import i18next from 'i18next';

export default (app) => {
  const getTaskStatusModel = () => app.objection.models.taskStatus;
  const getUsersModel = () => app.objection.models.user;
  const getLabelModel = () => app.objection.models.label;
  const normalizeLabelIds = (labelIds) => {
    if (!labelIds) {
      return [];
    }
    return (Array.isArray(labelIds) ? labelIds : [labelIds]).map(Number);
  };

  app
    .get('/tasks', { name: 'tasks', preValidation: app.authenticate }, async (req, reply) => {
        const taskStatuses = await getTaskStatusModel().query();
        const users = await getUsersModel().query();
        const labels = await getLabelModel().query();
        const filters = req.query;
        let query = app.objection.models.task
          .query()
          .withGraphFetched('[status, creator, executor, labels]')
          .distinct('tasks.*');

        if (filters.status) {
          query = query.where('statusId', Number(filters.status));
        }

        if (filters.executor) {
          query = query.where('executorId', Number(filters.executor));
        }

        if (filters.label) {
          query = query.joinRelated('labels').where('labels.id', Number(filters.label));
        }

        if (filters.isCreatorUser === 'on' && req.user) {
          query = query.where('creatorId', req.user.id);
        }

        const tasks = await query;
        reply.render('tasks/index', { tasks, taskStatuses, users, labels, filters });
        return reply;
    })
    .get('/tasks/new', { name: 'newTask', preValidation: app.authenticate }, async (req, reply) => {
        const taskStatuses = await getTaskStatusModel().query();
        const users = await getUsersModel().query();
        const labels = await getLabelModel().query();
        const task = new app.objection.models.task();
        reply.render('tasks/new', { taskStatuses, users, labels, task });
        return reply;
    })
    .post('/tasks', { name: 'createTask', preValidation: app.authenticate }, async (req, reply) => {
        const taskStatuses = await getTaskStatusModel().query();
        const creatorId = req.user?.id;
        const users = await getUsersModel().query();
        const labels = await getLabelModel().query();
        const labelIds = normalizeLabelIds(req.body.data.labelIds);
        const data = {
          ...req.body.data,
          statusId: req.body.data.statusId ? Number(req.body.data.statusId) : undefined,
          executorId: req.body.data.executorId ? Number(req.body.data.executorId) : null,
          creatorId,
        };
        delete data.labelIds;
        try {
            const task = await app.objection.models.task.query().insert(data);
            if (labelIds.length > 0) {
              await task.$relatedQuery('labels').relate(labelIds);
            }
            req.flash('info', i18next.t('flash.tasks.create.success'));
            reply.redirect(app.reverse('tasks'));
        } catch (error) {
            req.flash('error', i18next.t('flash.tasks.create.error'));
            reply.render('tasks/new', { taskStatuses, users, labels, task: { ...data, labelIds }, errors: error.data });
        }
        return reply;
    })
    .post('/tasks/:id', { name: 'updateTask', preValidation: app.authenticate }, async (req, reply) => {
        const { id } = req.params;
        const taskStatuses = await getTaskStatusModel().query();
        const users = await getUsersModel().query();
        const labels = await getLabelModel().query();
        const labelIds = normalizeLabelIds(req.body.data.labelIds);
        const data = {
          ...req.body.data,
          statusId: req.body.data.statusId ? Number(req.body.data.statusId) : undefined,
          executorId: req.body.data.executorId ? Number(req.body.data.executorId) : null,
        };
        delete data.labelIds;
        try {
            const task = await app.objection.models.task.query().patchAndFetchById(id, data);
            await task.$relatedQuery('labels').unrelate();
            if (labelIds.length > 0) {
              await task.$relatedQuery('labels').relate(labelIds);
            }
            req.flash('info', i18next.t('flash.tasks.update.success'));
            reply.redirect(app.reverse('tasks'));
        } catch (error) {
            req.flash('error', i18next.t('flash.tasks.update.error'));
            reply.render('tasks/edit', { taskStatuses, users, labels, task: { ...data, id, labelIds }, errors: error.data });
        }
        return reply;
    })
    .get('/tasks/:id/edit', { name: 'editTask', preValidation: app.authenticate }, async (req, reply) => {
        const { id } = req.params;
        const taskStatuses = await getTaskStatusModel().query();
        const users = await getUsersModel().query();
        const labels = await getLabelModel().query();
        const task = await app.objection.models.task.query().findById(id).withGraphFetched('labels');
        task.labelIds = task.labels.map(({ id: labelId }) => labelId);
        reply.render('tasks/edit', { taskStatuses, users, labels, task });
        return reply;
    })
    .post('/tasks/:id/delete', { name: 'deleteTask', preValidation: app.authenticate }, async (req, reply) => {
        const { id } = req.params;
        const task = await app.objection.models.task.query().findById(id);
        if (!task || task.creatorId !== req.user.id) {
            req.flash('error', i18next.t('flash.authError'));
            reply.redirect(app.reverse('tasks'));
            return reply;
        }

        await task.$query().delete();
        req.flash('info', i18next.t('flash.tasks.delete.success'));
        reply.redirect(app.reverse('tasks'));
        return reply;
    })
    .get('/tasks/:id', { name: 'showTask' }, async (req, reply) => {
        const { id } = req.params;
        const task = await app.objection.models.task.query().findById(id).withGraphFetched('[status, creator, executor, labels]');
        if (!task) {
            reply.redirect(app.reverse('tasks'));
            return reply;
        }
        reply.render('tasks/show', { task });
        return reply;
    });
}

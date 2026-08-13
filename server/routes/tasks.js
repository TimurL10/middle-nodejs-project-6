import i18next from 'i18next';

export default (app) => {
  const getTaskStatusModel = () => app.objection.models.taskStatus;
  const getUsersModel = () => app.objection.models.user;

  app
    .get('/tasks', { name: 'tasks' }, async (req, reply) => {
        const tasks = await app.objection.models.task.query().withGraphFetched('[status, creator, executor]');
        reply.render('tasks/index', { tasks });
        return reply;
    })
    .get('/tasks/new', { name: 'newTask', preValidation: app.authenticate }, async (req, reply) => {
        const taskStatuses = await getTaskStatusModel().query();
        const users = await getUsersModel().query();
        const task = new app.objection.models.task();
        reply.render('tasks/new', { taskStatuses, users, task });
        return reply;
    })
    .post('/tasks', { name: 'createTask', preValidation: app.authenticate }, async (req, reply) => {
        const taskStatuses = await getTaskStatusModel().query();
        const creatorId = req.user?.id;
        const users = await getUsersModel().query();
        const data = {
          ...req.body.data,
          statusId: req.body.data.statusId ? Number(req.body.data.statusId) : undefined,
          executorId: req.body.data.executorId ? Number(req.body.data.executorId) : null,
          creatorId,
        };
        try {
            const task = await app.objection.models.task.query().insert(data);
            req.flash('info', i18next.t('flash.tasks.create.success'));
            reply.redirect(app.reverse('tasks'));
        } catch (error) {
            req.flash('error', i18next.t('flash.tasks.create.error'));
            reply.render('tasks/new', { taskStatuses, users, task: data, errors: error.data });
        }
        return reply;
    })
    .post('/tasks/:id', { name: 'updateTask', preValidation: app.authenticate }, async (req, reply) => {
        const { id } = req.params;
        const taskStatuses = await getTaskStatusModel().query();
        const users = await getUsersModel().query();
        const data = {
          ...req.body.data,
          statusId: req.body.data.statusId ? Number(req.body.data.statusId) : undefined,
          executorId: req.body.data.executorId ? Number(req.body.data.executorId) : null,
        };
        try {
            const task = await app.objection.models.task.query().patchAndFetchById(id, data);
            req.flash('info', i18next.t('flash.tasks.update.success'));
            reply.redirect(app.reverse('tasks'));
        } catch (error) {
            req.flash('error', i18next.t('flash.tasks.update.error'));
            reply.render('tasks/edit', { taskStatuses, users, task: { ...data, id }, errors: error.data });
        }
        return reply;
    })
    .get('/tasks/:id/edit', { name: 'editTask', preValidation: app.authenticate }, async (req, reply) => {
        const { id } = req.params;
        const taskStatuses = await getTaskStatusModel().query();
        const users = await getUsersModel().query();
        const task = await app.objection.models.task.query().findById(id);
        reply.render('tasks/edit', { taskStatuses, users, task });
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
        const task = await app.objection.models.task.query().findById(id).withGraphFetched('[status, creator, executor]');
        if (!task) {
            reply.redirect(app.reverse('tasks'));
            return reply;
        }
        reply.render('tasks/show', { task });
        return reply;
    });
}

import i18next from 'i18next';

export default (app) => {
  const getTaskStatusModel = () => app.objection.models.taskStatus;
  const getTaskModel = () => app.objection.models.task;

  app
    .get('/taskstatuses', { name: 'taskstatuses' }, async (req, reply) => {
        const taskstatuses = await getTaskStatusModel().query();
        reply.render('taskstatuses/index', { taskstatuses });
        return reply;
    })
    .get('/taskstatuses/new', { name: 'newTaskStatus' }, (req, reply) => {
        const taskstatus = new (getTaskStatusModel())();
        reply.render('taskstatuses/new', { taskstatus });
        return reply;
    })
    .post('/taskstatuses', { name: 'createTaskStatus' }, async (req, reply) => {
        const taskstatus = new (getTaskStatusModel())();
        taskstatus.$set(req.body.data);

        try {
          await getTaskStatusModel().query().insert(req.body.data);
          req.flash('info', i18next.t('flash.taskStatuses.create.success'));
          reply.redirect(app.reverse('taskstatuses'));
        } catch (e) {
          reply.render('taskstatuses/new', { taskstatus, errors: e.data });
        }

        return reply;
    })
    .post('/taskstatuses/:id/delete', { name: 'deleteTaskStatus' }, async (req, reply) => {
        const taskstatus = await getTaskStatusModel().query().findById(req.params.id);
        const task = await getTaskModel().query().findOne({ statusId: taskstatus.id });
        if (task) {
          req.flash('error', i18next.t('flash.taskStatuses.delete.error'));
          reply.redirect(app.reverse('taskstatuses'));
          return reply;
        }

        await taskstatus.$query().delete();
        req.flash('info', i18next.t('flash.taskStatuses.delete.success'));
        reply.redirect(app.reverse('taskstatuses'));
        return reply;
    })
    .get('/taskstatuses/:id/edit', { name: 'editTaskStatus' }, async (req, reply) => {
        const taskstatus = await getTaskStatusModel().query().findById(req.params.id);
        if (!taskstatus) {
          reply.redirect(app.reverse('taskstatuses'));
          return reply;
        }

        reply.render('taskstatuses/edit', { taskstatus });
        return reply;
    })
    .post('/taskstatuses/:id', { name: 'updateTaskStatus' }, async (req, reply) => {
        const taskstatus = await getTaskStatusModel().query().findById(req.params.id);
        taskstatus.$set(req.body.data);

        try {
          await taskstatus.$query().patch(req.body.data);
          req.flash('info', i18next.t('flash.taskStatuses.update.success'));
          reply.redirect(app.reverse('taskstatuses'));
        } catch (e) {
          reply.render('taskstatuses/edit', { taskstatus, errors: e.data });
        }

        return reply;
    });
}

// @ts-nocheck

import i18next from 'i18next';

export default (app) => {
  const getTaskModel = () => app.objection.models.task;

  app
    .get('/users', { name: 'users' }, async (req, reply) => {
      const users = await app.objection.models.user.query();
      reply.render('users/index', { users });
      return reply;
    })
    .get('/users/new', { name: 'newUser' }, (req, reply) => {
      const user = new app.objection.models.user();
      reply.render('users/new', { user });
    })
    .post('/users', async (req, reply) => {
      const user = new app.objection.models.user();
      user.$set(req.body.data);

      try {
        const validUser = await app.objection.models.user.fromJson(req.body.data);
        await app.objection.models.user.query().insert(validUser);
        req.flash('info', i18next.t('flash.users.create.success'));
        reply.redirect(app.reverse('root'));
      } catch ({ data }) {
        req.flash('error', i18next.t('flash.users.create.error'));
        reply.render('users/new', { user, errors: data });
      }

      return reply;
    })
    .get('/users/:id/edit', { name: 'users.edit' }, async (req, reply) => {
      const { id } = req.params;
      const user = await app.objection.models.user.query().findById(id);
      if (!req.user || (req.user.id && user.id !== req.user.id)) {
        req.flash('error', i18next.t('flash.authError'));
        reply.redirect(app.reverse('root'));
        return reply;
      }
      reply.render('users/edit', { user });
      return reply;
    })
    .post('/users/:id/edit', { name: 'users.update' }, async (req, reply) => {
      const { id } = req.params;
      const user = await app.objection.models.user.query().findById(id);
      const params = { ...req.body.data };

      const data = req.session.get('data')
      console.log('data', data)

      if (params.password === '') {
        delete params.password;
      }

      user.$set(params);

      try {
        await user.$query().patch(params);
        req.flash('info', i18next.t('flash.users.update.success'));
        reply.redirect(app.reverse('root'));
      } catch (e) {
        console.error(e.message);
        req.flash('error', i18next.t('flash.users.update.error'));
        reply.render('users/edit', { user, errors: e.data });
      }

      return reply;
    })
    .get('/users/:id/delete', { name: 'users.delete' }, async (req, reply) => {
      const { id } = req.params;
      const user = await app.objection.models.user.query().findById(id);

       if (!req.user || (req.user.id && user.id !== req.user.id)) {
        req.flash('error', i18next.t('flash.authError'));
        reply.redirect(app.reverse('root'));
        return reply;
      }

      const task = await getTaskModel().query().findOne({ executorId: user.id });
      if (task) {
        req.flash('error', i18next.t('flash.users.delete.error'));
        reply.redirect(app.reverse('root'));
        return reply;
      }

      try {
        await user.$query().delete();
        req.flash('info', i18next.t('flash.users.delete.success'));
        reply.redirect(app.reverse('root'));
      } catch (e) {
        console.error(e.message);
        req.flash('error', i18next.t('flash.users.delete.error'));
        reply.redirect(app.reverse('root'));
      }

      return reply;
    });
}

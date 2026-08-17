// @ts-check

import i18next from 'i18next';

export default (app) => {
  const destroySession = (req, reply) => {
    req.logOut();
    req.flash('info', i18next.t('flash.session.delete.success'));
    reply.redirect(app.reverse('root'));
  };

  app
    .get('/session/new', { name: 'newSession' }, (req, reply) => {
      const signInForm = {};
      reply.render('session/new', { signInForm });
    })
    .post('/session', { name: 'session' }, (req, reply) => {
      if (req.body?._method === 'delete') {
        return destroySession(req, reply);
      }

      return app.fp.authenticate('form', async (authReq, authReply, err, user) => {
        if (err) {
          return app.httpErrors.internalServerError(err);
        }
        if (!user) {
          const signInForm = authReq.body.data;
          const errors = {
            email: [{ message: i18next.t('flash.session.create.error') }],
          };
          authReply.render('session/new', { signInForm, errors });
          return authReply.code(422);
        }
        await authReq.logIn(user);
        authReq.flash('success', i18next.t('flash.session.create.success'));
        authReply.redirect(app.reverse('root'));
        return authReply;
      })(req, reply);
    })
    .delete('/session', destroySession);
};

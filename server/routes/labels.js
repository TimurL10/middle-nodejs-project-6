import i18next from 'i18next';

export default (app) => {
  const getLabelModel = () => app.objection.models.label;

  app
    .get('/labels', { name: 'labels' }, async (req, reply) => {
        const labels = await getLabelModel().query();
        reply.render('labels/index', { labels });
        return reply;
    })
    .get('/labels/new', { name: 'newLabel' }, (req, reply) => {
        const label = new (getLabelModel())();
        reply.render('labels/new', { label });
        return reply;
    })
    .post('/labels', { name: 'createLabel' }, async (req, reply) => {
        const label = new (getLabelModel())();
        label.$set(req.body.data);

        try {
          await getLabelModel().query().insert(req.body.data);
          req.flash('info', i18next.t('flash.labels.create.success'));
          reply.redirect(app.reverse('labels'));
        } catch (e) {
          req.flash('error', i18next.t('flash.labels.create.error'));
          reply.render('labels/new', { label, errors: e.data });
        }

        return reply;
    })
    .get('/labels/:id/edit', { name: 'editLabel' }, async (req, reply) => {
        const label = await getLabelModel().query().findById(req.params.id);
        if (!label) {
          reply.redirect(app.reverse('labels'));
          return reply;
        }

        reply.render('labels/edit', { label });
        return reply;
    })
    .post('/labels/:id', { name: 'updateLabel' }, async (req, reply) => {
        const label = await getLabelModel().query().findById(req.params.id);
        label.$set(req.body.data);

        try {
          await label.$query().patch(req.body.data);
          req.flash('info', i18next.t('flash.labels.update.success'));
          reply.redirect(app.reverse('labels'));
        } catch (e) {
          req.flash('error', i18next.t('flash.labels.update.error'));
          reply.render('labels/edit', { label, errors: e.data });
        }

        return reply;
    })
    .post('/labels/:id/delete', { name: 'deleteLabel' }, async (req, reply) => {
        const label = await getLabelModel().query().findById(req.params.id);
        try {
          await label.$query().delete();
          req.flash('info', i18next.t('flash.labels.delete.success'));
        } catch (e) {
          req.flash('error', i18next.t('flash.labels.delete.error'));
        }

        reply.redirect(app.reverse('labels'));
        return reply;
    });
  }    

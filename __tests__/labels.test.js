// @ts-check

import fastify from 'fastify';

import init from '../server/plugin.js';
import { prepareData } from './helpers/index.js';

describe('test labels CRUD', () => {
  let app;
  let knex;
  let models;

  beforeAll(async () => {
    app = fastify({
      exposeHeadRoutes: false,
      logger: { target: 'pino-pretty' },
    });
    await init(app);
    knex = app.objection.knex;
    models = app.objection.models;

    await knex.migrate.latest();
    await prepareData(app);
  });

  it('index', async () => {
    await models.label.query().insert({ name: 'bug' });

    const response = await app.inject({
      method: 'GET',
      url: app.reverse('labels'),
    });

    expect(response.statusCode).toBe(200);
    expect(response.body).toContain('bug');
  });

  it('new', async () => {
    const response = await app.inject({
      method: 'GET',
      url: app.reverse('newLabel'),
    });

    expect(response.statusCode).toBe(200);
  });

  it('create', async () => {
    const params = { name: 'feature' };
    const response = await app.inject({
      method: 'POST',
      url: app.reverse('createLabel'),
      payload: {
        data: params,
      },
    });

    expect(response.statusCode).toBe(302);
    const label = await models.label.query().findOne(params);
    expect(label).toMatchObject(params);
  });

  it('edit', async () => {
    const label = await models.label.query().insert({ name: 'docs' });
    const response = await app.inject({
      method: 'GET',
      url: app.reverse('editLabel', { id: String(label.id) }),
    });

    expect(response.statusCode).toBe(200);
    expect(response.body).toContain(label.name);
  });

  it('update', async () => {
    const label = await models.label.query().insert({ name: 'old label' });
    const params = { name: 'new label' };
    const response = await app.inject({
      method: 'POST',
      url: app.reverse('updateLabel', { id: String(label.id) }),
      payload: {
        data: params,
      },
    });

    expect(response.statusCode).toBe(302);
    const updatedLabel = await models.label.query().findById(label.id);
    expect(updatedLabel).toMatchObject(params);
  });

  it('delete', async () => {
    const label = await models.label.query().insert({ name: 'deprecated' });
    const response = await app.inject({
      method: 'POST',
      url: app.reverse('deleteLabel', { id: String(label.id) }),
    });

    expect(response.statusCode).toBe(302);
    const deletedLabel = await models.label.query().findById(label.id);
    expect(deletedLabel).toBeUndefined();
  });

  it('does not delete a label used by a task', async () => {
    const label = await models.label.query().insert({ name: 'used label' });
    const status = await models.taskStatus.query().insert({ name: 'label protected status' });
    const [creator] = await models.user.query();
    const task = await models.task.query().insert({
      name: 'task with protected label',
      description: 'Task description',
      statusId: status.id,
      creatorId: creator.id,
      executorId: null,
    });
    await task.$relatedQuery('labels').relate(label.id);

    const response = await app.inject({
      method: 'POST',
      url: app.reverse('deleteLabel', { id: String(label.id) }),
    });

    expect(response.statusCode).toBe(302);
    const existingLabel = await models.label.query().findById(label.id);
    expect(existingLabel).toBeDefined();
  });

  afterAll(async () => {
    await app.close();
  });
});

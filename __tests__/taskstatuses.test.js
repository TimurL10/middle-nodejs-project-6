// @ts-check

import fastify from 'fastify';

import init from '../server/plugin.js';
import { prepareData } from './helpers/index.js';

describe('test task statuses CRUD', () => {
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
    await models.taskStatus.query().insert({ name: 'new' });

    const response = await app.inject({
      method: 'GET',
      url: app.reverse('taskstatuses'),
    });

    expect(response.statusCode).toBe(200);
    expect(response.body).toContain('new');
  });

  it('new', async () => {
    const response = await app.inject({
      method: 'GET',
      url: app.reverse('newTaskStatus'),
    });

    expect(response.statusCode).toBe(200);
  });

  it('create', async () => {
    const params = { name: 'in progress' };
    const response = await app.inject({
      method: 'POST',
      url: app.reverse('createTaskStatus'),
      payload: {
        data: params,
      },
    });

    expect(response.statusCode).toBe(302);
    const taskStatus = await models.taskStatus.query().findOne(params);
    expect(taskStatus).toMatchObject(params);
  });

  it('edit', async () => {
    const taskStatus = await models.taskStatus.query().insert({ name: 'ready for review' });
    const response = await app.inject({
      method: 'GET',
      url: app.reverse('editTaskStatus', { id: String(taskStatus.id) }),
    });

    expect(response.statusCode).toBe(200);
    expect(response.body).toContain(taskStatus.name);
  });

  it('update', async () => {
    const taskStatus = await models.taskStatus.query().insert({ name: 'testing' });
    const params = { name: 'done' };
    const response = await app.inject({
      method: 'POST',
      url: app.reverse('updateTaskStatus', { id: String(taskStatus.id) }),
      payload: {
        data: params,
      },
    });

    expect(response.statusCode).toBe(302);
    const updatedTaskStatus = await models.taskStatus.query().findById(taskStatus.id);
    expect(updatedTaskStatus).toMatchObject(params);
  });

  it('delete', async () => {
    const taskStatus = await models.taskStatus.query().insert({ name: 'archived' });
    const response = await app.inject({
      method: 'POST',
      url: app.reverse('deleteTaskStatus', { id: String(taskStatus.id) }),
    });

    expect(response.statusCode).toBe(302);
    const deletedTaskStatus = await models.taskStatus.query().findById(taskStatus.id);
    expect(deletedTaskStatus).toBeUndefined();
  });

  it('does not delete a status used by a task', async () => {
    const taskStatus = await models.taskStatus.query().insert({ name: 'status used by task' });
    const [creator] = await models.user.query();
    await models.task.query().insert({
      name: 'task with protected status',
      description: 'Task description',
      statusId: taskStatus.id,
      creatorId: creator.id,
      executorId: null,
    });

    const response = await app.inject({
      method: 'POST',
      url: app.reverse('deleteTaskStatus', { id: String(taskStatus.id) }),
    });

    expect(response.statusCode).toBe(302);
    const existingTaskStatus = await models.taskStatus.query().findById(taskStatus.id);
    expect(existingTaskStatus).toBeDefined();
  });

  afterAll(async () => {
    await app.close();
  });
});

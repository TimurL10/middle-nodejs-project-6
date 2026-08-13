// @ts-check

import fastify from 'fastify';

import init from '../server/plugin.js';
import { getTestData, prepareData } from './helpers/index.js';

describe('test tasks CRUD', () => {
  let app;
  let knex;
  let models;
  let testData;
  let counter = 0;

  const getUserName = (user) => [user.firstName, user.lastName].filter(Boolean).join(' ') || user.email;
  const getUniqueName = (prefix) => {
    counter += 1;
    return `${prefix}-${Date.now()}-${counter}`;
  };

  const signIn = async (data = testData.users.existing) => {
    const response = await app.inject({
      method: 'POST',
      url: app.reverse('session'),
      payload: {
        data,
      },
    });
    const [sessionCookie] = response.cookies;
    const { name, value } = sessionCookie;

    return { [name]: value };
  };

  const prepareTaskData = async (overrides = {}) => {
    const status = await models.taskStatus.query().insert({ name: getUniqueName('status') });
    const creator = await models.user.query().findOne({ email: testData.users.existing.email });
    const executor = await models.user.query().findOne({ email: 'elbert_abshire52@gmail.com' });

    return {
      status,
      creator,
      executor,
      task: {
        name: getUniqueName('task'),
        description: 'Task description',
        statusId: status.id,
        creatorId: creator.id,
        executorId: executor.id,
        ...overrides,
      },
    };
  };

  beforeAll(async () => {
    app = fastify({
      exposeHeadRoutes: false,
      logger: { target: 'pino-pretty' },
    });
    await init(app);
    knex = app.objection.knex;
    models = app.objection.models;
    testData = getTestData();

    await knex.migrate.latest();
    await prepareData(app);
  });

  it('index', async () => {
    const { task, status, creator, executor } = await prepareTaskData();
    await models.task.query().insert(task);

    const response = await app.inject({
      method: 'GET',
      url: app.reverse('tasks'),
    });

    expect(response.statusCode).toBe(200);
    expect(response.body).toContain(task.name);
    expect(response.body).toContain(status.name);
    expect(response.body).toContain(getUserName(creator));
    expect(response.body).toContain(getUserName(executor));
  });

  it('new', async () => {
    const cookies = await signIn();
    const response = await app.inject({
      method: 'GET',
      url: app.reverse('newTask'),
      cookies,
    });

    expect(response.statusCode).toBe(200);
  });

  it('create', async () => {
    const cookies = await signIn();
    const { status, executor } = await prepareTaskData();
    const params = {
      name: getUniqueName('created-task'),
      description: 'Created task description',
      statusId: String(status.id),
      executorId: String(executor.id),
    };

    const response = await app.inject({
      method: 'POST',
      url: app.reverse('createTask'),
      cookies,
      payload: {
        data: params,
      },
    });

    expect(response.statusCode).toBe(302);
    const task = await models.task.query().findOne({ name: params.name });
    expect(task).toMatchObject({
      name: params.name,
      description: params.description,
      statusId: status.id,
      executorId: executor.id,
    });
    expect(task.creatorId).toBeDefined();
  });

  it('show', async () => {
    const { task, status, creator } = await prepareTaskData();
    const createdTask = await models.task.query().insert(task);

    const response = await app.inject({
      method: 'GET',
      url: app.reverse('showTask', { id: String(createdTask.id) }),
    });

    expect(response.statusCode).toBe(200);
    expect(response.body).toContain(task.name);
    expect(response.body).toContain(task.description);
    expect(response.body).toContain(status.name);
    expect(response.body).toContain(getUserName(creator));
  });

  it('edit', async () => {
    const cookies = await signIn();
    const { task } = await prepareTaskData();
    const createdTask = await models.task.query().insert(task);

    const response = await app.inject({
      method: 'GET',
      url: app.reverse('editTask', { id: String(createdTask.id) }),
      cookies,
    });

    expect(response.statusCode).toBe(200);
    expect(response.body).toContain(task.name);
  });

  it('update', async () => {
    const cookies = await signIn();
    const { task } = await prepareTaskData();
    const createdTask = await models.task.query().insert(task);
    const newStatus = await models.taskStatus.query().insert({ name: getUniqueName('updated-status') });
    const newExecutor = await models.user.query().findOne({ email: 'nona_murray@yahoo.com' });
    const params = {
      name: getUniqueName('updated-task'),
      description: 'Updated task description',
      statusId: String(newStatus.id),
      executorId: String(newExecutor.id),
    };

    const response = await app.inject({
      method: 'POST',
      url: app.reverse('updateTask', { id: String(createdTask.id) }),
      cookies,
      payload: {
        data: params,
      },
    });

    expect(response.statusCode).toBe(302);
    const updatedTask = await models.task.query().findById(createdTask.id);
    expect(updatedTask).toMatchObject({
      name: params.name,
      description: params.description,
      statusId: newStatus.id,
      executorId: newExecutor.id,
    });
  });

  it('delete', async () => {
    const cookies = await signIn();
    const { task } = await prepareTaskData();
    const createdTask = await models.task.query().insert(task);

    const response = await app.inject({
      method: 'POST',
      url: app.reverse('deleteTask', { id: String(createdTask.id) }),
      cookies,
    });

    expect(response.statusCode).toBe(302);
    const deletedTask = await models.task.query().findById(createdTask.id);
    expect(deletedTask).toBeUndefined();
  });

  it('does not delete a task by a user who is not creator', async () => {
    const userParams = {
      email: `${getUniqueName('user')}@example.com`,
      password: 'password',
    };
    const user = await models.user.fromJson(userParams);
    await models.user.query().insert(user);
    const cookies = await signIn(userParams);
    const { task } = await prepareTaskData();
    const createdTask = await models.task.query().insert(task);

    const response = await app.inject({
      method: 'POST',
      url: app.reverse('deleteTask', { id: String(createdTask.id) }),
      cookies,
    });

    expect(response.statusCode).toBe(302);
    const existingTask = await models.task.query().findById(createdTask.id);
    expect(existingTask).toBeDefined();
  });

  afterAll(async () => {
    await app.close();
  });
});

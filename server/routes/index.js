// @ts-check

import welcome from './welcome.js';
import users from './users.js';
import session from './session.js';
import taskstatuses from './taskstatuses.js';
import tasks from './tasks.js';

const controllers = [
  welcome,
  users,
  session,
  taskstatuses,
  tasks,
];

export default (app) => controllers.forEach((f) => f(app));

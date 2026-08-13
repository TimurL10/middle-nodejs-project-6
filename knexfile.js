// @ts-check

import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const migrations = {
  directory: path.join(__dirname, 'server', 'migrations'),
};

const sqlitePool = {
  afterCreate: (connection, done) => {
    connection.run('PRAGMA foreign_keys = ON', done);
  },
};

export const development = {
  client: 'sqlite3',
  connection: {
    filename: path.resolve(__dirname, 'database.sqlite'),
  },
  pool: sqlitePool,
  useNullAsDefault: true,
  migrations,
};

export const test = {
  client: 'sqlite3',
  connection: ':memory:',
  pool: sqlitePool,
  useNullAsDefault: true,
  // debug: true,
  migrations,
};

export const production = {
  client: 'pg',
  connection: process.env.DATABASE_URL,
  migrations,
};

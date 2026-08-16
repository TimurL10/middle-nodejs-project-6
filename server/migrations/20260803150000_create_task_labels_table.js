// @ts-check

export const up = (knex) => (
  knex.schema.createTable('task_labels', (table) => {
    table.integer('task_id').notNullable();
    table.integer('label_id').notNullable();

    table.primary(['task_id', 'label_id']);

    table.foreign('task_id')
      .references('id')
      .inTable('tasks')
      .onDelete('CASCADE')
      .onUpdate('CASCADE');

    table.foreign('label_id')
      .references('id')
      .inTable('labels')
      .onDelete('RESTRICT')
      .onUpdate('CASCADE');
  })
);

export const down = (knex) => knex.schema.dropTable('task_labels');

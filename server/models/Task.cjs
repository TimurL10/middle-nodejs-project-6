const BaseModel = require('./BaseModel.cjs');
const { Model } = require('objection');
const TaskStatus = require('./TaskStatus.cjs');
const User = require('./User.cjs');


module.exports = class Task extends BaseModel {
  static get tableName() {
    return 'tasks';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['name','statusId','creatorId'],
      properties: {
        name: { type: 'string', minLength: 1 },
        description: { type: 'string', minLength: 1 },
        statusId: {type: 'integer'},
        creatorId: {type: 'integer'},
        executorId: {type: ['integer', 'null']}
      },
    };
  }
  
  static get relationMappings() {
    return {
      status: {
        relation: Model.BelongsToOneRelation,
        modelClass: TaskStatus,
        join: {
          from: 'tasks.status_id',
          to: 'task_statuses.id',
        },
      },
      creator: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'tasks.creator_id',
          to: 'users.id',
        },
      },
      executor: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'tasks.executor_id',
          to: 'users.id',
        },
      },
    };
  }


}

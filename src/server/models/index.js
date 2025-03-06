const { Sequelize } = require('sequelize');
const config = require('../config/database');

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    dialect: config.dialect,
    logging: false
  }
);

// モデル定義
const User = require('./user')(sequelize);
const Form = require('./form')(sequelize);
const FormField = require('./formField')(sequelize);
const WorkflowStep = require('./workflowStep')(sequelize);
const Submission = require('./submission')(sequelize);

// リレーション設定
Form.hasMany(FormField, { foreignKey: 'form_id' });
FormField.belongsTo(Form, { foreignKey: 'form_id' });

Form.hasMany(WorkflowStep, { foreignKey: 'form_id' });
WorkflowStep.belongsTo(Form, { foreignKey: 'form_id' });

Form.hasMany(Submission, { foreignKey: 'form_id' });
Submission.belongsTo(Form, { foreignKey: 'form_id' });

module.exports = {
  sequelize,
  User,
  Form,
  FormField,
  WorkflowStep,
  Submission
}; 
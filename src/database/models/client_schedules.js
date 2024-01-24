'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class client_schedules extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ users,driver_schedules }) {
      this.belongsTo(users, { foreignKey: "clientId", as: "client" });
      this.belongsTo(driver_schedules, { foreignKey: "scheduleId", as: "schedule" });
    }
    toJSON() {
      return {
        ...this.get(),
      };
    }
  }
  client_schedules.init({
    status: DataTypes.STRING,
    active: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'client_schedules',
  });
  return client_schedules;
};
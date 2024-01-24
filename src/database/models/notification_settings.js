'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class notification_settings extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ users,notification_types }) {
      this.belongsTo(users, { foreignKey: "userId", as: "user" });
      this.belongsTo(notification_types, { foreignKey: "notificationTypeId", as: "notificationType" });
    }
    toJSON() {
      return {
        ...this.get(),
      };
    }
  }
  notification_settings.init({
    allow: DataTypes.BOOLEAN,
    active: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'notification_settings',
  });
  return notification_settings;
};
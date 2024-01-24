'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class notifications extends Model {
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
  notifications.init({
    title: DataTypes.STRING,
    isRead: DataTypes.BOOLEAN,
    content: DataTypes.TEXT,
    active: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'notifications',
  });
  return notifications;
};
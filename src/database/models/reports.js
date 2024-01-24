'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class reports extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  reports.init({
    fullName: DataTypes.STRING,
    phoneNumber: DataTypes.BIGINT,
    email: DataTypes.STRING,
    title: DataTypes.STRING,
    description: DataTypes.TEXT,
    isRead: DataTypes.BOOLEAN,
    active: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'reports',
  });
  return reports;
};
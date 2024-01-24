'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class drivers extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ users }) {
      this.belongsTo(users, { foreignKey: "userId", as: "user" });
    }
    toJSON() {
      return {
        ...this.get(),
      };
    }
  }
  drivers.init({
    identity: DataTypes.JSON,
    availabilityStatus: DataTypes.STRING,
    driverLicence: DataTypes.JSON,
    isVerified: DataTypes.STRING,
    active: DataTypes.BOOLEAN,
    identityImage: DataTypes.TEXT,
    faceImage: DataTypes.TEXT,
    driverLicenceImage: DataTypes.TEXT,
  }, {
    sequelize,
    modelName: 'drivers',
  });
  return drivers;
};
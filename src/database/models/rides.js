'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class rides extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ drivers,users }) {
      this.belongsTo(drivers, { foreignKey: "driverId", as: "driver" });
      this.belongsTo(users, { foreignKey: "clientId", as: "client" });
    }
    toJSON() {
      return {
        ...this.get(),
      };
    }
  }
  rides.init({
    startTime: DataTypes.DATE,
    completionTime: DataTypes.DATE,
    pickupLocation: DataTypes.TEXT,
    dropoffLoation: DataTypes.TEXT,
    status: DataTypes.STRING,
    fareAmount: DataTypes.INTEGER,
    trackings: DataTypes.JSON,
    active: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'rides',
  });
  return rides;
};
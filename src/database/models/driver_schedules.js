'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class driver_schedules extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ drivers,vehicles,client_schedules }) {
      this.belongsTo(drivers, { foreignKey: "driverId", as: "driver" });
      this.belongsTo(vehicles, { foreignKey: "vehicleId", as: "vehicle" });
      this.hasMany(client_schedules);
    }
    toJSON() {
      return {
        ...this.get(),
      };
    }
  }
  driver_schedules.init({
    from: DataTypes.STRING,
    to: DataTypes.STRING,
    date: DataTypes.DATE,
    ride: DataTypes.BOOLEAN,
    weight: DataTypes.INTEGER,
    sits: DataTypes.INTEGER,
    fareAmount: DataTypes.INTEGER,
    delivery: DataTypes.BOOLEAN,
    description: DataTypes.TEXT,
    active: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'driver_schedules',
  });
  return driver_schedules;
};
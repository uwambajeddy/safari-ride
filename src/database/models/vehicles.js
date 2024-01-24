'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class vehicles extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ drivers,vehicle_types }) {
      this.belongsTo(drivers, { foreignKey: "driverId", as: "driver" });
      this.belongsTo(vehicle_types, { foreignKey: "vehicleTypeId", as: "vehicleType" });
    }
    toJSON() {
      return {
        ...this.get(),
      };
    }
  }
  vehicles.init({
    plateNumber: DataTypes.STRING,
    active: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'vehicles',
  });
  return vehicles;
};
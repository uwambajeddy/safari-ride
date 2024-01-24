'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class deliveries extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ drivers,delivery_requests }) {
      this.belongsTo(drivers, { foreignKey: "driverId", as: "driver" });
      this.belongsTo(delivery_requests, { foreignKey: "deliveryRequestId", as: "deliveryRequest" });
    }
    toJSON() {
      return {
        ...this.get(),
      };
    }
  }
  deliveries.init({
    startTime: DataTypes.DATE,
    completionTime: DataTypes.DATE,
    status: DataTypes.STRING,
    trackings: DataTypes.ARRAY(DataTypes.JSONB),
    driverView: DataTypes.BOOLEAN,
    clientView: DataTypes.BOOLEAN,
    active: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'deliveries',
  });
  return deliveries;
};
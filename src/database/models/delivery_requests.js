'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class delivery_requests extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ users }) {
      this.belongsTo(users, { foreignKey: "clientId", as: "client" });
    }
    toJSON() {
      return {
        ...this.get(),
      };
    }
  }
  delivery_requests.init({
    pickupLocation: DataTypes.TEXT,
    dropoffLocation: DataTypes.TEXT,
    fareAmount: DataTypes.INTEGER,
    isApproved: DataTypes.BOOLEAN,
    active: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'delivery_requests',
  });
  return delivery_requests;
};
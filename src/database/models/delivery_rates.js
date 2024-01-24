'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class delivery_rates extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ deliveries }) {
      this.belongsTo(deliveries, { foreignKey: "deliveryId", as: "delivery" });
    }
    toJSON() {
      return {
        ...this.get(),
      };
    }
  }
  delivery_rates.init({
    rate: DataTypes.INTEGER,
    review: DataTypes.TEXT,
    active: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'delivery_rates',
  });
  return delivery_rates;
};
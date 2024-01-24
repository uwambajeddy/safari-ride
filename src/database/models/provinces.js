'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class provinces extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ countries,districts }) {
      this.belongsTo(countries, { foreignKey: "countryId", as: "country" });
      this.hasMany(districts);
    }
    toJSON() {
      return {
        ...this.get(),
      };
    }
  }
  provinces.init({
    name: DataTypes.STRING,
    active: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'provinces',
  });
  return provinces;
};
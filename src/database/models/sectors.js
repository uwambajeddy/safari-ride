'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class sectors extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ districts }) {
      this.belongsTo(districts, { foreignKey: "districtId", as: "district" });
    }
    toJSON() {
      return {
        ...this.get(),
      };
    }
  }
  sectors.init({
    name: DataTypes.STRING,
    active: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'sectors',
  });
  return sectors;
};
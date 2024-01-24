'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class districts extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ provinces,sectors }) {
      this.belongsTo(provinces, { foreignKey: "provinceId", as: "province" });
      this.hasMany(sectors);
    }
    toJSON() {
      return {
        ...this.get(),
      };
    }
  }
  districts.init({
    name: DataTypes.STRING,
    active: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'districts',
  });
  return districts;
};
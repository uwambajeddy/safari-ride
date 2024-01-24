'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class countries extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ provinces }) {
      this.hasMany(provinces);
    }
    toJSON() {
      return {
        ...this.get(),
      };
    }
  }
  countries.init({
    name: DataTypes.STRING,
    code: DataTypes.STRING,
    extension: DataTypes.STRING,
    lat: DataTypes.STRING,
    long: DataTypes.STRING,
    active: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'countries',
  });
  return countries;
};
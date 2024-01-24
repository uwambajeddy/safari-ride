'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({user_types }) {
      this.belongsTo(user_types, {
        foreignKey: "userTypeId",
        as: "userType",
      });
    }
    toJSON() {
      return {
        ...this.get(),
      };
    }
  }
  users.init({
    userTypeId: DataTypes.INTEGER,
    fullName: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      unique: true,
    },
    phoneNumber: {
      type: DataTypes.BIGINT,
      unique: true,
    },
    profileImage: DataTypes.TEXT,
    description: DataTypes.STRING,
    gender: DataTypes.ENUM("male", "female", ""),
    location: DataTypes.TEXT,
    momoPay: DataTypes.BIGINT,
    emergencyNumber: DataTypes.BIGINT,
    isVerified: DataTypes.BOOLEAN,
    verificationToken: DataTypes.TEXT,
    password: DataTypes.STRING,
    passwordResetToken: DataTypes.DATE,
    passwordChangedAt: DataTypes.TEXT,
    passwordResetExpires: DataTypes.STRING,
    active: DataTypes.BOOLEAN,
  }, {
    sequelize,
    modelName: 'users',
  });
  return users;
};
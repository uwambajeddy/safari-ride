'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      userTypeId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "user_types",
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      fullName: Sequelize.STRING,
      email: {
        type: Sequelize.STRING,
      },
      phoneNumber: {
        type: Sequelize.BIGINT,
      },
      profileImage: Sequelize.TEXT,
      description: Sequelize.STRING,
      gender: Sequelize.ENUM("male", "female", ""),
      location: {
        type: Sequelize.TEXT
      },
      momoPay: {
        type: Sequelize.BIGINT
      },
      emergencyNumber: {
        type: Sequelize.BIGINT
      },
      isVerified: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      verificationToken: Sequelize.TEXT,
      password: Sequelize.STRING,
      passwordChangedAt: Sequelize.DATE,
      passwordResetToken: Sequelize.TEXT,
      passwordResetExpires: Sequelize.STRING,
      active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('users');
  }
};
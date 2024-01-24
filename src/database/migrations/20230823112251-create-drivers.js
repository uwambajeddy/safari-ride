'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('drivers', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      identity: {
        type: Sequelize.JSON
      },
      availabilityStatus: {
        type: Sequelize.STRING
      },
      driverLicence: {
        type: Sequelize.JSON
      },
      isVerified: {
        type: Sequelize.STRING,
        defaultValue: false,
      },
      identityImage: {
        type: Sequelize.TEXT,
      },
      faceImage: {
        type: Sequelize.TEXT,
      },
      driverLicenceImage: {
        type: Sequelize.TEXT,
      },
      active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('drivers');
  }
};
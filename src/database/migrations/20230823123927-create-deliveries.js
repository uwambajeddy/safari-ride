'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('deliveries', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      driverId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "drivers",
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      deliveryRequestId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "delivery_requests",
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      startTime: {
        type: Sequelize.DATE
      },
      completionTime: {
        type: Sequelize.DATE
      },
      status: {
        type: Sequelize.STRING
      },
      trackings: {
        type: Sequelize.ARRAY(Sequelize.JSONB)
      },
      driverView: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      clientView: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
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
    await queryInterface.dropTable('deliveries');
  }
};
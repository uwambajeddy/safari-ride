"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "notification_types",
      [
        {
          id: 99998,
           name: "General",
          active:true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 99997,
           name: "Updates",
          active:true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 99996,
           name: "Driver schedules",
          active:true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 99995,
           name: "Document Approval",
          active:true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("notification_types", null, {});
  },
};

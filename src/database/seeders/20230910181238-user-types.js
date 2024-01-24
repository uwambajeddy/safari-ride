"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "user_types",
      [
        {
          id: 1,
          name: "client",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 2,
          name: "driver",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 3,
          name: "admin",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("user_types", null, {});
  },
};

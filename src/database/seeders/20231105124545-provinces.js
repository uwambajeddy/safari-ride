"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "provinces",
      [
        {
          id: 99990,
           name: "Kigali",
           countryId: 99998,
          active:true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 99991,
           name: "Eastern Province",
           countryId: 99998,
          active:true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 99992,
           name: "Northern Province",
           countryId: 99998,
          active:true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 99993,
           name: "Southern Province",
           countryId: 99998,
          active:true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 99994,
           name: "Western Province",
           countryId: 99998,
          active:true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("provinces", null, {});
  },
};

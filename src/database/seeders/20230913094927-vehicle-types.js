"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "vehicle_types",
      [
        {
          id: 99990,
          name: "Moto",
          icon: "https://res.cloudinary.com/dvibmdi1y/image/upload/v1697868544/vehicle-types/moto_jtwmlj.jpg",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 99991,
          name: "Tricycle moto",
          icon: "https://res.cloudinary.com/dvibmdi1y/image/upload/v1697868545/vehicle-types/tricycle_i1ngji.jpg",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 999992,
          name: "Pickup",
          icon: "https://res.cloudinary.com/dvibmdi1y/image/upload/v1697868544/vehicle-types/pickup_fyuywa.jpg",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 99993,
          name: "Mini van",
          icon: "https://res.cloudinary.com/dvibmdi1y/image/upload/v1697868544/vehicle-types/mini-van_gz8wv0.jpg",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 99994,
          name: "sedan",
          icon: "https://res.cloudinary.com/dvibmdi1y/image/upload/v1697868544/vehicle-types/sedan_rm7rh1.jpg",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 99995,
          name: "hatchback",
          icon:"https://res.cloudinary.com/dvibmdi1y/image/upload/v1697868542/vehicle-types/hatchback_ylkpkq.jpg",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 99996,
          name: "SUV",
          icon:"https://res.cloudinary.com/dvibmdi1y/image/upload/v1697868545/vehicle-types/suv_wiv5wt.jpg",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 99997,
          name: "Bus",
          icon:"https://res.cloudinary.com/dvibmdi1y/image/upload/v1697868542/vehicle-types/bus_exy0vc.jpg",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 99998,
          name: "Mini truck",
          icon:"https://res.cloudinary.com/dvibmdi1y/image/upload/v1697868543/vehicle-types/mini-truck_w7dgug.jpg",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 99999,
          name: "Big truck",
          icon:"https://res.cloudinary.com/dvibmdi1y/image/upload/v1697868543/vehicle-types/big-truck_wuczew.jpg",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("vehicle_types", null, {});
  },
};

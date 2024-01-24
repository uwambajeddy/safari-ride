"use strict";

const bcryptjs = require("bcryptjs");
const { hash } = bcryptjs;

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "users",
      [
        {
          id: 99999,
          userTypeId: 3,
          fullName: "Eddy UWAMBAJE",
          email: "superadmin@gmail.com",
          phoneNumber: 250785850861,
          gender: "male",
          profileImage:
            "https://res.cloudinary.com/dvibmdi1y/image/upload/v1694676748/grppj64dototg7u0gjru.jpg",
          description:
            "Hi, I’m Eddy Uwambaje, Decisions: If you can’t decide, the answer is no. If two equally difficult paths, choose the one more painful in the short term (pain avoidance is creating an illusion of equality).",
          password: await hash("uwambaje", 12),
          momoPay: 250785850860,
          emergencyNumber: 250785850860,
          location: "-1.6884921,29.248596",
          isVerified: true,
          active: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 99998,
          userTypeId: 2,
          fullName: "Dushime Brother",
          email: "client@gmail.com",
          phoneNumber: 250785850862,
          gender: "male",
          profileImage:
            "https://res.cloudinary.com/dvibmdi1y/image/upload/v1694676748/grppj64dototg7u0gjru.jpg",
          description:
            "Hi, I’m Dushime Brother, Decisions: If you can’t decide, the answer is no. If two equally difficult paths, choose the one more painful in the short term (pain avoidance is creating an illusion of equality).",
          password: await hash("dushime", 12),
          momoPay: 250785850862,
          emergencyNumber: 250785850862,
          location: "-1.6884921,29.248106",
          isVerified: true,
          active: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 99997,
          userTypeId: 1,
          fullName: "Mugisha Chris",
          email: "driver@gmail.com",
          phoneNumber: 250785850863,
          gender: "male",
          profileImage:
            "https://res.cloudinary.com/dvibmdi1y/image/upload/v1694676748/grppj64dototg7u0gjru.jpg",
          description:
            "Hi, I’m Mugisha Chris, Decisions: If you can’t decide, the answer is no. If two equally difficult paths, choose the one more painful in the short term (pain avoidance is creating an illusion of equality).",
          password: await hash("mugisha", 12),
          momoPay: 250785850863,
          emergencyNumber: 250785850863,
          location: "-1.6884921,29.248296",
          isVerified: true,
          active: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("users", null, {});
  },
};

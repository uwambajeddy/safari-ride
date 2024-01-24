"use strict";

const bcryptjs = require("bcryptjs");
const { hash } = bcryptjs;

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "drivers",
      [
        {
          id: 99998,
          userId: 99998,
          identity: JSON.stringify({
            "result": {
                "documentNumber": "1200580107612516",
                "firstName": "Chris",
                "lastName": "Mugisha",
                "fullName": "Mugisha Chris",
                "age": 18,
                "dob": "2005/07/14",
                "dob_day": 14,
                "dob_month": 7,
                "dob_year": 2005,
                "documentType": "I",
                "documentSide": "FRONT",
                "issuerOrg_full": "Rwanda",
                "issuerOrg_iso2": "RW",
                "issuerOrg_iso3": "RWA",
                "nationality_full": "Rwanda",
                "nationality_iso2": "RW",
                "nationality_iso3": "RWA",
                "internalId": "853"
            },
            "face": {
                "isIdentical": true,
                "confidence": "0.655"
            },
            "verification": {
                "passed": true,
                "result": {
                    "face": true
                }
            },
            "authentication": {
                "score": 1
            },
            "vaultid": "mCyWYFEi9gCjN9meDJY62PmGwNfT8B49",
            "matchrate": 1,
            "executionTime": 3.991770029067993,
            "responseID": "e98c43712d987a178533d7ed13ff6272",
            "quota": 5,
            "credit": 84
        },),
          driverLicence: JSON.stringify(),
          availabilityStatus:"available",
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
    await queryInterface.bulkDelete("drivers", null, {});
  },
};

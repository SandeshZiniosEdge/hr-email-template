"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert("TemplateVariables", [
      {
        name: "##First Name##",
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "##Middle Name##",
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "##Last Name##",
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "##Designation##",
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "##Date##",
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("TemplateVariables", {
      name: {
        [Sequelize.Op.in]: [
          "##First Name##",
          "##Middle Name##",
          "##Last Name##",
          "##Designation##",
          "##Date##",
        ],
      },
    });
  },
};

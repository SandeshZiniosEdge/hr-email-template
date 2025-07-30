"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("NotificationScenarios", {
      // By convention, add an auto-increment id field (optional, remove if you don't want it)
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      notificationScenario: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      smsRequired: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      smsBody: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      emailRequired: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      emailSubject: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      emailBody: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      emailButtonName: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      inPortalWebRequired: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      inPortalWebSubject: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      inPortalWebBody: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      inPortalWebLinkName: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      mobilePushRequired: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      mobilePushSubject: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      mobilePushBody: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("NotificationScenarios");
  },
};

"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class NotificationScenario extends Model {
    static associate(models) {
      // Define associations here
    }
  }

  NotificationScenario.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      notificationScenario: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      smsRequired: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      smsBody: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      emailRequired: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      emailSubject: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      emailBody: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      emailButtonName: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      inPortalWebRequired: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      inPortalWebSubject: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      inPortalWebBody: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      inPortalWebLinkName: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      mobilePushRequired: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      mobilePushSubject: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      mobilePushBody: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
    },
    {
      sequelize,
      modelName: "NotificationScenario",
      tableName: "NotificationScenarios",
      timestamps: true,
    }
  );

  return NotificationScenario;
};

"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class TemplateVariable extends Model {
    static associate(models) {
      // Define associations here
    }
  }

  TemplateVariable.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
    },
    {
      sequelize,
      modelName: "TemplateVariable",
      tableName: "TemplateVariables",
      timestamps: true,
    }
  );

  return TemplateVariable;
};

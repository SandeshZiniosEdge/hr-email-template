"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Case extends Model {
    static associate(models) {
      // Define associations here
    }
  }

  Case.init(
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
      modelName: "TemplateVariables",
      tableName: "TemplateVariables",
      timestamps: true,
    }
  );

  return Case;
};

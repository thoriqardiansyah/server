"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Link extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Link.belongsTo(models.Portfolio, {
        foreignKey: "portfolioId",
        as: "links",
      });
    }
  }
  Link.init(
    {
      github: DataTypes.STRING,
      url: DataTypes.STRING,
      portfolioId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Link",
    }
  );
  return Link;
};

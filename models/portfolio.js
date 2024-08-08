"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Portfolio extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Portfolio.belongsTo(models.Category, {
        foreignKey: "categoryId",
        as: "categories",
      });
      Portfolio.belongsToMany(models.Stack, {
        through: "PortfolioStack",
        foreignKey: "portfolioId",
        as: "portfolios",
        as: "stacks",
      });
      Portfolio.hasOne(models.Link, { foreignKey: "portfolioId", as: "links" });
      Portfolio.hasOne(models.Image, {
        foreignKey: "portfolioId",
        as: "images",
      });
    }
  }
  Portfolio.init(
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: DataTypes.STRING,
      categoryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Portfolio",
    }
  );
  return Portfolio;
};

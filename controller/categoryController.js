const { Category, Portfolio } = require("../models");

module.exports = {
  createCategory: async (req, res) => {
    const { category } = req.body;

    if (!category) {
      return res
        .status(400)
        .json({ status: "400: Bad Request", message: "Category is required" });
    }

    const data = await Category.create({
      category,
    });

    return res.status(201).json({
      status: "201: Created",
      message: "Create category is success",
      data,
    });
  },

  getAllCategory: async (req, res) => {
    const data = await Category.findAll();

    return res.status(200).json({
      status: "200: Ok",
      message: "Get All Category Success",
      data,
    });
  },

  detailCategory: async (req, res) => {
    const { id } = req.params;

    const data = await Category.findByPk(id, {
      include: { model: Portfolio, as: "categories" },
    });

    if (!data) {
      return res
        .status(404)
        .json({ status: "404: Not Found", message: "Data not found!" });
    }

    return res.status(200).json({
      status: "200: Ok",
      message: "Get All Category Success",
      data,
    });
  },

  updateCategory: async (req, res) => {
    const { id } = req.params;
    const { category } = req.body;

    const data = await Category.findByPk(id);
    if (!data) {
      return res
        .status(404)
        .json({ status: "404: Not Found", message: "Data not found!" });
    }

    await Category.update({ category }, { where: { id: id } });

    return res
      .status(200)
      .json({ status: "200: Ok", message: "Data updated!" });
  },

  deleteCategory: async (req, res) => {
    const { id } = req.params;

    const category = await Category.findByPk(id);

    if (!category) {
      return res
        .status(404)
        .json({ status: "404: Not Found", message: "Category not found!" });
    }

    await Category.destroy({ where: { id } });

    return res
      .status(200)
      .json({ status: "200: Ok", message: "Category deleted!" });
  },
};

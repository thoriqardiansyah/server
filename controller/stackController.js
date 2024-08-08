const { Stack, Portfolio } = require("../models");

module.exports = {
  createStack: async (req, res) => {
    if (!req.body.stack) {
      return res
        .status(400)
        .json({ status: "400: Bad Request", message: "Stack is required" });
    }

    const data = await Stack.create({
      stack: req.body.stack,
    });

    return res.status(201).json({
      status: "201: Created",
      message: "Create stack is success",
      data,
    });
  },

  getAllStack: async (req, res) => {
    try {
      const data = await Stack.findAll();
      // {
      //   include: {
      //     model: Portfolio,
      //     as: "portfolios",
      //     attributes: { exclude: ["categoryId"] },
      //     through: {
      //       attributes: [],
      //     },
      //   },
      // }

      return res.status(200).json({
        status: "200: Ok",
        message: "Get All Stack Success",
        data,
      });
    } catch (error) {
      return res.status(500).json({
        status: "500: Internal Server Error",
        message: error,
      });
    }
  },

  detailStack: async (req, res) => {
    const { id } = req.params;

    const data = await Stack.findByPk(id, {
      include: {
        model: Portfolio,
        as: "portfolios",
        attributes: { exclude: ["categoryId"] },
        through: {
          attributes: [],
        },
      },
    });

    if (!data) {
      return res
        .status(404)
        .json({ status: "404: Not Found", message: "Data not found!" });
    }

    return res.status(200).json({
      status: "200: Ok",
      message: "Get detail stack Success",
      data,
    });
  },

  updateStack: async (req, res) => {
    const { id } = req.params;

    const stack = await Stack.findByPk(id);

    if (!stack) {
      return res
        .status(404)
        .json({ status: "404: Not Found", message: "Stack not found!" });
    }

    await Stack.update({ stack: req.body.stack }, { where: { id } });

    return res
      .status(200)
      .json({ status: "200: Ok", message: "Stack updated!" });
  },

  deleteStack: async (req, res) => {
    const { id } = req.params;

    const stack = await Stack.findByPk(id);

    if (!stack) {
      return res
        .status(404)
        .json({ status: "404: Not Found", message: "Stack not found!" });
    }

    await Stack.destroy({ where: { id } });

    return res
      .status(200)
      .json({ status: "200: Ok", message: "Stack deleted!" });
  },
};

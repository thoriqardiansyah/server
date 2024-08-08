const { Category, Portfolio, Stack, Link, Image } = require("../models");
const fs = require("fs");

module.exports = {
  createPortfolio: async (req, res) => {
    try {
      const { title, description, categoryId, stackId, github, url } = req.body;
      const arr = stackId.split(" ");
      const arrStack = arr.map((x) => parseInt(x));
      const fileSmall = req.files.imageSmall[0].filename;
      const fileBig = req.files.imageBig[0].filename;

      if (!fileSmall && !fileBig) {
        return res.status(400).json({
          status: "400: Bad Request",
          error: "Image small and image big is required!",
        });
      }

      const newPathSmall = `${req.protocol}://${req.get(
        "host"
      )}/public/images/${fileSmall}`;
      const newPathBig = `${req.protocol}://${req.get(
        "host"
      )}/public/images/${fileBig}`;

      if (!Array.isArray(arrStack)) {
        return res.status(400).json({
          status: "400: Bad Request",
          error: "stackId must be an array",
        });
      }

      const stacks = await Stack.findAll({
        where: {
          id: arrStack,
        },
      });

      if (stacks.length !== arrStack.length) {
        return res.status(404).json({
          status: "404: Not Found",
          error: "One or more stacks not found!",
        });
      }

      const portfolio = await Portfolio.create(
        {
          title,
          description,
          categoryId,
          links: {
            github,
            url,
          },
          images: {
            imageSmall: newPathSmall,
            imageBig: newPathBig,
          },
        },
        {
          include: [
            { model: Link, as: "links" },
            { model: Image, as: "images" },
          ],
        }
      );

      await portfolio.addStacks(stacks);

      return res.status(201).json({
        status: "201: Created",
        message: "Create portfolio is success",
      });
    } catch (error) {
      return res.status(500).json({
        status: "500: Internal Server Error",
        message: error,
      });
    }
  },

  getAllPortfolio: async (req, res) => {
    const data = await Portfolio.findAll({
      include: [
        {
          model: Category,
          as: "categories",
          attributes: { exclude: ["createdAt", "updatedAt"] },
        },
        {
          model: Stack,
          as: "stacks",
          attributes: { exclude: ["createdAt", "updatedAt"] },
          through: { attributes: [] },
        },
        {
          model: Link,
          as: "links",
          attributes: {
            exclude: ["createdAt", "updatedAt", "portfolioId"],
          },
        },
        {
          model: Image,
          as: "images",
          attributes: {
            exclude: ["createdAt", "updatedAt", "portfolioId"],
          },
        },
      ],
      attributes: { exclude: ["categoryId"] },
    });

    return res.status(200).json({
      status: "200: Ok",
      message: "Get all portfolio success",
      data,
    });
  },

  detailPortfolio: async (req, res) => {
    const { id } = req.params;

    const data = await Portfolio.findByPk(id, {
      include: [
        {
          model: Category,
          as: "categories",
          attributes: { exclude: ["createdAt", "updatedAt"] },
        },
        {
          model: Stack,
          as: "stacks",
          attributes: { exclude: ["createdAt", "updatedAt"] },
          through: { attributes: [] },
        },
        {
          model: Image,
          as: "images",
          attributes: {
            exclude: ["createdAt", "updatedAt", "portfolioId"],
          },
        },
      ],
      attributes: { exclude: ["categoryId"] },
    });

    if (!data) {
      return res.status(404).json({
        status: "404: Not Found",
        error: "Portfolio not found!",
      });
    }

    return res.status(200).json({
      status: "200: Ok",
      message: "Get detail portfolio Success",
      data,
    });
  },

  updatePortfolio: async (req, res) => {
    try {
      const { title, description, categoryId, stackId, github, url } = req.body;
      const { id } = req.params;
      const arr = stackId.split(" ");
      const arrStack = arr.map((x) => parseInt(x));

      const portfolio = await Portfolio.findByPk(id, {
        include: [
          {
            model: Category,
            as: "categories",
            // attributes: { exclude: ["createdAt", "updatedAt"] },
          },
          {
            model: Stack,
            as: "stacks",
            // attributes: { exclude: ["createdAt", "updatedAt"] },
            // through: { attributes: [] },
          },
          {
            model: Link,
            as: "links",
            // attributes: {
            //   exclude: ["createdAt", "updatedAt", "portfolioId"],
            // },
          },
          {
            model: Image,
            as: "images",
          },
        ],
      });

      if (!portfolio) {
        return res.status(404).json({
          status: "404: Not Found",
          error: "Portfolio not found!",
        });
      }
      const fileSmall = req.files["imageSmall"];
      const fileBig = req.files["imageBig"];

      if (fileSmall && !fileBig) {
        const replaceSmall = portfolio.images.imageSmall.replace(
          `${req.protocol}://${req.get("host")}/public/images/`,
          ""
        );
        const filePath = `./public/images/${replaceSmall}`;
        fs.unlink(filePath, (err) => {
          if (err) {
            return res
              .status(400)
              .json({ status: "error", message: err.message });
          }
        });

        const fileSmallName = fileSmall[0].filename;
        const newFileSmall = `${req.protocol}://${req.get(
          "host"
        )}/public/images/${fileSmallName}`;
        portfolio.images.imageSmall = newFileSmall;
      } else if (!fileSmall && fileBig) {
        const replaceBig = portfolio.images.imageBig.replace(
          `${req.protocol}://${req.get("host")}/public/images/`,
          ""
        );
        const filePath = `./public/images/${replaceBig}`;
        fs.unlink(filePath, (err) => {
          if (err) {
            return res
              .status(400)
              .json({ status: "error", message: err.message });
          }
        });

        const fileBigName = fileBig[0].filename;
        const newFileBig = `${req.protocol}://${req.get(
          "host"
        )}/public/images/${fileBigName}`;
        portfolio.images.imageBig = newFileBig;
      } else if (fileSmall && fileBig) {
        const replaceSmall = portfolio.images.imageSmall.replace(
          `${req.protocol}://${req.get("host")}/public/images/`,
          ""
        );
        const replaceBig = portfolio.images.imageBig.replace(
          `${req.protocol}://${req.get("host")}/public/images/`,
          ""
        );

        const filePathSmall = `./public/images/${replaceSmall}`;
        fs.unlink(filePathSmall, (err) => {
          if (err) {
            return res
              .status(400)
              .json({ status: "error", message: err.message });
          }
        });
        const filePathBig = `./public/images/${replaceBig}`;
        fs.unlink(filePathBig, (err) => {
          if (err) {
            return res
              .status(400)
              .json({ status: "error", message: err.message });
          }
        });

        const fileSmallName = fileSmall[0].filename;
        const fileBigName = fileBig[0].filename;

        const newFileSmall = `${req.protocol}://${req.get(
          "host"
        )}/public/images/${fileSmallName}`;
        const newFileBig = `${req.protocol}://${req.get(
          "host"
        )}/public/images/${fileBigName}`;

        portfolio.images.imageSmall = newFileSmall;
        portfolio.images.imageBig = newFileBig;
      }

      if (!Array.isArray(arrStack)) {
        return res.status(400).json({
          status: "400: Bad Request",
          error: "stackId must be an array",
        });
      }

      const stacks = await Stack.findAll({
        where: {
          id: arrStack,
        },
      });

      if (stacks.length !== arrStack.length) {
        return res.status(404).json({
          status: "404: Not Found",
          error: "One or more stacks not found!",
        });
      }

      (portfolio.title = title || portfolio.title),
        (portfolio.description = description || portfolio.description),
        (portfolio.categoryId = categoryId || portfolio.categoryId),
        (portfolio.links.github = github || portfolio.links.github),
        (portfolio.links.url = url || portfolio.links.url);
      await portfolio.save();
      await portfolio.setStacks(stacks);
      await Image.update(
        {
          imageSmall: portfolio.images.imageSmall,
          imageBig: portfolio.images.imageBig,
        },
        { where: { portfolioId: id } }
      );

      return res.status(200).json({
        status: "200: Ok",
        message: "Portfolio Updated!",
      });
    } catch (error) {
      return res.status(500).json({
        status: "500: Internal Server Error",
        message: error,
      });
    }
  },

  deletePortfolio: async (req, res) => {
    const { id } = req.params;

    const portfolio = await Portfolio.findByPk(id, {
      include: [{ model: Image, as: "images" }],
    });

    if (portfolio) {
      const replaceSmall = portfolio.images.imageSmall.replace(
        `${req.protocol}://${req.get("host")}/public/images/`,
        ""
      );
      const replaceBig = portfolio.images.imageBig.replace(
        `${req.protocol}://${req.get("host")}/public/images/`,
        ""
      );

      const filePathSmall = `./public/images/${replaceSmall}`;
      fs.unlink(filePathSmall, (err) => {
        if (err) {
          return res
            .status(400)
            .json({ status: "error", message: err.message });
        }
      });
      const filePathBig = `./public/images/${replaceBig}`;
      fs.unlink(filePathBig, (err) => {
        if (err) {
          return res
            .status(400)
            .json({ status: "error", message: err.message });
        }
      });

      portfolio.destroy();

      return res.status(200).json({
        status: "200: ok",
        message: "Portfolio deleted!",
      });
    } else {
      return res.status(404).json({
        status: "404: Not Found",
        error: "Portfolio not found!",
      });
    }
  },
};

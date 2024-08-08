const { Admin } = require("../models");
const bcrypt = require("bcrypt");
const { createCookie } = require("../utils");

module.exports = {
  Register: async (req, res) => {
    try {
      if (!req.body.password && !req.body.username) {
        return res.status(400).json({
          status: "400: Bad Request",
          message: "Username and Password not empty!",
        });
      }

      if (req.body.password != req.body.confirmPassword) {
        return res.status(406).json({
          status: "406: Not Acceptable",
          message: "Error: password doesn't match",
        });
      }

      const hashPassword = await bcrypt.hash(req.body.password, 10);

      await Admin.create({
        username: req.body.username,
        password: hashPassword,
      });

      return res.status(201).json({
        status: "201: Created",
        message: "Account Created!",
      });
    } catch (error) {
      return res.status(400).json({
        status: "400: Bad Request",
        message: error,
      });
    }
  },

  Login: async (req, res) => {
    try {
      const data = await Admin.findOne({
        where: { username: req.body.username },
      });

      if (!data) {
        return res.status(404).json({
          status: "404: Not Found",
          message: "Data not found!",
        });
      }

      const hashedPassword = await bcrypt.compare(
        req.body.password,
        data.password
      );

      if (!hashedPassword) {
        return res.status(406).json({
          status: "406: Not Acceptable",
          message: "Error: password doesn't match",
        });
      }

      createCookie(data, 200, res);
    } catch (error) {
      return res.status(400).json({
        status: "400: Bad Request",
        message: error,
      });
    }
  },

  Logout: (req, res) => {
    res.clearCookie("jwt", { maxAge: 0, httpOnly: false });

    return res.status(200).json({
      status: "200: Ok",
      message: "Success logout!",
    });
  },

  getProfile: async (req, res) => {
    const data = await Admin.findByPk(admin.id);

    // console.log(data);
    if (data) {
      return res.status(200).json({
        status: "200: Ok",
        message: "Success!",
        data: {
          id: data.id,
          username: data.username,
        },
      });
    }

    return res.status(404).json({
      status: "404: Not Found",
      message: "Data not found!",
    });
  },
};

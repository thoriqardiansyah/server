const jwt = require("jsonwebtoken");
require("dotenv").config();
const { Admin } = require("../models");

module.exports = {
  authMiddle: async (req, res, next) => {
    let decode;
    let token = req.cookies.jwt;

    if (!token) {
      return res.status(403).json({
        status: "403: Forbidden",
        message: "You don't have access!",
      });
    }

    try {
      decode = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return res.status(406).json({
        status: "406: Not Acceptable",
        message: "Token is not valid!",
      });
    }

    const currentAdmin = await Admin.findByPk(decode.id);

    if (!currentAdmin) {
      return res.status(404).json({
        status: "404: Not Found",
        message: "Data not found!",
      });
    }

    admin = currentAdmin;

    next();
  },
};

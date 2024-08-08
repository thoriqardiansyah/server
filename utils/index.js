const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = {
  createCookie: async (user, status, res) => {
    const token = await jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: 60 * 60,
    });

    const cookieOption = {
      // maxAge: 60 * 60,
      maxAge: new Date(Date.now() + 24 * 60 * 60 * 1000),
      httpOnly: true,
    };

    res.cookie("jwt", token, cookieOption);

    return res.status(status).json({
      status: "200: Ok",
      message: "Success!",
    });
  },
};

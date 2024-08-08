const router = require("express").Router();

const {
  Register,
  Login,
  Logout,
  getProfile,
} = require("../controller/authController");

const { authMiddle } = require("../middleware");

router.post("/register", Register);
router.post("/login", Login);
router.post("/logout", authMiddle, Logout);
router.get("/profile", authMiddle, getProfile);
// router.post("/test", authMiddle, (req, res) => {
//   res.send("Fuck you");
// });

module.exports = router;

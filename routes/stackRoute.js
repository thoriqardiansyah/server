const {
  createStack,
  getAllStack,
  detailStack,
  updateStack,
  deleteStack,
} = require("../controller/stackController");
const { authMiddle } = require("../middleware");

const router = require("express").Router();

router.post("/", authMiddle, createStack);
router.put("/:id", authMiddle, updateStack);
router.delete("/:id", authMiddle, deleteStack);
router.get("/", getAllStack);
router.get("/:id", detailStack);

module.exports = router;

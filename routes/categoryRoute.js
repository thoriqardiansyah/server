const {
  createCategory,
  getAllCategory,
  updateCategory,
  detailCategory,
  deleteCategory,
} = require("../controller/categoryController");
const { authMiddle } = require("../middleware");

const router = require("express").Router();

router.post("/", authMiddle, createCategory);
router.put("/:id", authMiddle, updateCategory);
router.delete("/:id", authMiddle, deleteCategory);
router.get("/", getAllCategory);
router.get("/:id", detailCategory);

module.exports = router;

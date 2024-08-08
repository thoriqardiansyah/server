const {
  createPortfolio,
  getAllPortfolio,
  updatePortfolio,
  detailPortfolio,
  deletePortfolio,
} = require("../controller/portfolioController");
const { authMiddle } = require("../middleware");
const { uploadFile } = require("../utils/fileUpload");

const router = require("express").Router();

router.post(
  "/",
  authMiddle,
  uploadFile.fields([
    { name: "imageSmall", maxCount: 1 },
    { name: "imageBig", maxCount: 1 },
  ]),
  createPortfolio
);
router.put(
  "/:id",
  authMiddle,
  uploadFile.fields([
    { name: "imageSmall", maxCount: 1 },
    { name: "imageBig", maxCount: 1 },
  ]),
  updatePortfolio
);
router.get("/", getAllPortfolio);
router.get("/:id", detailPortfolio);
router.delete("/:id", deletePortfolio);

module.exports = router;

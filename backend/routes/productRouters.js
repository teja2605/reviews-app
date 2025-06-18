const express = require("express");
const {
  getAllProducts,
  getProductById,
} = require("../controllers/productController");
const {
  createReview,
  getReviewsByProductId,
} = require("../controllers/reviewController");
const { authenticate } = require("../middleware/authMiddleware");
const router = express.Router();
router.get("/", getAllProducts);
router.get("/:id", getProductById);
router.post("/:id/reviews", authenticate, createReview);
router.get("/:id/reviews", getReviewsByProductId);
module.exports = router;
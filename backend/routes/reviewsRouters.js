const express = require("express");
const {
  createReview,
  getReviewsByProductId,
  getAverageRating,
} = require("../controllers/reviewController");
const { authenticate } = require("../middleware/authMiddleware");
const router = express.Router();
router.post("/:productId/reviews", authenticate, createReview);
router.get("/:productId/reviews", getReviewsByProductId);
router.get("/:productId/average-rating", getAverageRating);
module.exports = router;
const Review = require("../models/index").Review; 
const Product = require("../models/index").Product;
exports.createReview = async (req, res) => {
  const { productId, rating, reviewText } = req.body;
  const userId = req.user.id; 
  try {
    const existingReview = await Review.findOne({
      where: { productId, userId },
    });
    if (existingReview) {
      return res
        .status(400)
        .json({ message: "You have already reviewed this product." });
    }
    const newReview = await Review.create({
      productId,
      userId,
      rating,
      reviewText,
    });
    return res.status(201).json(newReview);
  } catch (error) {
    return res.status(500).json({ message: "Error creating review", error });
  }
};
exports.getReviewsForProduct = async (req, res) => {
  const { productId } = req.params;
  try {
    const reviews = await Review.findAll({ where: { productId } });
    return res.status(200).json(reviews);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching reviews", error });
  }
};
exports.getAverageRatingForProduct = async (req, res) => {
  const { productId } = req.params;
  try {
    const reviews = await Review.findAll({ where: { productId } });
    const averageRating =
      reviews.reduce((acc, review) => acc + review.rating, 0) /
        reviews.length || 0;
    return res.status(200).json({ averageRating });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error calculating average rating", error });
  }
};
    
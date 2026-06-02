import Review from "../models/Review.js";

export const createReview = async (req, res) => {
  try {
    const { productId, customerName, rating, comment } = req.body;

    if (!productId || !customerName || !rating || !comment) {
      return res.status(400).json({
        success: false,
        message: "productId, customerName, rating and comment are required",
      });
    }

    const review = await Review.create({
      productId,
      customerName,
      rating,
      comment,
    });

    res.status(201).json({ success: true, data: review });
  } catch (error) {
    console.error("createReview error", error);
    res.status(500).json({ success: false, message: "Failed to create review" });
  }
};

export const getReviewsForProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    const reviews = await Review.find({ productId }).sort({ createdAt: -1 });

    const averageRating =
      reviews.length === 0
        ? 0
        : reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

    res.json({
      success: true,
      data: {
        reviews,
        averageRating: Number(averageRating.toFixed(1)),
        count: reviews.length,
      },
    });
  } catch (error) {
    console.error("getReviewsForProduct error", error);
    res.status(500).json({ success: false, message: "Failed to fetch reviews" });
  }
};

export const markReviewHelpful = async (req, res) => {
  try {
    const { id } = req.params;

    const review = await Review.findByIdAndUpdate(
      id,
      { $inc: { helpfulCount: 1 } },
      { new: true }
    );

    if (!review) {
      return res
        .status(404)
        .json({ success: false, message: "Review not found" });
    }

    res.json({ success: true, data: review });
  } catch (error) {
    console.error("markReviewHelpful error", error);
    res.status(500).json({ success: false, message: "Failed to update review" });
  }
};

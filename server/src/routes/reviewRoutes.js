import express from "express";
import {
  createReview,
  getReviewsForProduct,
  markReviewHelpful,
} from "../controllers/reviewController.js";

const router = express.Router();

// POST /api/reviews
router.post("/", createReview);

// GET /api/reviews/:productId
router.get("/:productId", getReviewsForProduct);

// POST /api/reviews/:id/helpful
router.post("/:id/helpful", markReviewHelpful);

export default router;

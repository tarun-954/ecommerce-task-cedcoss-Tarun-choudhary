import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import reviewRoutes from "./routes/reviewRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/reviews_db";

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Review API is running",
  });
});

app.use("/api/reviews", reviewRoutes);

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection error", error);
    process.exit(1);
  });

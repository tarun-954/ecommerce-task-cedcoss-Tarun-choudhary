import { useEffect, useMemo, useState } from "react";

const API_BASE_URL = "http://localhost:5000/api";
const PRODUCT_ID = "soundhub-headphones-001";

function StarPicker({ value, onChange }) {
  return (
    <div className="star-picker" role="radiogroup" aria-label="Select rating">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          className={`star-btn ${value >= star ? "active" : ""}`}
          onClick={() => onChange(star)}
          aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
        >
          ★
        </button>
      ))}
    </div>
  );
}

function App() {
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    customerName: "",
    rating: 5,
    comment: "",
  });

  const averageStars = useMemo(() => "★".repeat(Math.round(averageRating || 0)), [averageRating]);

  const fetchReviews = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`${API_BASE_URL}/reviews/${PRODUCT_ID}`);
      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.message || "Unable to fetch reviews");
      }
      setReviews(result.data.reviews);
      setAverageRating(result.data.averageRating);
      setTotalReviews(result.data.count);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const response = await fetch(`${API_BASE_URL}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, productId: PRODUCT_ID }),
      });
      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.message || "Unable to submit review");
      }
      setFormData({
        customerName: "",
        rating: 5,
        comment: "",
      });
      await fetchReviews();
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  const markHelpful = async (reviewId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/reviews/${reviewId}/helpful`, {
        method: "POST",
      });
      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.message || "Unable to mark helpful");
      }
      await fetchReviews();
    } catch (err) {
      setError(err.message || "Something went wrong");
    }
  };

  return (
    <main className="app-shell">
      <section className="card">
        <header className="top">
          <h1>SoundHub Product Reviews</h1>
          <div className="rating-summary">
            <strong>{averageRating || 0}/5</strong>
            <span>{averageStars || "No stars yet"}</span>
            <small>{totalReviews} review(s)</small>
          </div>
        </header>

        <form className="review-form" onSubmit={handleSubmit}>
          <h2>Write a review</h2>

          <label htmlFor="customerName">Your Name</label>
          <input
            id="customerName"
            type="text"
            value={formData.customerName}
            onChange={(event) =>
              setFormData((prev) => ({ ...prev, customerName: event.target.value }))
            }
            placeholder="Enter your name"
            required
          />

          <label>Your Rating</label>
          <StarPicker
            value={formData.rating}
            onChange={(rating) => setFormData((prev) => ({ ...prev, rating }))}
          />

          <label htmlFor="comment">Your Review</label>
          <textarea
            id="comment"
            rows="4"
            value={formData.comment}
            onChange={(event) =>
              setFormData((prev) => ({ ...prev, comment: event.target.value }))
            }
            placeholder="Share your experience with this product"
            required
          />

          <button type="submit" disabled={submitting}>
            {submitting ? "Submitting..." : "Submit Review"}
          </button>
        </form>

        <section className="reviews-list">
          <h2>Customer Reviews</h2>
          {loading && <p>Loading reviews...</p>}
          {!loading && reviews.length === 0 && <p>No reviews yet. Be the first one!</p>}
          {!loading &&
            reviews.map((review) => (
              <article key={review._id} className="review-item">
                <div className="review-head">
                  <strong>{review.customerName}</strong>
                  <span>{"★".repeat(review.rating)}</span>
                </div>
                <p>{review.comment}</p>
                <button
                  type="button"
                  className="helpful-btn"
                  onClick={() => markHelpful(review._id)}
                >
                  👍 Helpful ({review.helpfulCount || 0})
                </button>
              </article>
            ))}
        </section>

        {error && <p className="error-text">{error}</p>}
      </section>
    </main>
  );
}

export default App;

import { useEffect, useMemo, useState } from "react";

const API_BASE_URL = "http://localhost:5000/api";
const PRODUCT_ID = "soundhub-headphones-001";
const HELPFUL_STORAGE_KEY = "soundhub_helpful_reviews";

function StarPicker({ value, onChange }) {
  return (
    <div className="flex gap-2 cursor-pointer" role="radiogroup" aria-label="Select rating">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          className={`w-2 h-8 rounded-sm transition-colors ${value >= star ? "level-meter-active" : "level-meter-inactive hover:bg-secondary-container"}`}
          onClick={() => onChange(star)}
          aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
        />
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
  const [helpfulLoadingId, setHelpfulLoadingId] = useState("");
  const [votedHelpfulIds, setVotedHelpfulIds] = useState(() => {
    try {
      const stored = localStorage.getItem(HELPFUL_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    customerName: "",
    rating: 5,
    comment: "",
  });

  const averageStars = useMemo(() => "★".repeat(Math.round(averageRating || 0)), [averageRating]);
  const ratingDistribution = useMemo(() => {
    const base = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    reviews.forEach((review) => {
      base[review.rating] += 1;
    });
    return base;
  }, [reviews]);

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

  useEffect(() => {
    localStorage.setItem(HELPFUL_STORAGE_KEY, JSON.stringify(votedHelpfulIds));
  }, [votedHelpfulIds]);

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
    if (votedHelpfulIds.includes(reviewId)) {
      return;
    }
    setHelpfulLoadingId(reviewId);
    try {
      const response = await fetch(`${API_BASE_URL}/reviews/${reviewId}/helpful`, {
        method: "POST",
      });
      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.message || "Unable to mark helpful");
      }
      setVotedHelpfulIds((prev) => [...prev, reviewId]);
      await fetchReviews();
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setHelpfulLoadingId("");
    }
  };

  return (
    <div className="bg-surface text-on-surface min-h-screen antialiased pt-[80px]">
      <header className="bg-surface/80 backdrop-blur-xl border-b border-white/10 fixed top-0 w-full z-50 flex justify-between items-center px-margin-mobile md:px-margin-desktop py-4 h-[80px]">
        <div className="text-primary-fixed-dim font-bold tracking-tight text-[32px] md:text-[40px]">
          SoundHub
        </div>
        <nav className="hidden md:flex gap-8 text-xs uppercase tracking-widest">
          <a className="text-primary border-b-2 border-primary pb-1" href="#">Headphones</a>
          <a className="hover:text-primary transition-colors" href="#">Speakers</a>
          <a className="hover:text-primary transition-colors" href="#">Studio</a>
          <a className="hover:text-primary transition-colors" href="#">Deals</a>
        </nav>
        <div className="flex gap-4">
          <span className="material-symbols-outlined">shopping_cart</span>
          <span className="material-symbols-outlined">account_circle</span>
        </div>
      </header>

      <main className="w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-8 md:py-12 flex flex-col gap-12">
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-start">
          <div className="lg:col-span-7">
            <div className="relative aspect-square rounded-xl overflow-hidden glass-panel shadow-[0_20px_40px_rgba(0,0,0,0.4)]">
              <img
                alt="Premium wireless headphones"
                className="w-full h-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBav3iS9r_6POGtcKvvRseY0H6Q5MgMF13ctXkyH3qEnd3IIKRbp-shdL0vuR1QSOGlGwrePq9SKc-8Vm6nEC7tkc421FTYr6IpI1ziG6bakKEP7oX5uKKDip8lrWf_l1n92kmpfu--ygpFMlDigUsG0HLKpkOC70xsuDGHesI3AJX3fVf22Vev6nJqb4Ueu4E-fKVOnF4bz32SlQA561EdbV6ChrfJ1zfhw_NJ9hZ2vSnDNzmklTFWvlY4sbHLpQGZPd1dw5Jzdw"
              />
            </div>
          </div>
          <div className="lg:col-span-5 flex flex-col pt-4 lg:pt-12">
            <h1 className="text-4xl font-semibold mb-2">SoundHub Pro</h1>
            <p className="text-lg mb-6">Wireless Noise Cancelling Headphones</p>
            <div className="text-3xl text-primary mb-8">$349.00</div>
            <p className="text-base leading-relaxed mb-8">
              Engineered for sonic perfection with active noise cancellation and immersive high-fidelity sound.
            </p>
          </div>
        </section>

        <section className="bg-surface-container p-6 md:p-10 rounded-xl border border-white/5 relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 relative z-10">
            <div className="lg:col-span-4 flex flex-col gap-8">
              <div>
                <h2 className="text-3xl mb-2">Customer Reviews</h2>
                <div className="flex items-end gap-4 mb-6">
                  <div className="text-[72px] leading-none font-bold text-primary">
                    {averageRating || 0}
                  </div>
                  <div className="pb-2">
                    <div className="text-secondary-container mb-1">{averageStars || "No stars yet"}</div>
                    <div className="text-xs">Based on {totalReviews} reviews</div>
                  </div>
                </div>
                <div className="flex flex-col gap-2 text-xs">
                  {[5, 4, 3, 2, 1].map((star) => {
                    const count = ratingDistribution[star];
                    const width = totalReviews ? Math.round((count / totalReviews) * 100) : 0;
                    return (
                      <div key={star} className="flex items-center gap-3">
                        <span className="w-4">{star}</span>
                        <div className="flex-grow h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
                          <div className="h-full bg-secondary-container" style={{ width: `${width}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="glass-panel p-6 rounded-lg border border-outline-variant/30">
                <h3 className="text-lg mb-4">Write a Review</h3>
                <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                  <div>
                    <label className="text-xs block mb-2 uppercase tracking-widest">Your Name</label>
                    <input
                      className="w-full bg-[#0F1113] border-0 border-b-2 border-outline-variant focus:border-primary text-on-surface p-3 focus:ring-0"
                      type="text"
                      value={formData.customerName}
                      onChange={(event) =>
                        setFormData((prev) => ({ ...prev, customerName: event.target.value }))
                      }
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs block mb-2 uppercase tracking-widest">Overall Rating</label>
                    <StarPicker
                      value={formData.rating}
                      onChange={(rating) => setFormData((prev) => ({ ...prev, rating }))}
                    />
                  </div>
                  <div>
                    <label className="text-xs block mb-2 uppercase tracking-widest">Share your experience</label>
                    <textarea
                      className="w-full bg-[#0F1113] border-0 border-b-2 border-outline-variant focus:border-primary text-on-surface p-3 focus:ring-0 resize-none"
                      rows="3"
                      value={formData.comment}
                      onChange={(event) =>
                        setFormData((prev) => ({ ...prev, comment: event.target.value }))
                      }
                      required
                    />
                  </div>
                  <button
                    className="mt-2 bg-transparent border border-primary text-primary text-xs uppercase tracking-widest py-3 px-4 rounded hover:bg-primary/5 transition-colors self-start disabled:opacity-70"
                    type="submit"
                    disabled={submitting}
                  >
                    {submitting ? "Submitting..." : "Submit Review"}
                  </button>
                </form>
              </div>
              {error && <p className="text-red-400 text-sm">{error}</p>}
            </div>

            <div className="lg:col-span-8 flex flex-col gap-6">
              {loading && <p>Loading reviews...</p>}
              {!loading && reviews.length === 0 && <p>No reviews yet. Be the first one!</p>}
              {!loading &&
                reviews.map((review) => (
                  <div key={review._id} className="border-b border-outline-variant/30 pb-6">
                    <div className="flex justify-between items-start mb-2 gap-4">
                      <div>
                        <div className="text-lg font-semibold">{review.comment.slice(0, 55) || "Review"}</div>
                        <div className="text-xs mt-1 opacity-80">
                          {review.customerName} • {new Date(review.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="text-secondary-container">{Array.from({ length: review.rating }).map((_, i) => <span key={i}>★</span>)}</div>
                    </div>
                    <p className="mt-3">{review.comment}</p>
                    <button
                      className="mt-4 flex items-center gap-1 text-xs hover:text-primary transition-colors disabled:opacity-60"
                      type="button"
                      onClick={() => markHelpful(review._id)}
                      disabled={votedHelpfulIds.includes(review._id) || helpfulLoadingId === review._id}
                    >
                      <span className="material-symbols-outlined text-[16px]">thumb_up</span>
                      {votedHelpfulIds.includes(review._id)
                        ? `Marked Helpful (${review.helpfulCount || 0})`
                        : helpfulLoadingId === review._id
                        ? "Updating..."
                        : `Helpful (${review.helpfulCount || 0})`}
                    </button>
                  </div>
                ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;

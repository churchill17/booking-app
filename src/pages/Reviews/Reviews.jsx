import { useState, useEffect } from "react";
import Select from "react-select";
import { useNavigate } from "react-router-dom";
import { searchListings, updateListing } from "../../components/host/services/hostApi";
import "./Reviews.css";

const ratingLabels = [
  "No rating", "Terrible", "Poor", "Average", "Good",
  "Very good", "Excellent", "Superb", "Exceptional", "Amazing", "Perfect",
];

const ratingColors = [
  "#94a3b8", "#ef4444", "#f97316", "#eab308", "#84cc16",
  "#22c55e", "#10b981", "#06b6d4", "#3b82f6", "#8b5cf6", "#19907e",
];

export default function Reviews() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    stars: "",
    rating: "",
    reviewCount: "",
    ratingLabel: "",
    locationScore: "",
    coupleLocationScore: "",
    overall: "",
    totalReviews: "",
    categories: [
      { name: "Staff", score: "" },
      { name: "Facilities", score: "" },
      { name: "Cleanliness", score: "" },
      { name: "Comfort", score: "" },
      { name: "Value for money", score: "" },
      { name: "Location", score: "" },
      { name: "Free WiFi", score: "" },
    ],
    reviews: [],
  });

  const [propertyQuery, setPropertyQuery] = useState("");
  const [propertyOptions, setPropertyOptions] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [validationErrors, setValidationErrors] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    if (!propertyQuery || propertyQuery.length < 2) {
      Promise.resolve().then(() => setPropertyOptions([]));
      return;
    }
    const handler = setTimeout(() => {
      searchListings(propertyQuery)
        .then((results) => { if (!cancelled) setPropertyOptions(results.properties || []); })
        .catch(() => { if (!cancelled) setPropertyOptions([]); });
    }, 350);
    return () => { cancelled = true; clearTimeout(handler); };
  }, [propertyQuery]);

  const addCategory = () =>
    setForm((f) => ({ ...f, categories: [...f.categories, { name: "", score: "" }] }));
  const updateCategory = (i, field, value) =>
    setForm((f) => { const cats = f.categories.slice(); cats[i] = { ...cats[i], [field]: value }; return { ...f, categories: cats }; });
  const removeCategory = (i) =>
    setForm((f) => ({ ...f, categories: f.categories.filter((_, idx) => idx !== i) }));

  const addReview = () =>
    setForm((f) => ({ ...f, reviews: [...f.reviews, { name: "", country: "", text: "" }] }));
  const updateReview = (i, field, value) =>
    setForm((f) => { const revs = f.reviews.slice(); revs[i] = { ...revs[i], [field]: value }; return { ...f, reviews: revs }; });
  const removeReview = (i) =>
    setForm((f) => ({ ...f, reviews: f.reviews.filter((_, idx) => idx !== i) }));

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const missing = [];

    if (!form.stars) missing.push("Stars");
    if (!form.rating) missing.push("Rating");
    if (!form.reviewCount) missing.push("Review Count");
    if (!form.ratingLabel) missing.push("Rating Label");
    if (!form.locationScore) missing.push("Location Score");
    if (!form.overall) missing.push("Overall Score");
    if (!form.totalReviews) missing.push("Total Reviews");

    if (!form.categories || form.categories.length === 0) {
      missing.push("At least one Category");
    } else {
      form.categories.forEach((cat, i) => {
        if (!cat.name) missing.push(`Category ${i + 1} Name`);
        if (cat.score === "" || cat.score === null || typeof cat.score === "undefined")
          missing.push(`Category ${cat.name || i + 1} Score`);
      });
    }

    if (!form.reviews || form.reviews.length === 0) {
      missing.push("At least one Review");
    } else {
      form.reviews.forEach((rev, i) => {
        if (!rev.name) missing.push(`Review ${i + 1} Name`);
        if (!rev.country) missing.push(`Review ${i + 1} Country`);

        if (!rev.text) missing.push(`Review ${i + 1} Text`);
      });
    }

    if (missing.length > 0) {
      setValidationErrors(missing);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setValidationErrors([]);
    setSubmitting(true);
    try {
      await updateListing({ guestReviews: form });
      alert("Review submitted!");
      navigate(-1);
    } catch (err) {
      alert("Failed to submit review: " + (err?.message || err));
    } finally {
      setSubmitting(false);
    }
  };

  const ratingVal = form.rating !== "" ? Number(form.rating) : null;
  const ratingBadgeColor = ratingVal !== null ? ratingColors[ratingVal] : "#94a3b8";

  return (
    <div className="rv-page">
      <div className="rv-card">

        {/* Header */}
        <div className="rv-header">
          <div className="rv-header-icon">★</div>
          <h2 className="rv-header-title">Submit Guest Reviews</h2>
          <p className="rv-header-sub">Fill in the details below to publish ratings and reviews for a property.</p>
        </div>

        {/* Validation errors */}
        {validationErrors.length > 0 && (
          <div className="rv-errors">
            <span className="rv-errors-icon">⚠</span>
            <div>
              <strong>Please complete the following fields:</strong>
              <ul className="rv-errors-list">
                {validationErrors.map((err, idx) => <li key={idx}>{err}</li>)}
              </ul>
            </div>
          </div>
        )}

        <form className="rv-form" onSubmit={handleSubmit}>

          {/* Property Search */}
          <div className="rv-section">
            <div className="rv-section-header">
              <span className="rv-section-icon">🏨</span>
              <h3 className="rv-section-title">Property</h3>
            </div>
            <div className="rv-field">
              <label className="rv-label" htmlFor="property-search">Search & select a property</label>
              <Select
                inputId="property-search"
                placeholder="Type to search properties…"
                value={selectedProperty}
                onInputChange={setPropertyQuery}
                onChange={setSelectedProperty}
                options={propertyOptions.map((p) => ({ value: p.id, label: p.name || p.id, ...p }))}
                isClearable
                classNamePrefix="rv-select"
              />
            </div>
          </div>

          {/* Ratings & Scores */}
          <div className="rv-section">
            <div className="rv-section-header">
              <span className="rv-section-icon">📊</span>
              <h3 className="rv-section-title">Ratings &amp; Scores</h3>
            </div>
            <div className="rv-grid-2">
              <div className="rv-field">
                <label className="rv-label" htmlFor="stars">Star Rating</label>
                <input
                  id="stars"
                  className="rv-input"
                  type="number"
                  name="stars"
                  value={form.stars}
                  onChange={handleChange}
                  min={0} max={5}
                  placeholder="0 – 5"
                />
              </div>
              <div className="rv-field">
                <label className="rv-label" htmlFor="reviewCount">Review Count</label>
                <input
                  id="reviewCount"
                  className="rv-input"
                  type="number"
                  name="reviewCount"
                  value={form.reviewCount}
                  onChange={handleChange}
                  min={0}
                  placeholder="e.g. 248"
                />
              </div>
              <div className="rv-field">
                <label className="rv-label" htmlFor="totalReviews">Total Reviews</label>
                <input
                  id="totalReviews"
                  className="rv-input"
                  type="number"
                  name="totalReviews"
                  value={form.totalReviews}
                  onChange={handleChange}
                  min={0}
                  placeholder="e.g. 312"
                />
              </div>
              <div className="rv-field">
                <label className="rv-label" htmlFor="overall">Overall Score</label>
                <input
                  id="overall"
                  className="rv-input"
                  type="number"
                  name="overall"
                  value={form.overall}
                  onChange={handleChange}
                  min={0} max={10} step={0.1}
                  placeholder="0.0 – 10.0"
                />
              </div>
              <div className="rv-field">
                <label className="rv-label" htmlFor="locationScore">Location Score</label>
                <input
                  id="locationScore"
                  className="rv-input"
                  type="number"
                  name="locationScore"
                  value={form.locationScore}
                  onChange={handleChange}
                  min={0} max={10} step={0.1}
                  placeholder="0.0 – 10.0"
                />
              </div>
              <div className="rv-field">
                <label className="rv-label" htmlFor="coupleLocationScore">Couple Location Score <span className="rv-optional">(optional)</span></label>
                <input
                  id="coupleLocationScore"
                  className="rv-input"
                  type="number"
                  name="coupleLocationScore"
                  value={form.coupleLocationScore}
                  onChange={handleChange}
                  min={0} max={10} step={0.1}
                  placeholder="0.0 – 10.0"
                />
              </div>
            </div>

            {/* Rating selector with live badge */}
            <div className="rv-field rv-rating-field">
              <label className="rv-label" htmlFor="rating">Rating (0 – 10)</label>
              <div className="rv-rating-row">
                <select
                  id="rating"
                  className="rv-input rv-select-native"
                  name="rating"
                  value={form.rating}
                  onChange={(e) => {
                    const value = e.target.value;
                    setForm((prev) => ({ ...prev, rating: value, ratingLabel: ratingLabels[value] || "" }));
                  }}
                >
                  <option value="">Select a rating…</option>
                  {ratingLabels.map((label, idx) => (
                    <option key={idx} value={idx}>{idx} — {label}</option>
                  ))}
                </select>
                {ratingVal !== null && (
                  <span className="rv-rating-badge" style={{ background: ratingBadgeColor }}>
                    {ratingVal} <em>{ratingLabels[ratingVal]}</em>
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Categories */}
          <div className="rv-section">
            <div className="rv-section-header">
              <span className="rv-section-icon">🏷</span>
              <h3 className="rv-section-title">Category Scores</h3>
            </div>
            <div className="rv-categories-list">
              {form.categories.map((cat, i) => (
                <div key={i} className="rv-category-row">
                  <input
                    className="rv-input rv-cat-name"
                    type="text"
                    placeholder="Category name"
                    value={cat.name}
                    onChange={(e) => updateCategory(i, "name", e.target.value)}
                  />
                  <input
                    className="rv-input rv-cat-score"
                    type="number"
                    placeholder="Score"
                    value={cat.score}
                    min={0} max={10} step={0.1}
                    onChange={(e) => updateCategory(i, "score", e.target.value)}
                  />
                  <button type="button" className="rv-btn-remove" onClick={() => removeCategory(i)} aria-label="Remove category">✕</button>
                </div>
              ))}
            </div>
            <button type="button" className="rv-btn-add" onClick={addCategory}>
              + Add Category
            </button>
          </div>

          {/* Reviews */}
          <div className="rv-section">
            <div className="rv-section-header">
              <span className="rv-section-icon">💬</span>
              <h3 className="rv-section-title">Guest Reviews</h3>
            </div>
            {form.reviews.length === 0 && (
              <p className="rv-empty-hint">No reviews yet. Click below to add the first one.</p>
            )}
            <div className="rv-reviews-list">
              {form.reviews.map((rev, i) => (
                <div key={i} className="rv-review-card">
                  <div className="rv-review-card-header">
                    <span className="rv-review-num">Review #{i + 1}</span>
                    <button type="button" className="rv-btn-remove" onClick={() => removeReview(i)} aria-label="Remove review">✕ Remove</button>
                  </div>
                  <div className="rv-grid-2">
                    <div className="rv-field">
                      <label className="rv-label">Guest Name</label>
                      <input
                        className="rv-input"
                        type="text"
                        placeholder="e.g. Sarah M."
                        value={rev.name}
                        onChange={(e) => updateReview(i, "name", e.target.value)}
                      />
                    </div>
                    <div className="rv-field">
                      <label className="rv-label">Country</label>
                      <input
                        className="rv-input"
                        type="text"
                        placeholder="e.g. United Kingdom"
                        value={rev.country}
                        onChange={(e) => updateReview(i, "country", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="rv-field">
                    <label className="rv-label">Review Text</label>
                    <textarea
                      className="rv-input rv-textarea"
                      placeholder="Write the guest's review here…"
                      value={rev.text}
                      onChange={(e) => updateReview(i, "text", e.target.value)}
                      rows={3}
                    />
                  </div>
                </div>
              ))}
            </div>
            <button type="button" className="rv-btn-add" onClick={addReview}>
              + Add Review
            </button>
          </div>

          {/* Submit */}
          <button type="submit" className="rv-btn-submit" disabled={submitting}>
            {submitting ? "Submitting…" : "Submit Reviews"}
          </button>

        </form>
      </div>
    </div>
  );
}

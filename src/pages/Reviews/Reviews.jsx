import { useState, useEffect } from "react";
import Select from "react-select";
import { useNavigate } from "react-router-dom";
import { searchListings } from "../../components/host/services/hostApi";

import { updateListing } from "../../components/host/services/hostApi";

import "./Reviews.css";

export default function Reviews() {
  const ratingLabels = [
    "No rating",
    "Terrible",
    "Poor",
    "Average",
    "Good",
    "Very good",
    "Excellent",
    "Superb",
    "Exceptional",
    "Amazing",
    "Perfect",
  ];
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

  useEffect(() => {
    let cancelled = false;
    if (!propertyQuery || propertyQuery.length < 2) {
      // Only update state in a microtask to avoid direct setState in effect
      Promise.resolve().then(() => setPropertyOptions([]));
      return;
    }
    const handler = setTimeout(() => {
      searchListings(propertyQuery)
        .then((results) => {
          if (!cancelled) setPropertyOptions(results.properties || []);
        })
        .catch(() => {
          if (!cancelled) setPropertyOptions([]);
        });
    }, 350);
    return () => {
      cancelled = true;
      clearTimeout(handler);
    };
  }, [propertyQuery]);
  const [validationErrors, setValidationErrors] = useState([]);

  // Handlers for dynamic fields
  const addCategory = () =>
    setForm((f) => ({
      ...f,
      categories: [...f.categories, { name: "", score: 0 }],
    }));
  const updateCategory = (i, field, value) =>
    setForm((f) => {
      const categories = f.categories.slice();
      categories[i][field] = value;
      return { ...f, categories };
    });
  const removeCategory = (i) =>
    setForm((f) => ({
      ...f,
      categories: f.categories.filter((_, idx) => idx !== i),
    }));
  const addReview = () =>
    setForm((f) => ({
      ...f,
      reviews: [...f.reviews, { name: "", country: "", flag: "", text: "" }],
    }));
  const updateReview = (i, field, value) =>
    setForm((f) => {
      const reviews = f.reviews.slice();
      reviews[i][field] = value;
      return { ...f, reviews };
    });
  const removeReview = (i) =>
    setForm((f) => ({
      ...f,
      reviews: f.reviews.filter((_, idx) => idx !== i),
    }));

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    if (!form.reviews || form.reviews.length === 0) {
      missing.push("At least one Review");
    }

    e.preventDefault();
    const missing = [];
    if (!form.stars) missing.push("Stars");
    if (!form.rating) missing.push("Rating");
    if (!form.reviewCount) missing.push("Review Count");
    if (!form.ratingLabel) missing.push("Rating Label");
    if (!form.locationScore) missing.push("Location Score");
    if (!form.overall) missing.push("Overall Score");
    if (!form.totalReviews) missing.push("Total Reviews");
    // Validate categories
    if (!form.categories || form.categories.length === 0) {
      missing.push("At least one Category");
    } else {
      form.categories.forEach((cat, i) => {
        if (!cat.name) missing.push(`Category ${i + 1} Name`);
        if (
          cat.score === "" ||
          cat.score === null ||
          typeof cat.score === "undefined"
        )
          missing.push(`Category ${cat.name || i + 1} Score`);
      });
    }
    // Validate reviews (if any reviews are present, all fields must be filled)
    if (form.reviews && form.reviews.length > 0) {
      form.reviews.forEach((rev, i) => {
        if (!rev.name) missing.push(`Review ${i + 1} Name`);
        if (!rev.country) missing.push(`Review ${i + 1} Country`);
        if (!rev.flag) missing.push(`Review ${i + 1} Flag`);
        if (!rev.text) missing.push(`Review ${i + 1} Text`);
      });
    }
    if (missing.length > 0) {
      setValidationErrors(missing);
      return;
    }
    setValidationErrors([]);
    try {
      await updateListing({ guestReviews: form });
      alert("Review submitted!");
      navigate(-1);
    } catch (err) {
      alert("Failed to submit review: " + (err?.message || err));
    }
  };

  return (
    <div className="reviews-form-container">
      <h2>Submit Guest Reviews</h2>
      {Array.isArray(validationErrors) && validationErrors.length > 0 && (
        <div style={{ color: "red", marginBottom: 16 }}>
          <b>Please fill the following fields:</b>
          <ul>
            {validationErrors.map((err, idx) => (
              <li key={idx}>{err}</li>
            ))}
          </ul>
        </div>
      )}
      <form className="reviews-form" onSubmit={handleSubmit}>
        <div style={{ marginBottom: 16 }}>
          <label htmlFor="property-search">Property:</label>
          <Select
            inputId="property-search"
            placeholder="Search for a property..."
            value={selectedProperty}
            onInputChange={setPropertyQuery}
            onChange={setSelectedProperty}
            options={propertyOptions.map((p) => ({
              value: p.id,
              label: p.name || p.id,
              ...p,
            }))}
            isClearable
          />
        </div>
        <label>
          Stars:
          <input
            type="number"
            name="stars"
            value={form.stars}
            onChange={handleChange}
            min={0}
            max={5}
            placeholder="Enter a number between 0 and 5"
          />
        </label>
        <label>
          Rating:
          <select
            name="rating"
            value={form.rating}
            onChange={(e) => {
              const value = e.target.value;
              setForm((prev) => ({
                ...prev,
                rating: value,
                ratingLabel: ratingLabels[value] || "",
              }));
            }}
            style={{
              display: "block",
              width: "100%",
              padding: "8px",
              marginTop: "4px",
              marginBottom: "8px",
            }}
          >
            <option value="">Select rating (0-10)</option>
            {ratingLabels.map((label, idx) => (
              <option key={idx} value={idx}>
                {idx}
              </option>
            ))}
          </select>
          <span
            style={{
              display: "block",
              color: "#555",
              fontSize: "0.95em",
              marginTop: "-4px",
              marginBottom: "12px",
            }}
          >
            Rating Label:{" "}
            <b>{form.rating !== "" ? ratingLabels[form.rating] : "-"}</b>
          </span>
        </label>
        <label>
          Review Count:
          <input
            type="number"
            name="reviewCount"
            value={form.reviewCount}
            onChange={handleChange}
            min={0}
            placeholder="Enter a number"
          />
        </label>
        <label>
          Total Reviews:
          <input
            type="number"
            name="totalReviews"
            value={form.totalReviews}
            onChange={handleChange}
            min={0}
            placeholder="Enter a number"
          />
        </label>
        <label>
          Location Score:
          <input
            type="number"
            name="locationScore"
            value={form.locationScore}
            onChange={handleChange}
            min={0}
            max={10}
            step={0.1}
            placeholder="Enter a number between 0 and 10"
          />
        </label>
        <label>
          Couple Location Score:
          <input
            type="number"
            name="coupleLocationScore"
            value={form.coupleLocationScore}
            onChange={handleChange}
            min={0}
            max={10}
            step={0.1}
            placeholder="Enter a number between 0 and 10 (Optional)"
          />
        </label>
        <label>
          Overall Score:
          <input
            type="number"
            name="overall"
            value={form.overall}
            onChange={handleChange}
            min={0}
            max={10}
            step={0.1}
            placeholder="Enter a number between 0 and 10"
          />
        </label>
        <fieldset>
          <legend>Categories</legend>
          {form.categories.map((cat, i) => (
            <div key={i} style={{ display: "flex", gap: 8, marginBottom: 4 }}>
              <input
                type="text"
                placeholder="Category Name"
                value={cat.name}
                onChange={(e) => updateCategory(i, "name", e.target.value)}
              />
              <input
                type="number"
                placeholder="Enter score from 0 to 10"
                value={cat.score}
                min={0}
                max={10}
                step={0.1}
                onChange={(e) => updateCategory(i, "score", e.target.value)}
              />
              <button type="button" onClick={() => removeCategory(i)}>
                Remove
              </button>
            </div>
          ))}
          <button type="button" onClick={addCategory}>
            Add Category
          </button>
        </fieldset>
        <fieldset>
          <legend>Reviews</legend>
          {form.reviews.map((rev, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 8,
                marginBottom: 12,
              }}
            >
              <input
                type="text"
                placeholder="Name"
                value={rev.name}
                onChange={(e) => updateReview(i, "name", e.target.value)}
              />
              <input
                type="text"
                placeholder="Country"
                value={rev.country}
                onChange={(e) => updateReview(i, "country", e.target.value)}
              />
              <input
                type="text"
                placeholder="Review Text"
                value={rev.text}
                onChange={(e) => updateReview(i, "text", e.target.value)}
              />
              <button type="button" onClick={() => removeReview(i)}>
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addReview}
            style={{ width: "100%", marginTop: 8 }}
          >
            Add Review
          </button>
        </fieldset>

        <button type="submit">Submit Reviews</button>
      </form>
    </div>
  );
}

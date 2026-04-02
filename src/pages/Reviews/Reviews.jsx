import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import {
  updateListing,
  searchListings,
} from "../../components/host/services/hostApi";

import "./Reviews.css";

export default function Reviews() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    stars: 0,
    rating: 0,
    reviewCount: 0,
    ratingLabel: "",
    locationScore: 0,
    coupleLocationScore: 0,
    overall: 0,
    totalReviews: 0,
    categories: [],
    reviews: [],
    topics: [],
  });
  const [propertyQuery, setPropertyQuery] = useState("");
  const [propertyOptions, setPropertyOptions] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState(null);


  // Debounced backend search for properties
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
          if (!cancelled) setPropertyOptions(results);
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
  const addTopic = () => setForm((f) => ({ ...f, topics: [...f.topics, ""] }));
  const updateTopic = (i, value) =>
    setForm((f) => {
      const topics = f.topics.slice();
      topics[i] = value;
      return { ...f, topics };
    });
  const removeTopic = (i) =>
    setForm((f) => ({ ...f, topics: f.topics.filter((_, idx) => idx !== i) }));

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedProperty) {
      alert("Please select a property.");
      return;
    }
    try {
      await updateListing(selectedProperty.id, { guestReviews: form });
      alert("Review submitted!");
      navigate(-1);
    } catch (err) {
      alert("Failed to submit review: " + (err?.message || err));
    }
  };

  return (
    <div className="reviews-form-container">
      <h2>Submit Guest Reviews</h2>
      <form className="reviews-form" onSubmit={handleSubmit}>
        <label>
          Search Property:
          <input
            type="text"
            value={propertyQuery}
            onChange={(e) => setPropertyQuery(e.target.value)}
            placeholder="Type property name..."
          />
        </label>
        <div
          style={{
            maxHeight: 120,
            overflowY: "auto",
            border: "1px solid #ccc",
            marginBottom: 8,
          }}
        >
          {propertyOptions
            .filter((p) =>
              p.propertyName
                .toLowerCase()
                .includes(propertyQuery.toLowerCase()),
            )
            .map((p) => (
              <div
                key={p.id}
                className={
                  "property-list-option" +
                  (selectedProperty?.id === p.id ? " selected" : "")
                }
                onClick={() => setSelectedProperty(p)}
              >
                {p.propertyName} ({p.city}, {p.country})
              </div>
            ))}
        </div>
        {selectedProperty && (
          <div className="selected-property">
            Selected: <b>{selectedProperty.propertyName}</b> (ID:{" "}
            {selectedProperty.id})
          </div>
        )}
        <label>
          Stars:
          <input
            type="number"
            name="stars"
            value={form.stars}
            onChange={handleChange}
            min={0}
            max={5}
          />
        </label>
        <label>
          Rating:
          <input
            type="number"
            name="rating"
            value={form.rating}
            onChange={handleChange}
            min={0}
            max={5}
            step={0.1}
          />
        </label>
        <label>
          Review Count:
          <input
            type="number"
            name="reviewCount"
            value={form.reviewCount}
            onChange={handleChange}
            min={0}
          />
        </label>
        <label>
          Rating Label:
          <input
            type="text"
            name="ratingLabel"
            value={form.ratingLabel}
            onChange={handleChange}
            placeholder="e.g. Excellent"
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
            placeholder="e.g. 9.5"
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
                placeholder="Score"
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
            <div key={i} style={{ display: "flex", gap: 8, marginBottom: 4 }}>
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
                placeholder="Flag"
                value={rev.flag}
                onChange={(e) => updateReview(i, "flag", e.target.value)}
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
          <button type="button" onClick={addReview}>
            Add Review
          </button>
        </fieldset>
        <fieldset>
          <legend>Topics</legend>
          {form.topics.map((topic, i) => (
            <div key={i} style={{ display: "flex", gap: 8, marginBottom: 4 }}>
              <input
                type="text"
                placeholder="Topic"
                value={topic}
                onChange={(e) => updateTopic(i, e.target.value)}
              />
              <button type="button" onClick={() => removeTopic(i)}>
                Remove
              </button>
            </div>
          ))}
          <button type="button" onClick={addTopic}>
            Add Topic
          </button>
        </fieldset>
        <button type="submit">Submit Reviews</button>
      </form>
    </div>
  );
}

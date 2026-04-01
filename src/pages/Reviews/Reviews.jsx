import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getListings,
  updateListing,
} from "../../components/host/services/hostApi";

export default function Reviews() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    overall: 0,
    totalReviews: 0,
    categories: [],
    reviews: [],
    topics: [],
  });
  const [propertyQuery, setPropertyQuery] = useState("");
  const [propertyOptions, setPropertyOptions] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState(null);

  // Fetch all properties for dropdown
  useEffect(() => {
    getListings().then((props) => setPropertyOptions(props));
  }, []);

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
    <div style={{ maxWidth: 600, margin: "2rem auto" }}>
      <h2>Submit Guest Reviews</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Search Property:
          <input
            type="text"
            value={propertyQuery}
            onChange={(e) => setPropertyQuery(e.target.value)}
            placeholder="Type property name..."
            style={{ width: 300 }}
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
                style={{
                  padding: 4,
                  background:
                    selectedProperty?.id === p.id ? "#e0e0e0" : "#fff",
                  cursor: "pointer",
                }}
                onClick={() => setSelectedProperty(p)}
              >
                {p.propertyName} ({p.city}, {p.country})
              </div>
            ))}
        </div>
        {selectedProperty && (
          <div style={{ marginBottom: 12, color: "green" }}>
            Selected: <b>{selectedProperty.propertyName}</b> (ID:{" "}
            {selectedProperty.id})
          </div>
        )}
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
        <br />
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
        <br />
        <fieldset style={{ marginBottom: 16 }}>
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
        <fieldset style={{ marginBottom: 16 }}>
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
        <fieldset style={{ marginBottom: 16 }}>
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

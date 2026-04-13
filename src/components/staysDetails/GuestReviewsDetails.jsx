import React, { useState } from "react";
import "./GuestReviewsDetails.css";

const placeholderData = {
  rating: 8.3,
  ratingLabel: "Very good",
  totalReviews: 9,
  categories: [
    { name: "Staff", score: 8.6 },
    { name: "Facilities", score: 9.4 },
    { name: "Cleanliness", score: 9.4 },
    { name: "Comfort", score: 9.4 },
    { name: "Value for money", score: 9.4 },
    { name: "Location", score: 8.6 },
    { name: "Free WiFi", score: 10 },
  ],
  reviewsDetails: [
    {
      firstName: "Ferishat",
      country: "Nigeria",
      roomType: "Studio",
      duration: "1 night · Dec 2025",
      travelerType: "Solo traveller",
      date: "1 January 2026",
      title: "Superb",
      rating: 9.0,
      reviews: "Quiet and clean",
      propertyResponse:
        "Thank you for your kind feedback. We're delighted you had a pleasant stay with us and hope to welcome you back soon.",
    },
    {
      firstName: "Amara",
      country: "United Kingdom",
      roomType: "Studio",
      duration: "2 nights · Nov 2025",
      travelerType: "Couple",
      date: "14 November 2025",
      title: "Wonderful stay",
      rating: 8.5,
      reviews: "Great location, very comfortable bed",
      propertyResponse:
        "We're so glad you enjoyed your time here. Looking forward to welcoming you back again soon!",
    },
    {
      firstName: "Kweku",
      country: "Ghana",
      roomType: "Deluxe Room",
      duration: "3 nights · Oct 2025",
      travelerType: "Family",
      date: "5 October 2025",
      title: "Excellent value",
      rating: 7.8,
      reviews: "Spacious room, fast WiFi, friendly staff",
      propertyResponse: null,
    },
    {
      firstName: "Isabelle",
      country: "France",
      roomType: "Studio",
      duration: "1 night · Sep 2025",
      travelerType: "Solo traveller",
      date: "22 September 2025",
      title: "Très bien",
      rating: 8.0,
      reviews: "Clean and quiet neighbourhood",
      propertyResponse:
        "Merci pour votre avis positif! We hope to see you again on your next visit to the city.",
    },
  ],
};

const GuestReviewsDetails = ({
  onClose,
  rating,
  ratingLabel,
  overall,
  totalReviews,
  categories,
  reviews,
  roomName,
}) => {
  const data = {
    rating: rating ?? placeholderData.rating,
    ratingLabel: ratingLabel ?? placeholderData.ratingLabel,
    overall: overall ?? placeholderData.overall,
    totalReviews: totalReviews ?? placeholderData.totalReviews,
    categories: categories ?? placeholderData.categories,
    reviews: reviews ?? placeholderData.reviewsDetails,
    reviewsDetails: {
      roomName: roomName || placeholderData,
    },
  };
  const [expandedResponses, setExpandedResponses] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("relevant");
  const [filterReviewer, setFilterReviewer] = useState("all");
  const [filterScore, setFilterScore] = useState("all");

  const toggleResponse = (idx) => {
    setExpandedResponses((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const filteredReviews = data.reviewsDetails
    .filter((r) => {
      const matchesSearch =
        searchQuery === "" ||
        r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.reviews.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.firstName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesScore =
        filterScore === "all" ||
        (filterScore === "9plus" && r.rating >= 9) ||
        (filterScore === "8plus" && r.rating >= 8);
      const matchesType =
        filterReviewer === "all" ||
        r.travelerType.toLowerCase().includes(filterReviewer);
      return matchesSearch && matchesScore && matchesType;
    })
    .sort((a, b) => {
      if (sortBy === "highest") return b.rating - a.rating;
      if (sortBy === "lowest") return a.rating - b.rating;
      return 0;
    });

  return (
    <div className="grd-overlay">
      <div className="grd-panel">
        <div className="grd-header">
          <h2 className="grd-header-title">Guest reviews — StayatMargarets</h2>
          <button className="grd-close" onClick={onClose}>
            &#xd7;
          </button>
        </div>

        <div className="grd-score-section">
          <div className="grd-score-row">
            <span className="grd-score-badge">{data.rating}</span>
            <div>
              <div className="grd-score-label">{data.ratingLabel}</div>
              <div className="grd-score-count">{data.totalReviews} reviews</div>
            </div>
          </div>
          <div className="grd-moderated">
            All reviews verified for authenticity
          </div>
        </div>

        <div className="grd-categories">
          <div className="grd-section-label">CATEGORY SCORES</div>
          <div className="grd-cat-grid">
            {data.categories.map((cat) => (
              <div key={cat.name} className="grd-cat-item">
                <div className="grd-cat-top">
                  <span>{cat.name}</span>
                  <span className="grd-cat-score">{cat.score}</span>
                </div>
                <div className="grd-bar-track">
                  <div
                    className="grd-bar-fill"
                    style={{ width: `${cat.score * 10}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grd-filters">
          <div className="grd-section-label">FILTERS</div>
          <div className="grd-filter-row">
            <select
              className="grd-select"
              value={filterReviewer}
              onChange={(e) => setFilterReviewer(e.target.value)}
            >
              <option value="all">All reviewers ({data.totalReviews})</option>
              <option value="solo">Solo travellers</option>
              <option value="couple">Couples</option>
              <option value="family">Families</option>
            </select>
            <select
              className="grd-select"
              value={filterScore}
              onChange={(e) => setFilterScore(e.target.value)}
            >
              <option value="all">All scores ({data.totalReviews})</option>
              <option value="9plus">9+</option>
              <option value="8plus">8+</option>
            </select>
            <select className="grd-select">
              <option>All languages ({data.totalReviews})</option>
              <option>English</option>
              <option>French</option>
            </select>
            <select className="grd-select">
              <option>All periods ({data.totalReviews})</option>
              <option>Last 3 months</option>
              <option>Last 6 months</option>
            </select>
          </div>
        </div>

        <div className="grd-search-row">
          <input
            className="grd-search-input"
            placeholder="Search reviews..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button className="grd-search-btn">Search</button>
        </div>

        <div className="grd-reviews-header">
          <span className="grd-reviews-title">Guest reviews</span>
          <select
            className="grd-sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="relevant">Most relevant</option>
            <option value="highest">Highest score</option>
            <option value="lowest">Lowest score</option>
          </select>
        </div>

        <div className="grd-reviews-list">
          {filteredReviews.length === 0 ? (
            <div className="grd-no-reviews">No reviews match your search.</div>
          ) : (
            filteredReviews.map((reviewsDetails, idx) => (
              <div key={idx} className="grd-review-card">
                <div className="grd-rc-top">
                  <div className="grd-rc-left">
                    <div className="grd-rc-avatar">
                      {reviewsDetails.firstName[0]}
                    </div>
                    <div className="grd-rc-name">
                      {reviewsDetails.firstName}
                    </div>
                    <div className="grd-rc-country">
                      {reviewsDetails.country}
                    </div>
                    <div className="grd-rc-meta">
                      {reviewsDetails.roomType}
                      <br />
                      {reviewsDetails.duration}
                      <br />
                      {reviewsDetails.travelerType}
                    </div>
                  </div>
                  <div className="grd-rc-right">
                    <div className="grd-rc-date">
                      Reviewed: {reviewsDetails.date}
                    </div>
                    <div className="grd-rc-headline">
                      <span className="grd-rc-title">
                        {reviewsDetails.title}
                      </span>
                      <span className="grd-rc-score">
                        {reviewsDetails.score.toFixed(1)}
                      </span>
                    </div>
                    <div className="grd-rc-positive">
                      <span className="grd-rc-pos-icon">✓</span>
                      <span>{reviewsDetails.positive}</span>
                    </div>
                    {reviewsDetails.propertyResponse && (
                      <div className="grd-rc-response">
                        <div className="grd-rc-response-title">
                          💬 Property response
                        </div>
                        <div className="grd-rc-response-text">
                          {expandedResponses[idx]
                            ? reviewsDetails.propertyResponse
                            : `${reviewsDetails.propertyResponse.slice(0, 60)}...`}
                        </div>
                        <span
                          className="grd-rc-response-more"
                          onClick={() => toggleResponse(idx)}
                        >
                          {expandedResponses[idx]
                            ? "Show less"
                            : "Continue reading"}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <hr className="grd-divider" />
                <div className="grd-rc-actions">
                  <button className="grd-rc-action-btn">👍 Helpful</button>
                  <button className="grd-rc-action-btn">👎 Not helpful</button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default GuestReviewsDetails;

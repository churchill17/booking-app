import React from "react";
import "./GuestReviews.css";

const GuestReviews = ({ guestReviews }) => {
  const { overall, totalReviews, categories, reviews, topics } = guestReviews;

  return (
    <section className="guest-reviews">
      <div className="guest-reviews__header">
        <h2 className="guest-reviews__title">Guest Reviews</h2>
        <button className="guest-reviews__see-all">See availability</button>
      </div>

      <div className="guest-reviews__summary">
        <div className="guest-reviews__score-box">
          <span className="guest-reviews__score">{overall}</span>
          <div>
            <div className="guest-reviews__label">Very good</div>
            <div className="guest-reviews__count">· {totalReviews} reviews</div>
            <a href="#" className="guest-reviews__read-all">Read all reviews</a>
          </div>
        </div>

        <div className="guest-reviews__categories">
          {categories.map((cat) => (
            <div key={cat.name} className="guest-reviews__category">
              <span className="guest-reviews__cat-name">{cat.name}</span>
              <div className="guest-reviews__bar-wrap">
                <div
                  className="guest-reviews__bar"
                  style={{ width: `${(cat.score / 10) * 100}%` }}
                />
              </div>
              <span className="guest-reviews__cat-score">{cat.score}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="guest-reviews__topics">
        <p className="guest-reviews__topics-label">Select topics to read reviews:</p>
        {topics.map((topic) => (
          <button key={topic} className="guest-reviews__topic-btn">
            + {topic}
          </button>
        ))}
      </div>

      <div className="guest-reviews__cards">
        <h3 className="guest-reviews__loved-title">See what guests loved the most:</h3>
        <div className="guest-reviews__cards-grid">
          {reviews.map((review) => (
            <div key={review.name} className="guest-reviews__card">
              <div className="guest-reviews__card-header">
                <div className="guest-reviews__avatar">{review.name[0]}</div>
                <div>
                  <div className="guest-reviews__reviewer-name">{review.name}</div>
                  <div className="guest-reviews__reviewer-country">
                    {review.flag} {review.country}
                  </div>
                </div>
              </div>
              <p className="guest-reviews__text">"{review.text}"</p>
              <a href="#" className="guest-reviews__read-more">Read more</a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GuestReviews;

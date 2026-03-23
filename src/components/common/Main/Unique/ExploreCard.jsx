export default function ExploreCard({
  image,
  title,
  city,
  review,
  comment,
  commentDescription,
  starting,
  price1,
}) {
  return (
    <div className="unique-card-item">
      <img src={image} alt={title} />
      <div className="explore-card-content">
        <h3>{title}</h3>
        <p>{city}</p>
        <div className="Review">
          <div className="review-score">{review}</div>
          <div>
            <p className="review-comment">{comment}</p>
            <p className="review-description">{commentDescription}</p>
            <div className="starting-price">
              <p className="starting-label">{starting}</p>
              <p className="price">{price1}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

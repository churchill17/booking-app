export default function HotelCard({
  image,
  title,
  city,
  review,
  comment,
  commentDescription,
  price1,
  price2,
  onClick,
}) {
  return (
    <div className="hotel-card-item" onClick={onClick} style={{ cursor: onClick ? "pointer" : "default" }}>
      <img src={image} alt={title} />
      <div className="hotel-card-content">
        <h3>{title}</h3>
        <p>{city}</p>
        <div className="Review">
          <div>{review}</div>
          <div>
            <p>{comment}</p>
            <p>{commentDescription}</p>
            <div className="price">
              <s>{price1}</s>
              <p>{price2}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

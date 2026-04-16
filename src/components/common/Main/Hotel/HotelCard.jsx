export default function HotelCard({
  image,
  title,
  city,
  review,
  comment,
  commentDescription,
  price1,
  price2,
}) {
  return (
    <div className="hotel-card-item">
      <img src={image} alt={title} />
      <h3>{title}</h3>
      <p>{city}</p>
      <div className="Review">
        <div>{review}</div>
        <div>
          <p>{comment}</p>
          <p>{commentDescription}</p>
        </div>
        <div className="price">
          <s>{price1}</s>
          <p>{price2}</p>
        </div>
      </div>
    </div>
  );
}

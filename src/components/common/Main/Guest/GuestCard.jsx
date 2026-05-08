export default function GuestCard({
  image,
  title,
  city,
  review,
  comment,
  commentDescription,
  starting,
  price1,
  onClick,
}) {
  return (
    <div className="guest-card-item" onClick={onClick} style={{ cursor: onClick ? "pointer" : "default" }}>
      <img src={image} alt={title} />
      <div className="guest-card-content">
        <h3>{title}</h3>
        <p>{city}</p>
        <div className="Review">
          <div>{review}</div>
          <div>
            <p>{comment}</p>
            <p>{commentDescription}</p>
            <div className="starting-price">
              <p>{starting}</p>
              <p>{price1}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

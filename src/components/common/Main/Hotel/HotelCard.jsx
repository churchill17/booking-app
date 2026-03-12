// import "./HotelCard.css";

export default function HotelCard({
  image,
  title,
  apartments,
  city,
  review,
  comment,
  commentDescription,
}) {
  return (
    <div>
      <img src={image} alt={title} />
      <h3>{apartments}</h3>
      <p>{city}</p>
      <div className="Review">
        <div>{review}</div>
        <div>
          <p>{comment}</p>
          <p>{commentDescription}</p>
        </div>
      </div>
    </div>
  );
}

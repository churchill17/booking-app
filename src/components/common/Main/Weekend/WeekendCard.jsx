export default function WeekendCard({
  image,
  title,
  city,
  review,
  comment,
  commentDescription,
  linkText,
  stay,
  price1,
  price2,
}) {
  return (
    <div>
      <img src={image} alt={title} />
      <h3>{title}</h3>
      <p>{city}</p>
      <div className="Review">
        <div>{review}</div>
        <div>
          <p>{comment}</p>
          <p>{commentDescription}</p>
        </div>
        <a href="">{linkText}</a>
        <div className="price">
          <p>{stay}</p>
          <s>{price1}</s>
          <p>{price2}</p>
        </div>
      </div>
    </div>
  );
}

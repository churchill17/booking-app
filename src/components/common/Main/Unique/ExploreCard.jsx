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
    <div>
      <img src={image} alt={title} />
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
  );
}

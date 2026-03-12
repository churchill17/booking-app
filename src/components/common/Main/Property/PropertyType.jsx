export default function PropertyType({ image, title, description }) {
  return (
    <>
      <div>
        <img src={image} alt={title} />
        <p>{description}</p>
      </div>
    </>
  );
}

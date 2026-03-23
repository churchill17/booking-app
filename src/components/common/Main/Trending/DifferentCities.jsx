export default function DifferentCities({ image, title }) {
  return (
    <div className="different-cities-item">
      <img src={image} alt={title} />
      <p>{title}</p>
    </div>
  );
}

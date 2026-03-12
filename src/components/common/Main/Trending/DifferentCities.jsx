
export default function DifferentCities({ image, title }) {
  return (
    <div>
      <img src={image} alt={title} />
      <p>{title}</p>
    </div>
  );
}
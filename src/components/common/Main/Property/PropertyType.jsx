import { useNavigate } from "react-router-dom";

export default function PropertyType({ image, title, description, path }) {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate(path, { state: { propertyType: description } });
  };
  return (
    <div
      className="property-type-item"
      style={{ cursor: "pointer" }}
      onClick={handleClick}
    >
      <img src={image} alt={title} />
      <p>{description}</p>
    </div>
  );
}

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
      <div className="property-type-content">
        <p>{description}</p>
      </div>
    </div>
  );
}

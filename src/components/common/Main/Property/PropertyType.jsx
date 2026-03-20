import { Link } from "react-router-dom";

export default function PropertyType({ image, title, description, path }) {
  return (
    <Link to={path} style={{ textDecoration: "none", color: "inherit" }}>
      <div>
        <img src={image} alt={title} />
        <p>{description}</p>
      </div>
    </Link>
  );
}

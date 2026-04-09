import "./Stars.css";

export default function Stars({ count }) {
  if (!count) return null;
  return (
    <>
      <span className="search-filter-stars">{"★".repeat(count)}</span>
    </>
  );
}

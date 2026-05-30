import "./AdminHostFooter.css";

export default function AdminHostFooter() {
  return (
    <footer className="admin-host-footer">
<span className="admin-host-footer-copy">
        © {new Date().getFullYear()} iBookNova. All rights
        reserved.
      </span>
    </footer>
  );
}

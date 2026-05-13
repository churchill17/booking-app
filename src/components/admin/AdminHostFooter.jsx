import "./AdminHostFooter.css";

export default function AdminHostFooter() {
  return (
    <footer className="admin-host-footer">
      <span className="admin-host-footer-brand">
        Vinjham<span className="admin-host-footer-dot">.</span>
      </span>
      <span className="admin-host-footer-copy">
        © {new Date().getFullYear()} Vinjham Property Management. All rights
        reserved.
      </span>
      <div className="admin-host-footer-links">
        <a href="#privacy">Privacy</a>
        <a href="#terms">Terms</a>
        <a href="#support">Support</a>
      </div>
    </footer>
  );
}

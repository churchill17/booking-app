import "./HostFooter.css";

export default function HostFooter() {
  return (
    <footer className="host-footer">
      <span className="host-footer-brand">
        Vinjham<span className="host-footer-dot">.</span>
      </span>
      <span className="host-footer-copy">
        © {new Date().getFullYear()} Vinjham Property Management. All rights
        reserved.
      </span>
      <div className="host-footer-links">
        <a href="#privacy">Privacy</a>
        <a href="#terms">Terms</a>
        <a href="#support">Support</a>
      </div>
    </footer>
  );
}

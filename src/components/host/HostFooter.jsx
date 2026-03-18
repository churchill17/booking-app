import "./HostFooter.css";

export default function HostFooter() {
  return (
    <footer className="host-footer">
      <span className="footer-brand">Vinjham<span className="footer-dot">.</span></span>
      <span className="footer-copy">© {new Date().getFullYear()} Vinjham Property Management. All rights reserved.</span>
      <div className="footer-links">
        <a href="#privacy">Privacy</a>
        <a href="#terms">Terms</a>
        <a href="#support">Support</a>
      </div>
    </footer>
  );
}

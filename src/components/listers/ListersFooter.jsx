import React from "react";
import "./ListersFooter.css";

export default function ListersFooter() {
  return (
    <footer className="listers-footer">
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

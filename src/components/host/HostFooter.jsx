import "./HostFooter.css";

export default function HostFooter() {
  return (
    <footer className="host-footer">
<span className="host-footer-copy">
        © {new Date().getFullYear()} iBookNova. All rights
        reserved.
      </span>
    </footer>
  );
}

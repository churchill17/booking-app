import { Link } from "react-router-dom";
import "./LoginHeader.css";
import logo from "../../assets/img/logo.jpg";

export default function LoginHeader() {
  return (
    <header className="login-header">
      <Link to="/" className="login-header-logo">
        <img src={logo} alt="iBookNova" />
      </Link>

      <Link to="/" className="login-header-home">
        ← Home
      </Link>

      <div className="login-header-stripe" />
    </header>
  );
}

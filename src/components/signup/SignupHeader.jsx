import { Link } from "react-router-dom";
import "./SignupHeader.css";
import logo from "../../assets/img/logo.jpg";

export default function SignupHeader() {
  return (
    <header className="signup-header">
      <Link to="/" className="signup-header-logo">
        <img src={logo} alt="iBookNova" />
      </Link>

      <Link to="/" className="signup-header-home">
        ← Home
      </Link>

      <div className="signup-header-stripe" />
    </header>
  );
}

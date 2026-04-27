import "./SignupHeader.css";

import logo from "../../assets/img/logo.jpg";

export default function SignupHeader() {
  return (
    <header className="signup-header">
      <a href="#" className="signup-header-logo">
        <img src={logo} alt="" />
      </a>

      <div className="signup-header-stripe" />
    </header>
  );
}

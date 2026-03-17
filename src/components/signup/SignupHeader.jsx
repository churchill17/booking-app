import "./SignupHeader.css";
import LanguageSelector from "../common/Header/LanguageSelector";
import logo from "../../assets/img/logo.jpg";

export default function SignupHeader() {
  return (
    <header className="signup-header">
      <a href="#" className="signup-header-logo">
       <img src={logo} alt="" />
      </a>

      <div className="signup-header-actions">
        <LanguageSelector />
        <button className="signup-header-help" title="Help">
          ?
        </button>
      </div>

      <div className="signup-header-stripe" />
    </header>
  );
}

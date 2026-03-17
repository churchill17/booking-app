import "./LoginHeader.css";
import LanguageSelector from "../common/Header/LanguageSelector";
import logo from "../../assets/img/logo.jpg";

export default function LoginHeader() {
  return (
    <header className="login-header">
      <a href="#" className="login-header-logo">
        <img src={logo} alt="" />
      </a>

      <div className="login-header-actions">
        <LanguageSelector />
        <button className="login-header-help" title="Help">
          ?
        </button>
      </div>

      <div className="login-header-stripe" />
    </header>
  );
}

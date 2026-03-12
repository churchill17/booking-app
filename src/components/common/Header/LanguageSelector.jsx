import { useState } from "react";
import "./LanguageSelector.css";

const languages = [
  { code: "en-GB", name: "English", country: "gb" },
  { code: "en-US", name: "American English", country: "us" },
  { code: "de", name: "Deutsch", country: "de" },
  { code: "et", name: "Eesti", country: "ee" },
  { code: "es", name: "Español", country: "es" },
  { code: "es-AR", name: "Español en Argentina", country: "ar" },
  { code: "fil", name: "Filipino", country: "ph" },
  { code: "hr", name: "Hrvatski", country: "hr" },
  { code: "id", name: "Indonesia", country: "id" },
  { code: "it", name: "Italiano", country: "it" },
  { code: "lv", name: "Latviešu", country: "lv" },
  { code: "lt", name: "Lietuvių", country: "lt" },
  { code: "hu", name: "Magyar", country: "hu" },
  { code: "ms", name: "Melayu", country: "my" },
  { code: "nl", name: "Nederlands", country: "nl" },
  { code: "no", name: "Norsk", country: "no" },
  { code: "pt", name: "Português", country: "pt" },
  { code: "pt-BR", name: "Português do Brasil", country: "br" },
  { code: "sk", name: "Slovenčina", country: "sk" },
  { code: "fi", name: "Suomi", country: "fi" },
  { code: "sv", name: "Svenska", country: "se" },
  { code: "vi", name: "Tiếng Việt", country: "vn" },
  { code: "tr", name: "Türkçe", country: "tr" },
  { code: "ca", name: "català", country: "es" },
  { code: "da", name: "dansk", country: "dk" },
  { code: "fr", name: "français", country: "fr" },
  { code: "pl", name: "polski", country: "pl" },
  { code: "ro", name: "română", country: "ro" },
  { code: "sl", name: "slovenščina", country: "si" },
  { code: "sr", name: "srpski", country: "rs" },
  { code: "is", name: "íslenska", country: "is" },
  { code: "cs", name: "čeština", country: "cz" },
  { code: "el", name: "Ελληνικά", country: "gr" },
  { code: "bg", name: "Български", country: "bg" },
  { code: "ru", name: "Русский", country: "ru" },
  { code: "uk", name: "Українська", country: "ua" },
  { code: "he", name: "עברית", country: "il" },
  { code: "ar", name: "العربية", country: "sa" },
  { code: "hi", name: "हिन्दी", country: "in" },
  { code: "th", name: "ไทย", country: "th" },
  { code: "ka", name: "ქართული ენა", country: "ge" },
  { code: "zh", name: "中文", country: "cn" },
  { code: "ja", name: "日本語", country: "jp" },
  { code: "zh-TW", name: "繁體中文", country: "tw" },
  { code: "ko", name: "한국어", country: "kr" },
];

const FlagImg = ({ country, className = "" }) => (
  <img
    src={`https://flagcdn.com/w40/${country}.png`}
    alt={country}
    className={`lang-flag-img ${className}`}
  />
);

export default function LanguageSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(languages[0]);

  const handleSelect = (lang) => {
    setSelected(lang);
    setIsOpen(false);
  };

  return (
    <>
      {/* Trigger button */}
      <div className="lang-trigger-wrap">
        <button
          className="lang-trigger"
          onClick={() => setIsOpen(true)}
          title={selected.name}
          aria-label="Select language"
        >
          <div className="lang-trigger-flag-wrap">
            <FlagImg country={selected.country} size={26} />
          </div>
          <span className="lang-trigger-label">{selected.name}</span>
        </button>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div className="lang-overlay" onClick={() => setIsOpen(false)}>
          <div className="lang-modal" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="lang-modal-header">
              <h2 className="lang-modal-title">Select your language</h2>
              <div
                className="lang-modal-close"
                role="button"
                tabIndex={0}
                aria-label="Close"
                onClick={() => setIsOpen(false)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    setIsOpen(false);
                  }
                }}
              >
                x
              </div>
            </div>

            {/* Grid */}
            <div className="lang-grid">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  className={`lang-item ${selected.code === lang.code ? "lang-item--active" : ""}`}
                  onClick={() => handleSelect(lang)}
                >
                  <FlagImg
                    country={lang.country}
                    size={24}
                    className="lang-item-flag-img"
                  />
                  <span className="lang-item-name">{lang.name}</span>
                  {selected.code === lang.code && (
                    <span className="lang-item-check">✓</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

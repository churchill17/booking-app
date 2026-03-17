/**
 * src/pages/ListProperty/ListPropertyMain.jsx
 * ─────────────────────────────────────────────────────────────
 * Root orchestrator for the /list-property flow.
 *
 * Internal pages (no URL changes — managed via local `page` state):
 *   "landing"  → LandingPage      (Welcome back / Continue your registration)
 *   "type"     → PropertyTypePage (Apartment / Homes / Hotel / Alternative)
 *   "wizard"   → 12-step listing wizard
 *   "legal"    → LegalInfoPage    (contracting-party form + T&Cs)
 *   "success"  → SuccessPage      (confirmation)
 *
 * Integrations:
 *   • useNavigate()   from react-router-dom  (← Back to site / dashboard)
 *   • getStoredUser() from utils/authUser    (pre-fills host name, shows user in nav)
 *
 * File structure expected:
 *   src/
 *   ├── components/
 *   │   └── ui.jsx                   shared primitives
 *   ├── utils/
 *   │   └── authUser.js              getStoredUser()
 *   └── pages/
 *       └── ListProperty/
 *           ├── ListProperty.jsx     auth guard (imports this file)
 *           ├── ListPropertyMain.jsx ← YOU ARE HERE
 *           ├── LandingPage.jsx
 *           ├── PropertyTypePage.jsx
 *           ├── WizardSteps.jsx
 *           ├── LegalInfoPage.jsx
 *           └── SuccessPage.jsx
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getStoredUser } from "../../utils/authUser";
import { getBookingApiUrl } from "../../utils/api";

import { ProgressStrip, WizardNav } from "./ui.jsx";
import InternalNav from "./components/InternalNav.jsx";
import "./components/WizardStepShell.css";

import LandingPage from "./LandingPage.jsx";
import PropertyTypePage from "./PropertyTypePage.jsx";
import LegalInfoPage from "./LegalInfoPage.jsx";
import SuccessPage from "./SuccessPage.jsx";

import {
  StepPropertyName,
  StepLocation,
  StepBedroom1,
  StepLivingRoom,
  StepOtherSpaces,
  StepGuestDetails,
  StepAmenities,
  StepServices,
  StepHouseRules,
  StepHostProfile,
  StepPhotos,
} from "./WizardSteps.jsx";

/* ── Wizard step registry ──────────────────────────────────── */
const WIZARD_STEPS = [
  { title: "Property name", Component: StepPropertyName },
  { title: "Location", Component: StepLocation },
  { title: "Bedroom 1", Component: StepBedroom1 },
  { title: "Living room", Component: StepLivingRoom },
  { title: "Other spaces", Component: StepOtherSpaces },
  { title: "Guest details", Component: StepGuestDetails },
  { title: "Amenities", Component: StepAmenities },
  { title: "Services", Component: StepServices },
  { title: "House rules", Component: StepHouseRules },
  { title: "Host profile", Component: StepHostProfile },
  { title: "Photos", Component: StepPhotos },
];

/* ── Default wizard data ───────────────────────────────────── */
const INITIAL_DATA = {
  propertyType: "",
  propertyName: "",
  address: "",
  apartment: "",
  country: "",
  city: "",
  zipCode: "",
  usesChannelManager: false,
  bedroom1: { single: 0, double: 1, king: 0, superKing: 0 },
  livingRoom: { sofaBed: 1 },
  otherSpaces: { single: 0, double: 1, king: 0, superKing: 0 },
  guests: 2,
  bathrooms: 1,
  excludeInfants: false,
  allowChildren: true,
  offerCots: false,
  apartmentSize: "",
  sizeUnit: "square metres",
  selectedAmenities: {
    "Air conditioning": true,
    Kitchen: true,
    "Flat-screen TV": true,
    Balcony: true,
  },
  breakfast: false,
  parking: "No",
  smokingAllowed: false,
  partiesAllowed: false,
  pets: "No",
  checkInFrom: "15:00",
  checkInUntil: "18:00",
  checkOutFrom: "08:00",
  checkOutUntil: "11:00",
  showProperty: true,
  showHost: true,
  showNeighbourhood: true,
  aboutProperty: "",
  hostName: "",
  aboutHost: "",
  aboutNeighbourhood: "",
  photos: [],
};

/* ── Internal sticky nav ───────────────────────────────────── */
/* ═══════════════════════════════════════════════════════════
   ROOT COMPONENT
═══════════════════════════════════════════════════════════ */
export default function ListPropertyMain() {
  const listPropertyApiUrl = getBookingApiUrl("list_property.php");
  const navigate = useNavigate();
  const storedUser = getStoredUser();

  const [page, setPage] = useState("landing");
  const [wizardStep, setStep] = useState(0);
  const [data, setData] = useState({
    ...INITIAL_DATA,
    hostName: storedUser?.firstName || "",
  });

  const setField = (key, val) => setData((d) => ({ ...d, [key]: val }));

  /* ── Wizard navigation ── */
  const goNext = () => {
    if (wizardStep < WIZARD_STEPS.length - 1) {
      setStep((s) => s + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      setPage("legal");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const goBack = () => {
    if (wizardStep > 0) {
      setStep((s) => s - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      setPage("type");
    }
  };

  const { Component } = WIZARD_STEPS[wizardStep];
  const goHome = () => navigate("/");

  const handleCompleteListing = async (legalFormData) => {
    const response = await fetch(listPropertyApiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        role: "host",
        user: storedUser || null,
        listing: data,
        legal: legalFormData,
      }),
    });

    const payload = await response.json().catch(() => ({}));
    if (!response.ok || payload?.success === false) {
      throw new Error(
        payload?.message || "Could not submit your listing. Please try again.",
      );
    }

    setPage("success");
  };

  return (
    <>
      {/* ── Scoped styles (lp- prefix avoids collision with the rest of the app) ── */}
      <div className="lp-root">
        {/* ════ LANDING — "Continue your registration" (p38) ════ */}
        {page === "landing" && (
          <>
            <InternalNav user={storedUser} onHome={goHome} />
            <LandingPage
              user={storedUser}
              onContinue={() => {
                setStep(0);
                setPage("wizard");
              }}
              onCreateNew={() => {
                setData({
                  ...INITIAL_DATA,
                  hostName: storedUser?.firstName || "",
                });
                setStep(0);
                setPage("type");
              }}
            />
          </>
        )}

        {/* ════ PROPERTY TYPE — p37 ════ */}
        {page === "type" && (
          <>
            <InternalNav user={storedUser} onHome={goHome} />
            <PropertyTypePage
              onSelect={(propertyType) => {
                setField("propertyType", propertyType);
                setStep(0);
                setPage("wizard");
              }}
            />
          </>
        )}

        {/* ════ WIZARD — steps 0–11 ════ */}
        {page === "wizard" && (
          <>
            <InternalNav user={storedUser} onHome={goHome} />
            <ProgressStrip step={wizardStep} />
            <div className="lp-step-bar">
              <strong>{WIZARD_STEPS[wizardStep].title}</strong>
              <span>
                Step {wizardStep + 1} of {WIZARD_STEPS.length}
              </span>
            </div>
            <div className="lp-page-shell">
              <Component key={wizardStep} data={data} set={setField} />
            </div>
            <WizardNav
              onBack={goBack}
              onNext={goNext}
              nextLabel={
                wizardStep === WIZARD_STEPS.length - 1
                  ? "Continue to legal info →"
                  : "Continue →"
              }
            />
          </>
        )}

        {/* ════ LEGAL — p34–p36 ════ */}
        {page === "legal" && (
          <>
            <InternalNav user={storedUser} onHome={goHome} />
            <LegalInfoPage
              onBack={() => {
                setPage("wizard");
                setStep(WIZARD_STEPS.length - 1);
              }}
              onSubmit={handleCompleteListing}
            />
          </>
        )}

        {/* ════ SUCCESS ════ */}
        {page === "success" && (
          <>
            <InternalNav user={storedUser} onHome={goHome} />
            <SuccessPage
              propertyName={data.propertyName || "Your property"}
              onDashboard={goHome}
            />
          </>
        )}
      </div>
    </>
  );
}

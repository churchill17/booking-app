import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getStoredUser } from "../../utils/authUser";
import { getBookingApiUrl } from "../../utils/api";

import { ProgressStrip, WizardNav } from "./ui.jsx";
import InternalNav from "./components/InternalNav.jsx";
import "./components/WizardStepShell.css";

import LandingPage from "./LandingPage.jsx";
import LegalInfoPage from "./LegalInfoPage.jsx";

import {
  StepProperty,
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
  StepPricing,
} from "./WizardSteps.jsx";

/* ── Wizard step registry ──────────────────────────────────── */
const WIZARD_STEPS = [
  { title: "Property", Component: StepProperty },
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
  { title: "Pricing", Component: StepPricing },
];

const isNonEmpty = (value) => String(value || "").trim().length > 0;

const isWizardStepValid = (step, data) => {
  switch (step) {
    case 0:
      return isNonEmpty(data.propertyName);
    case 1:
      return (
        isNonEmpty(data.address) &&
        isNonEmpty(data.country) &&
        isNonEmpty(data.city)
      );
    case 2: {
      const b = data.bedroom1 || {};
      const totalBeds =
        Number(b.single || 0) +
        Number(b.double || 0) +
        Number(b.king || 0) +
        Number(b.superKing || 0);
      return totalBeds > 0;
    }
    case 3:
    case 4:
      return true;
    case 5:
      return (
        Number(data.guests) >= 1 &&
        Number(data.bathrooms) >= 1 &&
        typeof data.allowChildren === "boolean" &&
        typeof data.offerCots === "boolean"
      );
    case 6:
      return true;
    case 7:
      return (
        typeof data.breakfast === "boolean" &&
        ["Yes, free", "Yes, paid", "No"].includes(data.parking)
      );
    case 8:
      return (
        typeof data.smokingAllowed === "boolean" &&
        typeof data.partiesAllowed === "boolean" &&
        isNonEmpty(data.pets) &&
        isNonEmpty(data.checkInFrom) &&
        isNonEmpty(data.checkInUntil) &&
        isNonEmpty(data.checkOutFrom) &&
        isNonEmpty(data.checkOutUntil)
      );
    case 9:
      return true;
    case 10:
      return (Array.isArray(data.photos) ? data.photos.length : 0) >= 5;
    case 11:
      return Number(data.nightlyRate) > 0 && isNonEmpty(data.currency);
    default:
      return true;
  }
};

const getWizardStepHelperText = (step, data) => {
  switch (step) {
    case 0:
      return isNonEmpty(data.propertyName)
        ? ""
        : "Enter your property name to continue.";
    case 1:
      if (!isNonEmpty(data.address))
        return "Enter the property address to continue.";
      if (!isNonEmpty(data.country)) return "Select a country to continue.";
      if (!isNonEmpty(data.city)) return "Enter the city to continue.";
      return "";
    case 2: {
      const b = data.bedroom1 || {};
      const totalBeds =
        Number(b.single || 0) +
        Number(b.double || 0) +
        Number(b.king || 0) +
        Number(b.superKing || 0);
      return totalBeds > 0
        ? ""
        : "Add at least 1 bed in Bedroom 1 to continue.";
    }
    case 5:
      if (Number(data.guests) < 1)
        return "Set guest capacity to at least 1 to continue.";
      if (Number(data.bathrooms) < 1)
        return "Set bathrooms to at least 1 to continue.";
      return "";
    case 10: {
      const photoCount = Array.isArray(data.photos) ? data.photos.length : 0;
      return photoCount >= 5
        ? ""
        : `Add at least 5 photos to continue (${photoCount}/5).`;
    }
    case 11:
      if (Number(data.nightlyRate) <= 0) {
        return "Enter a price per night greater than 0 to continue.";
      }
      if (!isNonEmpty(data.currency)) {
        return "Select a payout currency to continue.";
      }
      return "";
    default:
      return "";
  }
};

/* ── Default wizard data ───────────────────────────────────── */
const INITIAL_DATA = {
  propertyType: "",
  propertyName: "",
  address: "",
  apartment: "",
  country: "",
  city: "",
  zipCode: "",
  bedroom1: { single: 0, double: 1, king: 0, superKing: 0 },
  livingRoom: { sofaBed: 1 },
  otherSpaces: { single: 0, double: 1, king: 0, superKing: 0 },
  guests: 2,
  bathrooms: 1,
  excludeInfants: false,
  allowChildren: false,
  offerCots: false,
  apartmentSize: "",
  sizeUnit: "square metres",
  selectedAmenities: {
    "Air conditioning": false,
    Kitchen: false,
    "Flat-screen TV": false,
    Balcony: false,
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
  showProperty: false,
  showHost: false,
  showNeighbourhood: false,
  aboutProperty: "",
  hostName: "",
  aboutHost: "",
  aboutNeighbourhood: "",
  photos: [],
  nightlyRate: "",
  weekendRate: "",
  cleaningFee: "",
  currency: "USD",
  taxesIncluded: false,
};

import { useLocation } from "react-router-dom";

export default function ListPropertyMain() {
  const listPropertyApiUrl = getBookingApiUrl("list_property.php");
  const navigate = useNavigate();
  const location = useLocation();
  const storedUser = getStoredUser();

  // Use navigation state if present, else default
  const navState = location.state?.listProperty || {};
  const [page, setPage] = useState(navState.page || "landing");
  const [wizardStep, setStep] = useState(
    typeof navState.wizardStep === "number" ? navState.wizardStep : 0,
  );
  const [data, setData] = useState({
    ...INITIAL_DATA,
    hostName: "",
  });

  const setField = (key, val) => setData((d) => ({ ...d, [key]: val }));
  const canProceed = isWizardStepValid(wizardStep, data);
  const nextHelperText = canProceed
    ? ""
    : getWizardStepHelperText(wizardStep, data);

  useEffect(() => {
    // Only set initial state if not already set by navigation
    const initialNavState = location.state?.listProperty;
    if (!initialNavState) {
      const initialState = {
        ...(window.history.state && typeof window.history.state === "object"
          ? window.history.state
          : {}),
        listProperty: { page: "landing", wizardStep: 0 },
      };
      window.history.replaceState(initialState, "");
    }

    const handlePopState = (event) => {
      const nextState = event.state?.listProperty;
      if (nextState) {
        setPage(nextState.page || "landing");
        setStep(
          typeof nextState.wizardStep === "number" ? nextState.wizardStep : 0,
        );
      } else {
        setPage("landing");
        setStep(0);
      }
      window.scrollTo({ top: 0, behavior: "smooth" });
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [location.state]);

  useEffect(() => {
    const currentState = window.history.state?.listProperty;
    if (
      currentState?.page === page &&
      currentState?.wizardStep === wizardStep
    ) {
      return;
    }

    const nextState = {
      ...(window.history.state && typeof window.history.state === "object"
        ? window.history.state
        : {}),
      listProperty: { page, wizardStep },
    };

    window.history.pushState(nextState, "");
  }, [page, wizardStep]);

  /* ── Wizard navigation ── */
  const goNext = () => {
    if (!canProceed) {
      return;
    }

    if (wizardStep < WIZARD_STEPS.length - 1) {
      setStep((s) => s + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      setPage("legal");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const goBackInHistory = () => {
    if (window.history.length > 1) {
      window.history.back();
      return;
    }

    setPage("landing");
    setStep(0);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goBack = () => {
    goBackInHistory();
  };

  const { Component } = WIZARD_STEPS[wizardStep];
  const goHome = () => navigate("/");

  const handleCompleteListing = async (legalFormData) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(listPropertyApiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
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
          payload?.message ||
            "Could not submit your listing. Please try again.",
        );
      }

      navigate("/host", { replace: true });
    } catch (error) {
      throw new Error(
        error?.message || "Could not submit your listing. Please try again.",
      );
    }
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
                  hostName: "",
                });
                setStep(0);
                setPage("wizard");
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
              nextDisabled={!canProceed}
              helperText={nextHelperText}
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
              onBack={goBackInHistory}
              onSubmit={handleCompleteListing}
            />
          </>
        )}
      </div>
    </>
  );
}

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getListings, updateListing } from "../host/services/hostApi";
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
  StepGuestDetails,
  StepServices,
  StepExtraDetails,
  StepFacilitiesFAQs,
  StepHouseRules,
  StepPhotos,
  StepPricing,
} from "./WizardSteps.jsx";

/* ── Wizard step registry ──────────────────────────────────── */
const WIZARD_STEPS = [
  { title: "Property", Component: StepProperty },
  { title: "Location", Component: StepLocation },

  { title: "Guest details", Component: StepGuestDetails },

  { title: "Services", Component: StepServices },
  { title: "Extra Details", Component: StepExtraDetails },
  { title: "Facilities & FAQs", Component: StepFacilitiesFAQs },
  { title: "House rules", Component: StepHouseRules },
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
    case 2:
    case 3:
      return true;
    case 5:
      // StepFacilitiesFAQs: require at least one facility and one FAQ for preview
      return (
        data.facilities &&
        typeof data.facilities === "object" &&
        Object.keys(data.facilities).length > 0 &&
        Array.isArray(data.faqs) &&
        data.faqs.length > 0
      );
    case 6:
      // StepHouseRules: require all house rules fields and at least one payment method
      return (
        String(data.cancellation || "").trim().length > 0 &&
        String(data.children || "").trim().length > 0 &&
        String(data.cotPolicy || "").trim().length > 0 &&
        String(data.ageRestriction || "").trim().length > 0 &&
        String(data.petsPolicy || "").trim().length > 0 &&
        String(data.parties || "").trim().length > 0 &&
        String(data.finePrint || "").trim().length > 0 &&
        Array.isArray(data.paymentMethods) &&
        data.paymentMethods.length > 0
      );
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
        isNonEmpty(data.checkOutUntil) &&
        Array.isArray(data.highlights) &&
        data.highlights.length > 0
      );
    case 9:
      return Array.isArray(data.faqs) && data.faqs.length > 0;
    case 10:
      return (Array.isArray(data.photos) ? data.photos.length : 0) >= 5;
    case 11:
      return Number(data.originalPrice) > 0 && isNonEmpty(data.currency);
    case 4:
      // StepExtraDetails: require all four descriptions and at least one item in each preview
      return (
        String(data.accommodations || "").trim().length > 0 &&
        String(data.descriptionFacilities || "").trim().length > 0 &&
        String(data.descriptionDining || "").trim().length > 0 &&
        String(data.location || "").trim().length > 0 &&
        Array.isArray(data.highlights) &&
        data.highlights.length > 0 &&
        Array.isArray(data.popularFacilities) &&
        data.popularFacilities.length > 0 &&
        Array.isArray(data.rooms) &&
        data.rooms.length > 0
      );
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
    case 5:
      if (Number(data.guests) < 1)
        return "Set guest capacity to at least 1 to continue.";
      return "";
    case 10: {
      const photoCount = Array.isArray(data.photos) ? data.photos.length : 0;
      return photoCount >= 5
        ? ""
        : `Add at least 5 photos to continue (${photoCount}/5).`;
    }
    case 11:
      if (Number(data.originalPrice) <= 0) {
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
  guests: "",
  excludeInfants: false,
  lastMinuteBookings: false,
  apartmentSize: "",
  sizeUnit: "square metres",
  breakfast: false,
  parking: "No",
  smokingAllowed: false,
  checkInFrom: "15:00",
  checkInUntil: "18:00",
  checkOutFrom: "08:00",
  checkOutUntil: "11:00",
  photos: [],
  originalPrice: "",
  currentPrice: "",
  discount: "",
  weekendRate: "",
  cleaningFee: "",
  currency: "NGN",
  taxesIncluded: false,
  firstName: "",
  middleName: "",
  lastName: "",
  email: "",
  phone: "",
  country: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  zipCode: "",
  highlights: [], // StepExtraDetails
  popularFacilities: [], // StepExtraDetails
  rooms: [], // StepExtraDetails
  bedType: "", // StepExtraDetails (for room-level default or single-room case)
  descriptionFacilities: "", // StepExtraDetails
  descriptionDining: "", // StepExtraDetails
  // StepExtraDetails fields end
  // StepHouseRules fields
  cancellation: "",
  children: "",
  cotPolicy: "",
  ageRestriction: "",
  petsPolicy: "",
  paymentMethods: [],
  parties: "",
  finePrint: "",
  facilities: {},
  faqs: [],
  amenities: [], // StepExtraDetails
};

import { useLocation } from "react-router-dom";

// Map backend property data to match INITIAL_DATA structure
function mapPropertyDataToForm(raw) {
  // selectedAmenities removed

  // Map images array to photos array (extract image_url)
  let photos = [];
  if (Array.isArray(raw.images)) {
    photos = raw.images.map((img) => img.image_url).filter(Boolean);
  }

  // Map booleans (snake_case fields)
  const toBool = (val) => String(val) === "1" || val === 1;

  return {
    propertyType: raw.propertyType || raw.type || "",
    propertyName: raw.propertyName || raw.name || "",
    address: raw.address || "",
    apartment: raw.apartment || "",
    guests: raw.guests != null ? Number(raw.guests) : "",
    // bathrooms removed
    excludeInfants: toBool(raw.excludeInfants ?? raw.exclude_infants),
    // allowChildren removed
    // offerCots removed
    lastMinuteBookings: toBool(
      raw.lastMinuteBookings ?? raw.last_minute_bookings,
    ),
    apartmentSize: raw.apartmentSize || raw.apartment_size || "",
    sizeUnit: raw.sizeUnit || raw.size_unit || "square metres",
    // selectedAmenities removed
    breakfast: toBool(raw.breakfast),
    parking: raw.parking || "No",
    smokingAllowed: toBool(raw.smokingAllowed ?? raw.smoking_allowed),
    checkInFrom: raw.checkInFrom || raw.check_in_from || "15:00",
    checkInUntil: raw.checkInUntil || raw.check_in_until || "18:00",
    checkOutFrom: raw.checkOutFrom || raw.check_out_from || "08:00",
    checkOutUntil: raw.checkOutUntil || raw.check_out_until || "11:00",
    photos: photos,
    originalPrice:
      raw.originalPrice ||
      raw.nightlyRate ||
      raw.nightly_rate ||
      raw.price ||
      "",
    currentPrice: raw.currentPrice || "",
    discount: raw.discount || "",
    weekendRate: raw.weekendRate || raw.weekend_rate || "",
    cleaningFee: raw.cleaningFee || raw.cleaning_fee || "",
    currency: raw.currency || "NGN",
    taxesIncluded: toBool(raw.taxesIncluded ?? raw.taxes_included),
    // Contracting party fields (map from backend if present)
    firstName: raw.firstName || "",
    middleName: raw.middleName || "",
    lastName: raw.lastName || "",
    email: raw.email || "",
    phone: raw.phone || "",
    country: raw.country || "",
    addressLine1: raw.addressLine1 || "",
    addressLine2: raw.addressLine2 || "",
    city: raw.city || "",
    zipCode: raw.zipCode || "",
    // StepExtraDetails fields
    highlights: Array.isArray(raw.highlights) ? raw.highlights : [],
    popularFacilities: Array.isArray(raw.popularFacilities)
      ? raw.popularFacilities
      : Array.isArray(raw.popular_facilities)
        ? raw.popular_facilities
        : [],
    rooms: Array.isArray(raw.rooms) ? raw.rooms : [],
    bedType: raw.bedType || raw.bed_type || "",
    descriptionFacilities: raw.descriptionFacilities || "",
    descriptionDining: raw.descriptionDining || "",
    amenities: Array.isArray(raw.amenities) ? raw.amenities : [],
    // StepExtraDetails fields end
    // StepHouseRules fields
    cancellation: raw.cancellation || "",
    children: raw.children || "",
    cotPolicy: raw.cotPolicy || "",
    ageRestriction: raw.ageRestriction || "",
    petsPolicy: raw.petsPolicy || "",
    paymentMethods: Array.isArray(raw.paymentMethods) ? raw.paymentMethods : [],
    parties: raw.parties || "",
    finePrint: raw.finePrint || "",
    facilities:
      typeof raw.facilities === "object" && raw.facilities !== null
        ? raw.facilities
        : {},
    faqs: Array.isArray(raw.faqs) ? raw.faqs : [],
  };
}

export default function ListPropertyMain({ editId }) {
  // Multi-draft support (now at top level)
  const [drafts, setDrafts] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("wizardDrafts")) || [];
    } catch {
      return [];
    }
  });
  const [currentDraftId, setCurrentDraftId] = useState(null);
  const [data, setData] = useState(() => {
    if (currentDraftId) {
      const found = (
        JSON.parse(localStorage.getItem("wizardDrafts")) || []
      ).find((d) => d.id === currentDraftId);
      return found ? found.data : { ...INITIAL_DATA, hostName: "" };
    }
    return { ...INITIAL_DATA, hostName: "" };
  });

  // Multi-draft support
  // (removed duplicate state hooks)
  // Set a field in the wizard data and persist to drafts
  const setField = (key, value) => {
    setData((prev) => {
      const updated = { ...prev, [key]: value };
      let newDrafts = drafts;
      if (currentDraftId) {
        newDrafts = drafts.map((d) =>
          d.id === currentDraftId
            ? { ...d, data: updated, lastEdit: new Date().toISOString() }
            : d,
        );
        // Limit drafts to 5 most recent
        newDrafts = newDrafts
          .sort((a, b) => new Date(b.lastEdit) - new Date(a.lastEdit))
          .slice(0, 5);
        // Remove large fields from drafts before saving
        const draftsToStore = newDrafts.map((draft) => {
          const dataCopy = { ...draft.data };
          // Only keep photo URLs, not image data
          if (Array.isArray(dataCopy.photos)) {
            dataCopy.photos = dataCopy.photos
              .map((p) =>
                typeof p === "string" ? p : (p && p.image_url) || "",
              )
              .filter(Boolean);
          }
          // Optionally, remove other large fields here
          return { ...draft, data: dataCopy };
        });
        try {
          localStorage.setItem("wizardDrafts", JSON.stringify(draftsToStore));
          setDrafts(newDrafts);
        } catch (e) {
          // If quota exceeded, remove oldest and try again
          if (e.name === "QuotaExceededError" && draftsToStore.length > 1) {
            const fewerDrafts = draftsToStore.slice(0, 4);
            localStorage.setItem("wizardDrafts", JSON.stringify(fewerDrafts));
            setDrafts(newDrafts.slice(0, 4));
          } else {
            // Optionally, show a user-friendly error here
            console.error("Failed to save draft: ", e);
          }
        }
      }
      return updated;
    });
  };

  // Advance to the next wizard step or legal page
  const goNext = () => {
    if (!canProceed) return;
    if (wizardStep < WIZARD_STEPS.length - 1) {
      setStep((s) => s + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      setPage("legal");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };
  const listPropertyApiUrl = getBookingApiUrl("list_property.php");
  const navigate = useNavigate();
  const location = useLocation();
  // Always get the latest host user from localStorage
  const [storedUser, setStoredUser] = useState(() => getStoredUser("host"));
  // Refresh user info on mount and when page becomes visible
  useEffect(() => {
    const updateUser = () => setStoredUser(getStoredUser("host"));
    updateUser();
    window.addEventListener("visibilitychange", updateUser);
    return () => window.removeEventListener("visibilitychange", updateUser);
  }, []);

  // Use navigation state if present, else default
  const navState = location.state?.listProperty || {};
  const [page, setPage] = useState(
    editId ? "wizard" : navState.page || "landing",
  );
  const [wizardStep, setStep] = useState(
    editId
      ? 0
      : typeof navState.wizardStep === "number"
        ? navState.wizardStep
        : 0,
  );
  // (Removed duplicate declaration; handled above for multi-draft support)
  const [loadingEdit, setLoadingEdit] = useState(!!editId);
  // Load property data for editing
  useEffect(() => {
    if (!editId) return;
    setLoadingEdit(true);
    getListings().then((listings) => {
      const found = listings.find((item) => String(item.id) === String(editId));
      if (found) {
        // Debug: log backend data and what is missing
        const mapped = mapPropertyDataToForm(found.raw);
        const missing = Object.keys(INITIAL_DATA).filter(
          (key) =>
            mapped[key] === undefined ||
            (typeof INITIAL_DATA[key] === "object" && mapped[key] == null),
        );
        console.log("[DEBUG] Backend property data:", found.raw);
        console.log("[DEBUG] Mapped property data:", mapped);
        if (missing.length > 0) {
          console.warn(
            "[DEBUG] Missing or undefined fields for wizard:",
            missing,
          );
        }
      }
    });
  }, [editId]);
  const goBackInHistory = () => {
    if (editId) {
      navigate("/host", { replace: true });
      return;
    }
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
      // Merge legalFormData into contracting* fields
      const legalFields = {
        firstName: legalFormData.firstName || "",
        middleName: legalFormData.middleName || "",
        lastName: legalFormData.lastName || "",
        email: legalFormData.email || "",
        phone: legalFormData.phone || "",
        country: legalFormData.country || "",
        addressLine1: legalFormData.addressLine1 || "",
        addressLine2: legalFormData.addressLine2 || "",
        city: legalFormData.city || "",
        zipCode: legalFormData.zipCode || "",
      };
      const mergedData = { ...data, ...legalFields };
      if (editId) {
        // Update existing listing
        const payload = await updateListing(editId, {
          ...mergedData,
          legal: legalFormData,
        });
        if (payload?.success === false) {
          throw new Error(
            payload?.message ||
              "Could not update your listing. Please try again.",
          );
        }
      } else {
        // Create new listing
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
            listing: mergedData,
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
      }
      // Clear wizard progress from localStorage on completion
      try {
        localStorage.removeItem("wizardProgress");
      } catch (e) {
        console.log(e);
      }
      navigate("/host", { replace: true });
    } catch (error) {
      throw new Error(
        error?.message || "Could not submit your listing. Please try again.",
      );
    }
  };

  const canProceed = isWizardStepValid(wizardStep, data);
  const nextHelperText = canProceed
    ? ""
    : getWizardStepHelperText(wizardStep, data);

  if (loadingEdit) {
    return (
      <div className="lp-root">
        <div>Loading property data...</div>
      </div>
    );
  }
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
              drafts={drafts}
              onContinue={(id) => {
                const found = drafts.find((d) => d.id === id);
                if (found) {
                  setCurrentDraftId(id);
                  setData(found.data);
                  setStep(found.wizardStep || 0);
                  setPage("wizard");
                }
              }}
              onCreateNew={() => {
                // Start a new listing and persist progress
                const newId = `draft_${Date.now()}`;
                const newData = { ...INITIAL_DATA, hostName: "" };
                const newDraft = {
                  id: newId,
                  data: newData,
                  wizardStep: 0,
                  lastEdit: new Date().toISOString(),
                };
                const newDrafts = [newDraft, ...drafts];
                setDrafts(newDrafts);
                localStorage.setItem("wizardDrafts", JSON.stringify(newDrafts));
                setCurrentDraftId(newId);
                setData(newData);
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

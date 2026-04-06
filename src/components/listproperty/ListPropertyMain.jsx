import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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

// Steps: 0=Property, 1=Location, 2=GuestDetails, 3=Services,
//        4=ExtraDetails, 5=FacilitiesFAQs, 6=HouseRules, 7=Photos, 8=Pricing

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
      return true;
    case 3:
      return (
        typeof data.breakfast === "boolean" &&
        ["Yes, free", "Yes, paid", "No"].includes(data.parking)
      );
    case 4:
      return (
        isNonEmpty(data.accommodations) &&
        isNonEmpty(data.descriptionFacilities) &&
        isNonEmpty(data.descriptionDining) &&
        isNonEmpty(data.location) &&
        Array.isArray(data.highlights) && data.highlights.length > 0 &&
        Array.isArray(data.popularFacilities) && data.popularFacilities.length > 0 &&
        Array.isArray(data.rooms) && data.rooms.length > 0
      );
    case 5:
      return (
        data.facilities &&
        typeof data.facilities === "object" &&
        Object.keys(data.facilities).length > 0 &&
        Array.isArray(data.faqs) && data.faqs.length > 0
      );
    case 6:
      return (
        isNonEmpty(data.cancellation) &&
        isNonEmpty(data.children) &&
        isNonEmpty(data.cotPolicy) &&
        isNonEmpty(data.ageRestriction) &&
        isNonEmpty(data.petsPolicy) &&
        isNonEmpty(data.parties) &&
        isNonEmpty(data.finePrint) &&
        Array.isArray(data.paymentMethods) && data.paymentMethods.length > 0
      );
    case 7:
      return (Array.isArray(data.photos) ? data.photos.length : 0) >= 5;
    case 8:
      return Number(data.originalPrice) > 0 && isNonEmpty(data.currency);
    default:
      return true;
  }
};

const getWizardStepHelperText = (step, data) => {
  switch (step) {
    case 0:
      return isNonEmpty(data.propertyName) ? "" : "Enter your property name to continue.";
    case 1:
      if (!isNonEmpty(data.address)) return "Enter the property address to continue.";
      if (!isNonEmpty(data.country)) return "Select a country to continue.";
      if (!isNonEmpty(data.city)) return "Enter the city to continue.";
      return "";
    case 3:
      if (typeof data.breakfast !== "boolean") return "Please select breakfast option.";
      if (!["Yes, free", "Yes, paid", "No"].includes(data.parking)) return "Please select parking option.";
      return "";
    case 4:
      if (!isNonEmpty(data.accommodations)) return "Enter accommodations description.";
      if (!isNonEmpty(data.descriptionFacilities)) return "Enter facilities description.";
      if (!isNonEmpty(data.descriptionDining)) return "Enter dining description.";
      if (!isNonEmpty(data.location)) return "Enter location description.";
      if (!Array.isArray(data.highlights) || data.highlights.length === 0) return "Add at least one highlight.";
      if (!Array.isArray(data.popularFacilities) || data.popularFacilities.length === 0) return "Add at least one popular facility.";
      if (!Array.isArray(data.rooms) || data.rooms.length === 0) return "Add at least one room.";
      return "";
    case 6:
      if (!isNonEmpty(data.cancellation)) return "Enter cancellation policy.";
      if (!isNonEmpty(data.children)) return "Enter children policy.";
      if (!isNonEmpty(data.cotPolicy)) return "Enter cot policy.";
      if (!isNonEmpty(data.ageRestriction)) return "Enter age restriction.";
      if (!isNonEmpty(data.petsPolicy)) return "Enter pets policy.";
      if (!isNonEmpty(data.parties)) return "Enter parties policy.";
      if (!isNonEmpty(data.finePrint)) return "Enter fine print.";
      if (!Array.isArray(data.paymentMethods) || data.paymentMethods.length === 0) return "Add at least one payment method.";
      return "";
    case 7: {
      const photoCount = Array.isArray(data.photos) ? data.photos.length : 0;
      return photoCount >= 5 ? "" : `Add at least 5 photos to continue (${photoCount}/5).`;
    }
    case 8:
      if (Number(data.originalPrice) <= 0) return "Enter a price per night greater than 0 to continue.";
      if (!isNonEmpty(data.currency)) return "Select a payout currency to continue.";
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
  accommodations: "",
  descriptionFacilities: "",
  descriptionDining: "",
  location: "",
  highlights: [],
  popularFacilities: [],
  rooms: [],
  bedType: "",
  amenities: [],
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
};

function mapPropertyDataToForm(raw) {
  let photos = [];
  if (Array.isArray(raw.images)) {
    photos = raw.images.map((img) => img.image_url).filter(Boolean);
  }

  const toBool = (val) => String(val) === "1" || val === 1;

  return {
    propertyType: raw.propertyType || raw.type || "",
    propertyName: raw.propertyName || raw.name || "",
    address: raw.address || "",
    apartment: raw.apartment || "",
    country: raw.country || "",
    city: raw.city || "",
    zipCode: raw.zipCode || raw.zip_code || "",
    guests: raw.guests != null ? Number(raw.guests) : "",
    excludeInfants: toBool(raw.excludeInfants ?? raw.exclude_infants),
    lastMinuteBookings: toBool(raw.lastMinuteBookings ?? raw.last_minute_bookings),
    apartmentSize: raw.apartmentSize || raw.apartment_size || "",
    sizeUnit: raw.sizeUnit || raw.size_unit || "square metres",
    breakfast: toBool(raw.breakfast),
    parking: raw.parking || "No",
    smokingAllowed: toBool(raw.smokingAllowed ?? raw.smoking_allowed),
    checkInFrom: raw.checkInFrom || raw.check_in_from || "15:00",
    checkInUntil: raw.checkInUntil || raw.check_in_until || "18:00",
    checkOutFrom: raw.checkOutFrom || raw.check_out_from || "08:00",
    checkOutUntil: raw.checkOutUntil || raw.check_out_until || "11:00",
    photos,
    originalPrice: raw.originalPrice || raw.original_price || raw.nightly_rate || "",
    currentPrice: raw.currentPrice || raw.current_price || "",
    discount: raw.discount || "",
    weekendRate: raw.weekendRate || raw.weekend_rate || "",
    cleaningFee: raw.cleaningFee || raw.cleaning_fee || "",
    currency: raw.currency || "NGN",
    taxesIncluded: toBool(raw.taxesIncluded ?? raw.taxes_included),
    accommodations: raw.accommodations || "",
    descriptionFacilities: raw.descriptionFacilities || raw.description_facilities || "",
    descriptionDining: raw.descriptionDining || raw.description_dining || "",
    location: raw.location || raw.location_description || "",
    highlights: Array.isArray(raw.highlights) ? raw.highlights : [],
    popularFacilities: Array.isArray(raw.popularFacilities) ? raw.popularFacilities : Array.isArray(raw.popular_facilities) ? raw.popular_facilities : [],
    rooms: Array.isArray(raw.rooms) ? raw.rooms : [],
    bedType: raw.bedType || raw.bed_type || "",
    amenities: Array.isArray(raw.amenities) ? raw.amenities : [],
    cancellation: raw.cancellation || "",
    children: raw.children || raw.children_policy || "",
    cotPolicy: raw.cotPolicy || raw.cot_policy || "",
    ageRestriction: raw.ageRestriction || raw.age_restriction || "",
    petsPolicy: raw.petsPolicy || raw.pets_policy || "",
    paymentMethods: Array.isArray(raw.paymentMethods) ? raw.paymentMethods : raw.payment_methods ? raw.payment_methods.split(',') : [],
    parties: raw.parties || raw.parties_policy || "",
    finePrint: raw.finePrint || raw.fine_print || "",
    facilities: typeof raw.facilities === "object" && raw.facilities !== null ? raw.facilities : {},
    faqs: Array.isArray(raw.faqs) ? raw.faqs : [],
  };
}

export default function ListPropertyMain({ editId }) {
  const listPropertyApiUrl = getBookingApiUrl("list_property.php");
  const navigate = useNavigate();
  const location = useLocation();

  // ── State declarations at top ──
  const [drafts, setDrafts] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("wizardDrafts")) || [];
    } catch {
      return [];
    }
  });
  const [currentDraftId, setCurrentDraftId] = useState(null);
  const [data, setData] = useState({ ...INITIAL_DATA });
  const [storedUser, setStoredUser] = useState(() => getStoredUser("host"));
  const navState = location.state?.listProperty || {};
  const [page, setPage] = useState(editId ? "wizard" : navState.page || "landing");
  const [wizardStep, setStep] = useState(
    editId ? 0 : typeof navState.wizardStep === "number" ? navState.wizardStep : 0
  );
  const [loadingEdit, setLoadingEdit] = useState(!!editId);

  // ── Refresh user on visibility change ──
  useEffect(() => {
    const updateUser = () => setStoredUser(getStoredUser("host"));
    updateUser();
    window.addEventListener("visibilitychange", updateUser);
    return () => window.removeEventListener("visibilitychange", updateUser);
  }, []);

  // ── Load property for editing ──
  useEffect(() => {
    if (!editId) return;
    setLoadingEdit(true);
    getListings().then((listings) => {
      const found = listings.find((item) => String(item.id) === String(editId));
      if (found) {
        const mapped = mapPropertyDataToForm(found.raw);
        setData((d) => ({ ...d, ...mapped }));
      }
      setLoadingEdit(false);
    });
  }, [editId]);

  // ── Set a field and persist to drafts ──
  const setField = (key, value) => {
    setData((prev) => {
      const updated = { ...prev, [key]: value };
      if (currentDraftId) {
        const newDrafts = drafts
          .map((d) =>
            d.id === currentDraftId
              ? { ...d, data: updated, lastEdit: new Date().toISOString() }
              : d
          )
          .sort((a, b) => new Date(b.lastEdit) - new Date(a.lastEdit))
          .slice(0, 5);

        const draftsToStore = newDrafts.map((draft) => {
          const dataCopy = { ...draft.data };
          if (Array.isArray(dataCopy.photos)) {
            dataCopy.photos = dataCopy.photos
              .map((p) => (typeof p === "string" ? p : p?.image_url || ""))
              .filter(Boolean);
          }
          return { ...draft, data: dataCopy };
        });

        try {
          localStorage.setItem("wizardDrafts", JSON.stringify(draftsToStore));
          setDrafts(newDrafts);
        } catch (e) {
          if (e.name === "QuotaExceededError" && draftsToStore.length > 1) {
            const fewer = draftsToStore.slice(0, 4);
            localStorage.setItem("wizardDrafts", JSON.stringify(fewer));
            setDrafts(newDrafts.slice(0, 4));
          }
        }
      }
      return updated;
    });
  };

  const canProceed = isWizardStepValid(wizardStep, data);
  const nextHelperText = canProceed ? "" : getWizardStepHelperText(wizardStep, data);

  // ── Wizard navigation ──
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

  const goBack = () => goBackInHistory();
  const goHome = () => navigate("/");
  const { Component } = WIZARD_STEPS[wizardStep];

  // ── Submit listing ──
  const handleCompleteListing = async (legalFormData) => {
    try {
      const mergedData = {
        ...data,
        firstName: legalFormData.firstName || "",
        middleName: legalFormData.middleName || "",
        lastName: legalFormData.lastName || "",
        email: legalFormData.email || "",
        phone: legalFormData.phone || "",
        country: legalFormData.country || data.country || "",
        addressLine1: legalFormData.addressLine1 || "",
        addressLine2: legalFormData.addressLine2 || "",
        city: legalFormData.city || data.city || "",
        zipCode: legalFormData.zipCode || data.zipCode || "",
      };

      if (editId) {
        const payload = await updateListing(editId, { ...mergedData, legal: legalFormData });
        if (payload?.success === false) {
          throw new Error(payload?.message || "Could not update your listing. Please try again.");
        }
      } else {
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
          throw new Error(payload?.message || "Could not submit your listing. Please try again.");
        }
      }

      try { localStorage.removeItem("wizardProgress"); } catch (e) { console.log(e); }
      navigate("/host", { replace: true });
    } catch (error) {
      throw new Error(error?.message || "Could not submit your listing. Please try again.");
    }
  };

  if (loadingEdit) {
    return (
      <div className="lp-root">
        <div>Loading property data...</div>
      </div>
    );
  }

  return (
    <div className="lp-root">
      {/* LANDING */}
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
              const newId = `draft_${Date.now()}`;
              const newData = { ...INITIAL_DATA };
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

      {/* WIZARD */}
      {page === "wizard" && (
        <>
          <InternalNav user={storedUser} onHome={goHome} />
          <ProgressStrip step={wizardStep} />
          <div className="lp-step-bar">
            <strong>{WIZARD_STEPS[wizardStep].title}</strong>
            <span>Step {wizardStep + 1} of {WIZARD_STEPS.length}</span>
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

      {/* LEGAL */}
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
  );
}
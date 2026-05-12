import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getListings, updateListing } from "../host/services/hostApi";
import { getStoredUser } from "../../utils/authUser";
import { getBookingApiUrl } from "../../utils/api";

import { ProgressStrip, WizardNav } from "./ui.jsx";
import { STAGE_GROUPS } from "./ui.constants.js";
import InternalNav from "./components/InternalNav.jsx";
import "./components/WizardStepShell.css";

import LandingPage from "./LandingPage.jsx";
import LegalInfoPage from "./LegalInfoPage.jsx";

import {
  StepProperty,
  StepLocation,
  StepRooms,
  StepServicesAmenities,
  StepPhotos,
  StepDescriptions,
  StepFacilitiesFAQs,
  StepGuestRules,
  StepPricing,
} from "./WizardSteps.jsx";

const CELEBRATION_MESSAGES = {
  "Basic info": "Your property is on the map — now let's build your rooms!",
  "Your space": "Space all set up — time to bring it to life with photos!",
  Presentation: "Looking great — almost done, just a few more details.",
  Details: "Nearly there — set your pricing and you're ready to go live!",
};

/* ── Wizard step registry ──────────────────────────────────── */
const WIZARD_STEPS = [
  { title: "Property", Component: StepProperty },
  { title: "Location", Component: StepLocation },
  { title: "Your Rooms", Component: StepRooms },
  { title: "Services", Component: StepServicesAmenities },
  { title: "Photos", Component: StepPhotos },
  { title: "Descriptions", Component: StepDescriptions },
  { title: "FAQs", Component: StepFacilitiesFAQs },
  { title: "Guest Rules", Component: StepGuestRules },
  { title: "Pricing", Component: StepPricing },
];

// Steps: 0=Property, 1=Location, 2=Rooms, 3=ServicesAmenities,
//        4=Photos, 5=Descriptions, 6=FacilitiesFAQs, 7=GuestRules, 8=Pricing

const isNonEmpty = (value) => String(value || "").trim().length > 0;

const isWizardStepValid = (step, data) => {
  switch (step) {
    case 0:
      return isNonEmpty(data.propertyName) && isNonEmpty(data.propertyType);
    case 1:
      return (
        isNonEmpty(data.address) &&
        isNonEmpty(data.country) &&
        isNonEmpty(data.city)
      );
    case 2:
      // Rooms
      return Array.isArray(data.rooms) && data.rooms.length > 0;
    case 3:
      // Services & Amenities
      return (
        typeof data.breakfast === "boolean" &&
        ["Yes, free", "Yes, paid", "No"].includes(data.parking) &&
        Array.isArray(data.popularFacilities) &&
        data.popularFacilities.length > 0
      );
    case 4:
      // Photos
      return (Array.isArray(data.photos) ? data.photos.length : 0) >= 5;
    case 5:
      // Descriptions
      return (
        Array.isArray(data.accommodations) &&
        data.accommodations.length > 0 &&
        Array.isArray(data.descriptionDining) &&
        data.descriptionDining.length > 0 &&
        Array.isArray(data.location) &&
        data.location.length > 0
      );
    case 6:
      // FAQs
      return Array.isArray(data.faqs) && data.faqs.length > 0;
    case 7:
      // Guest Rules
      return (
        isNonEmpty(data.cancellation) &&
        isNonEmpty(data.children) &&
        isNonEmpty(data.cotPolicy) &&
        isNonEmpty(data.ageRestriction) &&
        isNonEmpty(data.petsPolicy) &&
        isNonEmpty(data.parties) &&
        isNonEmpty(data.finePrint) &&
        Array.isArray(data.paymentMethods) &&
        data.paymentMethods.length > 0
      );
    case 8:
      return isNonEmpty(data.originalPrice);
    default:
      return true;
  }
};

const getWizardStepHelperText = (step, data) => {
  switch (step) {
    case 0:
      if (!isNonEmpty(data.propertyName))
        return "Enter your property name to continue.";
      if (!isNonEmpty(data.propertyType))
        return "Select a property type to continue.";
      return "";
    case 1:
      if (!isNonEmpty(data.address))
        return "Enter the property address to continue.";
      if (!isNonEmpty(data.country)) return "Select a country to continue.";
      if (!isNonEmpty(data.city)) return "Enter the city to continue.";
      return "";
    case 2:
      return !Array.isArray(data.rooms) || data.rooms.length === 0
        ? "Add at least one room to continue."
        : "";
    case 3:
      if (typeof data.breakfast !== "boolean")
        return "Please select a breakfast option.";
      if (!["Yes, free", "Yes, paid", "No"].includes(data.parking))
        return "Please select a parking option.";
      if (
        !Array.isArray(data.popularFacilities) ||
        data.popularFacilities.length === 0
      )
        return "Select at least one popular facility.";
      return "";
    case 4: {
      const photoCount = Array.isArray(data.photos) ? data.photos.length : 0;
      return photoCount >= 5
        ? ""
        : `Add at least 5 photos to continue (${photoCount}/5).`;
    }
    case 5:
      if (
        !Array.isArray(data.accommodations) ||
        data.accommodations.length === 0
      )
        return "Select at least one accommodations option.";
      if (
        !Array.isArray(data.descriptionDining) ||
        data.descriptionDining.length === 0
      )
        return "Select at least one dining option.";
      if (!Array.isArray(data.location) || data.location.length === 0)
        return "Select at least one location option.";
      return "";
    case 6:
      return !Array.isArray(data.faqs) || data.faqs.length === 0
        ? "Add at least one FAQ to continue."
        : "";
    case 7:
      if (!isNonEmpty(data.cancellation)) return "Enter a cancellation policy.";
      if (!isNonEmpty(data.children)) return "Enter a children policy.";
      if (!isNonEmpty(data.cotPolicy)) return "Enter a cot/extra bed policy.";
      if (!isNonEmpty(data.ageRestriction)) return "Enter an age restriction.";
      if (!isNonEmpty(data.petsPolicy)) return "Enter a pets policy.";
      if (!isNonEmpty(data.parties)) return "Enter a parties & events policy.";
      if (!isNonEmpty(data.finePrint)) return "Enter the fine print.";
      if (
        !Array.isArray(data.paymentMethods) ||
        data.paymentMethods.length === 0
      )
        return "Add at least one payment method.";
      return "";
    case 8:
      return isNonEmpty(data.originalPrice) ? "" : "Enter an original price to continue.";
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
  // Legal / host personal details (stored separately to avoid conflict with property location)
  firstName: "",
  middleName: "",
  lastName: "",
  email: "",
  phone: "",
  dialCode: "+234",
  addressLine1: "",
  addressLine2: "",
  legalCountry: "",
  legalCity: "",
  legalZipCode: "",
  agree1: false,
  agree2: false,
  guests: "",
  excludeInfants: false,
  lastMinuteBookings: false,
  apartmentSize: "",
  sizeUnit: "square metres",
  breakfast: false,
  parking: "No",
  smokingAllowed: false,
  checkInFrom: "15:00",
  checkInUntil: "22:00",
  checkOutFrom: "08:00",
  checkOutUntil: "11:00",
  photos: [],
  originalPrice: "",
  currentPrice: "",
  discount: "",
  currency: "₦",
  taxesIncluded: false,
  accommodations: [],
  descriptionDining: [],
  location: [],
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
  faqs: [],
};

const toArr = (v) => (Array.isArray(v) ? v : v ? [String(v)] : []);

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
    lastMinuteBookings: toBool(
      raw.lastMinuteBookings ?? raw.last_minute_bookings,
    ),
    apartmentSize: raw.apartmentSize || raw.apartment_size || "",
    sizeUnit: raw.sizeUnit || raw.size_unit || "square metres",
    breakfast: toBool(raw.breakfast),
    parking: raw.parking || "No",
    smokingAllowed: toBool(raw.smokingAllowed ?? raw.smoking_allowed),
    checkInFrom: raw.checkInFrom || raw.check_in_from || "15:00",
    checkInUntil: raw.checkInUntil || raw.check_in_until || "22:00",
    checkOutFrom: raw.checkOutFrom || raw.check_out_from || "08:00",
    checkOutUntil: raw.checkOutUntil || raw.check_out_until || "11:00",
    photos,
    originalPrice: raw.originalPrice || raw.original_price,
    currentPrice: raw.currentPrice || raw.current_price || "",
    discount: raw.discount || "",
    currency: raw.currency || "NGN",
    taxesIncluded: toBool(raw.taxesIncluded ?? raw.taxes_included),
    accommodations: toArr(raw.accommodations),
    descriptionDining: toArr(raw.descriptionDining || raw.description_dining),
    location: toArr(
      raw.location || raw.locationDescription || raw.location_description,
    ),
    popularFacilities: Array.isArray(raw.popularFacilities)
      ? raw.popularFacilities
      : Array.isArray(raw.popular_facilities)
        ? raw.popular_facilities
        : [],
    rooms: Array.isArray(raw.rooms)
      ? raw.rooms.map((room) => ({
          ...room,
          originalPrice: room.originalPrice || room.original_price || "",
          currentPrice: room.currentPrice || room.current_price || "",
          availability: room.availability || "",
        }))
      : [],
    bedType: raw.bedType || raw.bed_type || "",
    amenities: Array.isArray(raw.amenities) ? raw.amenities : [],
    cancellation: raw.cancellation || "",
    children: raw.children || raw.children_policy || "",
    cotPolicy: raw.cotPolicy || raw.cot_policy || "",
    ageRestriction: raw.ageRestriction || raw.age_restriction || "",
    petsPolicy: raw.petsPolicy || raw.pets_policy || "",
    paymentMethods: Array.isArray(raw.paymentMethods)
      ? raw.paymentMethods
      : raw.payment_methods
        ? raw.payment_methods.split(",")
        : [],
    parties: raw.parties || raw.parties_policy || "",
    finePrint: raw.finePrint || raw.fine_print || "",
    faqs: Array.isArray(raw.faqs) ? raw.faqs : [],
    firstName: raw.firstName || "",
    middleName: raw.middleName || "",
    lastName: raw.lastName || "",
    email: raw.email || "",
    phone: raw.phone || "",
    dialCode: raw.dialCode || "+234",
    addressLine1: raw.addressLine1 || "",
    addressLine2: raw.addressLine2 || "",
    legalCountry: raw.legalCountry || "",
    legalCity: raw.legalCity || "",
    legalZipCode: raw.legalZipCode || "",
    agree1: false,
    agree2: false,
  };
}

export default function ListPropertyMain({ editId, forceWizard }) {
  const location = useLocation();
  const navState = location.state?.listProperty || {};
  const listPropertyApiUrl = getBookingApiUrl("list_property.php");
  const navigate = useNavigate();

  // ── State declarations at top ──
  const [drafts, setDrafts] = useState(() => {
    try {
      const u = getStoredUser("host");
      const key = u?.id
        ? `wizardDrafts_${u.id}`
        : `wizardDrafts_${u?.email || "guest"}`;
      return JSON.parse(localStorage.getItem(key)) || [];
    } catch {
      return [];
    }
  });
  const [currentDraftId, setCurrentDraftId] = useState(null);
  const [data, setData] = useState({ ...INITIAL_DATA });
  const [storedUser, setStoredUser] = useState(() => getStoredUser("host"));
  const draftsKey = storedUser?.id
    ? `wizardDrafts_${storedUser.id}`
    : `wizardDrafts_${storedUser?.email || "guest"}`;
  const [page, setPage] = useState(
    forceWizard ? "wizard" : editId ? "wizard" : navState.page || "landing",
  );
  const [wizardStep, setStep] = useState(
    editId
      ? 0
      : typeof navState.wizardStep === "number"
        ? navState.wizardStep
        : 0,
  );
  const [loadingEdit, setLoadingEdit] = useState(!!editId);
  const [celebrationStage, setCelebration] = useState(null);

  // ── Refresh user on visibility change ──
  useEffect(() => {
    const updateUser = () => setStoredUser(getStoredUser("host"));
    updateUser();
    window.addEventListener("visibilitychange", updateUser);
    return () => window.removeEventListener("visibilitychange", updateUser);
  }, []);

  // ── Auto-create draft if wizard opened without one (e.g. direct /wizard URL) ──
  useEffect(() => {
    if (forceWizard && !editId && !currentDraftId) {
      const newId = `draft_${Date.now()}`;
      const newDraft = {
        id: newId,
        data: { ...INITIAL_DATA },
        wizardStep: 0,
        lastEdit: new Date().toISOString(),
      };
      setDrafts((prev) => {
        const updated = [newDraft, ...prev.filter(Boolean)];
        try {
          localStorage.setItem(draftsKey, JSON.stringify(updated));
        } catch (e) {
          console.log(e);
        }
        return updated;
      });
      setCurrentDraftId(newId);
      // Stamp the current history entry with wizard state so browser back works
      navigate(location.pathname, {
        replace: true,
        state: {
          listProperty: { page: "wizard", wizardStep: 0, draftId: newId },
        },
      });
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Sync page/step from browser history (back / forward buttons) ──
  useEffect(() => {
    const s = location.state?.listProperty;
    if (s?.page) setPage(s.page);
    if (typeof s?.wizardStep === "number") setStep(s.wizardStep);
    if (!s && !editId && !forceWizard) {
      setPage("landing");
      setStep(0);
    }
  }, [location.key]); // eslint-disable-line react-hooks/exhaustive-deps

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
              : d,
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
          localStorage.setItem(draftsKey, JSON.stringify(draftsToStore));
          setDrafts(newDrafts);
        } catch (e) {
          if (e.name === "QuotaExceededError" && draftsToStore.length > 1) {
            const fewer = draftsToStore.slice(0, 4);
            localStorage.setItem(draftsKey, JSON.stringify(fewer));
            setDrafts(newDrafts.slice(0, 4));
          }
        }
      }
      return updated;
    });
  };

  const canProceed = isWizardStepValid(wizardStep, data);
  const nextHelperText = canProceed
    ? ""
    : getWizardStepHelperText(wizardStep, data);

  // ── Auto-dismiss celebration after 2.8 s ──
  useEffect(() => {
    if (!celebrationStage) return;
    const t = setTimeout(() => setCelebration(null), 2800);
    return () => clearTimeout(t);
  }, [celebrationStage]);

  const getStageIndexForStep = (step) =>
    STAGE_GROUPS.findIndex((g) => g.steps.includes(step));

  // ── Wizard navigation ──
  const goNext = () => {
    if (!canProceed) return;
    if (wizardStep < WIZARD_STEPS.length - 1) {
      const newStep = wizardStep + 1;
      const oldStage = getStageIndexForStep(wizardStep);
      const newStage = getStageIndexForStep(newStep);
      if (newStage > oldStage) setCelebration(STAGE_GROUPS[oldStage].label);
      setStep(newStep);
      // Push a history entry so browser back/forward tracks steps
      navigate(location.pathname, {
        state: {
          listProperty: {
            page: "wizard",
            wizardStep: newStep,
            draftId: currentDraftId,
          },
        },
      });
      if (currentDraftId) {
        setDrafts((prev) => {
          const updated = prev.map((d) =>
            d.id === currentDraftId
              ? {
                  ...d,
                  wizardStep: newStep,
                  lastEdit: new Date().toISOString(),
                }
              : d,
          );
          try {
            localStorage.setItem(draftsKey, JSON.stringify(updated));
          } catch (e) {
            console.log(e);
          }
          return updated;
        });
      }
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      setPage("legal");
      navigate(location.pathname, {
        state: {
          listProperty: { page: "legal", wizardStep, draftId: currentDraftId },
        },
      });
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const goBackInHistory = () => {
    if (editId) {
      navigate("/host", { replace: true });
      return;
    }
    // Pop the history stack — the location.key effect will sync page/step
    navigate(-1);
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
        // updateListing now throws on any failure — errors propagate up
        await updateListing(editId, {
          ...mergedData,
          legal: legalFormData,
        });
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
          throw new Error(
            payload?.message ||
              "Could not submit your listing. Please try again.",
          );
        }
      }

      // Remove the submitted draft so it no longer appears in the drafts list
      if (currentDraftId) {
        const updatedDrafts = drafts.filter((d) => d.id !== currentDraftId);
        setDrafts(updatedDrafts);
        try {
          localStorage.setItem(draftsKey, JSON.stringify(updatedDrafts));
        } catch (e) {
          console.log(e);
        }
        setCurrentDraftId(null);
      }
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

  if (loadingEdit) {
    return (
      <div className="lp-root">
        <div>Loading property data...</div>
      </div>
    );
  }

  // Helper to check if an id is a local draft
  const isLocalDraft = (id) =>
    drafts.filter(Boolean).some((d) => d && d.id === id);

  return (
    <div className="lp-root">
      {/* LANDING */}
      {page === "landing" && (
        <>
          <InternalNav user={storedUser} onHome={goHome} />
          <LandingPage
            user={storedUser}
            drafts={drafts.filter(Boolean)}
            onContinue={async (id) => {
              if (isLocalDraft(id)) {
                const found = drafts
                  .filter(Boolean)
                  .find((d) => d && d.id === id);
                if (found && found.data) {
                  const step = found.wizardStep || 0;
                  setCurrentDraftId(id);
                  setData(found.data);
                  setStep(step);
                  setPage("wizard");
                  navigate(location.pathname, {
                    state: {
                      listProperty: {
                        page: "wizard",
                        wizardStep: step,
                        draftId: id,
                      },
                    },
                  });
                }
              } else {
                // Backend property: load from backend then push history
                setLoadingEdit(true);
                setCurrentDraftId(null);
                const listings = await getListings();
                const found = listings.find(
                  (item) => String(item.id) === String(id),
                );
                if (found) {
                  const mapped = mapPropertyDataToForm(found.raw);
                  setData((d) => ({ ...d, ...mapped }));
                  setStep(0);
                  setPage("wizard");
                  navigate(location.pathname, {
                    state: {
                      listProperty: {
                        page: "wizard",
                        wizardStep: 0,
                        draftId: null,
                      },
                    },
                  });
                }
                setLoadingEdit(false);
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
              const newDrafts = [newDraft, ...drafts.filter(Boolean)];
              setDrafts(newDrafts);
              localStorage.setItem(draftsKey, JSON.stringify(newDrafts));
              setCurrentDraftId(newId);
              setData(newData);
              setStep(0);
              setPage("wizard");
              navigate(location.pathname, {
                state: {
                  listProperty: {
                    page: "wizard",
                    wizardStep: 0,
                    draftId: newId,
                  },
                },
              });
            }}
          />
        </>
      )}

      {/* WIZARD */}
      {page === "wizard" && (
        <>
          <InternalNav user={storedUser} onHome={goHome} />
          <ProgressStrip step={wizardStep} />

          {celebrationStage && (
            <div
              className="milestone-banner"
              style={{
                position: "fixed",
                bottom: 80,
                left: "50%",
                transform: "translateX(-50%)",
                zIndex: 1200,
                minWidth: 280,
                maxWidth: 480,
                width: "calc(100% - 40px)",
                background:
                  "linear-gradient(135deg, var(--oceanBlue) 0%, var(--navy) 100%)",
                color: "#fff",
                padding: "14px 18px",
                borderRadius: 14,
                boxShadow: "0 8px 32px rgba(26, 107, 181, 0.38)",
                display: "flex",
                alignItems: "center",
                gap: 12,
              }}
            >
              <span style={{ fontSize: 26, lineHeight: 1, flexShrink: 0 }}>
                🎉
              </span>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 15 }}>
                  ✓ {celebrationStage} complete!
                </div>
                <div style={{ fontSize: 13, opacity: 0.88, marginTop: 2 }}>
                  {CELEBRATION_MESSAGES[celebrationStage]}
                </div>
              </div>
              <button
                onClick={() => setCelebration(null)}
                style={{
                  background: "rgba(255,255,255,0.18)",
                  border: "none",
                  color: "#fff",
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  cursor: "pointer",
                  fontSize: 17,
                  lineHeight: 1,
                  flexShrink: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                ×
              </button>
            </div>
          )}

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

      {/* LEGAL */}
      {page === "legal" && (
        <>
          <InternalNav user={storedUser} onHome={goHome} />
          <LegalInfoPage
            onBack={goBackInHistory}
            onSubmit={handleCompleteListing}
            data={data}
            setField={setField}
            isEdit={!!editId}
          />
        </>
      )}
    </div>
  );
}

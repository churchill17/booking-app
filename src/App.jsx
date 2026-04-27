import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Signup from "./pages/Signup/Signup";
import Otp from "./pages/Otp/Otp";

import Host from "./pages/Host/Host";
import ListProperty from "./pages/ListProperty/ListProperty";
import ListPropertyWizard from "./pages/ListProperty/ListPropertyWizard";
import ListPropertySignup from "./pages/ListProperty/ListPropertySignup";
import ListPropertyLogin from "./pages/ListProperty/ListPropertyLogin";
import ListPropertyEdit from "./pages/ListProperty/ListPropertyEdit";
import Stays from "./pages/Stays/Stays";
import PropertyDetailsWrapper from "./components/host/PropertyDetailsWrapper";
import StaysDetails from "./pages/StaysDetails/StaysDetails";
import Reviews from "./pages/Reviews/Reviews";
import SearchFilter from "./pages/SearchFilter/SearchFilter";
import Booking from "./pages/booking/Booking";
import ManageTrips from "./pages/FooterPages/ManageTrips";
import ContactCustomerService from "./pages/FooterPages/ContactCustomerService";
import SafetyResourceCentre from "./pages/FooterPages/SafetyResourceCentre";
import PrivacyNotice from "./pages/FooterPages/PrivacyNotice";
import TermsOfService from "./pages/FooterPages/TermsOfService";
import AboutIbookNova from "./pages/FooterPages/AboutIbookNova";
import ContentGuidelines from "./pages/FooterPages/ContentGuidelines";
import Sustainability from "./pages/FooterPages/Sustainability";

const router = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "/log-in", element: <Login /> },
  { path: "/sign-up", element: <Signup /> },
  { path: "/otp", element: <Otp /> },
  { path: "/host", element: <Host /> },
  { path: "/list-property", element: <ListProperty /> },
  { path: "/list-property/wizard", element: <ListPropertyWizard /> },
  { path: "/list-property/type", element: <ListProperty /> },
  { path: "/list-property/signup", element: <ListPropertySignup /> },
  { path: "/list-property/login", element: <ListPropertyLogin /> },
  { path: "/list-property/edit/:id", element: <ListPropertyEdit /> },
  { path: "/stays", element: <Stays /> },
  { path: "/stays/:id", element: <StaysDetails /> },
  { path: "/host/property/:id", element: <PropertyDetailsWrapper /> },
  { path: "/reviews", element: <Reviews /> },
  { path: "/SearchFilter", element: <SearchFilter /> },
  { path: "/booking/:propertyId/:roomId", element: <Booking /> },
  { path: "/manage-trips", element: <ManageTrips /> },
  { path: "/contact", element: <ContactCustomerService /> },
  { path: "/safety", element: <SafetyResourceCentre /> },
  { path: "/privacy", element: <PrivacyNotice /> },
  { path: "/terms", element: <TermsOfService /> },
  { path: "/about", element: <AboutIbookNova /> },
  { path: "/content-guidelines", element: <ContentGuidelines /> },
  { path: "/sustainability", element: <Sustainability /> },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Signup from "./pages/Signup/Signup";
import Otp from "./pages/Otp/Otp";
import Flights from "./pages/Flights/Flights";
import CarRental from "./pages/CarRental/CarRental";
import Attractions from "./pages/Attractions/Attractions";
import Host from "./pages/Host/Host";
import ListProperty from "./pages/ListProperty/ListProperty";
import ListPropertySignup from "./pages/ListProperty/ListPropertySignup";
import ListPropertyLogin from "./pages/ListProperty/ListPropertyLogin";
import ListPropertyEdit from "./pages/ListProperty/ListPropertyEdit";
import Stays from "./pages/Stays/Stays";
import PropertyDetailsWrapper from "./components/host/PropertyDetailsWrapper";
import StaysDetails from "./pages/StaysDetails/StaysDetails";
import Reviews from "./pages/Reviews/Reviews";

const router = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "/log-in", element: <Login /> },
  { path: "/sign-up", element: <Signup /> },
  { path: "/otp", element: <Otp /> },
  { path: "/flights", element: <Flights /> },
  { path: "/car-rental", element: <CarRental /> },
  { path: "/attractions", element: <Attractions /> },
  { path: "/host", element: <Host /> },
  { path: "/list-property", element: <ListProperty /> },
  { path: "/list-property/type", element: <ListProperty /> },
  { path: "/list-property/signup", element: <ListPropertySignup /> },
  { path: "/list-property/login", element: <ListPropertyLogin /> },
  { path: "/list-property/edit/:id", element: <ListPropertyEdit /> },
  { path: "/stays", element: <Stays /> },
  { path: "/stays/:id", element: <StaysDetails /> },
  { path: "/host/property/:id", element: <PropertyDetailsWrapper /> },
  { path: "/reviews", element: <Reviews /> },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;

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
import Hotels from "./pages/Hotels/Hotels";
import Resorts from "./pages/Resorts/Resorts";
import Apartments from "./pages/Apartments/Apartments";
import GuestHouses from "./pages/GuestHouses/GuestHouses";
import PropertyDetailsWrapper from "./components/host/PropertyDetailsWrapper";

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
  { path: "/list-property/signup", element: <ListPropertySignup /> },
  { path: "/list-property/login", element: <ListPropertyLogin /> },
  { path: "/hotels", element: <Hotels /> },
  { path: "/resorts", element: <Resorts /> },
  { path: "/apartments", element: <Apartments /> },
  { path: "/guest-houses", element: <GuestHouses /> },
  { path: "/host/property/:id", element: <PropertyDetailsWrapper /> },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;

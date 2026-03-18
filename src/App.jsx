import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Signup from "./pages/Signup/Signup";
import Otp from "./pages/Otp/Otp";
import Flights from "./pages/Flights/Flights";
import CarRental from "./pages/CarRental/CarRental";
import Attractions from "./pages/Attractions/Atttractions";
import Listers from "./pages/Listers/Listers";
import ListProperty from "./pages/ListProperty/ListProperty";
import ListPropertySignup from "./pages/ListProperty/ListPropertySignup";
import ListPropertyLogin from "./pages/ListProperty/ListPropertyLogin";

const router = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "/log-in", element: <Login /> },
  { path: "/sign-up", element: <Signup /> },
  { path: "/otp", element: <Otp /> },
  { path: "/flights", element: <Flights /> },
  { path: "/car-rental", element: <CarRental /> },
  { path: "/attractions", element: <Attractions /> },
  { path: "/listers", element: <Listers /> },
  { path: "/list-property", element: <ListProperty /> },
  { path: "/list-property/signup", element: <ListPropertySignup /> },
  { path: "/list-property/login", element: <ListPropertyLogin /> },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;

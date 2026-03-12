import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Signup from "./pages/Signup/Signup";
import Otp from "./pages/Otp/Otp";
import Flights from "./pages/Flights/Flights";

const router = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "/log-in", element: <Login /> },
  { path: "/sign-up", element: <Signup /> },
  { path: "/otp", element: <Otp /> },
  { path: "/flights", element: <Flights /> },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;

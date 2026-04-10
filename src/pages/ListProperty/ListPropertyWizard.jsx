import ListPropertyMain from "../../components/listproperty/ListPropertyMain";
import { getStoredUser } from "../../utils/authUser";
import { Navigate } from "react-router-dom";

export default function ListPropertyWizard() {
  const user = getStoredUser("host");
  if (!user || user.role !== "host") {
    return <Navigate to="/list-property/signup" replace />;
  }
  // Pass a prop to force wizard mode
  return <ListPropertyMain forceWizard />;
}

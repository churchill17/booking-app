import { Navigate } from "react-router-dom";
import ListPropertyMain from "../../components/listproperty/ListPropertyMain";
import { getStoredUser } from "../../utils/authUser";

export default function ListProperty() {
  const user = getStoredUser();

  if (!user) {
    return <Navigate to="/list-property/signup" replace />;
  }

  return <ListPropertyMain />;
}

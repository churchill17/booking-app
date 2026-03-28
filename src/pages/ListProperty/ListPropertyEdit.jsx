import { useParams, Navigate } from "react-router-dom";
import ListPropertyMain from "../../components/listproperty/ListPropertyMain";
import { getStoredUser } from "../../utils/authUser";

export default function ListPropertyEdit() {
  const user = getStoredUser("host");
  const { id } = useParams();

  if (!user || user.role !== "host") {
    return <Navigate to="/list-property/signup" replace />;
  }

  // Pass the property id as a prop for edit mode
  return <ListPropertyMain editId={id} />;
}

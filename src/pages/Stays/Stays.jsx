import StaysMain from "../../components/Stays/StaysMain";
import { useLocation } from "react-router-dom";

export default function Stays() {
  const location = useLocation();
  const propertyType = location.state?.propertyType || "Hotels";
  return <StaysMain propertyType={propertyType} />;
}

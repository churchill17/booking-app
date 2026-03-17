import SuccessScreen from "./components/SuccessScreen.jsx";

export default function SuccessPage({ propertyName, onDashboard }) {
  return (
    <SuccessScreen propertyName={propertyName} onDashboard={onDashboard} />
  );
}

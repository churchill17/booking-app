import Header from "../../components/common/Header/Header.jsx";
import FlightsMain from "../../components/flights/FlightsMain/FlightsMain.jsx";
import FlightsFooter from "../../components/flights/FlightsFooter/FlightsFooter.jsx";
import "./Flights.css";

export default function Flights() {
  return (
    <div className="flights-page">
      <Header />
      <FlightsMain />
      <FlightsFooter />
    </div>
  );
}

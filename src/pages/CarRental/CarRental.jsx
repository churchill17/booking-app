import Header from "../../components/common/Header/Header";
import Footer from "../../components/common/Footer/Footer";
import CarRentalMain from "../../components/carRental/CarRentalMain";
import "./CarRental.css";

export default function CarRental() {
  return (
    <div className="car-rental-page">
      <Header />
      <CarRentalMain />
      <Footer />
    </div>
  );
}

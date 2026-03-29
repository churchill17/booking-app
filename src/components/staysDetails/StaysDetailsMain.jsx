import { staysDetailsData } from "./staysDetailsData";
import StaysDetailsHeader from "./StaysDetailsHeader";
import PhotoGallery from "./PhotoGallery";
import PropertyOverview from "./PropertyOverview";
import AvailabilityTable from "./AvailabilityTable";
import GuestReviews from "./GuestReviews";
import FacilitiesSection from "./FacilitiesSection";
import HouseRules from "./HouseRules";
import HotelSurroundings from "./HotelSurroundings";
import StaysDetailsFAQ from "./StaysDetailsFAQ";
import "./StaysDetailsMain.css"; 
import Header from "../common/Header/Header";

import Footer from "../common/Footer/Footer"

const StaysDetailsMain = () => {
  return (
    <div className="stays-details-main"> 
      <Header />
      <StaysDetailsHeader data={staysDetailsData} />

      <PhotoGallery images={staysDetailsData.images} />

      <section id="overview">
        <PropertyOverview
          description={staysDetailsData.description}
          highlights={staysDetailsData.highlights}
          popularFacilities={staysDetailsData.popularFacilities}
          coupleLocationScore={staysDetailsData.coupleLocationScore}
        />
      </section>

      <section id="info-prices">
        <AvailabilityTable rooms={staysDetailsData.rooms} />
      </section>

      <section id="guest-reviews">
        <GuestReviews guestReviews={staysDetailsData.guestReviews} />
      </section>

      <section id="facilities">
        <FacilitiesSection facilities={staysDetailsData.facilities} />
      </section>

      <section id="house-rules">
        <HouseRules houseRules={staysDetailsData.houseRules} />
      </section>

      <section id="important-legal">
        <div style={{background:'#fff',padding:'2rem',borderRadius:'16px',margin:'2rem 0',color:'#333'}}>
          <h2>Important & Legal</h2>
          <p>All important and legal information about this property will be displayed here.</p>
        </div>
      </section>

      <HotelSurroundings surroundings={staysDetailsData.surroundings} />

      <StaysDetailsFAQ faqs={staysDetailsData.faqs} /> 

      <Footer />
    </div>
  );
};

export default StaysDetailsMain;

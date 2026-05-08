import { useState } from "react";
import GalleryModal from "./GalleryModal";
import "./PhotoGallery.css";

const placeholderColors = [
  "#2a3d52", "#1e4a3f", "#3d3530", "#2e4238", "#1a3048", "#3a3020", "#253545",
];

const PhotoGallery = ({ images, propertyName, rooms = [], onReserve }) => {
  const [modalOpen, setModalOpen] = useState(false);

  const open  = () => setModalOpen(true);
  const close = () => setModalOpen(false);

  const mainImg   = images[0];
  const sideImgs  = images.slice(1, 3);
  const thumbImgs = images.slice(3, 7);

  return (
    <section className="photo-gallery">
      <div className="photo-gallery__main-grid">
        <div
          className="photo-gallery__primary"
          style={{
            background: mainImg?.src ? "none" : placeholderColors[0],
            backgroundImage: mainImg?.src ? `url(${mainImg.src})` : "none",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
          onClick={open}
        >
          {!mainImg?.src && <span className="photo-gallery__emoji">{mainImg?.placeholder}</span>}
          <div className="photo-gallery__overlay"><span>View photos</span></div>
        </div>

        <div className="photo-gallery__side">
          {sideImgs.map((img, i) => (
            <div
              key={i}
              className="photo-gallery__side-img"
              style={{
                background: img?.src ? "none" : placeholderColors[i + 1],
                backgroundImage: img?.src ? `url(${img.src})` : "none",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
              onClick={open}
            >
              {!img?.src && <span className="photo-gallery__emoji">{img?.placeholder}</span>}
            </div>
          ))}
        </div>
      </div>

      <div className="photo-gallery__thumbs">
        {thumbImgs.map((img, i) => (
          <div
            key={i}
            className={`photo-gallery__thumb ${i === thumbImgs.length - 1 ? "photo-gallery__thumb--more" : ""}`}
            style={{
              background: img?.src ? "none" : placeholderColors[i + 3],
              backgroundImage: img?.src ? `url(${img.src})` : "none",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
            onClick={open}
          >
            {!img?.src && <span className="photo-gallery__emoji">{img?.placeholder}</span>}
            {i === thumbImgs.length - 1 && (
              <div className="photo-gallery__more-overlay">
                +{Math.max(0, images.length - 7)} photos
              </div>
            )}
          </div>
        ))}
      </div>

      <GalleryModal
        open={modalOpen}
        onClose={close}
        propertyName={propertyName}
        images={images}
        rooms={rooms}
        onReserve={() => {
          close();
          if (onReserve) {
            onReserve();
          } else {
            const el = document.getElementById("info-prices");
            if (el) el.scrollIntoView({ behavior: "smooth" });
          }
        }}
      />
    </section>
  );
};

export default PhotoGallery;

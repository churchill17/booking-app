import { useState, useEffect } from "react";
import "./GalleryModal.css";

export default function GalleryModal({ open, onClose, propertyName, images = [], rooms = [], onReserve }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [activeRoom, setActiveRoom] = useState(null);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      setActiveTab("overview");
      setActiveRoom(null);
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  useEffect(() => {
    const handleKey = (e) => { if (e.key === "Escape") onClose(); };
    if (open) window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  if (!open) return null;

  const getRoomImg = (index) => {
    const img = images[index % Math.max(images.length, 1)];
    return img?.src || "";
  };

  const openRoom = (room, index) => {
    setActiveRoom({ ...room, coverImg: getRoomImg(index) });
    setActiveTab(`room-${room.id ?? index}`);
  };

  const backToOverview = () => {
    setActiveRoom(null);
    setActiveTab("overview");
  };

  return (
    <div className="gm-overlay" onClick={onClose}>
      <div className="gm-container" onClick={(e) => e.stopPropagation()}>

        {/* ── Header ── */}
        <div className="gm-header">
          <button className="gm-close" onClick={onClose} aria-label="Close">✕</button>
          <h2 className="gm-property-name">{propertyName}</h2>
          <button className="gm-reserve-btn" onClick={onReserve}>
            Reserve Now →
          </button>
        </div>

        {/* ── Tab bar ── */}
        <div className="gm-tabs">
          <button
            className={`gm-tab${activeTab === "overview" ? " gm-tab--active" : ""}`}
            onClick={backToOverview}
          >
            Overview
          </button>
          {rooms.map((room, i) => (
            <button
              key={room.id ?? i}
              className={`gm-tab${activeTab === `room-${room.id ?? i}` ? " gm-tab--active" : ""}`}
              onClick={() => openRoom(room, i)}
            >
              {room.name}
            </button>
          ))}
        </div>

        {/* ── Body ── */}
        <div className="gm-body">

          {/* Overview */}
          {activeTab === "overview" && (
            <div className="gm-overview">
              {images.length > 0 && (
                <div className="gm-section">
                  <h3 className="gm-section-title">All Photos</h3>
                  <div className="gm-photos-grid">
                    {images.map((img, i) => (
                      <div key={i} className="gm-photo-item">
                        {img.src
                          ? <img src={img.src} alt={img.alt || propertyName} className="gm-photo" />
                          : <div className="gm-placeholder">🏨</div>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {rooms.length > 0 && (
                <div className="gm-section">
                  <h3 className="gm-section-title">Rooms</h3>
                  <div className="gm-rooms-grid">
                    {rooms.map((room, i) => (
                      <div key={room.id ?? i} className="gm-room-card" onClick={() => openRoom(room, i)}>
                        <div className="gm-room-card-img">
                          {getRoomImg(i)
                            ? <img src={getRoomImg(i)} alt={room.name} />
                            : <div className="gm-placeholder">🛏</div>}
                          <div className="gm-room-card-overlay">View room</div>
                        </div>
                        <div className="gm-room-card-name">{room.name}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Individual room */}
          {activeTab !== "overview" && activeRoom && (
            <div className="gm-room-detail">
              <button className="gm-back-btn" onClick={backToOverview}>
                ← Back to overview
              </button>
              <div className="gm-room-detail-inner">
                <div className="gm-room-detail-img">
                  {activeRoom.coverImg
                    ? <img src={activeRoom.coverImg} alt={activeRoom.name} />
                    : <div className="gm-placeholder gm-placeholder--lg">🛏</div>}
                </div>
                <div className="gm-room-detail-info">
                  <h3 className="gm-room-detail-name">{activeRoom.name}</h3>

                  <div className="gm-room-meta">
                    {activeRoom.bedType && <span>🛏 {activeRoom.bedType}</span>}
                    {activeRoom.size    && <span>📐 {activeRoom.size}</span>}
                    {activeRoom.guests > 0 && (
                      <span>👤 Up to {activeRoom.guests} guest{activeRoom.guests !== 1 ? "s" : ""}</span>
                    )}
                  </div>

                  {Array.isArray(activeRoom.features) && activeRoom.features.length > 0 && (
                    <div className="gm-detail-block">
                      <p className="gm-detail-label">Features</p>
                      <div className="gm-tags">
                        {activeRoom.features.map((f, i) => <span key={i} className="gm-tag">{f}</span>)}
                      </div>
                    </div>
                  )}

                  {Array.isArray(activeRoom.amenities) && activeRoom.amenities.length > 0 && (
                    <div className="gm-detail-block">
                      <p className="gm-detail-label">Amenities</p>
                      <div className="gm-tags">
                        {activeRoom.amenities.map((a, i) => <span key={i} className="gm-tag">{a}</span>)}
                      </div>
                    </div>
                  )}

                  {(activeRoom.currentPrice || activeRoom.originalPrice) && (
                    <div className="gm-room-price">
                      {activeRoom.originalPrice && activeRoom.originalPrice !== activeRoom.currentPrice && (
                        <span className="gm-price-strike">{activeRoom.originalPrice}</span>
                      )}
                      <span className="gm-price-current">{activeRoom.currentPrice || activeRoom.originalPrice}</span>
                      <span className="gm-price-per"> / night</span>
                    </div>
                  )}

                  <button className="gm-room-reserve-btn" onClick={onReserve}>
                    Reserve this room →
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

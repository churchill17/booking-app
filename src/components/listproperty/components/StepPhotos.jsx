import { useRef, useState } from "react";
import { C } from "../ui.constants.js";
import { Card, StepHeading, InfoBox } from "../ui.jsx";
import "./StepPhotos.css";

export function StepPhotos({ data, set }) {
  const fileInputRef = useRef(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const photos = Array.isArray(data.photos) ? data.photos : [];
  const normalizedPhotos = photos.map((item) =>
    typeof item === "string" ? { src: item } : item,
  );

  const fileToDataUrl = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result || ""));
      reader.onerror = () => reject(new Error("Failed to read file."));
      reader.readAsDataURL(file);
    });

  const handleFiles = async (fileList) => {
    const incoming = Array.from(fileList || []);
    if (!incoming.length) return;

    setUploadError("");

    const valid = [];
    for (const file of incoming) {
      const isSupported = ["image/jpeg", "image/png"].includes(file.type);
      if (!isSupported) {
        setUploadError("Only JPG/JPEG and PNG files are allowed.");
        continue;
      }

      const isTooLarge = file.size > 47 * 1024 * 1024;
      if (isTooLarge) {
        setUploadError("Each photo must be 47 MB or smaller.");
        continue;
      }

      valid.push(file);
    }

    if (!valid.length) return;

    try {
      const mapped = await Promise.all(
        valid.map(async (file) => ({
          src: await fileToDataUrl(file),
          name: file.name,
        })),
      );

      set("photos", [...normalizedPhotos, ...mapped]);
    } catch {
      setUploadError("Could not process selected photos. Please try again.");
    }
  };

  const handleDrop = async (event) => {
    event.preventDefault();
    setIsDragActive(false);
    await handleFiles(event.dataTransfer?.files);
  };

  const handleFileChange = async (event) => {
    await handleFiles(event.target.files);
    event.target.value = "";
  };

  return (
    <div className="animate-in">
      <StepHeading
        title="What does your place look like?"
        subtitle="Upload at least 5 photos. The more you upload, the more bookings you'll get."
      />
      <Card>
        <div
          onDragOver={(event) => {
            event.preventDefault();
            setIsDragActive(true);
          }}
          onDragLeave={(event) => {
            event.preventDefault();
            setIsDragActive(false);
          }}
          onDrop={handleDrop}
          style={{
            border: `2px dashed ${isDragActive ? C.teal : C.border}`,
            borderRadius: 10,
            padding: "36px 20px",
            textAlign: "center",
            marginBottom: 20,
            cursor: "pointer",
            background: "#f7f5f2",
          }}
        >
          <p
            style={{ fontWeight: 600, color: C.midnightBlue, marginBottom: 6 }}
          >
            Drag and drop or
          </p>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            style={{
              border: `1.5px solid ${C.teal}`,
              color: C.teal,
              background: "none",
              borderRadius: 8,
              padding: "9px 22px",
              fontWeight: 700,
              cursor: "pointer",
              fontSize: 14,
              fontFamily: "inherit",
            }}
          >
            Upload photos
          </button>
          <p style={{ color: C.warmGray, fontSize: 12, marginTop: 8 }}>
            jpg/jpeg or png, max 47 MB each
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png"
            multiple
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
          {uploadError ? (
            <p style={{ color: "#b42318", fontSize: 13, marginTop: 8 }}>
              {uploadError}
            </p>
          ) : null}
        </div>

        {normalizedPhotos.length > 0 && (
          <div className="lp-step-photos__grid">
            {normalizedPhotos.map((photo, i) => (
              <div
                key={i}
                style={{
                  position: "relative",
                  borderRadius: 10,
                  overflow: "hidden",
                  border: i === 0 ? `3px solid ${C.teal}` : "none",
                }}
              >
                {i === 0 && (
                  <div
                    style={{
                      position: "absolute",
                      top: 8,
                      left: 8,
                      background: "#e67e22",
                      color: C.white,
                      fontSize: 11,
                      fontWeight: 700,
                      padding: "3px 9px",
                      borderRadius: 4,
                      zIndex: 2,
                    }}
                  >
                    Main photo
                  </div>
                )}
                <img
                  className="lp-step-photos__image"
                  src={photo.src}
                  alt=""
                  style={{
                    width: "100%",
                    height: 140,
                    objectFit: "cover",
                    display: "block",
                  }}
                />
                <button
                  onClick={() =>
                    set(
                      "photos",
                      normalizedPhotos.filter((_, j) => j !== i),
                    )
                  }
                  style={{
                    position: "absolute",
                    top: 8,
                    right: 8,
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
                    background: C.white,
                    border: "none",
                    cursor: "pointer",
                    fontSize: 16,
                    boxShadow: "0 1px 4px rgba(0,0,0,.25)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "inherit",
                  }}
                >
                  x
                </button>
              </div>
            ))}
          </div>
        )}
      </Card>
      <InfoBox>
        No professional photos? No problem - a smartphone works great! Choose a
        main photo that makes a strong first impression.
      </InfoBox>
    </div>
  );
}

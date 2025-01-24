import React from "react";

interface CustomPopupProps {
  job: {
    id: string;
    title: string;
    category: { name: string };
    rate?: number;
    payment_type?: string;
    date?: string;
    description?: string;
    position: {
      longitude: string;
      latitude: string;
    };
    // Add other job-related fields as needed
  };
  position: { x: number; y: number };
  onClose: () => void;
}

const CustomPopup: React.FC<CustomPopupProps> = ({ job, position, onClose }) => {
  return (
    <div
      style={{
        position: "absolute",
        left: position.x,
        top: position.y,
        transform: "translate(-50%, -100%)", // Center the popup
        backgroundColor: "white",
        borderRadius: "8px",
        boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
        padding: "16px",
        maxWidth: "300px",
        zIndex: 1000,
        pointerEvents: "auto", // Ensure the popup can receive pointer events
      }}
    >
      <button
        onClick={onClose}
        style={{
          position: "absolute",
          top: "8px",
          right: "8px",
          background: "transparent",
          border: "none",
          cursor: "pointer",
          fontSize: "16px",
        }}
        aria-label="Close popup"
      >
        ✕
      </button>
      <h3 style={{ margin: 0, fontSize: "18px", fontWeight: "bold" }}>
        {job.title}
      </h3>
      <p style={{ color: "#555", fontSize: "14px", margin: "8px 0" }}>
        {job.category.name}
      </p>
      <div style={{ fontSize: "14px", lineHeight: "1.5" }}>
        <div>
          <strong>Rate:</strong> {job.rate ? `${job.rate} NOK` : "N/A"}
        </div>
        <div>
          <strong>Payment Type:</strong> {job.payment_type || "N/A"}
        </div>
        <div>
          <strong>Date:</strong>{" "}
          {job.date ? new Date(job.date).toLocaleDateString() : "N/A"}
        </div>
      </div>
      {job.description && (
        <p style={{ marginTop: "12px", fontSize: "14px" }}>
          {job.description}
        </p>
      )}
    </div>
  );
};

export default CustomPopup;

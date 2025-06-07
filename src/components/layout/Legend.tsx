import React from "react";

export const Legend = () => {
  return (
    <div className="legend">
      <h3 className="section-title">
        <i className="fas fa-book"></i> Takvim Rehberi
      </h3>
      <div className="legend-items">
        {[
          { color: "#1d4ed8", label: "Sulama Günü" },
          { color: "#166534", label: "Sulandı" },
          { color: "#0c4a6e", border: "2px solid #0ea5e9", label: "Bugün" },
          {
            color: "#0c4a6e",
            border: "2px solid #0ea5e9",
            label: "Seçili Bitki",
          },
          { color: "#92400e", label: "Yaklaşan Sulama" },
        ].map(({ color, border, label }) => (
          <div key={label} className="legend-item">
            <div
              className="legend-color"
              style={{ background: color, border }}
            ></div>
            <span>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

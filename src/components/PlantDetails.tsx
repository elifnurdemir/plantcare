import type { Plant } from "../types/Types";

export const PlantDetails: React.FC<{ plant: Plant }> = ({ plant }) => (
  <div className="plant-details">
    <h3>{plant.commonName}</h3>
    <p style={{ fontStyle: "italic", color: "#94a3b8", marginBottom: "20px" }}>
      {plant.name}
    </p>

    {plant.image && (
      <img src={plant.image} alt={plant.commonName} className="plant-image" />
    )}

    <div className="care-conditions">
      <h4>🌞 Bakım Koşulları</h4>
      {Object.entries(plant.care).map(([key, value]) => (
        <div key={key} className="care-item">
          <strong>
            {key === "light"
              ? "Işık"
              : key === "temperature"
              ? "Sıcaklık"
              : key === "humidity"
              ? "Nem"
              : "Toprak"}
            :
          </strong>{" "}
          {value}
        </div>
      ))}
    </div>

    <div className="tips-section">
      <h4>⚠️ Sulama İpuçları</h4>
      <ul className="tips-list">
        {plant.tips.map((tip, index) => (
          <li key={index}>
            <span className="tip-bullet">•</span>
            <span>{tip}</span>
          </li>
        ))}
      </ul>
    </div>

    <button
      className="add-plant-btn"
      onClick={() => alert("Bitki sulama programı düzenlenecek")}
    >
      <i className="fas fa-edit"></i> Sulama Programını Düzenle
    </button>
  </div>
);

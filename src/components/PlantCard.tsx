import type { Plant } from "../types/Types";

export const PlantCard: React.FC<{
  plant: Plant;
  isSelected: boolean;
  onSelect: (id: number) => void;
}> = ({ plant, isSelected, onSelect }) => {
  const difficultyClass = `difficulty-${plant.difficulty.replace(" ", "-")}`;
  const wateringFrequency =
    plant.wateringInterval <= 5
      ? "Sık"
      : plant.wateringInterval <= 12
      ? "Orta"
      : "Nadir";

  return (
    <div
      className={`plant-card ${isSelected ? "selected" : ""}`}
      onClick={() => onSelect(plant.id)}
    >
      <div className="plant-card-header">
        <div className="plant-common-name">{plant.commonName}</div>
        <span className={`difficulty-badge ${difficultyClass}`}>
          {plant.difficulty}
        </span>
      </div>
      <div className="plant-scientific">{plant.name}</div>
      <div className="plant-info">
        <span>⏰ {plant.wateringInterval} gün</span>
        <span>💧 {wateringFrequency}</span>
      </div>
    </div>
  );
};

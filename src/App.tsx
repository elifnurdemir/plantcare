import React, { useState, useMemo, useCallback } from "react";
import "./App.css";
import type { Plant } from "./types/Types.tsx";
import { AddPlantModal } from "./components/AppPlantModal.tsx";
import { PlantCard } from "./components/PlantCard.tsx";
import { PlantDetails } from "./components/PlantDetails.tsx";
import { INITIAL_PLANTS } from "./types/InitialPlants.tsx";
import { getDateKey, isWateringDay } from "./utils/Utilities.tsx";
import { Header } from "./components/layout/Header.tsx";
import { Legend } from "./components/layout/Legend.tsx";
import { Calendar } from "./components/calendar/Calendar.tsx";

const App: React.FC = () => {
  const [plants, setPlants] = useState<Plant[]>(INITIAL_PLANTS);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date(2025, 5));
  const [selectedPlantId, setSelectedPlantId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [wateringHistory, setWateringHistory] = useState<
    Record<string, boolean>
  >({});
  const [showAddPlantModal, setShowAddPlantModal] = useState<boolean>(false);

  // Memoized values
  const filteredPlants = useMemo(
    () =>
      plants.filter(
        (plant) =>
          plant.commonName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          plant.name.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [plants, searchTerm]
  );

  const selectedPlant = useMemo(
    () => plants.find((p) => p.id === selectedPlantId),
    [plants, selectedPlantId]
  );

  const today = useMemo(() => new Date(), []);

  const stats = useMemo(() => {
    const todaySchedules = plants.filter((plant) =>
      isWateringDay(today, plant)
    ).length;
    const pendingWatering = plants.filter(
      (plant) =>
        isWateringDay(today, plant) &&
        !wateringHistory[getDateKey(today, plant.id)]
    ).length;

    return {
      totalPlants: plants.length,
      todaySchedules,
      pendingWatering,
      monthlyWatering: 12, // This could be calculated based on current month
    };
  }, [plants, today, wateringHistory]);

  // Callbacks
  const toggleWatering = useCallback((date: Date, plantId: number) => {
    const dateKey = getDateKey(date, plantId);
    setWateringHistory((prev) => ({
      ...prev,
      [dateKey]: !prev[dateKey],
    }));
  }, []);

  const changeMonth = useCallback((direction: number) => {
    setCurrentMonth((prev) => {
      const newMonth = new Date(prev);
      newMonth.setMonth(newMonth.getMonth() + direction);
      return newMonth;
    });
  }, []);

  const goToToday = useCallback(() => {
    setCurrentMonth(new Date());
  }, []);

  const selectPlant = useCallback((id: number) => {
    setSelectedPlantId((prev) => (prev === id ? null : id));
  }, []);

  const addNewPlant = useCallback(
    (newPlant: Omit<Plant, "id">) => {
      const id = Math.max(...plants.map((p) => p.id)) + 1;
      setPlants((prev) => [...prev, { ...newPlant, id }]);
      setShowAddPlantModal(false);
    },
    [plants]
  );

  return (
    <div className={`app ${isDarkMode ? "dark-theme" : "light-theme"}`}>
      <div className="container">
        <Header
          stats={stats}
          isDarkMode={isDarkMode}
          onToggleTheme={() => setIsDarkMode(!isDarkMode)}
        />
        <div className="main-content">
          <div className="calendar-section">
            <div className="calendar-header">
              <button className="nav-btn" onClick={() => changeMonth(-1)}>
                <i className="fas fa-chevron-left"></i> Önceki Ay
              </button>
              <div className="month-title">
                {currentMonth.toLocaleDateString("tr-TR", {
                  month: "long",
                  year: "numeric",
                })}
              </div>
              <button className="nav-btn" onClick={() => changeMonth(1)}>
                Sonraki Ay <i className="fas fa-chevron-right"></i>
              </button>
              <button className="nav-btn" onClick={goToToday}>
                <i className="fas fa-calendar-day"></i> Bugüne Git
              </button>
            </div>

            <div className="calendar-grid">
              <Calendar
                currentMonth={currentMonth}
                today={today}
                plants={plants}
                wateringHistory={wateringHistory}
                toggleWatering={toggleWatering}
              />
            </div>
          </div>

          <div className="sidebar">
            <div className="plants-section">
              <h3 className="section-title">
                <i className="fas fa-leaf"></i> Bitki Bilgileri
              </h3>

              <div className="plant-search">
                <i className="fas fa-search"></i>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Bitki ara..."
                  style={{
                    width: "100%",
                    maxWidth: "100%",
                    padding: "0.5rem",
                    boxSizing: "border-box",
                    borderRadius: "8px",
                    border: "1px solid #ccc",
                  }}
                />
              </div>

              <div id="plantsList">
                {filteredPlants.map((plant) => (
                  <PlantCard
                    key={plant.id}
                    plant={plant}
                    isSelected={selectedPlantId === plant.id}
                    onSelect={selectPlant}
                  />
                ))}
              </div>

              <button
                className="add-plant-btn"
                onClick={() => setShowAddPlantModal(true)}
              >
                <i className="fas fa-plus"></i> Yeni Bitki Ekle
              </button>
            </div>

            {selectedPlant && (
              <div className="selected-plant">
                <h3 className="section-title">
                  <i className="fas fa-info-circle"></i> Bitki Detayları
                </h3>
                <PlantDetails plant={selectedPlant} />
              </div>
            )}
          </div>
        </div>

        <Legend />
      </div>

      {showAddPlantModal && (
        <AddPlantModal
          onClose={() => setShowAddPlantModal(false)}
          onAdd={addNewPlant}
        />
      )}
    </div>
  );
};

export default App;

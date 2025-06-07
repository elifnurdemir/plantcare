// components/Calendar.tsx
import React, { type JSX } from "react";
import { DAY_HEADERS } from "../../types/InitialPlants";
import type { Plant } from "../../types/Types";
import { isWateringDay, getDateKey } from "../../utils/Utilities";

type CalendarProps = {
  currentMonth: Date;
  today: Date;
  plants: Plant[];
  wateringHistory: Record<string, boolean>;
  toggleWatering: (date: Date, plantId: number) => void;
};

export const Calendar: React.FC<CalendarProps> = ({
  currentMonth,
  today,
  plants,
  wateringHistory,
  toggleWatering,
}) => {
  const firstDay = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    1
  ).getDay();

  const daysInMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0
  ).getDate();

  const days: JSX.Element[] = [];

  // Gün başlıkları
  DAY_HEADERS.forEach((day) => {
    days.push(
      <div key={`header-${day}`} className="day-header">
        {day}
      </div>
    );
  });

  // Boş hücreler
  for (let i = 0; i < firstDay; i++) {
    days.push(<div key={`empty-${i}`} className="day-cell" />);
  }

  // Ay günleri
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day
    );
    const isToday = date.toDateString() === today.toDateString();
    const wateringPlants = plants.filter((plant) => isWateringDay(date, plant));

    days.push(
      <div key={`day-${day}`} className={`day-cell ${isToday ? "today" : ""}`}>
        <div className="day-number">{day}</div>
        <div className="day-events">
          {wateringPlants.map((plant) => {
            const watered = wateringHistory[getDateKey(date, plant.id)];
            return (
              <div
                key={`plant-${plant.id}-${day}`}
                className={`plant-item ${watered ? "watered" : ""}`}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleWatering(date, plant.id);
                }}
              >
                <span className="plant-name">{plant.commonName}</span>
                <span className="icon">{watered ? "✓" : "💧"}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return <>{days}</>;
};

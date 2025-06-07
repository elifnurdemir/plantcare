import { START_DATE } from "../types/InitialPlants";
import type { Plant } from "../types/Types";

// Utility functions
export const getDateKey = (date: Date, plantId: number) =>
  `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}-${plantId}`;

export const isWateringDay = (date: Date, plant: Plant): boolean => {
  const daysDiff = Math.floor(
    (date.getTime() - START_DATE.getTime()) / (1000 * 60 * 60 * 24)
  );
  return daysDiff >= 0 && daysDiff % plant.wateringInterval === 0;
};

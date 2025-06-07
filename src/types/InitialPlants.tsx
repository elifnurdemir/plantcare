import type { Plant } from "./Types";

export const INITIAL_PLANTS: Plant[] = [
  {
    id: 1,
    name: "Opuntia microdasys",
    commonName: "Tavşan Kulağı Kaktüsü",
    wateringInterval: 14,
    difficulty: "kolay",
    tips: [
      "Çok az su ile sulanmalı",
      "Toprak tamamen kuruduktan sonra sulayın",
      "Kışın ayda 1 kez yeterli",
      "Dikenlerine dikkat edin",
    ],
    care: {
      light: "Bol güneş ışığı",
      temperature: "18-24°C",
      humidity: "Düşük nem",
      soil: "Kaktüs toprağı",
    },
    image: "https://images.unsplash.com/photo-1564466809057-1c2e0f5fdc8d?w=400",
  },
];

export const DAY_HEADERS = ["Paz", "Pzt", "Sal", "Çar", "Per", "Cum", "Cmt"];
export const START_DATE = new Date(2025, 5, 6); // June 6, 2025

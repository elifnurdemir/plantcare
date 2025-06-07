export type Difficulty = 'çok kolay' | 'kolay' | 'orta' | 'zor';
export type Plant = {
  id: number;
  name: string;
  commonName: string;
  wateringInterval: number;
  difficulty: Difficulty;
  tips: string[];
  care: {
    light: string;
    temperature: string;
    humidity: string;
    soil: string;
  };
  image?: string;
};

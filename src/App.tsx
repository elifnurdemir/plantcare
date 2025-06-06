// App.tsx
import React, { useState, useEffect } from 'react';
import './App.css';

// Type definitions
type Difficulty = 'çok kolay' | 'kolay' | 'orta' | 'zor';
type CareConditions = {
  light: string;
  temperature: string;
  humidity: string;
  soil: string;
};

type Plant = {
  id: number;
  name: string;
  commonName: string;
  wateringInterval: number;
  difficulty: Difficulty;
  tips: string[];
  care: CareConditions;
  image?: string;
};

type WateringHistory = {
  [key: string]: boolean;
};

// Plant data
const initialPlants: Plant[] = [
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
      "Dikenlerine dikkat edin"
    ],
    care: {
      light: "Bol güneş ışığı",
      temperature: "18-24°C",
      humidity: "Düşük nem",
      soil: "Kaktüs toprağı"
    },
    image: "https://images.unsplash.com/photo-1564466809057-1c2e0f5fdc8d?w=400"
  },
  // Other plants...
];

const App: React.FC = () => {
  const [plants] = useState<Plant[]>(initialPlants);
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date(2025, 5));
  const [selectedPlantId, setSelectedPlantId] = useState<number | null>(null);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [wateringHistory, setWateringHistory] = useState<WateringHistory>({});

  useEffect(() => {
    // Load watering history from localStorage
    const savedHistory = localStorage.getItem('plantWateringHistory');
    if (savedHistory) {
      setWateringHistory(JSON.parse(savedHistory));
    }
  }, []);

  useEffect(() => {
    // Save watering history to localStorage
    localStorage.setItem('plantWateringHistory', JSON.stringify(wateringHistory));
  }, [wateringHistory]);

  // Get filtered plants based on search term
  const filteredPlants = plants.filter(plant => 
    plant.commonName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    plant.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

    // Watering functions
  const isWateringDay = (date: Date, plant: Plant): boolean => {
    const startDate = new Date(2025, 5, 6); // June 6, 2025
    const daysDiff = Math.floor((date.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    return daysDiff >= 0 && daysDiff % plant.wateringInterval === 0;
  };

  const isWatered = (date: Date, plantId: number): boolean => {
    const dateKey = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}-${plantId}`;
    return wateringHistory[dateKey] || false;
  };
  
  // Calculate statistics
  const totalPlants = plants.length;
  const todaySchedules = plants.filter(plant => 
    isWateringDay(new Date(), plant)
  ).length;
  const pendingWatering = plants.filter(plant => 
    isWateringDay(new Date(), plant) && !isWatered(new Date(), plant.id)
  ).length;



  const toggleWatering = (date: Date, plantId: number) => {
    const dateKey = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}-${plantId}`;
    setWateringHistory(prev => ({
      ...prev,
      [dateKey]: !prev[dateKey]
    }));
  };

  // Calendar functions
  const changeMonth = (direction: number) => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(newMonth.getMonth() + direction);
    setCurrentMonth(newMonth);
  };

  const goToToday = () => {
    setCurrentMonth(new Date());
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const selectPlant = (id: number) => {
    setSelectedPlantId(selectedPlantId === id ? null : id);
  };

  const renderCalendar = () => {
    const firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();
    const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
    const today = new Date();
    
    const dayHeaders = ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'];
    
    const days = [];
    
    // Add day headers
    dayHeaders.forEach(day => {
      days.push(
        <div key={`header-${day}`} className="day-header">
          {day}
        </div>
      );
    });
    
    // Add empty cells for days before the first day
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="day-cell" />);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      const isToday = date.toDateString() === today.toDateString();
      
      // Find plants that need watering on this day
      const wateringPlants = plants.filter(plant => isWateringDay(date, plant));
      
      days.push(
        <div 
          key={`day-${day}`} 
          className={`day-cell ${isToday ? 'today' : ''}`}
        >
          <div className="day-number">{day}</div>
          <div className="day-events">
            {wateringPlants.map(plant => {
              const watered = isWatered(date, plant.id);
              return (
                <div 
                  key={`plant-${plant.id}-${day}`}
                  className={`plant-item ${watered ? 'watered' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleWatering(date, plant.id);
                  }}
                >
                  <span className="plant-name">{plant.commonName}</span>
                  <span className="icon">{watered ? '✓' : '💧'}</span>
                </div>
              );
            })}
          </div>
        </div>
      );
    }
    
    return days;
  };

  return (
    <div className={`app ${isDarkMode ? 'dark-theme' : 'light-theme'}`}>
      <div className="container">
        <div className="save-notice">
          <i className="fas fa-save"></i>
          Bu dosyayı bilgisayarınıza kaydedin! Sulama işaretleriniz artık kalıcı olarak saklanacak.
        </div>
        
        <div className="header">
          <button className="theme-toggle" onClick={toggleTheme}>
            <i className={isDarkMode ? "fas fa-moon" : "fas fa-sun"}></i>
          </button>
          <h1>
            <i className="fas fa-seedling"></i> Bitki Sulama Takvimi <i className="fas fa-tint"></i>
          </h1>
          <p>6 Haziran 2025'ten başlayarak özel sulama programınız</p>
          
          <div className="stats-bar">
            <div className="stat-card">
              <div className="stat-value">{totalPlants}</div>
              <div className="stat-label">Toplam Bitki</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">12</div>
              <div className="stat-label">Bu Ay Sulama</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{pendingWatering}</div>
              <div className="stat-label">Sulama Bekleyen</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{todaySchedules}</div>
              <div className="stat-label">Bugün Sulama</div>
            </div>
          </div>
        </div>

        <div className="main-content">
          <div className="calendar-section">
            <div className="calendar-header">
              <button className="nav-btn" onClick={() => changeMonth(-1)}>
                <i className="fas fa-chevron-left"></i> Önceki Ay
              </button>
              <div className="month-title">
                {currentMonth.toLocaleDateString('tr-TR', { 
                  month: 'long', 
                  year: 'numeric' 
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
              {renderCalendar()}
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
                />
              </div>
              
              <div id="plantsList">
                {filteredPlants.map(plant => {
                  const difficultyClass = `difficulty-${plant.difficulty.replace(' ', '-')}`;
                  return (
                    <div 
                      key={plant.id}
                      className={`plant-card ${selectedPlantId === plant.id ? 'selected' : ''}`}
                      onClick={() => selectPlant(plant.id)}
                    >
                      <div className="plant-card-header">
                        <div className="plant-common-name">{plant.commonName}</div>
                        <span className={`difficulty-badge ${difficultyClass}`}>{plant.difficulty}</span>
                      </div>
                      <div className="plant-scientific">{plant.name}</div>
                      <div className="plant-info">
                        <span>⏰ {plant.wateringInterval} gün</span>
                        <span>💧 {plant.wateringInterval <= 5 ? 'Sık' : plant.wateringInterval <= 12 ? 'Orta' : 'Nadir'}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              <button className="add-plant-btn" onClick={() => alert('Yeni bitki ekleme özelliği aktifleştirilecek')}>
                <i className="fas fa-plus"></i> Yeni Bitki Ekle
              </button>
            </div>

            {selectedPlantId && (
              <div className="selected-plant">
                <h3 className="section-title">
                  <i className="fas fa-info-circle"></i> Bitki Detayları
                </h3>
                <PlantDetails plant={plants.find(p => p.id === selectedPlantId)!} />
              </div>
            )}
          </div>
        </div>

        <div className="legend">
          <h3 className="section-title">
            <i className="fas fa-book"></i> Takvim Rehberi
          </h3>
          <div className="legend-items">
            <div className="legend-item">
              <div className="legend-color" style={{ background: '#1d4ed8' }}></div>
              <span>Sulama Günü</span>
            </div>
            <div className="legend-item">
              <div className="legend-color" style={{ background: '#166534' }}></div>
              <span>Sulandı</span>
            </div>
            <div className="legend-item">
              <div className="legend-color" style={{ background: '#0c4a6e', border: '2px solid #0ea5e9' }}></div>
              <span>Bugün</span>
            </div>
            <div className="legend-item">
              <div className="legend-color" style={{ background: '#0c4a6e', border: '2px solid #0ea5e9' }}></div>
              <span>Seçili Bitki</span>
            </div>
            <div className="legend-item">
              <div className="legend-color" style={{ background: '#92400e' }}></div>
              <span>Yaklaşan Sulama</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// PlantDetails component
const PlantDetails: React.FC<{ plant: Plant }> = ({ plant }) => {
  return (
    <div className="plant-details">
      <h3>{plant.commonName}</h3>
      <p style={{ fontStyle: 'italic', color: '#94a3b8', marginBottom: '20px' }}>{plant.name}</p>
      
      {plant.image && <img src={plant.image} alt={plant.commonName} className="plant-image" />}
      
      <div className="care-conditions">
        <h4>🌞 Bakım Koşulları</h4>
        <div className="care-item"><strong>Işık:</strong> {plant.care.light}</div>
        <div className="care-item"><strong>Sıcaklık:</strong> {plant.care.temperature}</div>
        <div className="care-item"><strong>Nem:</strong> {plant.care.humidity}</div>
        <div className="care-item"><strong>Toprak:</strong> {plant.care.soil}</div>
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
      
      <button className="add-plant-btn" onClick={() => alert('Bitki sulama programı düzenlenecek')}>
        <i className="fas fa-edit"></i> Sulama Programını Düzenle
      </button>
    </div>
  );
};

export default App;
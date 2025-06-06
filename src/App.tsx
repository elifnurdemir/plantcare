import React, { useState, useEffect, useMemo, useCallback } from 'react';

// Types
type Difficulty = 'çok kolay' | 'kolay' | 'orta' | 'zor';
type Plant = {
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

// Constants
const INITIAL_PLANTS: Plant[] = [
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
  
];

const DAY_HEADERS = ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'];
const START_DATE = new Date(2025, 5, 6); // June 6, 2025

// Utility functions
const getDateKey = (date: Date, plantId: number) => 
  `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}-${plantId}`;

const isWateringDay = (date: Date, plant: Plant): boolean => {
  const daysDiff = Math.floor((date.getTime() - START_DATE.getTime()) / (1000 * 60 * 60 * 24));
  return daysDiff >= 0 && daysDiff % plant.wateringInterval === 0;
};

// Components
const PlantDetails: React.FC<{ plant: Plant }> = ({ plant }) => (
  <div className="plant-details">
    <h3>{plant.commonName}</h3>
    <p style={{ fontStyle: 'italic', color: '#94a3b8', marginBottom: '20px' }}>{plant.name}</p>
    
    {plant.image && <img src={plant.image} alt={plant.commonName} className="plant-image" />}
    
    <div className="care-conditions">
      <h4>🌞 Bakım Koşulları</h4>
      {Object.entries(plant.care).map(([key, value]) => (
        <div key={key} className="care-item">
          <strong>{key === 'light' ? 'Işık' : key === 'temperature' ? 'Sıcaklık' : key === 'humidity' ? 'Nem' : 'Toprak'}:</strong> {value}
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
    
    <button className="add-plant-btn" onClick={() => alert('Bitki sulama programı düzenlenecek')}>
      <i className="fas fa-edit"></i> Sulama Programını Düzenle
    </button>
  </div>
);

const PlantCard: React.FC<{
  plant: Plant;
  isSelected: boolean;
  onSelect: (id: number) => void;
}> = ({ plant, isSelected, onSelect }) => {
  const difficultyClass = `difficulty-${plant.difficulty.replace(' ', '-')}`;
  const wateringFrequency = plant.wateringInterval <= 5 ? 'Sık' : plant.wateringInterval <= 12 ? 'Orta' : 'Nadir';
  
  return (
    <div 
      className={`plant-card ${isSelected ? 'selected' : ''}`}
      onClick={() => onSelect(plant.id)}
    >
      <div className="plant-card-header">
        <div className="plant-common-name">{plant.commonName}</div>
        <span className={`difficulty-badge ${difficultyClass}`}>{plant.difficulty}</span>
      </div>
      <div className="plant-scientific">{plant.name}</div>
      <div className="plant-info">
        <span>⏰ {plant.wateringInterval} gün</span>
        <span>💧 {wateringFrequency}</span>
      </div>
    </div>
  );
};

// Add Plant Modal Component
const AddPlantModal: React.FC<{
  onClose: () => void;
  onAdd: (plant: Omit<Plant, 'id'>) => void;
}> = ({ onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    name: '',
    commonName: '',
    wateringInterval: 7,
    difficulty: 'kolay' as Difficulty,
    tips: [''],
    care: {
      light: '',
      temperature: '',
      humidity: '',
      soil: ''
    },
    image: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.commonName) {
      onAdd({
        ...formData,
        tips: formData.tips.filter(tip => tip.trim() !== '')
      });
    }
  };

  const addTip = () => {
    setFormData(prev => ({
      ...prev,
      tips: [...prev.tips, '']
    }));
  };

  const updateTip = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      tips: prev.tips.map((tip, i) => i === index ? value : tip)
    }));
  };

  const removeTip = (index: number) => {
    setFormData(prev => ({
      ...prev,
      tips: prev.tips.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2><i className="fas fa-plus-circle"></i> Yeni Bitki Ekle</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <form onSubmit={handleSubmit} className="plant-form">
          <div className="form-row">
            <div className="form-group">
              <label>Bitki Adı (Türkçe) *</label>
              <input
                type="text"
                value={formData.commonName}
                onChange={(e) => setFormData(prev => ({ ...prev, commonName: e.target.value }))}
                placeholder="Örn: Monstera Deliciosa"
                required
              />
            </div>
            <div className="form-group">
              <label>Bilimsel Adı *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Örn: Monstera deliciosa"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Sulama Aralığı (Gün) *</label>
              <input
                type="number"
                min="1"
                max="365"
                value={formData.wateringInterval}
                onChange={(e) => setFormData(prev => ({ ...prev, wateringInterval: parseInt(e.target.value) }))}
                required
              />
            </div>
            <div className="form-group">
              <label>Zorluk Seviyesi</label>
              <select
                value={formData.difficulty}
                onChange={(e) => setFormData(prev => ({ ...prev, difficulty: e.target.value as Difficulty }))}
              >
                <option value="çok kolay">Çok Kolay</option>
                <option value="kolay">Kolay</option>
                <option value="orta">Orta</option>
                <option value="zor">Zor</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Fotoğraf URL (İsteğe bağlı)</label>
            <input
              type="url"
              value={formData.image}
              onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div className="care-section">
            <h3>Bakım Koşulları</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Işık İhtiyacı</label>
                <input
                  type="text"
                  value={formData.care.light}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    care: { ...prev.care, light: e.target.value }
                  }))}
                  placeholder="Örn: Parlak dolaylı ışık"
                />
              </div>
              <div className="form-group">
                <label>Sıcaklık</label>
                <input
                  type="text"
                  value={formData.care.temperature}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    care: { ...prev.care, temperature: e.target.value }
                  }))}
                  placeholder="Örn: 18-25°C"
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Nem Oranı</label>
                <input
                  type="text"
                  value={formData.care.humidity}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    care: { ...prev.care, humidity: e.target.value }
                  }))}
                  placeholder="Örn: Yüksek nem"
                />
              </div>
              <div className="form-group">
                <label>Toprak Türü</label>
                <input
                  type="text"
                  value={formData.care.soil}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    care: { ...prev.care, soil: e.target.value }
                  }))}
                  placeholder="Örn: İyi drene olan toprak"
                />
              </div>
            </div>
          </div>

          <div className="tips-section">
            <h3>Bakım İpuçları</h3>
            {formData.tips.map((tip, index) => (
              <div key={index} className="tip-input">
                <input
                  type="text"
                  value={tip}
                  onChange={(e) => updateTip(index, e.target.value)}
                  placeholder="Bakım ipucu yazın..."
                />
                {formData.tips.length > 1 && (
                  <button type="button" onClick={() => removeTip(index)} className="remove-tip">
                    <i className="fas fa-times"></i>
                  </button>
                )}
              </div>
            ))}
            <button type="button" onClick={addTip} className="add-tip-btn">
              <i className="fas fa-plus"></i> İpucu Ekle
            </button>
          </div>

          <div className="form-actions">
            <button type="button" onClick={onClose} className="cancel-btn">
              İptal
            </button>
            <button type="submit" className="submit-btn">
              <i className="fas fa-save"></i> Bitki Ekle
            </button>
          </div>
        </form>
      </div>
    </div>
)};

const StatCard: React.FC<{ value: number; label: string }> = ({ value, label }) => (
  <div className="stat-card">
    <div className="stat-value">{value}</div>
    <div className="stat-label">{label}</div>
  </div>
);

const App: React.FC = () => {
  const [plants, setPlants] = useState<Plant[]>(INITIAL_PLANTS);
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date(2025, 5));
  const [selectedPlantId, setSelectedPlantId] = useState<number | null>(null);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [wateringHistory, setWateringHistory] = useState<Record<string, boolean>>({});
  const [showAddPlantModal, setShowAddPlantModal] = useState<boolean>(false);

  // Memoized values
  const filteredPlants = useMemo(() => 
    plants.filter(plant => 
      plant.commonName.toLowerCase().includes(searchTerm.toLowerCase()) || 
      plant.name.toLowerCase().includes(searchTerm.toLowerCase())
    ), [plants, searchTerm]
  );

  const selectedPlant = useMemo(() => 
    plants.find(p => p.id === selectedPlantId), [plants, selectedPlantId]
  );

  const today = useMemo(() => new Date(), []);

  const stats = useMemo(() => {
    const todaySchedules = plants.filter(plant => isWateringDay(today, plant)).length;
    const pendingWatering = plants.filter(plant => 
      isWateringDay(today, plant) && !wateringHistory[getDateKey(today, plant.id)]
    ).length;
    
    return {
      totalPlants: plants.length,
      todaySchedules,
      pendingWatering,
      monthlyWatering: 12 // This could be calculated based on current month
    };
  }, [plants, today, wateringHistory]);

  // Callbacks
  const toggleWatering = useCallback((date: Date, plantId: number) => {
    const dateKey = getDateKey(date, plantId);
    setWateringHistory(prev => ({
      ...prev,
      [dateKey]: !prev[dateKey]
    }));
  }, []);

  const changeMonth = useCallback((direction: number) => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      newMonth.setMonth(newMonth.getMonth() + direction);
      return newMonth;
    });
  }, []);

  const goToToday = useCallback(() => {
    setCurrentMonth(new Date());
  }, []);

  const selectPlant = useCallback((id: number) => {
    setSelectedPlantId(prev => prev === id ? null : id);
  }, []);

  const addNewPlant = useCallback((newPlant: Omit<Plant, 'id'>) => {
    const id = Math.max(...plants.map(p => p.id)) + 1;
    setPlants(prev => [...prev, { ...newPlant, id }]);
    setShowAddPlantModal(false);
  }, [plants]);

  // Calendar rendering
  const renderCalendar = useCallback(() => {
    const firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();
    const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
    
    const days = [];
    
    // Day headers
    DAY_HEADERS.forEach(day => {
      days.push(
        <div key={`header-${day}`} className="day-header">
          {day}
        </div>
      );
    });
    
    // Empty cells
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="day-cell" />);
    }
    
    // Days of month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      const isToday = date.toDateString() === today.toDateString();
      const wateringPlants = plants.filter(plant => isWateringDay(date, plant));
      
      days.push(
        <div 
          key={`day-${day}`} 
          className={`day-cell ${isToday ? 'today' : ''}`}
        >
          <div className="day-number">{day}</div>
          <div className="day-events">
            {wateringPlants.map(plant => {
              const watered = wateringHistory[getDateKey(date, plant.id)];
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
  }, [currentMonth, today, plants, wateringHistory, toggleWatering]);

  return (
    <div className={`app ${isDarkMode ? 'dark-theme' : 'light-theme'}`}>
      <div className="container">
        <div className="header">
          <button className="theme-toggle" onClick={() => setIsDarkMode(!isDarkMode)}>
            <i className={isDarkMode ? "fas fa-moon" : "fas fa-sun"}></i>
          </button>
          <h1>
            <i className="fas fa-seedling"></i> Bitki Sulama Takvimi <i className="fas fa-tint"></i>
          </h1>
          <p>6 Haziran 2025'ten başlayarak özel sulama programınız</p>
          
          <div className="stats-bar">
            <StatCard value={stats.totalPlants} label="Toplam Bitki" />
            <StatCard value={stats.monthlyWatering} label="Bu Ay Sulama" />
            <StatCard value={stats.pendingWatering} label="Sulama Bekleyen" />
            <StatCard value={stats.todaySchedules} label="Bugün Sulama" />
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
                {filteredPlants.map(plant => (
                  <PlantCard
                    key={plant.id}
                    plant={plant}
                    isSelected={selectedPlantId === plant.id}
                    onSelect={selectPlant}
                  />
                ))}
              </div>
              
              <button className="add-plant-btn" onClick={() => setShowAddPlantModal(true)}>
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

        <div className="legend">
          <h3 className="section-title">
            <i className="fas fa-book"></i> Takvim Rehberi
          </h3>
          <div className="legend-items">
            {[
              { color: '#1d4ed8', label: 'Sulama Günü' },
              { color: '#166534', label: 'Sulandı' },
              { color: '#0c4a6e', border: '2px solid #0ea5e9', label: 'Bugün' },
              { color: '#0c4a6e', border: '2px solid #0ea5e9', label: 'Seçili Bitki' },
              { color: '#92400e', label: 'Yaklaşan Sulama' }
            ].map(({ color, border, label }) => (
              <div key={label} className="legend-item">
                <div className="legend-color" style={{ background: color, border }}></div>
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {showAddPlantModal && <AddPlantModal onClose={() => setShowAddPlantModal(false)} onAdd={addNewPlant} />}
      
      <style jsx>{`
        .app { 
          min-height: 100vh; 
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          transition: all 0.3s ease;
        }
        .dark-theme { 
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); 
          color: #e2e8f0; 
        }
        .light-theme { 
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%); 
          color: #1e293b; 
        }
        .container { 
          max-width: 1400px; 
          margin: 0 auto; 
          padding: 20px; 
        }
        .save-notice {
          background: #059669;
          color: white;
          padding: 12px 20px;
          border-radius: 8px;
          margin-bottom: 20px;
          text-align: center;
          font-weight: 500;
        }
        .header { 
          text-align: center; 
          margin-bottom: 30px; 
          position: relative;
        }
        .theme-toggle {
          position: absolute;
          top: 0;
          right: 0;
          background: none;
          border: 2px solid #64748b;
          color: inherit;
          padding: 8px 12px;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .theme-toggle:hover {
          background: #64748b;
          color: white;
        }
        .stats-bar { 
          display: grid; 
          grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); 
          gap: 15px; 
          margin-top: 20px; 
        }
        .stat-card { 
          background: rgba(255, 255, 255, 0.1); 
          padding: 15px; 
          border-radius: 8px; 
          text-align: center;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        .stat-value { 
          font-size: 24px; 
          font-weight: bold; 
          color: #10b981; 
        }
        .stat-label { 
          font-size: 12px; 
          opacity: 0.8; 
          margin-top: 5px; 
        }
        .main-content { 
          display: grid; 
          grid-template-columns: 1fr 350px; 
          gap: 30px; 
        }
        .calendar-section { 
          background: rgba(255, 255, 255, 0.1); 
          border-radius: 12px; 
          padding: 20px;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        .calendar-header { 
          display: flex; 
          justify-content: space-between; 
          align-items: center; 
          margin-bottom: 20px; 
          flex-wrap: wrap;
          gap: 10px;
        }
        .nav-btn { 
          background: #3b82f6; 
          color: white; 
          border: none; 
          padding: 8px 16px; 
          border-radius: 6px; 
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .nav-btn:hover { 
          background: #2563eb; 
          transform: translateY(-1px);
        }
        .month-title { 
          font-size: 20px; 
          font-weight: bold; 
          text-transform: capitalize;
        }
        .calendar-grid { 
          display: grid; 
          grid-template-columns: repeat(7, 1fr); 
          gap: 2px; 
        }
        .day-header { 
          background: #4f46e5; 
          color: white; 
          padding: 8px; 
          text-align: center; 
          font-weight: bold; 
          font-size: 12px;
        }
        .day-cell { 
          background: rgba(255, 255, 255, 0.05); 
          min-height: 80px; 
          padding: 4px; 
          border-radius: 4px;
          transition: all 0.3s ease;
        }
        .day-cell:hover {
          background: rgba(255, 255, 255, 0.1);
        }
        .day-cell.today { 
          border: 2px solid #0ea5e9; 
          background: rgba(14, 165, 233, 0.2);
        }
        .day-number { 
          font-size: 12px; 
          font-weight: bold; 
          margin-bottom: 4px; 
        }
        .day-events { 
          display: flex; 
          flex-direction: column; 
          gap: 2px; 
        }
        .plant-item { 
          background: #1d4ed8; 
          color: white; 
          padding: 2px 4px; 
          border-radius: 3px; 
          font-size: 10px; 
          cursor: pointer; 
          display: flex; 
          justify-content: space-between; 
          align-items: center;
          transition: all 0.3s ease;
        }
        .plant-item:hover {
          transform: scale(1.05);
        }
        .plant-item.watered { 
          background: #166534; 
        }
        .plant-name { 
          overflow: hidden; 
          white-space: nowrap; 
          text-overflow: ellipsis; 
          flex: 1; 
        }
        .sidebar { 
          display: flex; 
          flex-direction: column; 
          gap: 20px; 
        }
        .plants-section, .selected-plant { 
          background: rgba(255, 255, 255, 0.1); 
          border-radius: 12px; 
          padding: 20px;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        .section-title { 
          margin: 0 0 15px 0; 
          font-size: 18px; 
          font-weight: bold;
        }
        .plant-search { 
          position: relative; 
          margin-bottom: 15px; 
        }
        .plant-search i { 
          position: absolute; 
          left: 10px; 
          top: 50%; 
          transform: translateY(-50%); 
          color: #94a3b8; 
        }
        .plant-search input { 
          width: 100%; 
          padding: 10px 10px 10px 35px; 
          border: 1px solid #475569; 
          border-radius: 6px; 
          background: rgba(255, 255, 255, 0.1); 
          color: inherit;
          font-size: 14px;
        }
        .plant-search input:focus {
          outline: none;
          border-color: #3b82f6;
        }
        .plant-card { 
          background: rgba(255, 255, 255, 0.05); 
          border: 1px solid rgba(255, 255, 255, 0.1); 
          border-radius: 8px; 
          padding: 12px; 
          margin-bottom: 10px; 
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .plant-card:hover, .plant-card.selected { 
          background: rgba(255, 255, 255, 0.15); 
          border-color: #3b82f6;
          transform: translateY(-2px);
        }
        .plant-card-header { 
          display: flex; 
          justify-content: space-between; 
          align-items: center; 
          margin-bottom: 5px; 
        }
        .plant-common-name { 
          font-weight: bold; 
          font-size: 14px; 
        }
        .difficulty-badge { 
          font-size: 10px; 
          padding: 2px 6px; 
          border-radius: 10px; 
          font-weight: bold;
        }
        .difficulty-çok-kolay { 
          background: #16a34a; 
          color: white; 
        }
        .difficulty-kolay { 
          background: #eab308; 
          color: white; 
        }
        .difficulty-orta { 
          background: #f97316; 
          color: white; 
        }
        .difficulty-zor { 
          background: #dc2626; 
          color: white; 
        }
        .plant-scientific { 
          font-style: italic; 
          color: #94a3b8; 
          font-size: 12px; 
          margin-bottom: 8px; 
        }
        .plant-info { 
          display: flex; 
          gap: 10px; 
          font-size: 11px; 
          color: #94a3b8; 
        }
        .add-plant-btn { 
          width: 100%; 
          background: #059669; 
          color: white; 
          border: none; 
          padding: 12px; 
          border-radius: 6px; 
          cursor: pointer; 
          font-weight: bold;
          transition: all 0.3s ease;
        }
        .add-plant-btn:hover { 
          background: #047857; 
          transform: translateY(-1px);
        }
        .plant-details h3 { 
          margin: 0 0 10px 0; 
          color: #10b981; 
        }
        .plant-image { 
          width: 100%; 
          height: 150px; 
          object-fit: cover; 
          border-radius: 8px; 
          margin-bottom: 15px; 
        }
        .care-conditions { 
          margin: 15px 0; 
        }
        .care-conditions h4 { 
          margin: 0 0 10px 0; 
          font-size: 14px; 
        }
        .care-item { 
          margin-bottom: 5px; 
          font-size: 13px; 
        }
        .tips-section { 
          margin: 15px 0; 
        }
        .tips-section h4 { 
          margin: 0 0 10px 0; 
          font-size: 14px; 
        }
        .tips-list { 
          list-style: none; 
          padding: 0; 
          margin: 0; 
        }
        .tips-list li { 
          display: flex; 
          align-items: flex-start; 
          margin-bottom: 5px; 
          font-size: 13px; 
        }
        .tip-bullet { 
          color: #10b981; 
          margin-right: 8px; 
          font-weight: bold; 
        }
        .legend { 
          background: rgba(255, 255, 255, 0.1); 
          border-radius: 12px; 
          padding: 20px; 
          margin-top: 30px;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        .legend-items { 
          display: flex; 
          flex-wrap: wrap; 
          gap: 15px; 
        }
        .legend-item { 
          display: flex; 
          align-items: center; 
          gap: 8px; 
          font-size: 12px; 
        }
        .legend-color { 
          width: 16px; 
          height: 16px; 
          border-radius: 3px; 
        }
        
        /* Modal Styles */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          backdrop-filter: blur(5px);
        }
        
        .modal-content {
          background: #1e293b;
          border-radius: 12px;
          width: 90%;
          max-width: 600px;
          max-height: 90vh;
          overflow-y: auto;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .modal-header h2 {
          margin: 0;
          color: #10b981;
          font-size: 20px;
        }
        
        .close-btn {
          background: none;
          border: none;
          color: #94a3b8;
          font-size: 24px;
          cursor: pointer;
          padding: 0;
          width: 30px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          transition: all 0.3s ease;
        }
        
        .close-btn:hover {
          background: rgba(255, 255, 255, 0.1);
          color: white;
        }
        
        .plant-form {
          padding: 20px;
        }
        
        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
          margin-bottom: 15px;
        }
        
        .form-group {
          display: flex;
          flex-direction: column;
        }
        
        .form-group label {
          font-size: 14px;
          font-weight: 600;
          margin-bottom: 5px;
          color: #e2e8f0;
        }
        
        .form-group input,
        .form-group select {
          padding: 10px;
          border: 1px solid #475569;
          border-radius: 6px;
          background: rgba(255, 255, 255, 0.1);
          color: #e2e8f0;
          font-size: 14px;
          transition: all 0.3s ease;
        }
        
        .form-group input:focus,
        .form-group select:focus {
          outline: none;
          border-color: #3b82f6;
          background: rgba(255, 255, 255, 0.15);
        }
        
        .care-section,
        .tips-section {
          margin: 20px 0;
          padding: 15px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 8px;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .care-section h3,
        .tips-section h3 {
          margin: 0 0 15px 0;
          color: #10b981;
          font-size: 16px;
        }
        
        .tip-input {
          display: flex;
          gap: 10px;
          align-items: center;
          margin-bottom: 10px;
        }
        
        .tip-input input {
          flex: 1;
          padding: 8px;
          border: 1px solid #475569;
          border-radius: 6px;
          background: rgba(255, 255, 255, 0.1);
          color: #e2e8f0;
          font-size: 14px;
        }
        
        .remove-tip {
          background: #dc2626;
          border: none;
          color: white;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        }
        
        .remove-tip:hover {
          background: #b91c1c;
          transform: scale(1.1);
        }
        
        .add-tip-btn {
          background: #059669;
          border: none;
          color: white;
          padding: 8px 12px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 12px;
          transition: all 0.3s ease;
        }
        
        .add-tip-btn:hover {
          background: #047857;
        }
        
        .form-actions {
          display: flex;
          gap: 15px;
          justify-content: flex-end;
          margin-top: 25px;
          padding-top: 20px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .cancel-btn {
          background: #6b7280;
          border: none;
          color: white;
          padding: 12px 20px;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.3s ease;
        }
        
        .cancel-btn:hover {
          background: #4b5563;
        }
        
        .submit-btn {
          background: #059669;
          border: none;
          color: white;
          padding: 12px 20px;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.3s ease;
        }
        
        .submit-btn:hover {
          background: #047857;
          transform: translateY(-1px);
        }
        
        @media (max-width: 768px) {
          .main-content { 
            grid-template-columns: 1fr; 
          }
          .calendar-header { 
            flex-direction: column; 
            gap: 10px; 
          }
          .stats-bar { 
            grid-template-columns: repeat(2, 1fr); 
          }
          .day-cell { 
            min-height: 60px; 
          }
          .plant-item { 
            font-size: 9px; 
          }
          .form-row {
            grid-template-columns: 1fr;
          }
          .modal-content {
            width: 95%;
            margin: 10px;
          }
        }
      `}</style>
    </div>
  );
};

export default App;
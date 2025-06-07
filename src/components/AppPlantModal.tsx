import { useState } from "react";
import type { Difficulty, Plant } from "../types/Types";

// Add Plant Modal Component
export const AddPlantModal: React.FC<{
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
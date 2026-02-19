import React from 'react';
import '../styles/PrayerCard.css';

const ChevronDown = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9"></polyline>
  </svg>
);

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

const PrayerCard = ({ 
  prayerId, 
  prayerConfig, 
  prayerData, 
  isExpanded, 
  onToggleExpand, 
  onUpdateComponent,
  isDisabled 
}) => {
  const { name, icon, sunnaCount } = prayerConfig;
  const { inTime, athkar, sunnaCompleted, completionPercentage } = prayerData;

  const handleSunnaChange = (delta) => {
    const newValue = Math.max(0, Math.min(sunnaCount, sunnaCompleted + delta));
    onUpdateComponent(prayerId, 'sunnaCompleted', newValue);
  };

  const handleInputChange = (e) => {
    let value = parseInt(e.target.value) || 0;
    value = Math.max(0, Math.min(sunnaCount, value));
    onUpdateComponent(prayerId, 'sunnaCompleted', value);
  };

  const getProgressColor = (percentage) => {
    if (percentage === 0) return 'var(--color-text-muted)';
    if (percentage < 50) return 'var(--color-danger)';
    if (percentage < 100) return 'var(--color-warning)';
    return 'var(--color-success)';
  };

  return (
    <div className={`prayer-card ${isExpanded ? 'expanded' : ''} ${completionPercentage === 100 ? 'completed' : ''}`}>
      {/* Header - Always visible */}
      <button 
        className="prayer-header"
        onClick={() => onToggleExpand(prayerId)}
        disabled={isDisabled}
      >
        <div className="prayer-info">
          <span className="prayer-icon">{icon}</span>
          <div className="prayer-details">
            <span className="prayer-name">{name}</span>
            <span className="prayer-progress" style={{ color: getProgressColor(completionPercentage) }}>
              {completionPercentage}% Complete
            </span>
          </div>
        </div>
        
        <div className="prayer-actions">
          <div 
            className="progress-indicator"
            style={{ 
              background: `conic-gradient(${getProgressColor(completionPercentage)} ${completionPercentage * 3.6}deg, transparent 0deg)` 
            }}
          >
            {completionPercentage === 100 && <CheckIcon />}
          </div>
          <div className={`expand-icon ${isExpanded ? 'rotated' : ''}`}>
            <ChevronDown />
          </div>
        </div>
      </button>

      {/* Expandable Content */}
      <div className={`prayer-content ${isExpanded ? 'show' : ''}`}>
        <div className="prayer-items">
          {/* Pray in Time */}
          <label className={`prayer-item ${inTime ? 'checked' : ''}`}>
            <input
              type="checkbox"
              checked={inTime}
              onChange={(e) => onUpdateComponent(prayerId, 'inTime', e.target.checked)}
              disabled={isDisabled}
            />
            <div className="item-checkbox">
              {inTime && <CheckIcon />}
            </div>
            <span className="item-label">Pray in time</span>
          </label>

          {/* Athkar After */}
          <label className={`prayer-item ${athkar ? 'checked' : ''}`}>
            <input
              type="checkbox"
              checked={athkar}
              onChange={(e) => onUpdateComponent(prayerId, 'athkar', e.target.checked)}
              disabled={isDisabled}
            />
            <div className="item-checkbox">
              {athkar && <CheckIcon />}
            </div>
            <span className="item-label">Read Athkar after prayer</span>
          </label>

          {/* Sunna Prayers Counter */}
          <div className="sunna-section">
            <span className="sunna-label">Sunna prayers completed</span>
            <div className="sunna-counter">
              <button 
                className="counter-btn"
                onClick={() => handleSunnaChange(-1)}
                disabled={isDisabled || sunnaCompleted <= 0}
              >
                −
              </button>
              <input
                type="number"
                value={sunnaCompleted}
                onChange={handleInputChange}
                min="0"
                max={sunnaCount}
                disabled={isDisabled}
                className="counter-input"
              />
              <span className="counter-divider">/</span>
              <span className="counter-total">{sunnaCount}</span>
              <button 
                className="counter-btn"
                onClick={() => handleSunnaChange(1)}
                disabled={isDisabled || sunnaCompleted >= sunnaCount}
              >
                +
              </button>
            </div>
            <div className="sunna-progress">
              <div 
                className="sunna-bar"
                style={{ width: `${(sunnaCompleted / sunnaCount) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrayerCard;

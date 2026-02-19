import React from 'react';
import '../styles/DailyItem.css';

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

const DailyItem = ({ 
  item, 
  itemData, 
  isExpanded, 
  onToggleExpand, 
  onUpdate,
  isDisabled,
  t
}) => {
  const { id, type, icon, weight } = item;
  const completionPercentage = itemData?.completionPercentage || 0;
  
  // Get translated name based on item id
  const getTranslatedName = (itemId) => {
    const translationMap = {
      'fajr': t('fajr'),
      'dhuhr': t('dhuhr'),
      'asr': t('asr'),
      'maghrib': t('maghrib'),
      'isha': t('isha'),
      'morning_athkar': t('morningAthkar'),
      'evening_athkar': t('eveningAthkar'),
      'quran_day': t('quranReading'),
      'quran_tarawih': t('tarawihReading'),
    };
    return translationMap[itemId] || item.name;
  };
  
  const name = getTranslatedName(id);

  const getProgressColor = (percentage) => {
    if (percentage === 0) return 'var(--color-text-muted)';
    if (percentage < 50) return 'var(--color-danger)';
    if (percentage < 100) return 'var(--color-warning)';
    return 'var(--color-success)';
  };

  const handlePrayerComponentUpdate = (component, value) => {
    onUpdate(id, component, value);
  };

  const handleGoalUpdate = (value) => {
    if (item.goalType === 'number') {
      onUpdate(id, 'value', value);
    } else {
      onUpdate(id, 'completed', value);
    }
  };

  const handleNumberChange = (delta) => {
    const currentValue = itemData?.value || 0;
    const newValue = Math.max(0, Math.min(item.max, currentValue + delta));
    handleGoalUpdate(newValue);
  };

  const handleInputChange = (e) => {
    let value = parseInt(e.target.value) || 0;
    value = Math.max(0, Math.min(item.max, value));
    handleGoalUpdate(value);
  };

  // Render prayer type
  if (type === 'prayer') {
    return (
      <div className={`daily-item prayer ${isExpanded ? 'expanded' : ''} ${completionPercentage === 100 ? 'completed' : ''}`}>
        <button 
          className="item-header"
          onClick={() => onToggleExpand(id)}
          disabled={isDisabled}
        >
          <div className="item-info">
            <span className="item-icon">{icon}</span>
            <div className="item-details">
              <span className="item-name">{name}</span>
              <span className="item-progress" style={{ color: getProgressColor(completionPercentage) }}>
                {completionPercentage}% {t('complete')}
              </span>
            </div>
          </div>
          
          <div className="item-actions">
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

        <div className={`item-content ${isExpanded ? 'show' : ''}`}>
          <div className="item-subitems">
            {/* Pray in Time */}
            <label className={`subitem ${itemData?.inTime ? 'checked' : ''}`}>
              <input
                type="checkbox"
                checked={itemData?.inTime || false}
                onChange={(e) => handlePrayerComponentUpdate('inTime', e.target.checked)}
                disabled={isDisabled}
              />
              <div className="subitem-checkbox">
                {itemData?.inTime && <CheckIcon />}
              </div>
              <span className="subitem-label">{t('prayInTime')}</span>
            </label>

            {/* Athkar After */}
            <label className={`subitem ${itemData?.athkar ? 'checked' : ''}`}>
              <input
                type="checkbox"
                checked={itemData?.athkar || false}
                onChange={(e) => handlePrayerComponentUpdate('athkar', e.target.checked)}
                disabled={isDisabled}
              />
              <div className="subitem-checkbox">
                {itemData?.athkar && <CheckIcon />}
              </div>
              <span className="subitem-label">{t('readAthkarAfter')}</span>
            </label>

            {/* Sunna Prayers */}
            <div className="sunna-section">
              <span className="sunna-label">{t('sunnaPrayers')}</span>
              <div className="sunna-counter">
                <button 
                  className="counter-btn"
                  onClick={() => handlePrayerComponentUpdate('sunnaCompleted', (itemData?.sunnaCompleted || 0) - 1)}
                  disabled={isDisabled || (itemData?.sunnaCompleted || 0) <= 0}
                >
                  −
                </button>
                <input
                  type="number"
                  value={itemData?.sunnaCompleted || 0}
                  onChange={(e) => handlePrayerComponentUpdate('sunnaCompleted', parseInt(e.target.value) || 0)}
                  min="0"
                  max={item.sunnaCount}
                  disabled={isDisabled}
                  className="counter-input"
                />
                <span className="counter-divider">/</span>
                <span className="counter-total">{item.sunnaCount}</span>
                <button 
                  className="counter-btn"
                  onClick={() => handlePrayerComponentUpdate('sunnaCompleted', (itemData?.sunnaCompleted || 0) + 1)}
                  disabled={isDisabled || (itemData?.sunnaCompleted || 0) >= item.sunnaCount}
                >
                  +
                </button>
              </div>
              <div className="sunna-progress">
                <div 
                  className="sunna-bar"
                  style={{ width: `${((itemData?.sunnaCompleted || 0) / item.sunnaCount) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render goal type - checkbox
  if (item.goalType === 'checkbox') {
    const isCompleted = itemData?.completed || false;
    
    return (
      <label className={`daily-item goal checkbox ${isCompleted ? 'completed' : ''}`}>
        <input
          type="checkbox"
          checked={isCompleted}
          onChange={(e) => handleGoalUpdate(e.target.checked)}
          disabled={isDisabled}
        />
        <div className="goal-checkbox-visual">
          {isCompleted && <CheckIcon />}
        </div>
        <div className="goal-content">
          <span className="goal-icon">{icon}</span>
          <div className="goal-text">
            <span className="goal-name">{name}</span>
            <span className="goal-label">{item.label}</span>
          </div>
        </div>
        <div className="goal-status">
          {isCompleted ? (
            <span className="status-complete">✓ {t('completed')}</span>
          ) : (
            <span className="status-pending">{t('notStarted')}</span>
          )}
        </div>
      </label>
    );
  }

  // Render goal type - number
  const currentValue = itemData?.value || 0;
  
  return (
    <div className="daily-item goal number">
      <div className="goal-header">
        <div className="goal-content">
          <span className="goal-icon">{icon}</span>
          <div className="goal-text">
            <span className="goal-name">{name}</span>
            <span className="goal-label">{item.label}</span>
          </div>
        </div>
        <div className="goal-percentage" style={{ color: getProgressColor(completionPercentage) }}>
          {completionPercentage}%
        </div>
      </div>
      
      <div className="goal-controls">
        <button 
          className="control-btn"
          onClick={() => handleNumberChange(-1)}
          disabled={isDisabled || currentValue <= 0}
        >
          −
        </button>
        
        <div className="number-display">
          <input
            type="number"
            value={currentValue}
            onChange={handleInputChange}
            min="0"
            max={item.max}
            disabled={isDisabled}
            className="number-input"
          />
          <span className="target-label">/ {item.target}</span>
        </div>
        
        <button 
          className="control-btn"
          onClick={() => handleNumberChange(1)}
          disabled={isDisabled || currentValue >= item.max}
        >
          +
        </button>
      </div>
      
      <div className="goal-progress-bar">
        <div 
          className="progress-fill"
          style={{ 
            width: `${Math.min(completionPercentage, 100)}%`,
            backgroundColor: getProgressColor(completionPercentage)
          }}
        />
      </div>
    </div>
  );
};

export default DailyItem;

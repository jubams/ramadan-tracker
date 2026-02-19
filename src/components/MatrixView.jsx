import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRamadanData } from '../hooks/useRamadanData';
import { useLanguage } from '../contexts/LanguageContext';
import LanguageToggle from '../components/LanguageToggle';
import '../styles/MatrixView.css';

const MatrixView = () => {
  const {
    data,
    DAILY_ITEMS,
    RAMADAN_DAYS,
    currentDay,
    isBeforeRamadan,
    isAfterRamadan,
  } = useRamadanData();
  
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [hoveredCell, setHoveredCell] = useState(null);
  
  // Get translated name
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
    return translationMap[itemId] || itemId;
  };

  const handleCellClick = (day) => {
    navigate(`/?day=${day}`);
  };

  const getCellData = (day, itemId) => {
    const dayData = data[day];
    if (!dayData || !dayData.items || !dayData.items[itemId]) {
      return { completionPercentage: 0 };
    }
    return dayData.items[itemId];
  };

  const getColorClass = (percentage) => {
    if (percentage === 0) return 'empty';
    if (percentage <= 33) return 'low';
    if (percentage <= 66) return 'medium';
    if (percentage < 100) return 'high';
    return 'complete';
  };

  return (
    <div className="matrix-view">
      {/* Language Toggle */}
      <div className="header-language-toggle">
        <LanguageToggle />
      </div>

      {/* Header */}
      <header className="matrix-header">
        <h1>📊 {t('progressMatrix')}</h1>
        <p>{t('clickAnyCell')}</p>
      </header>

      {/* Legend */}
      <div className="matrix-legend">
        <div className="legend-item">
          <div className="legend-box empty"></div>
          <span>0%</span>
        </div>
        <div className="legend-item">
          <div className="legend-box low"></div>
          <span>1-33%</span>
        </div>
        <div className="legend-item">
          <div className="legend-box medium"></div>
          <span>34-66%</span>
        </div>
        <div className="legend-item">
          <div className="legend-box high"></div>
          <span>67-99%</span>
        </div>
        <div className="legend-item">
          <div className="legend-box complete"></div>
          <span>100%</span>
        </div>
      </div>

      {/* Matrix Grid */}
      <div className="matrix-container">
        <div className="matrix-wrapper">
          {/* Column Headers */}
          <div className="matrix-row header-row">
            <div className="matrix-cell header-cell day-header">{t('day')}</div>
            {DAILY_ITEMS.map((item) => (
              <div key={item.id} className="matrix-cell header-cell goal-header" title={getTranslatedName(item.id)}>
                <span className="goal-icon">{item.icon}</span>
              </div>
            ))}
            <div className="matrix-cell header-cell total-header">{t('completed')}</div>
          </div>

          {/* Data Rows */}
          <div className="matrix-body">
            {Array.from({ length: RAMADAN_DAYS }, (_, i) => {
              const day = i + 1;
              const dayData = data[day];
              const isCurrentDay = day === currentDay;
              // Only dim future days during Ramadan
              const isFutureDay = !isBeforeRamadan && !isAfterRamadan && day > currentDay;

              return (
                <div 
                  key={day}
                  className={`matrix-row ${isCurrentDay ? 'current-row' : ''} ${isFutureDay ? 'future-row' : ''}`}
                >
                  {/* Day Number */}
                  <div 
                    className="matrix-cell day-cell"
                    onClick={() => handleCellClick(day)}
                  >
                    <span className="day-num">{day}</span>
                    {isCurrentDay && <span className="today-marker">•</span>}
                  </div>

                  {/* Goal Cells */}
                  {DAILY_ITEMS.map((item) => {
                    const cellData = getCellData(day, item.id);
                    const percentage = cellData?.completionPercentage || 0;
                    const isHovered = hoveredCell === `${day}-${item.id}`;

                    return (
                      <div
                        key={item.id}
                        className={`matrix-cell data-cell ${getColorClass(percentage)}`}
                        onClick={() => handleCellClick(day)}
                        onMouseEnter={() => setHoveredCell(`${day}-${item.id}`)}
                        onMouseLeave={() => setHoveredCell(null)}
                      >
                        {isHovered && (
                          <div className="hover-tooltip">
                            <strong>{t('day')} {day}</strong>
                            <div>{getTranslatedName(item.id)}</div>
                            <div>{percentage}% {t('completed')}</div>
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {/* Total Cell */}
                  <div 
                    className={`matrix-cell total-cell ${getColorClass(dayData?.overallCompletion || 0)}`}
                    onClick={() => handleCellClick(day)}
                    title={`Day ${day}: ${dayData?.overallCompletion || 0}%`}
                  >
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Summary Section */}
      <div className="matrix-summary">
        <h3>{t('goalStatistics')}</h3>
        <div className="stats-grid">
          {DAILY_ITEMS.map((item) => {
            const completedDays = Array.from({ length: RAMADAN_DAYS }, (_, i) => {
              const dayData = getCellData(i + 1, item.id);
              return dayData?.completionPercentage === 100 ? 1 : 0;
            }).reduce((a, b) => a + b, 0);

            const percentage = Math.round((completedDays / RAMADAN_DAYS) * 100);

            return (
              <div key={item.id} className="stat-card">
                <div className="stat-header">
                  <span className="stat-icon">{item.icon}</span>
                  <span className="stat-name">{getTranslatedName(item.id)}</span>
                </div>
                <div className="stat-bar-container">
                  <div className={`stat-bar ${getColorClass(percentage)}`} style={{ width: `${percentage}%` }}></div>
                </div>
                <div className="stat-value">{completedDays}/{RAMADAN_DAYS} {t('days')} ({percentage}%)</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MatrixView;

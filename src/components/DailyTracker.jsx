import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useRamadanData } from '../hooks/useRamadanData';
import { useLanguage } from '../contexts/LanguageContext';
import DailyItem from '../components/DailyItem';
import LanguageToggle from '../components/LanguageToggle';
import { getProgressColor, formatDate } from '../utils/helpers';
import '../styles/DailyTracker.css';

const ChevronLeft = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6"></polyline>
  </svg>
);

const ChevronRight = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6"></polyline>
  </svg>
);

const MoonIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9c0-.46-.04-.92-.1-1.36-.98 1.37-2.58 2.26-4.4 2.26-3.03 0-5.5-2.47-5.5-5.5 0-1.82.89-3.42 2.26-4.4-.44-.06-.9-.1-1.36-.1z"/>
  </svg>
);

const DailyTracker = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  const {
    currentDay,
    setCurrentDay,
    DAILY_ITEMS,
    RAMADAN_DAYS,
    expandedItem,
    toggleItemExpand,
    updateItem,
    getDayData,
    getRamadanDate,
    formatHijriDate,
    isBeforeRamadan,
    isAfterRamadan,
  } = useRamadanData();

  // Get day from URL params or default to current day
  const dayFromUrl = searchParams.get('day');
  const initialDay = dayFromUrl ? parseInt(dayFromUrl) : currentDay;
  const [selectedDay, setSelectedDay] = useState(initialDay);
  
  // Update selected day when URL changes
  useEffect(() => {
    const dayParam = searchParams.get('day');
    if (dayParam) {
      const day = parseInt(dayParam);
      if (day >= 1 && day <= RAMADAN_DAYS) {
        setSelectedDay(day);
      }
    }
  }, [searchParams, RAMADAN_DAYS]);
  
  const dayData = getDayData(selectedDay);
  const date = getRamadanDate(selectedDay);
  const hijriDate = formatHijriDate(date, selectedDay);
  const isToday = selectedDay === currentDay;
  // Disable future days only during Ramadan (not before or after)
  const isFutureDay = !isBeforeRamadan && !isAfterRamadan && selectedDay > currentDay;

  const handlePrevDay = useCallback(() => {
    if (selectedDay > 1) {
      const newDay = selectedDay - 1;
      setSelectedDay(newDay);
      setSearchParams({ day: newDay.toString() });
    }
  }, [selectedDay, setSearchParams]);

  const handleNextDay = useCallback(() => {
    if (selectedDay < RAMADAN_DAYS) {
      const newDay = selectedDay + 1;
      setSelectedDay(newDay);
      setSearchParams({ day: newDay.toString() });
    }
  }, [selectedDay, RAMADAN_DAYS, setSearchParams]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') handlePrevDay();
      if (e.key === 'ArrowRight') handleNextDay();
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlePrevDay, handleNextDay]);

  const progressColor = getProgressColor(dayData.overallCompletion);
  const { t, isRTL } = useLanguage();

  // Get progress label based on percentage
  const getProgressLabelText = (percentage) => {
    if (percentage === 0) return t('notStarted');
    if (percentage <= 33) return t('gettingStarted');
    if (percentage <= 66) return t('goodProgress');
    if (percentage < 100) return t('almostThere');
    return t('complete');
  };

  return (
    <div className="daily-tracker animate-fadeIn">
      {/* Language Toggle */}
      <div className="header-language-toggle">
        <LanguageToggle />
      </div>

      {/* Header */}
      <header className="tracker-header">
        <div className="brand">
          <div className="brand-icon">
            <MoonIcon />
          </div>
          <h1>{t('appTitle')}</h1>
        </div>
        
        <div className="date-card">
          <button 
            className="nav-btn"
            onClick={handlePrevDay}
            disabled={selectedDay === 1}
            aria-label={t('previousDay')}
          >
            <ChevronLeft />
          </button>
          
          <div className="date-info">
            <div className="day-label">
              <span className="day-number">{t('day')} {selectedDay}</span>
              {isToday && <span className="today-tag">{t('today')}</span>}
            </div>
            <div className="date-details">
              <span className="hijri">{hijriDate.day} {t('ramadan')}</span>
              <span className="gregorian">{formatDate(date)}</span>
            </div>
          </div>
          
          <button 
            className="nav-btn"
            onClick={handleNextDay}
            disabled={selectedDay === RAMADAN_DAYS}
            aria-label={t('nextDay')}
          >
            <ChevronRight />
          </button>
        </div>
      </header>

      {/* Progress Section */}
      <section className="progress-section">
        <div className="progress-summary">
          <div className="progress-ring-container">
            <div 
              className="progress-ring" 
              style={{
                '--progress': dayData.overallCompletion,
                '--color': progressColor
              }}
            >
              <div className="progress-content">
                <span className="progress-percent">{dayData.overallCompletion}%</span>
                <span className="progress-text">
                  {dayData.completedItems}/{DAILY_ITEMS.length} {t('completed')}
                </span>
              </div>
            </div>
          </div>
          <div className="progress-status" style={{color: progressColor}}>
            {getProgressLabelText(dayData.overallCompletion)}
          </div>
        </div>
      </section>

      {/* Daily Items List - All in one ordered list */}
      <section className="items-section">
        <h2 className="section-title">{t('dailyTasks') || 'Daily Tasks'}</h2>
        
        <div className="items-list">
          {DAILY_ITEMS.map((item) => (
            <DailyItem
              key={item.id}
              item={item}
              itemData={dayData.items[item.id]}
              isExpanded={expandedItem === item.id}
              onToggleExpand={toggleItemExpand}
              onUpdate={(itemId, field, value) => 
                updateItem(selectedDay, itemId, field, value)
              }
              isDisabled={isFutureDay}
              t={t}
            />
          ))}
        </div>
      </section>

      {/* Completion Message */}
      {dayData.overallCompletion === 100 && (
        <div className="success-message animate-slideUp">
          <span className="success-icon">🌟</span>
          <div className="success-content">
            <strong>{t('perfectDay')}</strong>
            <span>{t('allTasksCompleted')}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default DailyTracker;

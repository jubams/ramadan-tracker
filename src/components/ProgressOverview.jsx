import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRamadanData } from '../hooks/useRamadanData';
import { useLanguage } from '../contexts/LanguageContext';
import LanguageToggle from '../components/LanguageToggle';
import { getProgressColor } from '../utils/helpers';
import '../styles/ProgressOverview.css';

const StatsIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="20" x2="12" y2="10"></line>
    <line x1="18" y1="20" x2="18" y2="4"></line>
    <line x1="6" y1="20" x2="6" y2="16"></line>
  </svg>
);

const DownloadIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
    <polyline points="7 10 12 15 17 10"></polyline>
    <line x1="12" y1="15" x2="12" y2="3"></line>
  </svg>
);

const UploadIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
    <polyline points="17 8 12 3 7 8"></polyline>
    <line x1="12" y1="3" x2="12" y2="15"></line>
  </svg>
);

const ResetIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 4 23 10 17 10"></polyline>
    <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
  </svg>
);

const FireIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"></path>
  </svg>
);

const TrophyIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="7"></circle>
    <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline>
  </svg>
);

const TaskIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
    <polyline points="22 4 12 14.01 9 11.01"></polyline>
  </svg>
);

const ProgressOverview = () => {
  const {
    data,
    currentDay,
    RAMADAN_DAYS,
    DAILY_ITEMS,
    getStatistics,
    exportData,
    importData,
    resetData,
  } = useRamadanData();
  
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [showImportModal, setShowImportModal] = useState(false);
  const [importError, setImportError] = useState(null);
  
  const stats = getStatistics();

  const handleDayClick = (day) => {
    navigate(`/?day=${day}`);
  };

  const handleImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      await importData(file);
      setShowImportModal(false);
      setImportError(null);
      alert('Data imported successfully!');
    } catch (error) {
      setImportError('Failed to import data. Please check the file format.');
    }
  };

  const getProgressClass = (percentage) => {
    if (percentage === 0) return 'empty';
    if (percentage <= 33) return 'low';
    if (percentage <= 66) return 'medium';
    return 'high';
  };

  return (
    <div className="progress-overview animate-fadeIn">
      {/* Language Toggle */}
      <div className="header-language-toggle">
        <LanguageToggle />
      </div>

      {/* Header */}
      <header className="overview-header">
        <div className="header-icon">
          <StatsIcon />
        </div>
        <h1>{t('progress')}</h1>
        <p>{t('appSubtitle')}</p>
      </header>

      {/* Main Stats */}
      <section className="stats-section">
        <div className="main-stat">
          <div 
            className="main-progress-ring"
            style={{
              '--progress': stats.overallPercentage,
              '--color': getProgressColor(stats.overallPercentage)
            }}
          >
            <span className="main-percent">{stats.overallPercentage}%</span>
          </div>
          <div className="main-stat-info">
            <span className="main-label">{t('overallProgress')}</span>
            <span className="main-sublabel">
              {stats.totalDaysCompleted} {t('perfectDays')}
            </span>
          </div>
        </div>

        <div className="stats-grid">
          <div className="stat-box">
            <div className="stat-icon fire">
              <FireIcon />
            </div>
            <div className="stat-data">
              <span className="stat-value">{stats.currentStreak}</span>
              <span className="stat-name">{t('currentStreak')}</span>
            </div>
          </div>

          <div className="stat-box">
            <div className="stat-icon trophy">
              <TrophyIcon />
            </div>
            <div className="stat-data">
              <span className="stat-value">{stats.bestStreak}</span>
              <span className="stat-name">{t('bestStreak')}</span>
            </div>
          </div>

          <div className="stat-box wide">
            <div className="stat-icon task">
              <TaskIcon />
            </div>
            <div className="stat-data">
              <span className="stat-value">{stats.totalItemsCompleted}</span>
              <span className="stat-name">{t('tasksCompleted')}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Calendar */}
      <section className="calendar-section">
        <div className="calendar-header">
          <h2>{t('ramadanCalendar')}</h2>
          <div className="legend">
            <span className="legend-item">
              <span className="dot empty"></span>0%
            </span>
            <span className="legend-item">
              <span className="dot low"></span>1-33%
            </span>
            <span className="legend-item">
              <span className="dot medium"></span>34-66%
            </span>
            <span className="legend-item">
              <span className="dot high"></span>67-100%
            </span>
          </div>
        </div>

        <div className="days-grid">
          {Array.from({ length: RAMADAN_DAYS }, (_, i) => {
            const day = i + 1;
            const dayData = data[day];
            const isCurrentDay = day === currentDay;
            const progressClass = getProgressClass(dayData?.overallCompletion || 0);

            return (
              <button
                key={day}
                className={`day-card ${progressClass} ${isCurrentDay ? 'current' : ''}`}
                onClick={() => handleDayClick(day)}
              >
                <span className="day-number">{day}</span>
                <span className="day-percent">{dayData?.overallCompletion || 0}%</span>
                {isCurrentDay && <div className="current-mark"></div>}
              </button>
            );
          })}
        </div>
      </section>

      {/* Daily Items List */}
      <section className="items-list-section">
        <h3>{t('dailyTasksList')} ({DAILY_ITEMS.length} {t('items')})</h3>
        <div className="items-breakdown">
          {DAILY_ITEMS.map((item, index) => {
            // Get translated name
            const translatedName = (() => {
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
              return translationMap[item.id] || item.name;
            })();
            
            return (
              <div key={item.id} className="breakdown-item">
                <span className="item-number">{index + 1}</span>
                <span className="item-emoji">{item.icon}</span>
                <span className="item-name">{translatedName}</span>
                {item.type === 'prayer' && (
                  <small className="item-detail">({item.sunnaCount} {t('sunna')})</small>
                )}
                {item.type === 'goal' && item.goalType === 'number' && (
                  <small className="item-detail">({t('target')}: {item.target})</small>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Data Actions */}
      <section className="actions-section">
        <h3>{t('dataManagement')}</h3>
        <div className="action-buttons">
          <button className="action-btn" onClick={exportData}>
            <DownloadIcon />
            <span>{t('export')}</span>
          </button>
          <button className="action-btn" onClick={() => setShowImportModal(true)}>
            <UploadIcon />
            <span>{t('importData')}</span>
          </button>
          <button className="action-btn danger" onClick={resetData}>
            <ResetIcon />
            <span>{t('reset')}</span>
          </button>
        </div>
      </section>

      {/* Import Modal */}
      {showImportModal && (
        <div className="modal-overlay" onClick={() => setShowImportModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3>{t('importDataTitle')}</h3>
            <p>{t('importDataDesc')}</p>
            <input type="file" accept=".json" onChange={handleImport} />
            {importError && <p className="error-text">{importError}</p>}
            <button className="btn-close" onClick={() => setShowImportModal(false)}>
              {t('cancel')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgressOverview;

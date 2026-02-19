import React from 'react';
import { NavLink } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import '../styles/BottomNavigation.css';

const HomeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
    <polyline points="9 22 9 12 15 12 15 22"></polyline>
  </svg>
);

const ChartIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="20" x2="18" y2="10"></line>
    <line x1="12" y1="20" x2="12" y2="4"></line>
    <line x1="6" y1="20" x2="6" y2="14"></line>
  </svg>
);

const GridIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7"></rect>
    <rect x="14" y="3" width="7" height="7"></rect>
    <rect x="14" y="14" width="7" height="7"></rect>
    <rect x="3" y="14" width="7" height="7"></rect>
  </svg>
);

const BottomNavigation = () => {
  const { t } = useLanguage();
  
  return (
    <nav className="bottom-nav">
      <NavLink 
        to="/" 
        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
        end
      >
        <div className="nav-icon">
          <HomeIcon />
        </div>
        <span>{t('today')}</span>
      </NavLink>
      
      <NavLink 
        to="/matrix" 
        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
      >
        <div className="nav-icon">
          <GridIcon />
        </div>
        <span>{t('matrix')}</span>
      </NavLink>
      
      <NavLink 
        to="/progress" 
        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
      >
        <div className="nav-icon">
          <ChartIcon />
        </div>
        <span>{t('progress')}</span>
      </NavLink>
    </nav>
  );
};

export default BottomNavigation;

import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import '../styles/LanguageToggle.css';

const LanguageToggle = () => {
  const { language, toggleLanguage, isRTL } = useLanguage();

  return (
    <button 
      className="language-toggle"
      onClick={toggleLanguage}
      aria-label={isRTL ? 'Switch to English' : 'التبديل إلى العربية'}
    >
      <span className={`lang-option ${language === 'en' ? 'active' : ''}`}>EN</span>
      <span className="lang-divider">|</span>
      <span className={`lang-option ${language === 'ar' ? 'active' : ''}`}>عربي</span>
    </button>
  );
};

export default LanguageToggle;

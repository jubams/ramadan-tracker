import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

const translations = {
  en: {
    // Header
    appTitle: 'Ramadan Tracker',
    appSubtitle: 'Track Your Worship',
    
    // Navigation
    today: 'Today',
    matrix: 'Matrix',
    progress: 'Progress',
    
    // Days
    day: 'Day',
    today: 'Today',
    ramadan: 'Ramadan',
    
    // Progress
    overallProgress: 'Overall Progress',
    currentStreak: 'Current Streak',
    bestStreak: 'Best Streak',
    perfectDays: 'Perfect Days',
    completed: 'completed',
    
    // Goals/Prayers
    fajr: 'Fajr',
    dhuhr: 'Dhuhr',
    asr: 'Asr',
    maghrib: 'Maghrib',
    isha: 'Isha',
    morningAthkar: 'Morning Athkar',
    eveningAthkar: 'Evening Athkar',
    quranReading: 'Quran Reading',
    tarawihReading: 'Tarawih Reading',
    
    // Prayer components
    prayInTime: 'Pray in time',
    readAthkarAfter: 'Read Athkar after prayer',
    sunnaPrayers: 'Sunna prayers completed',
    pagesRead: 'Pages read',
    pagesReadTarawih: 'Pages read in Tarawih',
    timesMadeDua: 'Times made Dua',
    athkarCompleted: 'Athkar completed',
    
    // Progress labels
    notStarted: 'Not Started',
    gettingStarted: 'Getting Started',
    goodProgress: 'Good Progress',
    almostThere: 'Almost There',
    complete: 'Complete!',
    perfectDay: 'Perfect Day!',
    allTasksCompleted: 'All tasks completed',
    
    // General
    dailyTasks: 'Daily Tasks',
    previousDay: 'Previous day',
    nextDay: 'Next day',
    
    // Matrix
    progressMatrix: 'Progress Matrix',
    clickAnyCell: 'Click any cell to view that day',
    goalStatistics: 'Goal Statistics',
    days: 'days',
    
    // Data management
    dataManagement: 'Data Management',
    export: 'Export',
    importData: 'Import',
    reset: 'Reset',
    cancel: 'Cancel',
    importDataTitle: 'Import Data',
    importDataDesc: 'Upload your backup file to restore your progress',
    
    // Stats
    overallProgress: 'Overall Progress',
    perfectDays: 'perfect days',
    currentStreak: 'Current Streak',
    bestStreak: 'Best Streak',
    tasksCompleted: 'Tasks Completed',
    
    // Calendar
    ramadanCalendar: 'Ramadan Calendar',
    dailyTasksList: 'Daily Tasks',
    items: 'items',
    sunna: 'Sunna',
    target: 'Target',
    
    // Tooltips
    dayComplete: 'Day',
    completePercent: '% complete',
  },
  ar: {
    // Header
    appTitle: 'متتبع رمضان',
    appSubtitle: 'تتبع عباداتك',
    
    // Navigation
    today: 'اليوم',
    matrix: 'مصفوفة',
    progress: 'التقدم',
    
    // Days
    day: 'يوم',
    today: 'اليوم',
    ramadan: 'رمضان',
    
    // Progress
    overallProgress: 'التقدم العام',
    currentStreak: 'السلسلة الحالية',
    bestStreak: 'أفضل سلسلة',
    perfectDays: 'أيام مثالية',
    completed: 'مكتمل',
    
    // Goals/Prayers
    fajr: 'الفجر',
    dhuhr: 'الظهر',
    asr: 'العصر',
    maghrib: 'المغرب',
    isha: 'العشاء',
    morningAthkar: 'أذكار الصباح',
    eveningAthkar: 'أذكار المساء',
    quranReading: 'قراءة القرآن',
    tarawihReading: 'قراءة التراويح',
    
    // Prayer components
    prayInTime: 'الصلاة في وقتها',
    readAthkarAfter: 'قراءة الأذكار بعد الصلاة',
    sunnaPrayers: 'السنن المؤكدة المكتملة',
    pagesRead: 'الصفحات المقروءة',
    pagesReadTarawih: 'صفحات التراويح',
    timesMadeDua: 'مرات الدعاء',
    athkarCompleted: 'الأذكار المكتملة',
    
    // Progress labels
    notStarted: 'لم يبدأ',
    gettingStarted: 'بداية جيدة',
    goodProgress: 'تقدم جيد',
    almostThere: 'اقتربت!',
    complete: 'مكتمل!',
    perfectDay: 'يوم مثالي!',
    allTasksCompleted: 'جميع المهام مكتملة',
    
    // General
    dailyTasks: 'المهام اليومية',
    previousDay: 'اليوم السابق',
    nextDay: 'اليوم التالي',
    
    // Matrix
    progressMatrix: 'مصفوفة التقدم',
    clickAnyCell: 'اضغط على أي خلية لعرض ذلك اليوم',
    goalStatistics: 'إحصائيات الأهداف',
    days: 'أيام',
    
    // Data management
    dataManagement: 'إدارة البيانات',
    export: 'تصدير',
    importData: 'استيراد',
    reset: 'إعادة تعيين',
    cancel: 'إلغاء',
    importDataTitle: 'استيراد البيانات',
    importDataDesc: 'قم بتحميل ملف النسخ الاحتياطي لاستعادة تقدمك',
    
    // Stats
    overallProgress: 'التقدم العام',
    perfectDays: 'أيام مثالية',
    currentStreak: 'السلسلة الحالية',
    bestStreak: 'أفضل سلسلة',
    tasksCompleted: 'المهام المنجزة',
    
    // Calendar
    ramadanCalendar: 'تقويم رمضان',
    dailyTasksList: 'المهام اليومية',
    items: 'عناصر',
    sunna: 'سنة',
    target: 'هدف',
    
    // Tooltips
    dayComplete: 'يوم',
    completePercent: '% مكتمل',
  }
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    const saved = localStorage.getItem('ramadan_language');
    return saved || 'en';
  });

  useEffect(() => {
    localStorage.setItem('ramadan_language', language);
    // Set RTL for Arabic
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'ar' : 'en');
  };

  const t = (key) => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t, isRTL: language === 'ar' }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

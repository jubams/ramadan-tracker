import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'ramadan_tracker_v4';

// Single ordered list of all daily items (prayers and goals mixed)
const DAILY_ITEMS = [
  {
    id: 'fajr',
    type: 'prayer',
    name: 'Fajr',
    icon: '🌅',
    sunnaCount: 2,
    weight: 12.5,
  },
  {
    id: 'morning_athkar',
    type: 'goal',
    goalType: 'checkbox',
    name: 'Morning Athkar',
    label: 'Complete morning Athkar',
    icon: '🌄',
    weight: 12.5,
  },
  {
    id: 'dhuhr',
    type: 'prayer',
    name: 'Dhuhr',
    icon: '☀️',
    sunnaCount: 6,
    weight: 12.5,
  },
  {
    id: 'quran_day',
    type: 'goal',
    goalType: 'number',
    name: 'Quran Reading',
    label: 'Pages read',
    icon: '📖',
    max: 20,
    target: 20,
    weight: 12.5,
  },
  {
    id: 'asr',
    type: 'prayer',
    name: 'Asr',
    icon: '🌤️',
    sunnaCount: 4,
    weight: 12.5,
  },
  {
    id: 'evening_athkar',
    type: 'goal',
    goalType: 'checkbox',
    name: 'Evening Athkar',
    label: 'Complete evening Athkar',
    icon: '🌆',
    weight: 12.5,
  },
  {
    id: 'maghrib',
    type: 'prayer',
    name: 'Maghrib',
    icon: '🌇',
    sunnaCount: 2,
    weight: 12.5,
  },
  {
    id: 'isha',
    type: 'prayer',
    name: 'Isha',
    icon: '🌙',
    sunnaCount: 2,
    weight: 12.5,
  },
  {
    id: 'quran_tarawih',
    type: 'goal',
    goalType: 'number',
    name: 'Tarawih Reading',
    label: 'Pages read in Tarawih',
    icon: '🌃',
    max: 20,
    target: 20,
    weight: 12.5,
  },
];

// Ramadan 2026: February 18 - March 19, 2026
const RAMADAN_DAYS = 30;
const RAMADAN_2026_START = new Date(2026, 1, 18); // February 18, 2026 (month is 0-indexed)

const initializeItemData = (item) => {
  if (item.type === 'prayer') {
    return {
      inTime: false,
      athkar: false,
      sunnaCompleted: 0,
      completionPercentage: 0,
    };
  } else if (item.type === 'goal') {
    if (item.goalType === 'number') {
      return {
        value: 0,
        completionPercentage: 0,
      };
    } else {
      return {
        completed: false,
        completionPercentage: 0,
      };
    }
  }
};

const initializeDayData = () => {
  const items = {};
  DAILY_ITEMS.forEach(item => {
    items[item.id] = initializeItemData(item);
  });
  
  return {
    items,
    overallCompletion: 0,
    completedItems: 0,
  };
};

const initializeRamadanData = () => {
  const data = {};
  for (let i = 1; i <= RAMADAN_DAYS; i++) {
    data[i] = initializeDayData();
  }
  return data;
};

const calculatePrayerCompletion = (itemData, item) => {
  let completed = 0;
  let total = 3;
  
  if (itemData.inTime) completed += 1;
  if (itemData.athkar) completed += 1;
  
  const sunnaProgress = item.sunnaCount > 0 
    ? itemData.sunnaCompleted / item.sunnaCount 
    : 0;
  completed += sunnaProgress;
  
  return Math.round((completed / total) * 100);
};

const calculateGoalCompletion = (itemData, item) => {
  if (item.goalType === 'number') {
    const progress = item.target > 0 
      ? Math.min(itemData.value / item.target, 1) 
      : 0;
    return Math.round(progress * 100);
  }
  return itemData.completed ? 100 : 0;
};

const calculateItemCompletion = (itemData, item) => {
  if (item.type === 'prayer') {
    return calculatePrayerCompletion(itemData, item);
  } else {
    return calculateGoalCompletion(itemData, item);
  }
};

const calculateDayCompletion = (dayData) => {
  let totalPercentage = 0;
  let completedItems = 0;
  
  DAILY_ITEMS.forEach(item => {
    const itemData = dayData.items[item.id];
    const completion = calculateItemCompletion(itemData, item);
    totalPercentage += (completion * item.weight) / 100;
    
    if (completion === 100) {
      completedItems += 1;
    }
  });
  
  return {
    overallCompletion: Math.round(totalPercentage),
    completedItems,
  };
};

export const useRamadanData = () => {
  const [data, setData] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error parsing saved data:', e);
      }
    }
    return initializeRamadanData();
  });

  const [currentDay, setCurrentDay] = useState(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize to start of day
    
    // Reset to midnight for accurate comparison
    const ramadanStart = new Date(RAMADAN_2026_START);
    ramadanStart.setHours(0, 0, 0, 0);
    
    // Calculate days since Ramadan started
    const diffTime = today.getTime() - ramadanStart.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
    
    // If before Ramadan, show day 1
    // If during Ramadan, show current day
    // If after Ramadan, show day 30
    if (diffDays < 1) {
      return 1;
    } else if (diffDays > RAMADAN_DAYS) {
      return RAMADAN_DAYS;
    } else {
      return diffDays;
    }
  });

  // Check if we're before Ramadan starts (allow editing all days)
  const isBeforeRamadan = (() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const ramadanStart = new Date(RAMADAN_2026_START);
    ramadanStart.setHours(0, 0, 0, 0);
    return today < ramadanStart;
  })();

  // Check if we're after Ramadan ends (allow editing all days)
  const isAfterRamadan = (() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const ramadanEnd = new Date(RAMADAN_2026_START);
    ramadanEnd.setDate(ramadanEnd.getDate() + RAMADAN_DAYS);
    ramadanEnd.setHours(0, 0, 0, 0);
    return today > ramadanEnd;
  })();

  const [expandedItem, setExpandedItem] = useState(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  const updateItem = useCallback((day, itemId, field, value) => {
    setData(prevData => {
      const dayData = { ...prevData[day] };
      const items = { ...dayData.items };
      const itemData = { ...items[itemId] };
      
      itemData[field] = value;
      
      // Find the item config
      const itemConfig = DAILY_ITEMS.find(i => i.id === itemId);
      itemData.completionPercentage = calculateItemCompletion(itemData, itemConfig);
      
      items[itemId] = itemData;
      dayData.items = items;
      
      const dayStats = calculateDayCompletion(dayData);
      dayData.overallCompletion = dayStats.overallCompletion;
      dayData.completedItems = dayStats.completedItems;
      
      return {
        ...prevData,
        [day]: dayData,
      };
    });
  }, []);

  const toggleItemExpand = useCallback((itemId) => {
    setExpandedItem(prev => prev === itemId ? null : itemId);
  }, []);

  const getDayData = useCallback((day) => {
    const dayData = data[day] || initializeDayData();
    
    // Ensure all items exist (for backward compatibility)
    if (!dayData.items) {
      dayData.items = {};
    }
    
    DAILY_ITEMS.forEach(item => {
      if (!dayData.items[item.id]) {
        dayData.items[item.id] = initializeItemData(item);
      }
    });
    
    return dayData;
  }, [data]);

  const getStatistics = useCallback(() => {
    const days = Object.values(data);
    const totalCompletion = days.reduce((sum, day) => sum + day.overallCompletion, 0);
    const overallPercentage = Math.round(totalCompletion / RAMADAN_DAYS);
    
    let bestDay = 1;
    let maxCompletion = 0;
    days.forEach((day, index) => {
      if (day.overallCompletion > maxCompletion) {
        maxCompletion = day.overallCompletion;
        bestDay = index + 1;
      }
    });

    let currentStreak = 0;
    for (let i = currentDay; i >= 1; i--) {
      if (data[i].overallCompletion === 100) {
        currentStreak++;
      } else {
        break;
      }
    }

    let bestStreak = 0;
    let tempStreak = 0;
    days.forEach(day => {
      if (day.overallCompletion === 100) {
        tempStreak++;
        bestStreak = Math.max(bestStreak, tempStreak);
      } else {
        tempStreak = 0;
      }
    });

    return {
      overallPercentage,
      bestDay,
      bestDayPercentage: maxCompletion,
      currentStreak,
      bestStreak,
      totalDaysCompleted: days.filter(day => day.overallCompletion === 100).length,
      totalItemsCompleted: days.reduce((sum, day) => sum + day.completedItems, 0),
    };
  }, [data, currentDay]);

  const exportData = useCallback(() => {
    const exportObj = {
      version: '4.0',
      ramadanData: data,
      exportDate: new Date().toISOString(),
    };
    const dataStr = JSON.stringify(exportObj, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ramadan-tracker-${new Date().getFullYear()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [data]);

  const importData = useCallback((file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const imported = JSON.parse(e.target.result);
          if (imported.ramadanData) {
            setData(imported.ramadanData);
            resolve(true);
          } else {
            reject(new Error('Invalid data format'));
          }
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  }, []);

  const resetData = useCallback(() => {
    if (window.confirm('Are you sure you want to reset all your progress? This cannot be undone.')) {
      setData(initializeRamadanData());
    }
  }, []);

  const getRamadanDate = useCallback((dayNumber) => {
    const date = new Date(RAMADAN_2026_START);
    date.setDate(date.getDate() + dayNumber - 1);
    return date;
  }, []);

  const formatHijriDate = useCallback((date, dayNumber) => {
    // dayNumber is the day of Ramadan (1-30)
    // We calculate the approximate Hijri date based on Ramadan 2026
    // Ramadan 1447 AH starts around February 18, 2026
    const hijriDay = dayNumber;
    const hijriMonth = 'Ramadan';
    const hijriYear = 1447; // 2026 corresponds to 1447 AH
    return { day: hijriDay, month: hijriMonth, year: hijriYear };
  }, []);

  return {
    data,
    currentDay,
    setCurrentDay,
    DAILY_ITEMS,
    RAMADAN_DAYS,
    expandedItem,
    toggleItemExpand,
    updateItem,
    getDayData,
    getStatistics,
    exportData,
    importData,
    resetData,
    getRamadanDate,
    formatHijriDate,
    isBeforeRamadan,
    isAfterRamadan,
  };
};

export { RAMADAN_DAYS };

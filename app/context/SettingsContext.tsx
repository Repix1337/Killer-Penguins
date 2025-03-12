'use client'
import React, { createContext, useContext, useState} from 'react';

// Add helper function to safely access localStorage
const getLocalStorageItem = (key: string): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(key);
  }
  return null;
};

interface SettingsContextType {
  showRangeIndicators: boolean;
  showHealthBars: boolean;
  autoStartRounds: boolean;
  confirmTowerSell: boolean;
  setShowRangeIndicators: (value: boolean) => void;
  setShowHealthBars: (value: boolean) => void;
  setAutoStartRounds: (value: boolean) => void;
  setConfirmTowerSell: (value: boolean) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  
  const [showRangeIndicators, setShowRangeIndicatorsState] = useState(() => 
    getLocalStorageItem('showRangeIndicators') === 'true'
  );
  const [showHealthBars, setShowHealthBarsState] = useState(() => 
    getLocalStorageItem('showHealthBars') === 'true'
  );
  const [autoStartRounds, setAutoStartRoundsState] = useState(() => {
    const stored = getLocalStorageItem('autoStartRounds');
    return stored === null ? true : stored === 'true'; 
  }
  );
  const [confirmTowerSell, setConfirmTowerSellState] = useState(() => 
    getLocalStorageItem('confirmTowerSell') === 'true'
  );

  // Create wrapper functions to update both state and localStorage
  

  const setShowRangeIndicators = (value: boolean) => {
    setShowRangeIndicatorsState(value);
    localStorage.setItem('showRangeIndicators', value.toString());
  };

  const setShowHealthBars = (value: boolean) => {
    setShowHealthBarsState(value);
    localStorage.setItem('showHealthBars', value.toString());
  };

  const setAutoStartRounds = (value: boolean) => {
    setAutoStartRoundsState(value);
    localStorage.setItem('autoStartRounds', value.toString());
  };

  const setConfirmTowerSell = (value: boolean) => {
    setConfirmTowerSellState(value);
    localStorage.setItem('confirmTowerSell', value.toString());
  };

  return (
    <SettingsContext.Provider value={{
      showRangeIndicators,
      showHealthBars,
      autoStartRounds,
      confirmTowerSell,
      setShowRangeIndicators,
      setShowHealthBars,
      setAutoStartRounds,
      setConfirmTowerSell,
    }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
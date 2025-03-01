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
  showDamageNumbers: boolean;
  showRangeIndicators: boolean;
  showHealthBars: boolean;
  autoStartRounds: boolean;
  confirmTowerSell: boolean;
  setShowDamageNumbers: (value: boolean) => void;
  setShowRangeIndicators: (value: boolean) => void;
  setShowHealthBars: (value: boolean) => void;
  setAutoStartRounds: (value: boolean) => void;
  setConfirmTowerSell: (value: boolean) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [showDamageNumbers, setShowDamageNumbers] = useState(() => 
    getLocalStorageItem('showDamageNumbers') === 'true'
  );
  const [showRangeIndicators, setShowRangeIndicators] = useState(() => 
    getLocalStorageItem('showRangeIndicators') === 'true'
  );
  const [showHealthBars, setShowHealthBars] = useState(() => 
    getLocalStorageItem('showHealthBars') === 'true'
  );
  const [autoStartRounds, setAutoStartRounds] = useState(() => 
    getLocalStorageItem('autoStartRounds') === 'true'
  );
  const [confirmTowerSell, setConfirmTowerSell] = useState(() => 
    getLocalStorageItem('confirmTowerSell') === 'true'
  );

  return (
    <SettingsContext.Provider value={{
      showDamageNumbers,
      showRangeIndicators,
      showHealthBars,
      autoStartRounds,
      confirmTowerSell,
      setShowDamageNumbers,
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
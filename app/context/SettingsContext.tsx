'use client'
import React, { createContext, useContext, useState, useEffect } from 'react';

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
    localStorage.getItem('showDamageNumbers') === 'true'
  );
  const [showRangeIndicators, setShowRangeIndicators] = useState(() => 
    localStorage.getItem('showRangeIndicators') === 'true'
  );
  const [showHealthBars, setShowHealthBars] = useState(() => 
    localStorage.getItem('showHealthBars') === 'true'
  );
  const [autoStartRounds, setAutoStartRounds] = useState(() => 
    localStorage.getItem('autoStartRounds') === 'true'
  );
  const [confirmTowerSell, setConfirmTowerSell] = useState(() => 
    localStorage.getItem('confirmTowerSell') === 'true'
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
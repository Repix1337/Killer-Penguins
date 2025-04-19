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
  // Add new performance mode setting
  performanceMode: boolean;
  setPerformanceMode: (value: boolean) => void;
  // Add new visual settings
  showAttackAnimations: boolean;
  setShowAttackAnimations: (value: boolean) => void;
  showExplosions: boolean;
  setShowExplosions: (value: boolean) => void;
  showLingeringEffects: boolean;
  setShowLingeringEffects: (value: boolean) => void;
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
  // Add new performance mode state
  const [performanceMode, setPerformanceModeState] = useState(() => 
    getLocalStorageItem('performanceMode') === 'true'
  );
  // Add new visual settings states
  const [showAttackAnimations, setShowAttackAnimationsState] = useState(true);
  const [showExplosions, setShowExplosionsState] = useState(true);
  const [showLingeringEffects, setShowLingeringEffectsState] = useState(true);

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

  // Add new performance mode setter
  const setPerformanceMode = (value: boolean) => {
    setPerformanceModeState(value);
    localStorage.setItem('performanceMode', value.toString());
  };

  // Add new visual settings setters
  const setShowAttackAnimations = (value: boolean) => {
    setShowAttackAnimationsState(value);
    localStorage.setItem('showAttackAnimations', value.toString());
  };

  const setShowExplosions = (value: boolean) => {
    setShowExplosionsState(value);
    localStorage.setItem('showExplosions', value.toString());
  };

  const setShowLingeringEffects = (value: boolean) => {
    setShowLingeringEffectsState(value);
    localStorage.setItem('showLingeringEffects', value.toString());
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
      // Add new performance mode setting
      performanceMode,
      setPerformanceMode,
      // Add new visual settings
      showAttackAnimations,
      setShowAttackAnimations,
      showExplosions,
      setShowExplosions,
      showLingeringEffects,
      setShowLingeringEffects,
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
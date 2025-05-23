import React from 'react'
import { useSettings } from './context/SettingsContext';
interface SettingsProps {
    onClose: () => void;
  }
interface SettingToggleProps {
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label: string;
}

interface KeybindItemProps {
  action: string;
  bind: string;
}
const Settings: React.FC<SettingsProps> = ({onClose}) => {
    const { 
            showRangeIndicators,
            showHealthBars,
            autoStartRounds,
            confirmTowerSell,
            setShowRangeIndicators,
            setShowHealthBars,
            setAutoStartRounds,
            setConfirmTowerSell,
            showAttackAnimations,
            setShowAttackAnimations,
            showExplosions,
            setShowExplosions,
            showLingeringEffects,
            setShowLingeringEffects
        } = useSettings();
        
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-2 sm:p-4 md:p-6 bg-black/50">
      <div className="animate-scaleUp bg-gradient-to-b from-[#0B1D35] to-[#1E3A8A] 
        p-3 sm:p-4 md:p-6 rounded-xl shadow-lg w-full max-w-[95vw] md:max-w-[85vw] lg:max-w-[1200px] 
        border border-[#67E8F9]/30 max-h-[90vh] overflow-y-auto">
        
        {/* Header - make it sticky */}
        <div className="sticky top-0 flex justify-between items-center mb-4 md:mb-6 
          bg-inherit pt-1 pb-2 border-b border-sky-800/50">
          <h3 className="text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r 
            from-cyan-300 to-blue-400 bg-clip-text text-transparent">
            Game Settings
          </h3>
          <button 
            onClick={onClose}
            className="p-1.5 sm:p-2 hover:bg-sky-800/50 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Settings grid - improved layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {/* Visual Settings */}
          <div className="setting-section flex-1 min-w-0">
            <h4 className="setting-header">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              Visual Settings
            </h4>
            <div className="setting-options">
              <SettingToggle
                checked={showRangeIndicators}
                onChange={(e) => setShowRangeIndicators(e.target.checked)}
                label="Show Tower Range"
              />
              <SettingToggle
                checked={showHealthBars}
                onChange={(e) => setShowHealthBars(e.target.checked)}
                label="Show Enemy Health"
              />
            </div>
          </div>

          {/* Gameplay Settings */}
          <div className="setting-section flex-1 min-w-0">
            <h4 className="setting-header">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Gameplay Settings
            </h4>
            <div className="setting-options">
              <SettingToggle
                checked={autoStartRounds}
                onChange={(e) => setAutoStartRounds(e.target.checked)}
                label="Auto-start Next Round"
              />
              <SettingToggle
                checked={confirmTowerSell}
                onChange={(e) => setConfirmTowerSell(e.target.checked)}
                label="Confirm Tower Selling"
              />
            </div>
          </div>

          {/* Controls Section */}
          <div className="setting-section flex-1 min-w-0">
            <h4 className="setting-header">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
              Control Bindings
            </h4>
            <div className="grid grid-cols-1 gap-1.5 text-[11px] sm:text-xs">
              <KeybindItem action="Pause Game" bind="space" />
              <KeybindItem action="Basic Speed" bind="1" />
              <KeybindItem action="Speed Up" bind="2" />
              <KeybindItem action="Super Speed" bind="3" />
              <KeybindItem action="Sell Tower" bind="Del" />
            </div>
          </div>

          {/* Visual Effects Section */}
          <div className="setting-section flex-1 min-w-0">
            <h4 className="setting-header">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Visual Effects
            </h4>
            <div className="setting-options">
              <SettingToggle
                checked={showAttackAnimations}
                onChange={(e) => setShowAttackAnimations(e.target.checked)}
                label="Attack Animations"
              />
              <SettingToggle
                checked={showExplosions}
                onChange={(e) => setShowExplosions(e.target.checked)}
                label="Explosions"
              />
              <SettingToggle
                checked={showLingeringEffects}
                onChange={(e) => setShowLingeringEffects(e.target.checked)}
                label="Lingering Effects"
              />
              
              <div className="flex gap-2 mt-3 flex-col sm:flex-row">
                <button
                  onClick={() => {
                      setShowAttackAnimations(true);
                      setShowExplosions(true);
                      setShowLingeringEffects(true);
                  }}
                  className="flex-1 px-2 md:px-3 py-1 md:py-1.5 bg-gradient-to-r from-blue-600 to-cyan-600 
                      hover:from-blue-700 hover:to-cyan-700 rounded text-xs font-medium
                      transition-all duration-200 hover:scale-[0.98] active:scale-[0.97]
                      border border-blue-400/30 shadow-lg shadow-blue-900/20"
                >
                  Enable All
                </button>
                <button
                  onClick={() => {
                      setShowAttackAnimations(false);
                      setShowExplosions(false);
                      setShowLingeringEffects(false);
                  }}
                  className="flex-1 px-2 md:px-3 py-1 md:py-1.5 bg-gradient-to-r from-red-600 to-rose-600 
                      hover:from-red-700 hover:to-rose-700 rounded text-xs font-medium
                      transition-all duration-200 hover:scale-[0.98] active:scale-[0.97]
                      border border-red-400/30 shadow-lg shadow-red-900/20"
                >
                  Disable All
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Reset button - stick to bottom */}
        <div className="sticky bottom-0 pt-4 mt-4 border-t border-sky-700 bg-inherit">
          <button 
            onClick={() => {
                if (confirm('Are you sure you want to reset all settings? (Window will be reloaded)')) {
                    localStorage.clear();
                    window.location.reload();
                }
            }}
            className="w-full px-3 md:px-4 py-2 md:py-3 bg-red-600/80 hover:bg-red-700 
            rounded-lg transition-all duration-200 text-xs md:text-sm font-semibold
            flex items-center justify-center gap-2 hover:scale-[0.98] active:scale-[0.97]"
          >
            <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Reset All Settings
          </button>
        </div>
      </div>
    </div>
  )
}

const SettingToggle: React.FC<SettingToggleProps> = ({ checked, onChange, label }) => (
  <label className="flex items-center gap-2 sm:gap-3 p-2 sm:p-2.5 md:p-3 
    hover:bg-sky-800/30 rounded-lg transition-colors cursor-pointer group w-full 
    touch-manipulation">
    <input 
      type="checkbox"
      checked={checked}
      onChange={onChange}
      className="hidden"
    />
    <div className={`w-9 sm:w-10 md:w-12 h-5 sm:h-5 md:h-6 flex items-center 
      rounded-full p-0.5 sm:p-1 ${checked ? 'bg-cyan-500' : 'bg-gray-600'} 
      transition-colors duration-300`}>
      <div className={`bg-white w-4 sm:w-3.5 md:w-4 h-4 sm:h-3.5 md:h-4 
        rounded-full shadow-md transform transition-transform duration-300 
        ${checked ? 'translate-x-4 sm:translate-x-5 md:translate-x-6' : ''}`} />
    </div>
    <span className="text-xs sm:text-sm md:text-base group-hover:text-cyan-300 
      transition-colors flex-1">{label}</span>
  </label>
);

const KeybindItem: React.FC<KeybindItemProps> = ({ action, bind }) => (
    <div className="flex justify-between items-center p-1.5 sm:p-2
      hover:bg-sky-800/30 rounded-lg transition-colors gap-2">
      <span className="text-gray-300">{action}</span>
      <kbd className="px-1.5 py-0.5 bg-sky-800 rounded 
        min-w-[40px] text-center text-cyan-300 
        shadow-inner whitespace-nowrap">
        {bind.toLowerCase()}
      </kbd>
    </div>
  );

export default Settings
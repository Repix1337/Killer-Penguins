'use client'
import React from 'react'
import Spawn from './GameLogic'
import Menu from './Menu'

const GameInterface = () => {
    const [renderMenu, setRenderMenu] = React.useState(false)
    const [round, setRound] = React.useState(0)
    const [HealthPoints, setHealthPoints] = React.useState(100)
    const [money, setMoney] = React.useState(200);
    const [isSpeedUp, setIsSpeedUp] = React.useState(0);
    const [isPaused, setIsPaused] = React.useState(false);
    const [canPause, setCanPause] = React.useState(false);
    const [selectedTowerType, setSelectedTowerType] = React.useState('');

    const onClick = () => {
      if (round < 1) {
        setRound(1);
      }
    }

    const handleSpeedUp = () => {
      if (!isPaused) {
        setIsSpeedUp(prev => (prev >= 2 ? 0 : prev + 1));
      }
    }
    

    const handlePause = () => {
      if (canPause) {
        setIsPaused(prev => !prev);
        if (isSpeedUp) {
          setIsSpeedUp(0);
        }
      }
    }

    const handleTowerSelect = (type: keyof TowerType) => {
      setSelectedTowerType(prev => prev === type ? '' : type);
    }
    
    return !renderMenu ? (
      <div className="flex flex-col justify-center min-h-[15vh] items-center text-white w-screen select-none p-1">
  {/* Top Game Controls Bar */}
  <div className="flex justify-center items-center gap-3 w-full p-2 text-base md:text-xl 
                  bg-gradient-to-r from-slate-800 to-slate-700 min-h-[10vh] shadow-lg border-b-2 border-blue-500/50
                   sm:gap-2 sm:text-sm sm:p-1">
    
    <button
      className={`px-4 py-2 rounded-lg shadow-md transition-all duration-200 
      ${round < 1 ? 'bg-green-500 hover:bg-green-600 animate-pulse' : 'bg-slate-600'}
      sm:px-3 sm:py-1`}
      onClick={onClick}
      disabled={round > 0}
    >
      {round < 1 ? 'Start Game' : 'Started'}
    </button>

    <div className="flex items-center gap-2 bg-slate-800/50 px-3 py-1 rounded-lg sm:px-2 sm:py-1">
      <span className="text-gray-300">Round:</span>
      <span className="font-bold text-blue-400">{round}</span>
      <span className="text-gray-400">/ 50</span>
    </div>

    <div className="flex items-center gap-1 bg-slate-800/50 px-3 py-1 rounded-lg sm:px-2 sm:py-1">
      <span className="text-red-500 text-2xl sm:text-lg">&hearts;</span>
      <span className={`font-bold ${HealthPoints < 30 ? 'text-red-500 animate-pulse' : 'text-red-400'}`}>
        {HealthPoints}
      </span>
    </div>

    <div className="flex items-center gap-1 bg-slate-800/50 px-3 py-1 rounded-lg sm:px-2 sm:py-1">
      <span className="text-green-500">💰</span>
      <span className="font-bold text-green-400">{Math.floor(money)}$</span>
    </div>

    <button
      className={`px-4 py-2 rounded-lg shadow-md transition-all duration-200
      ${isSpeedUp === 2 ? 'bg-blue-700' : isSpeedUp === 1 ? 'bg-blue-600' : 'bg-blue-500'}
      sm:px-3 sm:py-1`}
      onClick={handleSpeedUp}
    >
      <div className="flex items-center gap-2 sm:gap-1">
        <span>Speed</span>
        <span className="font-bold">{isSpeedUp === 2 ? '3x ⚡' : isSpeedUp === 1 ? '2x ▶' : '1x ▶'}</span>
      </div>
    </button>

    <button
      className={`px-4 py-2 rounded-lg shadow-md transition-all duration-200
      ${!canPause ? 'opacity-50 cursor-not-allowed' : ''}
      ${isPaused ? 'bg-yellow-600' : 'bg-yellow-500 hover:bg-yellow-600'}
      sm:px-3 sm:py-1`}
      onClick={handlePause}
      disabled={!canPause}
    >
      {isPaused ? '▶ Resume' : '⏸ Pause'}
    </button>

    <button
      className="px-4 py-2 rounded-lg shadow-md transition-all duration-200 bg-red-500 hover:bg-red-600
                 sm:px-3 sm:py-1"
      onClick={() => setRenderMenu(true)}
    >
      Exit Game
    </button>
</div>

        {/* Game Board */}
        <Spawn 
          round={round} 
          setHealthPoints={setHealthPoints} 
          money={money} 
          setMoney={setMoney} 
          setRound={setRound} 
          hp={HealthPoints}
          isSpeedUp={isSpeedUp}
          setIsSpeedUp={setIsSpeedUp}
          setIsPaused={setIsPaused}
          isPaused={isPaused}
          setCanPause={setCanPause}
          canPause={canPause}
          selectedTowerType={selectedTowerType}
        />
        
        {/* Tower Selection Panel */}
        <div className='bg-gradient-to-b from-slate-800 to-slate-900 flex flex-col items-center p-2 
shadow-lg border-t-2 border-blue-500/50 w-full min-h-[17vh]'>
  <div className='grid grid-cols-7  gap-3 w-full max-w-4xl 
  px-2 justify-items-center'>
            <TowerButton
              type="basic"
              src="/basic.png"
              price={100}
              isSelected={selectedTowerType === 'basic'}
              onClick={() => handleTowerSelect('basic')}
              label="Basic"
            />
            <TowerButton
              type="sniper"
              src="/sniper.png"
              price={200}
              isSelected={selectedTowerType === 'sniper'}
              onClick={() => handleTowerSelect('sniper')}
              label="Sniper"
            />
            <TowerButton
              type="rapidShooter"
              src="/rapidShooter.png"
              price={500}
              isSelected={selectedTowerType === 'rapidShooter'}
              onClick={() => handleTowerSelect('rapidShooter')}
              label="Rapid Shooter"
            />
            <TowerButton
              type="slower"
              src="/slower.png"
              price={300}
              isSelected={selectedTowerType === 'slower'}
              onClick={() => handleTowerSelect('slower')}
              label="Slower"
            />
            <TowerButton
              type="gasspitter"
              src="/gasSpitter.png"
              price={300}
              isSelected={selectedTowerType === 'gasspitter'}
              onClick={() => handleTowerSelect('gasspitter')}
              label="Gas Spitter"
            />
            <TowerButton
              type="mortar"
              src="/mortar.png"
              price={1200}
              isSelected={selectedTowerType === 'mortar'}
              onClick={() => handleTowerSelect('mortar')}
              label="Mortar"
            />
            <TowerButton
              type="cannon"
              src="/cannon.png"
              price={500}
              isSelected={selectedTowerType === 'cannon'}
              onClick={() => handleTowerSelect('cannon')}
              label="Cannon"
            />
          </div>
        </div>
      </div>
    ) : <Menu />;
};

interface TowerType {
  basic: string;
  sniper: string;
  rapidShooter: string;
  slower: string;
  gasspitter: string;
  mortar: string;
  cannon: string;
}

interface TowerButtonProps {
  type: string;
  src: string;
  price: number;
  isSelected: boolean;
  onClick: () => void;
  label?: string;
}

const TowerButton = ({ type, src, price, isSelected, onClick, label }: TowerButtonProps) => (
  <div 
     className={`group hover:scale-105 transition-all cursor-pointer rounded-lg  select-none
    ${isSelected 
      ? 'bg-gradient-to-br from-blue-600 to-blue-800 ring-2 ring-blue-400' 
      : 'bg-gradient-to-br from-slate-700 to-slate-800 hover:from-slate-600 hover:to-slate-700'}
    shadow-lg w-full max-w-[100px]`}
    onClick={onClick}
  >
    <div className="flex justify-center mb-1">
      <div className="relative">
        <img 
          src={src} 
          className='w-8 h-8 md:w-10 md:h-10 transition-transform duration-300 
          group-hover:rotate-12' 
          alt={type}
        />
        {isSelected && (
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-400 rounded-full 
          animate-pulse" />
        )}
      </div>
    </div>
    <div className="text-center">
      <p className="text-green-400 font-semibold text-sm md:text-base mb-0.5">
        {price}$
      </p>
      <p className="text-xs md:text-sm text-gray-200 font-medium">
        {label || type}
      </p>
    </div>
  </div>
);

export default GameInterface
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
      <div className="flex flex-col justify-center min-h-[15vh] items-center text-white w-full">
        {/* Top Game Controls Bar */}
        <div className='flex flex-wrap justify-center items-center gap-2 w-full p-2 text-base md:text-xl bg-slate-700 min-h-[7vh] shadow-lg border border-blue-400'>
          <div className='bg-slate-800 p-1 rounded-lg shadow-sm hover:cursor-pointer text-sm md:text-xl' 
               onClick={onClick}>
            Start
          </div>
          <div className='text-sm md:text-xl'>Round: {round}/50</div>
          <div className='text-red-500 text-sm md:text-xl'> &hearts; {HealthPoints}</div>
          <div className='text-green-500 text-sm md:text-xl'>{Math.floor(money)}$</div>
          <div className={`p-1 rounded-lg shadow-sm hover:cursor-pointer text-sm md:text-xl
                          ${isSpeedUp === 2 ? 'bg-blue-800' : isSpeedUp ? 'bg-blue-600' : 'bg-blue-400'}`}
               onClick={handleSpeedUp}>
             Speed {isSpeedUp === 2 ? '3x' : isSpeedUp === 1 ? '2x' : '1x'}
          </div>
          <div className={`p-1 rounded-lg shadow-sm text-sm md:text-xl
                          ${canPause ? 'hover:cursor-pointer' : 'opacity-50 cursor-not-allowed'}
                          ${isPaused ? 'bg-yellow-600' : 'bg-yellow-400'}`}
               onClick={handlePause}>
            {isPaused ? 'Resume' : 'Pause'}
          </div>
          <div className='px-2 py-1 rounded-lg shadow-sm hover:cursor-pointer bg-red-500 text-sm md:text-xl'
               onClick={() => setRenderMenu(true)}>
            Exit
          </div>
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
          isPaused={isPaused}
          setCanPause={setCanPause}
          selectedTowerType={selectedTowerType}
        />
        
        {/* Tower Selection Panel */}
        <div className='bg-slate-800 flex flex-col items-center p-2 shadow-lg border border-blue-400 w-full'>
  <h1 className="text-lg font-bold mb-2">Tower Select Panel</h1>
  <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-7 gap-1 w-full max-w-3xl px-1 justify-items-center'>
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
    className={`hover:scale-105 transition-all cursor-pointer bg-slate-700 rounded-lg p-1 
                w-full max-w-[96px] ${isSelected ? 'ring-2 ring-blue-400' : ''}`}
    onClick={onClick}
  >
    <div className="flex justify-center">
      <img src={src} className='w-6 h-6 md:w-8 md:h-8' alt={type} />
    </div>
    <div className="text-center text-[10px] md:text-xs mt-0.5">
      <p className="text-green-400">{price}$</p>
      <p className="whitespace-normal leading-tight">{label || type}</p>
    </div>
  </div>
);

export default GameInterface
'use client'
import React from 'react'
import Spawn from './Spawn'

const Menu = () => {
    const [round, setRound] = React.useState(0)
    const [HealthPoints, setHealthPoints] = React.useState(100)
    const [money, setMoney] = React.useState(200);
    const [isSpeedUp, setIsSpeedUp] = React.useState(false);
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
        setIsSpeedUp(prev => !prev);
      }
    }

    const handlePause = () => {
      if (canPause) {
        setIsPaused(prev => !prev);
        if (isSpeedUp) {
          setIsSpeedUp(false);
        }
      }
    }

    const handleTowerSelect = (type: string) => {
      setSelectedTowerType(prev => prev === type ? '' : type);
    }
    
    return (
      <div className="flex flex-col justify-center  items-center text-white">
       
        <div className='flex justify-center items-center gap-3 w-[100%] text-xl bg-slate-700 h-12 shadow-lg border border-blue-400'>
          <div className=' bg-slate-800 p-1 text-xl rounded-lg shadow-sm hover:cursor-pointer' onClick={onClick}>Start</div>
          <div>Round: {round}/40</div>
          <div className='text-red-500 text-xl'> &hearts; {HealthPoints}</div>
          <div className=' text-green-500'>{Math.floor(money)}$</div>
          <div 
            className={`p-1 text-xl rounded-lg shadow-sm hover:cursor-pointer ${isSpeedUp ? 'bg-blue-600' : 'bg-blue-400'}`} 
            onClick={handleSpeedUp}
          >
            Speed {isSpeedUp ? '2x' : '1x'}
          </div>
          <div 
            className={`p-1 text-xl rounded-lg shadow-sm ${canPause ? 'hover:cursor-pointer' : 'opacity-50 cursor-not-allowed'} ${isPaused ? 'bg-yellow-600' : 'bg-yellow-400'}`} 
            onClick={handlePause}
          >
            {isPaused ? 'Resume' : 'Pause'}
          </div>
        </div>
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
        
          <div className='bg-slate-800 flex flex-col items-center p-2 shadow-lg border border-blue-400 w-[100%]'>
            <h1 className="text-lg font-bold mb-1">Tower Select Panel</h1>
            <div className='flex flex-wrap justify-center gap-2'>
              <TowerButton
                type="basic"
                src="/tower1.png"
                price={100}
                isSelected={selectedTowerType === 'basic'}
                onClick={() => handleTowerSelect('basic')}
                label="Basic"
              />
              <TowerButton
                type="sniper"
                src="/tower2.png"
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
            </div>
          </div>
      </div>
    )
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
    className={`hover:scale-105 transition-all cursor-pointer bg-slate-700 rounded-lg p-1 w-24 ${
      isSelected ? 'ring-2 ring-blue-400' : ''
    }`}
    onClick={onClick}
  >
    <div className="flex justify-center">
      <img src={src} className='w-8 h-8' alt={type} />
    </div>
    <div className="text-center text-xs mt-0.5">
      <p className="text-green-400">{price}$</p>
      <p className="whitespace-normal leading-tight">{label || type}</p>
    </div>
  </div>
);

export default Menu
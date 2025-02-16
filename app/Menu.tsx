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
    
    return (
      <div className="relative">
       
        <div className='flex justify-center items-center gap-3 text-xl bg-slate-700 h-12'>
          <div className=' bg-slate-800 p-1 text-xl rounded-lg shadow-sm hover:cursor-pointer' onClick={onClick}>Start</div>
          <div>Round: {round}/37</div>
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
        />
      </div>
    )
}

export default Menu
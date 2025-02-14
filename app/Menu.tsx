'use client'
import React from 'react'
import Spawn from './Spawn'

const Menu = () => {
    const [round, setRound] = React.useState(0)
    const [HealthPoints, setHealthPoints] = React.useState(100)
    const [money, setMoney] = React.useState(200);
    const [isSpeedUp, setIsSpeedUp] = React.useState(false);

    const onClick = () => {
      if (round < 1) {
        setRound(1);
      }
    }

    const handleSpeedUp = () => {
      setIsSpeedUp(prev => !prev);
    }
    
    return (
      <div>
        <div className='flex justify-center items-center gap-3 text-xl bg-slate-700 h-12 '>
          <div className=' bg-slate-800 p-1 text-xl rounded-lg shadow-sm hover:cursor-pointer' onClick={onClick}>Start</div>
          <div>Round: {round}/30</div>
          <div className='text-red-500 text-xl'> &hearts; {HealthPoints}</div>
          <div className=' text-green-500'>{Math.floor(money)}$</div>
          <div 
            className={`p-1 text-xl rounded-lg shadow-sm hover:cursor-pointer ${isSpeedUp ? 'bg-blue-600' : 'bg-blue-400'}`} 
            onClick={handleSpeedUp}
          >
            Speed {isSpeedUp ? '2x' : '1x'}
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
        />
      </div>
    )
}

export default Menu
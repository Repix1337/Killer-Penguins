'use client'
import React from 'react'
import Spawn from './Spawn'

const Menu = () => {
    const [round, setRound] = React.useState(0)
    const [HealthPoints, setHealthPoints] = React.useState(100)
    const [money, setMoney] = React.useState(200);
    const onClick = () => {
      if (round < 1)
      {
        setRound(1);
      }
    }
    
  return (
    <div>
      <div className='flex justify-center items-center gap-3 text-xl bg-slate-700 h-12 '>
    <div className=' bg-slate-800 p-1 text-xl rounded-lg shadow-sm hover:cursor-pointer' onClick={onClick}>Start</div>
    <div>Round: {round}/30</div>
    <div className='text-red-500 text-xl'> &hearts; {HealthPoints}</div>
    <div className=' text-green-500'>{money}$</div>
    </div>
    <Spawn round={round} setHealthPoints={setHealthPoints} money={money} setMoney={setMoney} setRound={setRound} hp={HealthPoints}/>
    
    </div>
  )
}

export default Menu
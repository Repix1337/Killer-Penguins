'use client'
import React from 'react'
import Spawn from './Spawn'

const Menu = () => {
    const [round, setRound] = React.useState(0)
    const [HealthPoints, setHealthPoints] = React.useState(100)
    const [money, setMoney] = React.useState(200);
    const onClick = () => {
        setRound(1);
    }
    
  return (
    <div>
    <Spawn round={round} setHealthPoints={setHealthPoints} money={money} setMoney={setMoney} setRound={setRound} hp={HealthPoints}/>
    <div className='flex flex-col align-center text-center'>
    <div className=' text-white' onClick={onClick}>Start</div>
    <div>Round: {round}/30</div>
    <div>Health Points: {HealthPoints}</div>
    <div>Money: {money}</div>
    </div>
    </div>
  )
}

export default Menu
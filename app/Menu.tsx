'use client'
import React from 'react'
import Spawn from './Spawn'

const Menu = () => {
    const [round, setRound] = React.useState(0)
    const [HealthPoints, setHealthPoints] = React.useState(100)
    const onClick = () => {
        setRound(1);
    }
    
  return (
    <div>
    <div className=' text-white' onClick={onClick}>Start</div>
    <Spawn round={round} healthPoints={HealthPoints} setHealthPoints={setHealthPoints}/>
    <div>Round: {round}</div>
    <div>Health Points: {HealthPoints}</div>
    </div>
  )
}

export default Menu
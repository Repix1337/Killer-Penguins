import React from 'react'
import Spawn from './Spawn'

const GameMap = () => {
  return (
    <div className='relative w-screen h-4/5 border border-white'>
      <img src='/map.png' className='object-cover w-full h-full z-0' alt='map' />
      
    </div>
  )
}

export default GameMap
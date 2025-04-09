import React, { ReactNode } from 'react'

const PopUp = ({children}: {children: ReactNode}) => {
  return (
    <div className='absolute top-0 left-0 w-full h-full bg-black bg-opacity-75 overflow-hidden flex items-center justify-center z-50'>
      <div className='bg-gradient-to-br from-slate-900 to-slate-800 text-white p-12 rounded-2xl 
        text-center border-4 border-blue-500 shadow-2xl transform scale-100 animate-pop-in'>
            {children}
        </div>
    </div>
  )
}

export default PopUp
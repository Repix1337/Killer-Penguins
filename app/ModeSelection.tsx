import React from 'react'
import PopUp from './PopUp'
interface ModeProps  {
  onClose: () => void
  setGameMode: (gameMode: string) => void
}
const ModeSelection:React.FC<ModeProps> = ({onClose, setGameMode}) => {
  return (
    <PopUp>
        <div className='flex justify-between items-center mb-6'>
            <h1 className='text-4xl font-bold'>Select Game Mode</h1>
            <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
            <div className='flex gap-2'>
                <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded' onClick={() => setGameMode('normal')}>
                    Normal
                </button>
                <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded' onClick={() => setGameMode('sandbox')}>
                    Sandbox
                </button>
            </div>
    </PopUp>
  )
}

export default ModeSelection
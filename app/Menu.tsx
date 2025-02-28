import React from 'react'
import GameInterface from './GameInterface'
import TutorialWindow from './TutorialWindow'

const Menu = () => {
    const [renderGame, setRenderGame] = React.useState(false)
    const [showTutorial, setShowTutorial] = React.useState(false)

    return !renderGame ? (
        <div className='relative flex flex-col bg-cover min-h-screen min-w-[100vw] text-white
        font-bold text-4xl gap-3 overflow-hidden'
        style={{ 
            backgroundImage: 'url(/map.png)',
            backgroundPosition: 'center',
        }}>
            {/* Add animated background overlay */}
            <div className='absolute inset-0 bg-gradient-to-br from-blue-500/20 to
            -purple-500/20 animate-gradient'></div>

            <div className='relative z-10 bg-black/60 min-h-screen w-full p-4 sm:p-6 
            md:p-10 border border-white/20 backdrop-blur-sm rounded-lg flex flex-col 
            gap-6 md:gap-10 animate-fadeIn'>
                <h1 className='text-[2.5rem] sm:text-[3.5rem] md:text-[5rem] h-auto md:h-16 
                flex justify-center items-center text-center text-transparent bg-clip-text 
                bg-gradient-to-r from-blue-400 to-purple-600 drop-shadow-lg
                hover:from-blue-500 hover:to-purple-700 transition-all duration-300
                animate-slideDown'>
                    Tower Defense
                </h1>
                <div className='text-left flex flex-col gap-4 md:gap-6 items-center mt-4 
                md:mt-10 animate-slideUp'>
                    <button 
                        onClick={() => setRenderGame(true)}
                        className='w-full sm:w-72 md:w-64 py-3 md:py-4 px-6 md:px-8 
                        text-xl md:text-2xl bg-blue-500/80 hover:bg-blue-600/80 
                        transition-all duration-200 rounded-lg shadow-lg 
                        hover:shadow-blue-500/50 relative overflow-hidden group'
                    >
                        <span className="relative z-10">Play</span>
                        <div className="absolute inset-0 w-0 bg-gradient-to-r from-blue-400 
                        to-purple-600 transition-all duration-300 group-hover:w-full"></div>
                    </button>
                    
                    <button 
                        onClick={() => setShowTutorial(true)}
                        className='w-full sm:w-72 md:w-64 py-3 md:py-4 px-6 md:px-8 
                        text-xl md:text-2xl bg-indigo-500/80 hover:bg-indigo-600/80 
                        transition-all duration-200 rounded-lg shadow-lg 
                        hover:shadow-indigo-500/50 relative overflow-hidden group'
                    >
                        <span className="relative z-10">Game guide</span>
                        <div className="absolute inset-0 w-0 bg-gradient-to-r from-indigo-400 
                        to-purple-600 transition-all duration-300 group-hover:w-full"></div>
                    </button>
                </div>
            </div>
            {showTutorial && <TutorialWindow onClose={() => setShowTutorial(false)} />}
        </div>
    ) : (
        <GameInterface />
    )
}

export default Menu
import React from 'react'
import GameInterface from './GameInterface'
import TutorialWindow from './TutorialWindow';

const Menu = () => {
    const [renderGame, setRenderGame] = React.useState(false)
    const [showTutorial, setShowTutorial] = React.useState(false);
    const renderGameOnClick = () => {
        setRenderGame(true)
    }

    return !renderGame ? (
        <div className='flex flex-col bg-cover min-h-screen min-w-[100vw] text-white
        font-bold text-4xl gap-3 shadow-2xl 
        transition-all duration-300 hover:shadow-blue-400/50'
        style={{ 
            backgroundImage: 'url(/map.png)',
            backgroundPosition: 'center',
        }}>
            <div className='bg-black/60 min-h-screen w-full p-4 sm:p-6 md:p-10 
            border border-white/20 rounded-lg flex flex-col gap-6 md:gap-10'>
                <h1 className='text-[2.5rem] sm:text-[3.5rem] md:text-[5rem] h-auto md:h-16 
                flex justify-center items-center text-center text-transparent bg-clip-text 
                bg-gradient-to-r from-blue-400 to-purple-600 drop-shadow-lg
                hover:from-blue-500 hover:to-purple-700 transition-all duration-300'>
                    Tower Defense
                </h1>
                <div className='text-left flex flex-col gap-4 md:gap-6 items-center mt-4 md:mt-10'>
                    <button 
                        onClick={renderGameOnClick}
                        className='w-full sm:w-72 md:w-64 py-3 md:py-4 px-6 md:px-8 text-xl md:text-2xl
                        bg-blue-500/80 hover:bg-blue-600/80 transition-all duration-200 
                        rounded-lg shadow-lg hover:shadow-blue-500/50
                        hover:translate-y-[-2px] active:translate-y-[1px]'
                    >
                        Play
                    </button>
                    
                    <button 
                        onClick={() => setShowTutorial(true)}
                        className='w-full sm:w-72 md:w-64 py-3 md:py-4 px-6 md:px-8 text-xl md:text-2xl
                        bg-indigo-500/80 hover:bg-indigo-600/80 transition-all duration-200 
                        rounded-lg shadow-lg hover:shadow-indigo-500/50
                        hover:translate-y-[-2px] active:translate-y-[1px]'
                    >
                        Game guide
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
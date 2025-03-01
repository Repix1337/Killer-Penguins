import React from 'react'
import GameInterface from './GameInterface'
import TutorialWindow from './TutorialWindow'

const Menu = () => {
    const [renderGame, setRenderGame] = React.useState(false)
    const [showTutorial, setShowTutorial] = React.useState(false)
    const [showSettings, setShowSettings] = React.useState(false)
    const [volume, setVolume] = React.useState(100)

    return !renderGame ? (
        <div className='relative flex flex-col min-h-screen min-w-[100vw] text-white
        font-bold text-4xl gap-3 overflow-hidden bg-gradient-to-br from-sky-900 via-blue-900 to-cyan-900'>
            {/* Animated snow effect */}
            <div className="absolute inset-0">
                {[...Array(100)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute h-2 w-2 rounded-full bg-white/70 animate-snowfall"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 5}s`,
                            animationDuration: `${3 + Math.random() * 8}s`
                        }}
                    />
                ))}
            </div>

            {/* Add penguin character */}
            <div className="absolute bottom-0 w-full flex justify-center items-end gap-4 ">
                <div className="w-24 h-24 md:w-32 md:h-32 animate-bounce-slow">
                    <img src="/basic.png" alt="Basic Penguin" className="w-full h-full object-contain" />
                </div>
                <div className="w-24 h-24 md:w-32 md:h-32 animate-bounce-slow" style={{ animationDelay: '0.2s' }}>
                    <img src="/sniper.png" alt="Sniper Penguin" className="w-full h-full object-contain" />
                </div>
                <div className="w-24 h-24 md:w-32 md:h-32 animate-bounce-slow" style={{ animationDelay: '0.4s' }}>
                    <img src="/rapidShooter.png" alt="Rapid Shooter Penguin" className="w-full h-full object-contain" />
                </div>
                <div className="w-24 h-24 md:w-32 md:h-32 animate-bounce-slow" style={{ animationDelay: '0.6s' }}>
                    <img src="/slower.png" alt="Slower Penguin" className="w-full h-full object-contain" />
                </div>
                <div className="w-24 h-24 md:w-32 md:h-32 animate-bounce-slow" style={{ animationDelay: '0.8s' }}>
                    <img src="/gasSpitter.png" alt="Gas Spitter Penguin" className="w-full h-full object-contain" />
                </div>
                <div className="w-24 h-24 md:w-32 md:h-32 animate-bounce-slow" style={{ animationDelay: '1s' }}>
                    <img src="/mortar.png" alt="Mortar Penguin" className="w-full h-full object-contain" />
                </div>
                <div className="w-24 h-24 md:w-32 md:h-32 animate-bounce-slow" style={{ animationDelay: '1.2s' }}>
                    <img src="/cannon.png" alt="Cannon Penguin" className="w-full h-full object-contain" />
                </div>
            </div>
            {/* Main content */}
            <div className='relative z-10 backdrop-blur-sm min-h-screen w-full p-4 sm:p-6 
            md:p-10 flex flex-col gap-6 md:gap-10 animate-fadeIn'>
                <h1 className='text-[2.5rem] sm:text-[3.5rem] md:text-[5rem] h-auto md:h-16 
                flex justify-center items-center text-center text-transparent bg-clip-text 
                bg-gradient-to-r from-cyan-300 to-blue-500 drop-shadow-lg font-extrabold
                hover:from-cyan-400 hover:to-blue-600 transition-all duration-300
                animate-slideDown tracking-wider'>
                    KILLER PENGUINS
                </h1>

                <div className='text-left flex flex-col gap-4 md:gap-6 items-center mt-4 
                md:mt-10 animate-slideUp'>
                    <button 
                        onClick={() => setRenderGame(true)}
                        className='menu-button bg-cyan-600/80 hover:bg-cyan-700/80 
                        hover:shadow-cyan-500/50'
                    >
                        <span className="relative z-10 flex items-center gap-2">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Play Game
                        </span>
                        <div className="absolute inset-0 w-0 bg-gradient-to-r from-violet-500 
                        to-fuchsia-600 transition-all duration-300 group-hover:w-full"></div>
                    </button>
                    
                    <button 
                        onClick={() => setShowTutorial(true)}
                        className='menu-button bg-blue-600/80 hover:bg-blue-700/80 
                        hover:shadow-blue-500/50'
                    >
                        <span className="relative z-10 flex items-center gap-2">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                            Game Guide
                        </span>
                        <div className="absolute inset-0 w-0 bg-gradient-to-r from-fuchsia-500 
                        to-pink-600 transition-all duration-300 group-hover:w-full"></div>
                    </button>

                    <button 
                        onClick={() => setShowSettings(!showSettings)}
                        className='menu-button bg-sky-600/80 hover:bg-sky-700/80 
                        hover:shadow-sky-500/50'
                    >
                        <span className="relative z-10 flex items-center gap-2">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            Settings
                        </span>
                        <div className="absolute inset-0 w-0 bg-gradient-to-r from-pink-500 
                        to-rose-600 transition-all duration-300 group-hover:w-full"></div>
                    </button>

                    {showSettings && (
                        <div className="animate-fadeIn bg-sky-900/90 p-6 rounded-lg shadow-lg w-full sm:w-72 md:w-64">
                            <h3 className="text-xl mb-4">Settings</h3>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm">Volume: {volume}%</label>
                                    <input 
                                        type="range" 
                                        min="0" 
                                        max="100" 
                                        value={volume} 
                                        onChange={(e) => setVolume(parseInt(e.target.value))}
                                        className="w-full accent-cyan-500"
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            {showTutorial && <TutorialWindow onClose={() => setShowTutorial(false)} />}
        </div>
    ) : (
        <GameInterface />
    )
}

export default Menu
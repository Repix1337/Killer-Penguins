import React from "react";
import GameInterface from "./GameInterface";
import TutorialWindow from "./TutorialWindow";
import Leaderboard from "./Leaderboard";
import Settings from "./Settings";
import ModeSelection from "./ModeSelection";
import { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged, signOut, User } from 'firebase/auth';
import Auth from './auth';

const Menu: React.FC = () => {
  const [gameMode, setGameMode] = React.useState("");
  const [showModeSelection, setShowModeSelection] = React.useState(false);
  const [showTutorial, setShowTutorial] = React.useState(false);
  const [showSettings, setShowSettings] = React.useState(false);
  const [showLeaderboard, setShowLeaderboard] = React.useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const auth = getAuth();
    
    // Check if there's a user session in localStorage on component mount
    const savedUser = localStorage.getItem('authUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      // Save user data to localStorage when auth state changes
      if (user) {
        localStorage.setItem('authUser', JSON.stringify({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          // Add any other user properties you need
        }));
      } else {
        localStorage.removeItem('authUser');
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      const auth = getAuth();
      await signOut(auth);
      localStorage.removeItem('authUser'); // Clear stored user data on logout
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return gameMode === "" ? (
    <div
      className="relative flex flex-col min-h-screen min-w-[100vw] text-[#FFFFFF]
        font-bold text-4xl gap-3 overflow-hidden bg-[#0B1D35]"
    >
      {/* Animated snow effect */}
      <div className="absolute inset-0">
        {[...Array(200)].map((_, i) => (
          <div
            key={i}
            className="absolute h-2 w-2 rounded-full bg-[#FFFFFF]/70 animate-snowfall"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 8}s`,
              animationDuration: `${5 + Math.random() * 10}s`,
              opacity: Math.random() * 0.7 + 0.3,
              transform: `scale(${Math.random() * 0.8 + 0.2})`,
            }}
          />
        ))}
      </div>

      {/* Add penguin character */}
      <div className="absolute bottom-0 w-full flex justify-center items-end gap-4 ">
        <div className="w-24 h-24 md:w-32 md:h-32 animate-bounce-slow">
          <img
            src="/basic.png"
            alt="Basic Penguin"
            className="w-full h-full object-contain"
          />
        </div>
        <div
          className="w-24 h-24 md:w-32 md:h-32 animate-bounce-slow"
          style={{ animationDelay: "0.2s" }}
        >
          <img
            src="/sniper.png"
            alt="Sniper Penguin"
            className="w-full h-full object-contain"
          />
        </div>
        <div
          className="w-24 h-24 md:w-32 md:h-32 animate-bounce-slow"
          style={{ animationDelay: "0.4s" }}
        >
          <img
            src="/rapidShooter.png"
            alt="Rapid Shooter Penguin"
            className="w-full h-full object-contain"
          />
        </div>
        <div
          className="w-24 h-24 md:w-32 md:h-32 animate-bounce-slow"
          style={{ animationDelay: "0.6s" }}
        >
          <img
            src="/slower.png"
            alt="Slower Penguin"
            className="w-full h-full object-contain"
          />
        </div>
        <div
          className="w-24 h-24 md:w-32 md:h-32 animate-bounce-slow"
          style={{ animationDelay: "0.8s" }}
        >
          <img
            src="/gasSpitter.png"
            alt="Gas Spitter Penguin"
            className="w-full h-full object-contain"
          />
        </div>
        <div
          className="w-24 h-24 md:w-32 md:h-32 animate-bounce-slow"
          style={{ animationDelay: "1s" }}
        >
          <img
            src="/mortar.png"
            alt="Mortar Penguin"
            className="w-full h-full object-contain"
          />
        </div>
        <div
          className="w-24 h-24 md:w-32 md:h-32 animate-bounce-slow"
          style={{ animationDelay: "1.2s" }}
        >
          <img
            src="/cannon.png"
            alt="Cannon Penguin"
            className="w-full h-full object-contain"
          />
        </div>
      </div>
      {/* Main content */}
      <div
        className="relative z-10 backdrop-blur-sm min-h-screen w-full p-4 sm:p-6 
            md:p-10 flex flex-col gap-6 md:gap-10 animate-fadeIn"
      >
        <h1
          className="text-[2.5rem] sm:text-[3.5rem] md:text-[5rem] h-auto md:h-16 
                flex justify-center items-center text-center text-transparent bg-clip-text 
                bg-gradient-to-r from-[#67E8F9] to-[#3B82F6] drop-shadow-lg font-extrabold
                hover:from-[#22D3EE] hover:to-[#2563EB] transition-all duration-300
                animate-slideDown tracking-wider"
        >
          KILLER PENGUINS
        </h1>

        <div
          className="text-left flex flex-col gap-4 md:gap-6 items-center mt-4 
                md:mt-10 animate-slideUp"
        >
          <button
            onClick={() => setShowModeSelection(true)}
            className="menu-button bg-[#0891B2]/80 hover:bg-[#0E7490]/80 
                        hover:shadow-[#06B6D4]/50 p-4 rounded-lg"
          >
            <span className="relative z-10 flex items-center gap-2">
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Play Game
            </span>
            <div
              className="absolute inset-0 w-0 bg-gradient-to-r from-violet-500 
                        to-fuchsia-600 transition-all duration-300 group-hover:w-full"
            ></div>
          </button>

          <button
            onClick={() => setShowTutorial(true)}
            className="menu-button bg-[#2563EB]/80 hover:bg-[#1D4ED8]/80 
                        hover:shadow-[#3B82F6]/50 p-4 rounded-lg"
          >
            <span className="relative z-10 flex items-center gap-2">
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
              News & Guide
            </span>
            <div
              className="absolute inset-0 w-0 bg-gradient-to-r from-fuchsia-500 
                        to-pink-600 transition-all duration-300 group-hover:w-full"
            ></div>
          </button>

          <button
            onClick={() => setShowSettings(!showSettings)}
            className="menu-button bg-[#0EA5E9]/80 hover:bg-[#0284C7]/80 
                        hover:shadow-[#38BDF8]/50 p-4 rounded-lg"
          >
            <span className="relative z-10 flex items-center gap-2">
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              Settings
            </span>
            <div
              className="absolute inset-0 w-0 bg-gradient-to-r from-pink-500 
                        to-rose-600 transition-all duration-300 group-hover:w-full"
            ></div>
          </button>
          <button
            onClick={() => setShowLeaderboard(true)}
            className="menu-button bg-[#7C3AED]/80 hover:bg-[#6D28D9]/80 
    hover:shadow-[#8B5CF6]/50 p-4 rounded-lg"
          >
            <span className="relative z-10 flex items-center gap-2">
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
              Leaderboard
            </span>
          </button>
          <button
            onClick={() => user ? handleLogout() : setShowAuth(true)}
            className="menu-button bg-gradient-to-r from-cyan-600 to-blue-600 
            hover:from-cyan-700 hover:to-blue-700 text-white"
          >
            <span className="flex items-center justify-center gap-2">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d={user ? "M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" 
                : "M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"} />
              </svg>
              {user ? 'Logout' : 'Login'}
            </span>
          </button>
          {showSettings && <Settings onClose={() => setShowSettings(false)} />}
        </div>
      </div>
      {showTutorial && (
        <TutorialWindow onClose={() => setShowTutorial(false)} />
      )}
      {showLeaderboard && (
        <Leaderboard onClose={() => setShowLeaderboard(false)} />
      )}
      {showModeSelection && (
        <ModeSelection
          onClose={() => setShowModeSelection(false)}
          setGameMode={setGameMode}
        />
      )}
      {showAuth && <Auth onClose={() => setShowAuth(false)} />}
    </div>
  ) : (
    <GameInterface
      gameMode={gameMode}
      setShowSettings={setShowSettings}
      showSettings={showSettings}
    />
  );
};

export default Menu;

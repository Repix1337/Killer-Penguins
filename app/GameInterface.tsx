"use client";
import React from "react";
import Spawn from "./GameLogic";
import Menu from "./Menu";
import Settings from "./Settings";
import { User } from "firebase/auth";
interface SpawnProps {
  gameMode: string;
  setShowSettings: React.Dispatch<React.SetStateAction<boolean>>;
  showSettings: boolean;
  user: User | null;
}
const GameInterface: React.FC<SpawnProps> = ({
  gameMode,
  setShowSettings,
  showSettings,
  user,
}) => {
  const [renderMenu, setRenderMenu] = React.useState(false);
  const [round, setRound] = React.useState(0);
  const [HealthPoints, setHealthPoints] = React.useState(100);
  const [money, setMoney] = React.useState(200);
  const [isSpeedUp, setIsSpeedUp] = React.useState(0);
  const [isPaused, setIsPaused] = React.useState(false);
  const [canPause, setCanPause] = React.useState(false);
  const [selectedTowerType, setSelectedTowerType] = React.useState("");
  const [sandboxInput, setSandboxInput] = React.useState({
    round: "",
    money: "",
    hp: "",
  });

  const handleSandboxInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSandboxInput((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Immediately update money and HP when changed
    if (gameMode === "sandbox" && round < 1) {
      if (name === "money") {
        const newMoney = parseInt(value) || 0;
        setMoney(Math.max(newMoney, 0));
      } else if (name === "hp") {
        const newHp = parseInt(value) || 1;
        setHealthPoints(Math.max(newHp, 1));
      }
    }
  };

  const onClick = () => {
    if (round < 1 && gameMode === "normal") {
      setRound(1);
    } else if (round < 1 && gameMode === "sandbox") {
      const newRound = parseInt(sandboxInput.round) || 1;
      setRound(Math.max(newRound, 1));
    }
  };

  const handleSpeedUp = () => {
    if (!isPaused) {
      setIsSpeedUp((prev) => (prev >= 2 ? 0 : prev + 1));
    }
  };

  const handlePause = () => {
    if (canPause) {
      setIsPaused((prev) => !prev);
      if (isSpeedUp) {
        setIsSpeedUp(0);
      }
    }
  };

  const handleTowerSelect = (type: keyof TowerType) => {
    setSelectedTowerType((prev) => (prev === type ? "" : type));
  };

  return !renderMenu ? (
    <div className="flex flex-col justify-center min-h-[15vh] items-center text-white w-screen select-none p-1">
      {/* Top Game Controls Bar */}
      {/* Top Game Controls Bar */}
<div className="flex flex-col md:flex-row justify-between items-center gap-4 w-full p-4 
    bg-gradient-to-r from-slate-900 to-slate-800 min-h-[10vh] shadow-lg 
    border-b-2 border-blue-500/50">
    
    {/* Left Section - Game Stats */}
    <div className="flex flex-wrap items-center gap-3 md:gap-4">
        <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-2 rounded-xl">
            <span className="text-blue-400">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
            </span>
            <div className="flex flex-col">
                <span className="text-xs text-gray-400">Round</span>
                <span className="font-bold text-blue-400">
                    {round}<span className="text-gray-500">/50</span>
                </span>
            </div>
        </div>

        <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-2 rounded-xl">
            <span className="text-red-400 text-xl">&hearts;</span>
            <div className="flex flex-col">
                <span className="text-xs text-gray-400">Health</span>
                <span className={`font-bold ${HealthPoints < 30 ? "text-red-500 animate-pulse" : "text-red-400"}`}>
                    {HealthPoints}
                </span>
            </div>
        </div>

        <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-2 rounded-xl">
            <span className="text-green-400 text-xl">💰</span>
            <div className="flex flex-col">
                <span className="text-xs text-gray-400">Money</span>
                <span className="font-bold text-green-400">${Math.floor(money)}</span>
            </div>
        </div>
    </div>

    {/* Middle Section - Sandbox Inputs (only shown in sandbox mode and before round 1) */}
    {gameMode === "sandbox" && round < 1 && (
        <div className="flex items-center gap-3">
            <div className="flex flex-col gap-1">
                <label className="text-xs text-gray-400">Starting Round</label>
                <input
                    type="number"
                    name="round"
                    value={sandboxInput.round}
                    onChange={handleSandboxInput}
                    className="w-24 px-2 py-1 bg-slate-700 rounded-lg text-white text-sm"
                    min="1"
                    placeholder="Round"
                />
            </div>
            <div className="flex flex-col gap-1">
                <label className="text-xs text-gray-400">Starting Money</label>
                <input
                    type="number"
                    name="money"
                    value={sandboxInput.money}
                    onChange={handleSandboxInput}
                    className="w-24 px-2 py-1 bg-slate-700 rounded-lg text-white text-sm"
                    min="0"
                    placeholder="Money"
                />
            </div>
            <div className="flex flex-col gap-1">
                <label className="text-xs text-gray-400">Starting HP</label>
                <input
                    type="number"
                    name="hp"
                    value={sandboxInput.hp}
                    onChange={handleSandboxInput}
                    className="w-24 px-2 py-1 bg-slate-700 rounded-lg text-white text-sm"
                    min="1"
                    placeholder="Health"
                />
            </div>
        </div>
    )}

    {/* Right Section - Game Controls & Settings */}
    <div className="flex items-center gap-3">
        <button
            className={`px-4 py-2 rounded-lg shadow-md transition-all duration-200
                ${round < 1 ? "bg-green-500 hover:bg-green-600 animate-pulse" : "bg-slate-600"}
                flex items-center gap-2`}
            onClick={onClick}
            disabled={round > 0}
        >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {round < 1 ? "Start Game" : "Started"}
        </button>

        <div className="flex items-center gap-2">
            <button
                className={`p-2 rounded-lg shadow-md transition-all duration-200
                    ${isSpeedUp === 2 ? "bg-blue-700" : isSpeedUp === 1 ? "bg-blue-600" : "bg-blue-500"}`}
                onClick={handleSpeedUp}
            >
                {isSpeedUp === 2 ? "3x ⚡" : isSpeedUp === 1 ? "2x ▶" : "1x ▶"}
            </button>

            <button
                className={`p-2 rounded-lg shadow-md transition-all duration-200
                    ${!canPause ? "opacity-50 cursor-not-allowed" : ""}
                    ${isPaused ? "bg-yellow-600" : "bg-yellow-500 hover:bg-yellow-600"}`}
                onClick={handlePause}
                disabled={!canPause}
            >
                {isPaused ? "▶" : "⏸"}
            </button>
        </div>

        <div className="flex items-center gap-2 border-l border-gray-600 pl-2">
            <button
                onClick={() => setShowSettings(!showSettings)}
                className="p-2 rounded-lg shadow-md transition-all duration-200 
                    bg-[#0EA5E9]/80 hover:bg-[#0284C7]/80"
                title="Settings"
            >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
            </button>

            <button
                className="p-2 rounded-lg shadow-md transition-all duration-200 
                    bg-red-500 hover:bg-red-600"
                onClick={() => setRenderMenu(true)}
                title="Exit Game"
            >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
    </div>
</div>

      {/* Game Board */}
      <Spawn
        round={round}
        setHealthPoints={setHealthPoints}
        money={money}
        setMoney={setMoney}
        setRound={setRound}
        hp={HealthPoints}
        isSpeedUp={isSpeedUp}
        setIsSpeedUp={setIsSpeedUp}
        setIsPaused={setIsPaused}
        isPaused={isPaused}
        setCanPause={setCanPause}
        canPause={canPause}
        selectedTowerType={selectedTowerType}
        gameMode={gameMode}
        user={user}
      />
{showSettings && <Settings onClose={() => setShowSettings(false)} />}
      {/* Tower Selection Panel */}
      <div
        className="bg-gradient-to-b from-slate-800 to-slate-900 flex flex-col items-center p-4 
    shadow-lg border-t-2 border-blue-500/50 w-full min-h-[20vh]"
      >
        <div
          className="grid grid-cols-4 md:grid-cols-7 gap-3 md:gap-6 w-full max-w-6xl 
      px-2 justify-items-center"
        >
          <TowerButton
            type="basic"
            src="/basic.png"
            price={100}
            isSelected={selectedTowerType === "basic"}
            onClick={() => handleTowerSelect("basic")}
            label="Basic"
          />
          <TowerButton
            type="sniper"
            src="/sniper.png"
            price={200}
            isSelected={selectedTowerType === "sniper"}
            onClick={() => handleTowerSelect("sniper")}
            label="Sniper"
          />
          <TowerButton
            type="rapidShooter"
            src="/rapidShooter.png"
            price={500}
            isSelected={selectedTowerType === "rapidShooter"}
            onClick={() => handleTowerSelect("rapidShooter")}
            label="Rapid Shooter"
          />
          <TowerButton
            type="slower"
            src="/slower.png"
            price={300}
            isSelected={selectedTowerType === "slower"}
            onClick={() => handleTowerSelect("slower")}
            label="Slower"
          />
          <TowerButton
            type="gasspitter"
            src="/gasSpitter.png"
            price={300}
            isSelected={selectedTowerType === "gasspitter"}
            onClick={() => handleTowerSelect("gasspitter")}
            label="Gas Spitter"
          />
          <TowerButton
            type="mortar"
            src="/mortar.png"
            price={1200}
            isSelected={selectedTowerType === "mortar"}
            onClick={() => handleTowerSelect("mortar")}
            label="Mortar"
          />
          <TowerButton
            type="cannon"
            src="/cannon.png"
            price={500}
            isSelected={selectedTowerType === "cannon"}
            onClick={() => handleTowerSelect("cannon")}
            label="Cannon"
          />
        </div>
      </div>
    </div>
  ) : (
    <Menu />
  );
};

interface TowerType {
  basic: string;
  sniper: string;
  rapidShooter: string;
  slower: string;
  gasspitter: string;
  mortar: string;
  cannon: string;
}

interface TowerButtonProps {
  type: string;
  src: string;
  price: number;
  isSelected: boolean;
  onClick: () => void;
  label?: string;
}

const TowerButton = ({
  type,
  src,
  price,
  isSelected,
  onClick,
  label,
}: TowerButtonProps) => (
  <div
    className={`group hover:scale-105 transition-all cursor-pointer rounded-lg select-none
    ${
      isSelected
        ? "bg-gradient-to-br from-blue-600 to-blue-800 ring-2 ring-blue-400"
        : "bg-gradient-to-br from-slate-700 to-slate-800 hover:from-slate-600 hover:to-slate-700"
    }
    shadow-lg w-full max-w-[120px] md:max-w-[150px] p-3`}
    onClick={onClick}
  >
    <div className="flex justify-center mb-2">
      <div className="relative">
        <img
          src={src}
          className="w-10 h-10 md:w-14 md:h-14 transition-transform duration-300 
            group-hover:rotate-12"
          alt={type}
        />
        {isSelected && (
          <div
            className="absolute -top-1 -right-1 w-3 h-3 bg-blue-400 rounded-full 
            animate-pulse"
          />
        )}
      </div>
    </div>
    <div className="text-center">
      <p className="text-green-400 font-semibold text-sm md:text-lg mb-1">
        {price}$
      </p>
      <p className="text-xs md:text-base text-gray-200 font-medium">
        {label || type}
      </p>
    </div>
  </div>
);

export default GameInterface;

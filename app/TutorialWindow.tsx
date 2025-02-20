import React, { useState } from 'react';

interface TutorialWindowProps {
    onClose: () => void;
}

const TutorialWindow: React.FC<TutorialWindowProps> = ({ onClose }) => {
    const [activeTab, setActiveTab] = useState<'towers' | 'mechanics'>('towers');
    const [selectedTowerInfo, setSelectedTowerInfo] = useState<string | null>(null);

    const renderTowerContent = () => {
        const towerData = { 
            basic: {
                name: "Basic Tower",
                cost: 100,
                description: "Balanced tower with good damage and attack speed.",
                special: "Artillery Master (20000$) - Massive damage, range increase, and explosion damage.",
                upgrades: [
                    "Level 1 (400$) - Enhanced Targeting: +40 damage",
                    "Level 2 (600$) - Combat Accelerator: -250ms attack interval",
                    "Level 3 (1500$) - Double Shot: Can hit 2 enemies",
                    "Level 4 (2500$) - Armor Piercing: Can hit armored and stealth",
                    "Level 5 (3000$) - Extended Range: +30% range",
                    "Level 6 (5000$) - Critical Strike: 25% chance for 2x damage",
                    "Level 7 (15000$) - Artillery Master: Explosive damage"
                ]
            },
            sniper: {
                name: "Sniper Tower",
                cost: 200,
                description: "High single-target damage with long range.",
                special: "Elite Sniper (20000$) - 5x damage boost.",
                upgrades: [
                    "Level 1 (800$) - High-Caliber: +80 damage",
                    "Level 2 (1000$) - Neural Interface: -500ms attack interval",
                    "Level 3 (2000$) - Armor Piercing: Can hit armored, +100 damage",
                    "Level 4 (2500$) - Rapid Targeting: -500ms attack interval",
                    "Level 5 (4000$) - Critical Strike: 35% chance for 3x damage",
                    "Level 6 (5000$) - Double Shot: Can hit 2 enemies",
                    "Level 7 (10000$) - Elite Sniper: 5x damage"
                ]
            },
            rapidShooter: {
                name: "Rapid Shooter",
                cost: 500,
                description: "High attack speed tower, effective against groups.",
                special: "Gatling Master (10000$) - Ultimate attack speed.",
                upgrades: [
                    "Level 1 (500$) - Rapid Fire: -100ms attack interval",
                    "Level 2 (1000$) - Enhanced Damage: +25 damage, stealth detection",
                    "Level 3 (2500$) - Triple Shot: Can hit 3 enemies",
                    "Level 4 (2000$) - Quick Loader: -100ms attack interval",
                    "Level 5 (5000$) - Extended Range: +25% range",
                    "Level 6 (7500$) - Quadruple Shot: Can hit 4 enemies",
                    "Level 7 (10000$) - Gatling Master: 1.5x damage, 40% faster attack"
                ]
            },
            slower: {
                name: "Slower Tower",
                cost: 300,
                description: "Slows down enemies in range.",
                special: "Time Warper (10000$) - Maximum slow effect.",
                upgrades: [
                    "Level 1 (400$) - Enhanced Slow: +10% slow effect",
                    "Level 2 (1000$) - Double Target: Can slow 2 enemies",
                    "Level 3 (1500$) - Extended Duration: Longer slow, stealth detection",
                    "Level 4 (4500$) - Triple Target: Can slow 3 enemies",
                    "Level 5 (5000$) - Potent Slow: +15% slow effect",
                    "Level 6 (7500$) - Extended Range: +40% range",
                    "Level 7 (10000$) - Time Warper: Maximum slow effect"
                ]
            },
            gasSpitter: {
                name: "Gas Spitter",
                cost: 300,
                description: "Poisons enemies with damage over time.",
                special: "Plague Master (10000$) - Deadly poison, stops regen.",
                upgrades: [
                    "Level 1 (300$) - Virulent Strain: +20 poison damage",
                    "Level 2 (600$) - Caustic Catalyst: +20 poison damage",
                    "Level 3 (1200$) - Double Spray: Can poison 2 enemies",
                    "Level 4 (1500$) - Concentrated Toxin: +30 poison damage",
                    "Level 5 (2500$) - Extended Range: +25% range",
                    "Level 6 (5000$) - Triple Spray: Can poison 3 enemies",
                    "Level 7 (10000$) - Plague Master: 4x poison damage, stops regen"
                ]
            },
            mortar: {
                name: "Mortar Tower",
                cost: 1200,
                description: "Long-range explosive damage to groups.",
                special: "Artillery Master (15000$) - Maximum explosion power.",
                upgrades: [
                    "Level 1 (400$) - Seismic Shells: +50 damage",
                    "Level 2 (1000$) - Rapid Reloader: -1000ms attack interval",
                    "Level 3 (2000$) - Shockwave Amplifier: +20% explosion radius",
                    "Level 4 (4000$) - Better Shells: +75 damage, faster reload",
                    "Level 5 (5000$) - Extended Range: +30% range",
                    "Level 6 (7500$) - Devastating Blast: +100 damage, +25% radius",
                    "Level 7 (15000$) - Artillery Master: 2x damage, +30% range"
                ]
            },
            cannon: {
                name: "Cannon Tower",
                cost: 500,
                description: "Explosive damage tower effective against groups.",
                special: "Siege Master (15000$) - Ultimate explosive power.",
                upgrades: [
                    "Level 1 (400$) - Tungsten Core: +40 damage",
                    "Level 2 (1000$) - Autoloader: -300ms attack interval",
                    "Level 3 (1500$) - Blast Radius: +20% explosion radius",
                    "Level 4 (4000$) - Better Shells: +75 damage, faster reload",
                    "Level 5 (6000$) - Extended Range: +25% range",
                    "Level 6 (8000$) - Critical Strike: 30% chance for 2x damage",
                    "Level 7 (15000$) - Siege Master: 2x damage, larger explosions"
                ]
            }
        };
    
        return (
            <div className="space-y-6">
                {Object.entries(towerData).map(([key, tower]) => (
                    <div key={key} className="bg-slate-700 p-4 rounded-lg hover:bg-slate-600 transition-all">
                        <div 
                            className="flex items-center gap-4 mb-2 cursor-pointer group"
                            onClick={() => setSelectedTowerInfo(selectedTowerInfo === key ? null : key)}
                        >
                            <img src={`/${key}.png`} alt={tower.name} className="w-12 h-12"/>
                            <div className="flex-1">
                                <h3 className="text-xl text-white flex items-center gap-2">
                                    {tower.name} ({tower.cost}$)
                                    <span className="text-blue-400 text-sm">
                                        {selectedTowerInfo === key ? '▼ Click to hide' : '▶ Click to show upgrades'}
                                    </span>
                                </h3>
                            </div>
                        </div>
                        <p className="text-gray-300">{tower.description}</p>
                        <p className="text-yellow-400 mt-2">{tower.special}</p>
                        
                        {selectedTowerInfo === key && (
                            <div className="mt-4 ml-4 space-y-2 border-t border-blue-400 pt-4">
                                <h4 className="text-lg text-blue-400 mb-2">Upgrade Path:</h4>
                                {tower.upgrades.map((upgrade, index) => (
                                    <p key={index} className="text-gray-300">{upgrade}</p>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        );
    };

    const renderMechanicsContent = () => (
        <div className="space-y-6">
            {/* Money Management */}
            <div className="bg-slate-700 p-4 rounded-lg">
                <h3 className="text-xl text-white mb-2">Money Management</h3>
                <p className="text-gray-300">• Start with 200$ initial money</p>
                <p className="text-gray-300">• Earn money by killing enemies</p>
                <p className="text-gray-300">• Towers can be sold for 75% of total investment</p>
            </div>

            {/* Tower Placement and Upgrades */}
            <div className="bg-slate-700 p-4 rounded-lg">
                <h3 className="text-xl text-white mb-2">Tower Placement & Upgrades</h3>
                <p className="text-gray-300">• Place towers on building sites marked on the map</p>
                <p className="text-gray-300">• Click a tower to open upgrade menu</p>
                <p className="text-gray-300">• Blue circle shows tower&apos;s range</p>
                <p className="text-gray-300">• Change targeting priority between First, Last, and Highest HP</p>
            </div>

            <div className="bg-slate-700 p-4 rounded-lg">
                <h3 className="text-xl text-white mb-2">Targeting Options</h3>
                <p className="text-gray-300">• First - Targets enemy furthest along the path</p>
                <p className="text-gray-300">• Last - Targets enemy closest to start</p>
                <p className="text-gray-300">• Highest HP - Targets enemy with most health</p>
                <p className="text-gray-300">• Change targeting in tower upgrade menu</p>
            </div>

            {/* Enemy Types */}
            <div className="bg-slate-700 p-4 rounded-lg">
                <h3 className="text-xl text-white mb-2">Enemy Types</h3>
                <div className="space-y-2">
                    <div className="flex items-center gap-4">
                        <img src="/basicEnemy.png" alt="Normal Enemy" className="w-8 h-8"/>
                        <p className="text-gray-300">• Normal - Basic enemies</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <img src="/speedy.png" alt="Fast Enemy" className="w-8 h-8"/>
                        <p className="text-gray-300">• Fast - Moves quickly but has less HP</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <img src="/tank.png" alt="Tank Enemy" className="w-8 h-8"/>
                        <p className="text-gray-300">• Tank - High HP but moves slowly</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <img src="/stealth.png" alt="Stealth Enemy" className="w-8 h-8"/>
                        <p className="text-gray-300">• Stealth - Invisible to towers without stealth detection</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <img src="/regenTank.png" alt="Regenerating Enemy" className="w-8 h-8"/>
                        <p className="text-gray-300">• Regenerating - Recovers HP over time</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <img src="/armoredbasic.png" alt="Armored Enemy" className="w-8 h-8"/>
                        <p className="text-gray-300">• Armored - immune to non explosive attacks</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <img src="/boss.png" alt="Boss Enemy" className="w-8 h-8"/>
                        <p className="text-yellow-300">• Boss - Very high HP and regenerates (appears in rounds 32 and 40)</p>
                    </div>
                </div>
            </div>

            {/* Game Controls */}
            <div className="bg-slate-700 p-4 rounded-lg">
                <h3 className="text-xl text-white mb-2">Game Controls</h3>
                <p className="text-gray-300">• Press Start to begin the game</p>
                <p className="text-gray-300">• Speed up button doubles game speed</p>
                <p className="text-gray-300">• Pause button freezes the game (only between rounds)</p>
                <p className="text-gray-300">• 40 rounds to complete</p>
            </div>
        </div>
    );

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-slate-800 p-6 rounded-lg max-w-4xl w-full max-h-[80vh] overflow-y-auto border border-blue-400">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-white">Game Guide</h2>
                    <button 
                        onClick={onClose}
                        className="text-gray-400 hover:text-white"
                    >
                        ✕
                    </button>
                </div>

                {/* Tab Navigation */}
                <div className="flex gap-4 mb-6">
                    <button
                        onClick={() => setActiveTab('towers')}
                        className={`px-4 py-2 rounded-lg transition-all ${
                            activeTab === 'towers'
                                ? 'bg-blue-500 text-white'
                                : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                        }`}
                    >
                        Towers
                    </button>
                    <button
                        onClick={() => setActiveTab('mechanics')}
                        className={`px-4 py-2 rounded-lg transition-all ${
                            activeTab === 'mechanics'
                                ? 'bg-blue-500 text-white'
                                : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                        }`}
                    >
                        Game Mechanics
                    </button>
                </div>

                {/* Content */}
                {activeTab === 'towers' ? renderTowerContent() : renderMechanicsContent()}
            </div>
        </div>
    );
};

export default TutorialWindow;
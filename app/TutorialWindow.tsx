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
                description: "Balanced tower with good damage and attack speed (50 damage, 1000ms interval)",
                path1: "Path 1: Attack Speed - Multiple targets and faster firing, culminating in quad shot",
                path2: "Path 2: Heavy Damage - Increasing damage leading to explosive attacks",
                upgrades: [
                    "Path 1-1: Stealth Detection (400$) - Can target stealth enemies",
                    "Path 1-2: Rapid Fire (800$) - -300ms attack interval",
                    "Path 1-3: Double Shot (2000$) - Can hit 2 targets, -200ms interval",
                    "Path 1-4: Speed Master (15000$) - Triple shot, -250ms interval, +50% damage",
                    "Path 1-5: Hypersonic Barrage (25000$) - Quad shot, -100ms interval, +80% damage",
                    "Path 2-1: Enhanced Targeting (600$) - +60 damage",
                    "Path 2-2: Heavy Shells (2000$) - +80 damage, can hit armored",
                    "Path 2-3: Critical Strike (5000$) - 30% chance for 3x damage",
                    "Path 2-4: Demolition Expert (15000$) - Converts to explosion damage, 3x damage, 25 radius",
                    "Path 2-5: Nuclear Strike (30000$) - 1.5x damage, 40% larger radius, stuns for 150ms"
                ]
            },
            sniper: {
                name: "Sniper Tower",
                cost: 200,
                description: "High single-target damage with long range (120 damage, 2000ms interval)",
                path1: "Path 1: Heavy Impact - Massive damage and stunning capabilities",
                path2: "Path 2: Speed Focus - Multiple targets with rapid firing",
                upgrades: [
                    "Path 1-1: Precision Scope (1000$) - +100 damage",
                    "Path 1-2: Stun Rounds (2500$) - 20% stun chance (150ms)",
                    "Path 1-3: Armor Piercing (5000$) - Can hit armored, +150 damage",
                    "Path 1-4: Heavy Impact (12000$) - 2x damage, 40% stun chance (300ms)",
                    "Path 1-5: Ultimate Destroyer (25000$) - 2.5x damage, 100% stun chance (500ms)",
                    "Path 2-1: Quick Loader (800$) - -400ms attack interval",
                    "Path 2-2: Double Shot (2000$) - Can hit 2 targets, -200ms interval",
                    "Path 2-3: Advanced Targeting (4500$) - Triple shot, -300ms interval",
                    "Path 2-4: Rapid Fire Master (15000$) - -500ms interval, +30% damage",
                    "Path 2-5: Machine Gun Mode (25000$) - Quad shot, -300ms interval, +50% damage"
                ]
            },
            gasSpitter: {
                name: "Gas Spitter",
                cost: 300,
                description: "Poisons enemies with damage over time (20 damage + 20 poison/tick)",
                path1: "Path 1: Toxin - Enhanced poison damage and regen blocking",
                path2: "Path 2: Gas Cloud - Area control with slowing effects",
                upgrades: [
                    "Path 1-1: Virulent Strain (400$) - +25 poison damage",
                    "Path 1-2: Lingering Toxin (1200$) - +30 poison, stops regen",
                    "Path 1-3: Deadly Concoction (3500$) - 2x poison damage",
                    "Path 1-4: Toxic Catalyst (8000$) - 2.5x poison, can hit stealth",
                    "Path 1-5: Bio Weaponry (15000$) - 3x poison, +50% base damage",
                    "Path 2-1: Wider Spray (600$) - +20% range",
                    "Path 2-2: Double Nozzle (2000$) - Can hit 2 targets, +20% range",
                    "Path 2-3: Gas Cloud (4500$) - Creates explosion, 20 radius, +20 poison",
                    "Path 2-4: Dense Vapors (12000$) - 25 radius, 20% slow, +30 poison",
                    "Path 2-5: Chemical Warfare (20000$) - 30 radius, 30% slow, +50% poison"
                ]
            },
            slower: {
                name: "Slower Tower",
                cost: 300,
                description: "Slows down enemies in range (10 damage, 25% slow)",
                path1: "Path 1: Time Warp - Stronger slowing and area effects",
                path2: "Path 2: Frost - Multi-target with freezing capabilities",
                upgrades: [
                    "Path 1-1: Enhanced Slow (400$) - 20% stronger slow effect",
                    "Path 1-2: Time Distortion (1500$) - 30% stronger slow, longer duration",
                    "Path 1-3: Temporal Field (3500$) - Creates slow field, 15 radius, 40% slow",
                    "Path 1-4: Chrono Break (8000$) - 20 radius, 60% slow, 4s duration",
                    "Path 1-5: Time Lord (15000$) - 25 radius, 70% slow, 5s duration, hits stealth",
                    "Path 2-1: Frost Touch (600$) - +15 damage",
                    "Path 2-2: Frost Touch 2 (1200$) - -250ms attack interval",
                    "Path 2-3: Arctic Wind (4500$) - Triple target, +30% range, +25 damage",
                    "Path 2-4: Deep Freeze (12000$) - Quad target, stun chance, +30 damage",
                    "Path 2-5: Permafrost (20000$) - 2x damage, 400ms stun, +50% range"
                ]
            },
            rapidShooter: {
                name: "Rapid Shooter",
                cost: 500,
                description: "High attack speed tower (20 damage, 350ms interval)",
                path1: "Path 1: Multi-shot - Multiple targets and enhanced speed",
                path2: "Path 2: Chain Lightning - Chain attacks between enemies",
                upgrades: [
                    "Path 1-1: Faster Firing (500$) - -75ms attack interval",
                    "Path 1-2: Enhanced Targeting (1200$) - +15 damage, -50ms interval",
                    "Path 1-3: Double Shot (3500$) - Can hit 2 targets, -25ms interval",
                    "Path 1-4: Triple Shot (8000$) - Triple shot, -50ms interval, +10 damage",
                    "Path 1-5: Bullet Storm (15000$) - Quad shot, -75ms interval, +50% damage",
                    "Path 2-1: Static Charge (800$) - +25 damage, +10% range",
                    "Path 2-2: Enhanced Range (1500$) - +20% range, stealth detection",
                    "Path 2-3: Chain Lightning (4500$) - Chains to 2 enemies, +20 damage",
                    "Path 2-4: Storm Caller (12000$) - Chains to 3 enemies, +40% damage",
                    "Path 2-5: Lightning Master (20000$) - Chains to 4 enemies, 2x damage"
                ]
            },
            
            mortar: {
                name: "Mortar Tower",
                cost: 1200,
                description: "Long-range explosive damage (100 damage, 7000ms interval)",
                path1: "Path 1: Heavy Artillery - Massive explosion damage",
                path2: "Path 2: Tactical Support - Crowd control effects",
                upgrades: [
                    "Path 1-1: High Explosive (800$) - +150 damage, +10% radius",
                    "Path 1-2: Heavy Ordnance (2000$) - +30% damage, +20% radius",
                    "Path 1-3: Concentrated Blast (4500$) - +50% damage, armor piercing",
                    "Path 1-4: Napalm Shells (8000$) - +75% damage, stealth detection",
                    "Path 1-5: Nuclear Artillery (15000$) - 2.5x damage, crit chance",
                    "Path 2-1: EMP Shells (1000$) - Adds stun effect",
                    "Path 2-2: Cryogenic Payload (2500$) - 30% slow effect",
                    "Path 2-3: Shockwave Artillery (5000$) - Enhanced CC, +50 damage",
                    "Path 2-4: Shock and Awe (12000$) - Massive CC, +100 damage",
                    "Path 2-5: Strategic Command (20000$) - Ultimate CC, +50% damage"
                ]
            },
            
            cannon: {
                name: "Cannon Tower",
                cost: 500,
                description: "Medium-range explosive damage (75 damage, 2000ms interval)",
                path1: "Path 1: Anti-Tank - Single target and armor piercing",
                path2: "Path 2: Anti-Group - Area damage and crowd control",
                upgrades: [
                    "Path 1-1: Reinforced Barrel (800$) - +50 damage, armor piercing",
                    "Path 1-2: AP Rounds (2000$) - +75 damage, 20% crit chance",
                    "Path 1-3: Depleted Uranium (4500$) - +50% damage, 30% crit",
                    "Path 1-4: Tank Hunter (8000$) - +75% damage, -500ms interval",
                    "Path 1-5: Siege Breaker (15000$) - +50% damage, 50% crit chance",
                    "Path 2-1: Spread Shot (1000$) - +30% explosion radius",
                    "Path 2-2: Shrapnel Shells (2500$) - +40% radius, +40 damage",
                    "Path 2-3: Chain Reaction (5000$) - +50% radius, -200ms interval",
                    "Path 2-4: Carpet Bomber (12000$) - +60% radius, +30% damage",
                    "Path 2-5: Apocalypse Cannon (20000$) - 2x radius, stun effect"
                ]
            }
        };
    
        return (
            <div className="space-y-6">
                {Object.entries(towerData).map(([key, tower]) => (
                    <div key={key} className="bg-slate-700 p-4 rounded-lg hover:bg-slate-600 transition-all">
                        <div 
                            className="flex items-center gap-4 mb-4 cursor-pointer group"
                            onClick={() => setSelectedTowerInfo(selectedTowerInfo === key ? null : key)}
                        >
                            <div className="relative">
                                <img 
                                    src={`/${key}.png`} 
                                    alt={tower.name} 
                                    className="w-16 h-16 border-2 border-blue-400 rounded-lg"
                                />
                                <span className="absolute -top-2 -right-2 bg-blue-500 text-white px-2 py-1 rounded-full text-sm">
                                    {tower.cost}$
                                </span>
                            </div>
                            <div className="flex-1">
                                <h3 className="text-2xl text-white font-bold mb-1">{tower.name}</h3>
                                <p className="text-gray-300 text-sm">{tower.description}</p>
                            </div>
                            <span className="text-blue-400 text-sm">
                                {selectedTowerInfo === key ? '▼ Hide Details' : '▶ Show Details'}
                            </span>
                        </div>
                        
                        {selectedTowerInfo === key && (
                            <div className="mt-4 ml-4 space-y-4 border-t border-blue-400 pt-4">
                                <div className="grid grid-cols-2 gap-6">
                                    {/* Path 1 */}
                                    <div className="space-y-2">
                                        <h4 className="text-lg text-red-400 font-bold mb-3">{tower.path1}</h4>
                                        {tower.upgrades.slice(0, 5).map((upgrade, index) => (
                                            <div 
                                                key={index} 
                                                className="bg-slate-800 p-2 rounded border border-red-400/30 hover:border-red-400 transition-all"
                                            >
                                                <p className="text-red-300">{upgrade}</p>
                                            </div>
                                        ))}
                                    </div>
                                    {/* Path 2 */}
                                    <div className="space-y-2">
                                        <h4 className="text-lg text-blue-400 font-bold mb-3">{tower.path2}</h4>
                                        {tower.upgrades.slice(5, 10).map((upgrade, index) => (
                                            <div 
                                                key={index} 
                                                className="bg-slate-800 p-2 rounded border border-blue-400/30 hover:border-blue-400 transition-all"
                                            >
                                                <p className="text-blue-300">{upgrade}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="mt-4 bg-slate-800 p-3 rounded">
                                    <p className="text-yellow-400 text-sm">
                                        Note: You can upgrade both paths up to level 2. After level 3, you must commit to one path.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        );
    };

    const renderMechanicsContent = () => (
        <div className="space-y-6">
            {/* Tower Upgrades section update */}
            <div className="bg-slate-700 p-4 rounded-lg">
                <h3 className="text-xl text-white mb-2">Tower Upgrades System</h3>
                <p className="text-gray-300">• Each tower has two upgrade paths</p>
                <p className="text-gray-300">• Path 1 (Red) and Path 2 (Blue) offer different specializations</p>
                <p className="text-gray-300">• Can upgrade both paths up to level 2</p>
                <p className="text-gray-300">• After level 3, must commit to one path</p>
                <p className="text-gray-300">• Maximum upgrade level is 5 per path</p>
                <p className="text-gray-300">• Later upgrades require previous upgrades in that path</p>
            </div>
    
            {/* Update the Tower Placement section */}
            <div className="bg-slate-700 p-4 rounded-lg">
                <h3 className="text-xl text-white mb-2">Tower Placement & Management</h3>
                <p className="text-gray-300">• Place towers on building sites marked on the map</p>
                <p className="text-gray-300">• Click a tower to open upgrade menu</p>
                <p className="text-gray-300">• Blue circle shows tower&apos;s range</p>
                <p className="text-gray-300">• Sell towers for 75% of total investment</p>
                <p className="text-gray-300">• Switch targeting between First, Last, and Highest HP</p>
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
                        <img src="/armoredbasicEnemy.png" alt="Armored Enemy" className="w-8 h-8"/>
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
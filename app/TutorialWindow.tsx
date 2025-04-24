import React, { useState } from "react";
import { towerUpgrades } from "./towerUpgrades";
import Image from "next/image";
interface TutorialWindowProps {
  onClose: () => void;
}

const TutorialWindow: React.FC<TutorialWindowProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<
    "towers" | "mechanics" | "patchNotes"
  >("towers");
  const [selectedTowerInfo, setSelectedTowerInfo] = useState<string | null>(
    null
  );

  const renderTowerContent = () => {
    const baseTowerData = {
      basic: {
        name: "Basic Tower",
        cost: 100,
        description:
          "Balanced tower with good damage and attack speed (50 damage, 1000ms interval)",
        path1:
          "Path 1: Attack Speed - Multiple targets and faster firing with acceleration",
        path2:
          "Path 2: Heavy Damage - Increasing damage with enemy marking capabilities",
      },
      sniper: {
        name: "Sniper Tower",
        cost: 200,
        description:
          "High single-target damage with long range (120 damage, 2000ms interval)",
        path1:
          "Path 1: Heavy Impact - Massive damage and stunning capabilities",
        path2: "Path 2: Speed Focus - Multiple targets with rapid firing",
      },
      gasSpitter: {
        name: "Gas Spitter",
        cost: 300,
        description:
          "Poisons enemies with damage over time (20 damage + 25 poison/tick)",
        path1: "Path 1: Gas Cloud - Area control with regen blocking",
        path2: "Path 2: Melting Toxin - Specialized in melting boss enemies",
      },
      slower: {
        name: "Slower Tower",
        cost: 300,
        description: "Slows down enemies in range (10 damage, 25% slow)",
        path1: "Path 1: Movement Control - Enhanced slowing and area control",
        path2: "Path 2: Frost Master - Freezes multiple enemies in place",
      },
      rapidShooter: {
        name: "Rapid Shooter",
        cost: 500,
        description: "High attack speed tower (20 damage, 350ms interval)",
        path1:
          "Path 1: Multi-shot - Multiple target attacks and low HP execution",
        path2: "Path 2: Chain Lightning - Chain attacks between enemies",
      },

      mortar: {
        name: "Mortar Tower",
        cost: 1200,
        description:
          "Long-range explosive damage (450 damage, 8500ms interval)",
        path1:
          "Path 1: Heavy Artillery - Massive boss damage with long intervals",
        path2: "Path 2: Tactical Support - Reduces enemy max HP and stuns",
      },

      cannon: {
        name: "Cannon Tower",
        cost: 500,
        description:
          "Medium-range explosive damage (100 damage, 2750ms interval)",
        path1: "Path 1: Critical Strike - High damage with critical hit chance",
        path2:
          "Path 2: Area Control - Area damage and current health percentage damage",
      },
    };

    return (
      <div className="space-y-6">
        {Object.entries(towerUpgrades).map(([key, upgrades]) => {
          const tower = baseTowerData[key as keyof typeof baseTowerData];
          if (!tower) return null;

          return (
            <div key={key} className="tower-card">
              <div
                className="flex items-center gap-4 mb-4 cursor-pointer group"
                onClick={() =>
                  setSelectedTowerInfo(selectedTowerInfo === key ? null : key)
                }
              >
                <div className="relative">
                  <Image
                    src={`/${key}.png`}
                    alt={tower.name}
                    className="tower-image w-32 h-32 object-contain"
                    width={100} // Increased from 35
                    height={100} // Increased from 35
                    quality={100}
                  />
                  <span className="absolute -top-2 -right-20 tower-cost">
                    {tower.cost}$
                  </span>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl text-white font-bold mb-1">
                    {tower.name}
                  </h3>
                  <p className="text-gray-300 text-sm">{tower.description}</p>
                </div>
                <span className="text-blue-400 text-sm">
                  {selectedTowerInfo === key
                    ? "▼ Hide Details"
                    : "▶ Show Details"}
                </span>
              </div>

              {selectedTowerInfo === key && (
                <div className="mt-4 ml-4 space-y-4 border-t border-blue-400 pt-4">
                  <div className="grid grid-cols-2 gap-6">
                    {/* Path 1 */}
                    <div className="space-y-2">
                      <h4 className="upgrade-path-1">{tower.path1}</h4>
                      {upgrades
                        .filter((upgrade) => upgrade.path === 1)
                        .map((upgrade, index) => (
                          <div key={index} className="upgrade-item">
                            <p className="text-red-300">
                              {`Path 1-${index + 1}: ${upgrade.name} (${
                                upgrade.cost
                              }$) - ${upgrade.description}`}
                            </p>
                          </div>
                        ))}
                    </div>
                    {/* Path 2 */}
                    <div className="space-y-2">
                      <h4 className="upgrade-path-2">{tower.path2}</h4>
                      {upgrades
                        .filter((upgrade) => upgrade.path === 2)
                        .map((upgrade, index) => (
                          <div key={index} className="upgrade-item">
                            <p className="text-blue-300">
                              {`Path 2-${index + 1}: ${upgrade.name} (${
                                upgrade.cost
                              }$) - ${upgrade.description}`}
                            </p>
                          </div>
                        ))}
                    </div>
                  </div>
                  <div className="mt-4 bg-slate-800 p-3 rounded">
                    <p className="text-yellow-400 text-sm">
                      Note: You can upgrade both paths up to level 2. After
                      level 3, you must commit to one path.
                    </p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  const renderMechanicsContent = () => (
    <div className="space-y-6">
      {/* Tower Upgrades section update */}
      <div className="bg-sky-800/80 p-4 rounded-lg border border-cyan-400/30">
        <h3 className="text-xl text-white mb-2">Tower Upgrades System</h3>
        <p className="text-gray-300">• Each tower has two upgrade paths</p>
        <p className="text-gray-300">
          • Path 1 (Red) and Path 2 (Blue) offer different specializations
        </p>
        <p className="text-gray-300">• Can upgrade both paths up to level 2</p>
        <p className="text-gray-300">
          • After level 3, must commit to one path
        </p>
        <p className="text-gray-300">• Maximum upgrade level is 5 per path</p>
        <p className="text-gray-300">
          • Later upgrades require previous upgrades in that path
        </p>
      </div>

      {/* Update the Tower Placement section */}
      <div className="bg-sky-800/80 p-4 rounded-lg border border-cyan-400/30">
        <h3 className="text-xl text-white mb-2">
          Tower Placement & Management
        </h3>
        <p className="text-gray-300">
          • Place towers on building sites marked on the map
        </p>
        <p className="text-gray-300">• Click a tower to open upgrade menu</p>
        <p className="text-gray-300">
          • Yellow circle shows tower&apos;s range
        </p>
        <p className="text-gray-300">
          • Sell towers for 75% of total investment
        </p>
        <p className="text-gray-300">
          • Switch targeting between First, Last, and Highest HP
        </p>
      </div>

      <div className="bg-sky-800/80 p-4 rounded-lg border border-cyan-400/30">
        <h3 className="text-xl text-white mb-2">Targeting Options</h3>
        <p className="text-gray-300">
          • First - Targets enemy furthest along the path
        </p>
        <p className="text-gray-300">• Last - Targets enemy closest to start</p>
        <p className="text-gray-300">
          • Highest HP - Targets enemy with most health
        </p>
        <p className="text-gray-300">
          • Change targeting in tower upgrade menu
        </p>
      </div>

      {/* Enemy Types */}
      <div className="bg-sky-800/80 p-4 rounded-lg border border-cyan-400/30">
        <h3 className="text-xl text-white mb-2">Enemy Types</h3>
        <div className="space-y-2">
          <div className="flex items-center gap-4">
            <Image
              src="/basicEnemy.png"
              width={100} // Increased from 35
              height={100} // Increased from 35
              quality={100}
              alt="Normal Enemy"
              className="w-8 h-8"
            />
            <p className="text-gray-300">• Normal - Basic enemies</p>
          </div>
          <div className="flex items-center gap-4">
            <Image
              src="/speedy.png"
              width={100} // Increased from 35
              height={100} // Increased from 35
              quality={100}
              alt="Fast Enemy"
              className="w-8 h-8"
            />
            <p className="text-gray-300">
              • Fast - Moves quickly but has less HP
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Image
              src="/tank.png"
              width={100} // Increased from 35
              height={100} // Increased from 35
              quality={100}
              alt="Tank Enemy"
              className="w-8 h-8"
            />
            <p className="text-gray-300">• Tank - High HP but moves slowly</p>
          </div>
          <div className="flex items-center gap-4">
            <Image
              src="/stealth.png"
              width={100} // Increased from 35
              height={100} // Increased from 35
              quality={100}
              alt="Stealth Enemy"
              className="w-8 h-8"
            />
            <p className="text-gray-300">
              • Stealth - Invisible to towers without stealth detection
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Image
              src="/regenTank.png"
              width={100} // Increased from 35
              height={100} // Increased from 35
              quality={100}
              alt="Regenerating Enemy"
              className="w-8 h-8"
            />
            <p className="text-gray-300">
              • Regenerating - Recovers HP over time
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Image
              src="/armoredbasicEnemy.png"
              width={100} // Increased from 35
              height={100} // Increased from 35
              quality={100}
              alt="Armored Enemy"
              className="w-8 h-8"
            />
            <p className="text-gray-300">
              • Armored - immune to non explosive attacks
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Image
              src="/boss.png"
              alt="Boss Enemy"
              width={100} // Increased from 35
              height={100} // Increased from 35
              quality={100}
              className="w-8 h-8"
            />
            <p className="text-yellow-300">
              • Boss - Very high HP and regenerates (appears in rounds 32 and
              40)
            </p>
          </div>
        </div>
      </div>

      {/* Game Controls */}
      <div className="bg-sky-800/80 p-4 rounded-lg border border-cyan-400/30">
        <h3 className="text-xl text-white mb-2">Game Controls</h3>
        <p className="text-gray-300">• Press Start to begin the game</p>
        <p className="text-gray-300">• Speed up button doubles game speed</p>
        <p className="text-gray-300">
          • Pause button freezes the game (only between rounds)
        </p>
        <p className="text-gray-300">• 50 rounds to complete</p>
      </div>
    </div>
  );
  const renderPatchNotesContent = () => (
    <div className="space-y-6">
      {/* Tower Upgrades section update */}
      <div className="bg-sky-800/80 p-4 rounded-lg border border-cyan-400/30">
        <h2 className="text-xl text-white mb-2">Patch Notes 12.03.2025</h2>
        <div className="mt-6 space-y-4">
          <h4 className="text-lg text-white">Cannon</h4>
          <p className="text-gray-300">
            •Path 2 small rework: Now this path focuses on dealing current enemy
            percent dmg.
          </p>
        </div>
        <div className="mt-6 space-y-4">
          <h4 className="text-lg text-white">Mortar</h4>
          <p className="text-gray-300">
            •Path 2 rework: Now this path focuses on reducing enemy max health
            and stuns.
          </p>
        </div>
        <div className="mt-6 space-y-4">
          <h4 className="text-lg text-white">Basic</h4>
          <p className="text-gray-300">
            •Path 1 nerf: Can no longer literally one shot bosses.
          </p>
        </div>
        <div className="mt-6 space-y-4">
          <h4 className="text-lg text-white">Slower</h4>
          <p className="text-gray-300">
            •Path 1 nerf: His explosion radius got significantly reduced.
          </p>
          <p className="text-gray-300">
            •Path 2 buff: Attack interval reduced.
          </p>
        </div>
        <div className="mt-6 space-y-4">
          <h4 className="text-lg text-white">Sniper</h4>
          <p className="text-gray-300">
            •Path 1 nerf: Reduced its max dmg from about 23 000 to about 15 000.
          </p>
          <p className="text-gray-300">
            •Path 2 buff: Reduced its max attack interval from 150 to 70.
          </p>
        </div>
        <div className="mt-6 space-y-4">
          <h4 className="text-lg text-white">Systems</h4>
          <p className="text-gray-300">•Further upgrade adjustments.</p>
          <p className="text-gray-300">•Added new spawner enemies types.</p>
          <p className="text-gray-300">
            •Added stealth focused targetting type.
          </p>
          <p className="text-gray-300">
            •Since round 150, two new enemies will start to appear: Ultra Boss
            and Mega Boss spawner.
          </p>
        </div>
        <h3 className="text-xl text-white mb-2">Patch Notes 11.03.2025</h3>
        <div className="mt-6 space-y-4">
          <h4 className="text-lg text-white">Slower</h4>
          <p className="text-gray-300">
            •Path 1 Nerfed: His max slow is now 85%.
          </p>
        </div>
        <div className="mt-6 space-y-4">
          <h4 className="text-lg text-white">Slower</h4>
          <p className="text-gray-300">
            •Path 1 Nerfed: His max slow is now 85%.
          </p>
        </div>
        <div className="mt-6 space-y-4">
          <h4 className="text-lg text-white">Systems</h4>
          <p className="text-gray-300">•New stats menu ui.</p>
          <p className="text-gray-300">•Fixed enemies spawn after round 65.</p>
          <p className="text-gray-300">
            •After round 65 enemies will now gain more speed every round.
          </p>
        </div>
        <h3 className="text-xl text-white mb-2">Patch Notes 10.03.2025</h3>

        {/* Reworked Tower Paths section */}
        <div className="mt-6 space-y-4">
          <h4 className="text-lg text-white">Basic Tower</h4>
          <p className="text-gray-300">
            • Reworked Path 1: Focus on accelerated shots that deal more damage
            the more they attack the same target.
          </p>
          <p className="text-gray-300">
            • Reworked Path 2: Slow, high-damage attacker that marks enemies to
            take more damage from other towers.
          </p>
        </div>

        {/* Sniper Adjustments section */}
        <div className="mt-6 space-y-4">
          <h4 className="text-lg text-white">Sniper Tower Adjustments</h4>
          <p className="text-gray-300">
            • Path 1: Deals more damage and is better at stunning.
          </p>
          <p className="text-gray-300">
            • Path 2: Can no longer stun and deals less overall damage.
          </p>
        </div>

        {/* Slower Tower Adjustments */}
        <div className="mt-6 space-y-4">
          <h4 className="text-lg text-white">Slower Tower Adjustments</h4>
          <p className="text-gray-300">
            • Completely reworked Path 2: Now can stun all enemies within its
            range, becoming the stun master.
          </p>
        </div>

        {/* Rapid Tower Adjustments */}
        <div className="mt-6 space-y-4">
          <h4 className="text-lg text-white">Rapid Tower Adjustments</h4>
          <p className="text-gray-300">
            • Path 1: Now executes enemies at certain thresholds and can target
            up to 5 enemies at a time.
          </p>
        </div>

        {/* Gas Spitter Tower Adjustments */}
        <div className="mt-6 space-y-4">
          <h4 className="text-lg text-white">Gas Spitter Tower Adjustments</h4>
          <p className="text-gray-300">
            • Path 2: Now worse at clearing waves of enemies.
          </p>
        </div>

        {/* Cannon Tower Adjustments */}
        <div className="mt-6 space-y-4">
          <h4 className="text-lg text-white">Cannon Tower Adjustments</h4>
          <p className="text-gray-300">
            • Path 1: Deals more overall damage and can stun enemies.
          </p>
        </div>
      </div>
    </div>
  );
  return (
    <div className="fixed inset-0 bg-sky-900/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gradient-to-br from-sky-900 via-blue-900 to-cyan-900 p-6 rounded-lg max-w-4xl w-full max-h-[80vh] overflow-y-auto border-2 border-cyan-400/50 shadow-lg shadow-cyan-500/30">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-500">
            Game Guide
          </h2>
          <button
            onClick={onClose}
            className="text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab("towers")}
            className={`px-4 py-2 rounded-lg transition-all ${
              activeTab === "towers"
                ? "bg-cyan-600/80 text-white shadow-lg shadow-cyan-500/30"
                : "bg-sky-800/80 text-gray-300 hover:bg-sky-700/80"
            }`}
          >
            Towers
          </button>
          <button
            onClick={() => setActiveTab("mechanics")}
            className={`px-4 py-2 rounded-lg transition-all ${
              activeTab === "mechanics"
                ? "bg-cyan-600/80 text-white shadow-lg shadow-cyan-500/30"
                : "bg-sky-800/80 text-gray-300 hover:bg-sky-700/80"
            }`}
          >
            Game Mechanics
          </button>
          <button
            onClick={() => setActiveTab("patchNotes")}
            className={`px-4 py-2 rounded-lg transition-all ${
              activeTab === "patchNotes"
                ? "bg-cyan-600/80 text-white shadow-lg shadow-cyan-500/30"
                : "bg-sky-800/80 text-gray-300 hover:bg-sky-700/80"
            }`}
          >
            Patch Notes
          </button>
        </div>

        {/* Update tower card styles */}
        <style jsx>{`
          .tower-card {
            @apply bg-sky-800/80 p-4 rounded-lg hover:bg-sky-700/80 transition-all 
                        border border-cyan-400/30 hover:border-cyan-400/60;
          }
          .tower-image {
            @apply border-2 border-cyan-400/50 rounded-lg;
          }
          .tower-cost {
            @apply bg-cyan-600/80 text-white;
          }
          .upgrade-path-1 {
            @apply text-cyan-300 font-bold mb-3;
          }
          .upgrade-path-2 {
            @apply text-blue-300 font-bold mb-3;
          }
          .upgrade-item {
            @apply bg-sky-900/80 p-2 rounded border border-cyan-400/30 
                        hover:border-cyan-400/60 transition-all;
          }
        `}</style>

        {/* Apply new styles to existing content */}
        <div className="space-y-6">
          {activeTab === "towers"
            ? renderTowerContent()
            : activeTab === "mechanics"
            ? renderMechanicsContent()
            : renderPatchNotesContent()}
        </div>
      </div>
    </div>
  );
};

export default TutorialWindow;

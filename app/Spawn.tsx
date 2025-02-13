import React, { useState, useEffect, useCallback} from 'react';
import { v4 as uuidv4 } from 'uuid';



// Define the props for the Spawn component
interface SpawnProps {
  round: number;
  setHealthPoints: React.Dispatch<React.SetStateAction<number>>;
  money: number;
  setMoney: React.Dispatch<React.SetStateAction<number>>;
  setRound: React.Dispatch<React.SetStateAction<number>>;
  hp: number;
}

// Define the Enemy interface
interface Enemy {
  id: string;
  positionX: number;
  positionY: number;
  hp: number;
  speed: number;
  baseSpeed: number;
  damage: number;
  src: string;
  type: string;
  regen: number;
  isTargeted: boolean;  
}

// Define the Tower interface
interface Tower {
  id: string;
  positionX: number;
  positionY: number;
  attack: number;
  attackSpeed: number;
  furthestEnemyInRange: Enemy[] | null;
  isAttacking: boolean;
  price: number;
  type: string;
  maxDamage: number;
  maxAttackSpeed: number;
  radius: number;
  attackType: string;
  canHitStealth: boolean;
  slowAmount: number;
  maxSlow:number;
}

const Spawn: React.FC<SpawnProps> = ({ round, setHealthPoints, money, setMoney, setRound, hp }) => {
  // Game state
  const [enemies, setEnemies] = useState<Enemy[]>([]);
  const [tower, setTower] = useState<Tower[]>([]);
  const [attackEffects, setAttackEffects] = useState<{ 
    id: string; 
    towerPositionX: number; 
    towerPositionY: number; 
    enemyPositionX: number; 
    enemyPositionY: number; 
    timestamp?: number 
  }[]>([]);
  const [enemyCount, setEnemyCount] = useState(0);
  const [showUpgradeMenu, setShowUpgradeMenu] = useState(false);
  const [showTowerSelectMenu, setShowTowerSelectMenu] = useState(false);
  const [selectedTowerID, setSelectedTowerID] = useState('');
  const [selectedTower, setSelectedTower] = useState<{ 
    towerPositionX: number; 
    towerPositionY: number; 
    element: HTMLImageElement;
  }[]>([]);
  
  // Add this new state near other state declarations
  const [isPageVisible, setIsPageVisible] = useState(true);

  // Add this new useEffect for visibility tracking
  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsPageVisible(!document.hidden);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);
  
  // First, extract enemy types as constants
  const ENEMY_TYPES = {
    BASIC: {
      src: 'enemy1.png',
      hp: 100,
      damage: 5,
      type: 'basic',
      speed: 0.225,    // from 0.150 * 1.5
      baseSpeed: 0.225, // from 0.150 * 1.5
      regen: 0
    },
    STEALTH: {
      src: 'enemy2.png',
      hp: 50,
      damage: 10,
      type: 'stealth',
      speed: 0.225,    // from 0.150 * 1.5
      baseSpeed: 0.225, // from 0.150 * 1.5
      regen: 0
    },
    TANK: {
      src: 'enemy3.png',
      hp: 350,
      damage: 5,
      type: 'basic',
      speed: 0.1875,    // from 0.125 * 1.5
      baseSpeed: 0.1875, // from 0.125 * 1.5
      regen: 0
    },
    SPEEDY: {
      src: 'enemy4.png',
      hp: 50,
      damage: 35,
      type: 'speedy',
      speed: 1.5,    // from 1.0 * 1.5
      baseSpeed: 1.5, // from 1.0 * 1.5
      regen: 0
    },
    STEALTHYTANK: {
      src: 'stealthyTank.png',
      hp: 250,
      damage: 20,
      type: 'stealthytank',
      speed: 0.1875,    // from 0.125 * 1.5
      baseSpeed: 0.1875, // from 0.125 * 1.5
      regen: 0
    },
    STEALTHYSPEEDY: {
      src: 'stealthySpeedy.png',
      hp: 50,
      damage: 50,
      type: 'stealthyspeedy',
      speed: 1.5,    // from 1.0 * 1.5
      baseSpeed: 1.5, // from 1.0 * 1.5
      regen: 0
    },
    REGENTANK: {
      src: 'regenTank.png',
      hp: 300,
      damage: 50,
      type: 'regentank',
      speed: 0.1875,    // from 0.125 * 1.5
      baseSpeed: 0.1875, // from 0.125 * 1.5
      regen: 100
    },
    SPEEDYREGENTANK: {
      src: 'regenTank.png',
      hp: 450,
      damage: 50,
      type: 'speedyregentank',
      speed: 0.35,    // from 0.2 * 1.5
      baseSpeed: 0.35, // from 0.2 * 1.5
      regen: 150
    }
  };

// Add this near ENEMY_TYPES constant
const TOWER_TYPES = {
  BASIC: {
    src: '/tower1.png',
    attack: 50,
    attackSpeed: 1000,
    price: 100,
    type: 'basic',
    maxDamage: 250,
    maxAttackSpeed: 300,
    radius: 25,
    attackType: 'single',
    canHitStealth: false,
    slowAmount: 1,
    maxSlow: 1
  },
  SNIPER: {
    src: '/tower2.png',
    attack: 100,
    attackSpeed: 2000,
    price: 200,
    type: 'sniper',
    maxDamage: 300,
    maxAttackSpeed: 1200,
    radius: 90,
    attackType: 'single',
    canHitStealth: true,
    slowAmount: 1,
    maxSlow: 1
    
  },
  RAPIDSHOOTER: {
    src: '/rapidShooter.png',
    attack: 25,
    attackSpeed: 400,
    price: 500,
    type: 'rapidShooter',
    maxDamage: 75,
    maxAttackSpeed: 200,
    radius: 25,
    attackType: 'double',
    canHitStealth: false,
    slowAmount: 1,
    maxSlow: 1
  },
  SLOWER: {
    src: '/slower.png',
    attack: 15,
    attackSpeed: 1500,
    price: 300,
    type: 'slower',
    maxDamage: 40,
    maxAttackSpeed: 750,
    radius: 25,
    attackType: 'single',
    canHitStealth: false,
    slowAmount: 0.75,
    maxSlow: 0.6
  }
};

// Then create a helper function for creating new towers
const createNewTower = (type: keyof typeof TOWER_TYPES, positionX: number, positionY: number, id: string) => ({
  id: id,
  positionX: positionX,
  positionY: positionY,
  furthestEnemyInRange: null,
  isAttacking: false,
  ...TOWER_TYPES[type]
});

// Then, create helper function for spawning enemies
const createNewEnemy = (type: keyof typeof ENEMY_TYPES) => ({
  id: uuidv4(),
  positionX: -7,
  positionY: 50,
  isTargeted: false,
  ...ENEMY_TYPES[type]
});

useEffect(() => {
  if (hp <= 0) {
    alert('Game Over! You lost!');
    setRound(0);
    setEnemyCount(0);
    setHealthPoints(100);
    setMoney(200);
    setEnemies([]);
    setTower([]);
    setShowUpgradeMenu(false);
    const tower1Elements = document.querySelectorAll('img[src="/tower1.png"]') as NodeListOf<HTMLImageElement>;
    const tower2Elements = document.querySelectorAll('img[src="/tower2.png"]') as NodeListOf<HTMLImageElement>;
    const tower3Elements = document.querySelectorAll('img[src="/rapidShooter.png"]') as NodeListOf<HTMLImageElement>;
    const tower4Elements = document.querySelectorAll('img[src="/slower.png"]') as NodeListOf<HTMLImageElement>;
    [...tower1Elements, ...tower2Elements, ...tower3Elements, ...tower4Elements].forEach((element) => {
      element.src = '/buildingSite.png';
    });
  }
}, [hp]);

useEffect(() => {
  if (!isPageVisible) return; // Stop if page is not visible   
  const spawnEnemies = () => {
    // Check for game over first
    if (round > 30 && enemies.length === 0) {
      alert('Congratulations! You won!');
      setRound(0);
      setEnemyCount(0);
      setHealthPoints(100);
      setMoney(200);
      setEnemies([]);
      setTower([]);
      setShowUpgradeMenu(false);
      const tower1Elements = document.querySelectorAll('img[src="/tower1.png"]') as NodeListOf<HTMLImageElement>;
    const tower2Elements = document.querySelectorAll('img[src="/tower2.png"]') as NodeListOf<HTMLImageElement>;
    const tower3Elements = document.querySelectorAll('img[src="/rapidShooter.png"]') as NodeListOf<HTMLImageElement>;
    const tower4Elements = document.querySelectorAll('img[src="/slower.png"]') as NodeListOf<HTMLImageElement>;
    [...tower1Elements, ...tower2Elements, ...tower3Elements, ...tower4Elements].forEach((element) => {
      element.src = '/buildingSite.png';
    });
      return;
    }

    // Early rounds - Basic enemies
    if ((round > 0 && round <= 4) || (round > 5 && round < 10)) {
      if (enemyCount < 10 * round) {
        setEnemies(prev => [...prev, createNewEnemy('BASIC')]);
        setEnemyCount(prev => prev + 1);
      }
    }
    // Boss round - Stealth enemies
    else if (round === 5 && enemyCount < 10 * round) {
      const enemyType = enemyCount % 2 === 0 ? 'STEALTH' : 'SPEEDY';
      setEnemies(prev => [...prev, createNewEnemy(enemyType)]);
      setEnemyCount(prev => prev + 1);
    }
    // Later rounds - Mixed enemies
    else if (round >= 10 && round <= 15 && enemyCount < 10 * round) {
      const enemyType = enemyCount % 3 === 0 ? 'STEALTH' : 
                       enemyCount % 3 === 1 ? 'SPEEDY' : 'BASIC';
      setEnemies(prev => [...prev, createNewEnemy(enemyType)]);
      setEnemyCount(prev => prev + 1);
    }
    else if (round > 15 && round <= 19 && enemyCount < 10 * round) {
      const enemyType = enemyCount % 3 === 0 ? 'STEALTH' : 
                       enemyCount % 3 === 1 ? 'SPEEDY' : 'TANK';
      setEnemies(prev => [...prev, createNewEnemy(enemyType)]);
      setEnemyCount(prev => prev + 1);
    }
    else if (round === 20 && enemyCount < 10 * round) {
      setEnemies(prev => [...prev, createNewEnemy("REGENTANK")]);
      setEnemyCount(prev => prev + 1);
    }
    else if (round >= 21 && round <= 29 && enemyCount < 15 * round) {
      const enemyType = enemyCount % 3 === 0 ? 'STEALTHYTANK' : 
                       enemyCount % 3 === 1 ? 'STEALTHYSPEEDY' : 'REGENTANK';
      setEnemies(prev => [...prev, createNewEnemy(enemyType)]);
      setEnemyCount(prev => prev + 1);
    }
    else if (round === 30 && enemyCount < 10 * round) {
      setEnemies(prev => [...prev, createNewEnemy("SPEEDYREGENTANK")]);
      setEnemyCount(prev => prev + 1);
    }
    // Game reset
    else if (round === 0) {
      setEnemies([]);
    }
    // Round completion
    if (enemies.length === 0 && enemyCount === 10 * round || enemyCount === 15 * round) {
      setRound(prev => prev + 1);
      setEnemyCount(0);
    }
  };

  const spawnInterval = setInterval(() => {
    if (round > 0) {
      spawnEnemies();
    }
  }, Math.max(1000 / round, 50));

  // Cleanup
  return () => clearInterval(spawnInterval);
}, [round, enemyCount, enemies.length, isPageVisible]); 

  // Enemy movement - updates position every 25ms
  useEffect(() => {
    if (!isPageVisible || round <= 0) return; // Stop if page is not visible

    const interval = setInterval(moveEnemy, 25);
    return () => clearInterval(interval);
  }, [round, isPageVisible]); // Add isPageVisible to dependencies

  // Heal enemy every second if it has health regeneration
  useEffect(() => {
    if (!isPageVisible || round <= 0) return; // Stop if page is not visible

    const interval = setInterval(() => {
      setEnemies((prevEnemies) => 
        prevEnemies.map(enemy => 
          enemy.regen > 0 ? {...enemy, hp: enemy.hp + enemy.regen} : enemy
        )
      )
    }, 1500);
    return () => clearInterval(interval);
  }, [enemies, isPageVisible]); 

  // Main tower attack logic
 const towerAttack = useCallback((tower: Tower, targets: Enemy[]) => {
  if (tower.isAttacking) return;
 
  setTower((prevTowers) =>
    prevTowers.map((t) =>
      t.id === tower.id ? { ...t, isAttacking: true } : t
    )
  );

  // Mark targets as targeted
  setEnemies((prevEnemies) =>
    prevEnemies.map((enemy) => {
      const isTargeted = targets.some(target => target.id === enemy.id);
      return isTargeted ? { ...enemy, isTargeted: true } : enemy;
    })
  );

  const newEffects = targets.map(target => ({
    id: uuidv4(),
    towerPositionX: tower.positionX,
    towerPositionY: tower.positionY,
    enemyPositionX: target.positionX,
    enemyPositionY: target.positionY,
    timestamp: Date.now()
  }));
  
  setAttackEffects((prevEffects) => [...prevEffects, ...newEffects]);
  setMoney((prevMoney) => prevMoney + Math.floor(tower.attack / 7.5));

  setTimeout(() => {
    setAttackEffects((prevEffects) => 
      prevEffects.filter((effect) => !newEffects.find(e => e.id === effect.id))
    );
    setTower((prevTowers) =>
      prevTowers.map((t) =>
        t.id === tower.id ? { ...t, isAttacking: false } : t
      )
    );
    // Unmark targets after attack
    setEnemies((prevEnemies) =>
      prevEnemies.map((enemy) => {
        const wasTargeted = targets.some(target => target.id === enemy.id);
        return wasTargeted ? { ...enemy, isTargeted: false } : enemy;
      })
    );
  }, tower.attackSpeed);

  setEnemies((prevEnemies) =>
    prevEnemies.map((enemy) => {
      const isTargeted = targets.some(target => target.id === enemy.id);
      if (isTargeted) {
        return { 
          ...enemy, 
          hp: enemy.hp - tower.attack, 
          speed: Math.max(enemy.speed * tower.slowAmount, enemy.baseSpeed * 0.5)
        };
      }
      return enemy;
    })
  );

}, []);

  // Tower targeting system - updates target when enemies move
  useEffect(() => {
    if (!isPageVisible) return; // Stop if page is not visible

    setTower((prevTowers) =>
      prevTowers.map((tower) => ({
        ...tower,
        furthestEnemyInRange: getFurthestEnemyInRadius(tower.positionX, tower.radius, tower.canHitStealth, tower.attackType, tower.attack) ?? null
      })
      )
    );
  }, [enemies, isPageVisible]); // Add isPageVisible to dependencies
  
  // Tower attack execution - triggers attacks when targets are available
  useEffect(() => {
    if (!isPageVisible) return; // Stop if page is not visible

    tower.forEach((t) => {
      if (t.furthestEnemyInRange && !t.isAttacking) {
        towerAttack(t, t.furthestEnemyInRange);
      }
    });
  }, [tower, towerAttack, isPageVisible]); // Add isPageVisible to dependencies

  // Create enemy elements
  const createEnemy = () => {
    if (round > 0) {
      return enemies.map((enemy) => (
        <img
          key={enemy.id}
          src={enemy.src}
          alt='enemy'
          style={{
            position: 'absolute',
            top: `${enemy.positionY}%`,
            left: `${enemy.positionX}%`,
            transform: 'translateY(-50%)',
            zIndex: 10,
          }}
        />
      ));
    }
  };

  // Move enemies by updating their position
  const moveEnemy = () => {
    setEnemies((prevEnemies) =>
      prevEnemies
        .map((enemy) => {
          // Define waypoints/checkpoints for the path
          if (enemy.positionX < 30) {
            // First segment - Move right until x=30
            return { ...enemy, positionX: enemy.positionX + enemy.speed };
          } else if (enemy.positionX >= 30 && enemy.positionX < 50 && enemy.positionY > 15) {
            // Second segment - Move up until y=15
            return { ...enemy, positionY: enemy.positionY - (enemy.speed * 2) };
          } else if (enemy.positionY <= 15 && enemy.positionX < 50) {
            // Third segment - Move right until x=50
            return { ...enemy, positionX: enemy.positionX + enemy.speed };
          } else if (enemy.positionX >= 50 && enemy.positionX < 75 && enemy.positionY < 82) {
            // Fourth segment - Move down until y=75
            return { ...enemy, positionY: enemy.positionY + enemy.speed * 2 };
          } else if (enemy.positionY >= 82 && enemy.positionX < 75) {
            // Fifth segment - Move right until x=70
            return { ...enemy, positionX: enemy.positionX + enemy.speed };
          } else if (enemy.positionX >= 70 && enemy.positionY > 50) {
            // Sixth segment - Move up until y=50
            return { ...enemy, positionY: enemy.positionY - (enemy.speed * 2) };
          } else {
            // Final segment - Move right until end
            return { ...enemy, positionX: enemy.positionX + enemy.speed };
          }
        })
        .filter((enemy) => enemy.hp > 0)
    );
  };

  // Reduce player's health points if enemies reach the end
  const damagePlayer = (enemies: Enemy[]) => {
    enemies.forEach((enemy) => {
      if (enemy.positionX > 99) { // Changed from >= 100 to > 95
        setHealthPoints((prevHealthPoints) => prevHealthPoints - enemy.damage);
        setEnemies((prevEnemies) => prevEnemies.filter(e => e.id !== enemy.id)); // Remove the enemy that dealt damage
      }
    });
  };

  // Call damagePlayer whenever enemies change
  useEffect(() => {
    damagePlayer(enemies);
  }, [enemies]);

  // Buy towers and place them on the map
  const buyTowers = (event: React.MouseEvent<HTMLImageElement>, positionX: number,positionY:number) => {
    if (round > 0 && (event.target as HTMLImageElement).src.includes('buildingSite')) {
      setShowUpgradeMenu(false);
      setShowTowerSelectMenu(true);
      const newTowerId = uuidv4();  // Generate ID first
      (event.target as HTMLImageElement).id = newTowerId;  // Set the ID of the clicked element
      setSelectedTowerID(newTowerId);  // Set the selected tower ID
      setSelectedTower([{ towerPositionX: positionX, towerPositionY: positionY, element: event.target as HTMLImageElement }]);
    }
    else if (round > 0 && !(event.target as HTMLImageElement).src.includes('buildingSite')) {
      setShowUpgradeMenu(true);
      setShowTowerSelectMenu(false);
      setSelectedTowerID((event.target as HTMLImageElement).id);
    }
  };
  
// Then modify the selectTowerType function to use these constants
const selectTowerType = (type: string, newTowerId: string) => {
  const towerType = type.toUpperCase() as keyof typeof TOWER_TYPES;
  const towerConfig = TOWER_TYPES[towerType];
  
  if (!towerConfig || money < towerConfig.price) return;

  selectedTower[0].element.src = towerConfig.src;
  setShowTowerSelectMenu(false);
  setMoney((prevMoney) => prevMoney - towerConfig.price);
  setTower((prevTower) => [...prevTower, createNewTower(towerType, selectedTower[0].towerPositionX, selectedTower[0].towerPositionY, newTowerId)]);
};

const closeTowerSelectMenu = () => {
  setShowTowerSelectMenu(false);
}
const upgradeTower = () => {
  if (showUpgradeMenu) {
    const selectedTower = tower.find(t => t.id === selectedTowerID);
    
    if (!selectedTower) return null;

    return (
      <div className='absolute top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-40 bg-slate-400 flex 
        flex-col items-center justify-center p-4 rounded-lg gap-2'
        style={{left: selectedTower.positionX < 50 ? '80%' : '20%'}}
      >
        <h1 className="text-xl font-bold mb-2">Upgrade Menu</h1>
              {selectedTower.attack < selectedTower.maxDamage ? (
                <button 
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded w-full"
                  onClick={upgradeDamage}
                  disabled={money < 250}
                >
                  Upgrade Damage (250$ for +25dmg)
                </button>
              ) : (
                <div className="bg-gray-500 text-white font-bold py-2 px-4 rounded w-full text-center">
                  Max Damage Reached
                </div>
              )}
              {selectedTower.attackSpeed > selectedTower.maxAttackSpeed ? (
                <button 
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full"
                  onClick={upgradeAttackSpeed}
                  disabled={money < 500}
                >
                  Upgrade Attack Speed (500$ for -200ms)
                </button>
              ) : (
                <div className="bg-gray-500 text-white font-bold py-2 px-4 rounded w-full text-center">
                  Max Attack Speed Reached
                </div>
              )}
              {selectedTower.attackType === 'single' ? (
                <button 
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full"
                  onClick={upgradeDoubleAttack}
                  disabled={money < 1500}
                >
                  Upgrade Double Attack (1500$)
                </button>
              ) : selectedTower.type === "basic" ?(
                <div className="bg-gray-500 text-white font-bold py-2 px-4 rounded w-full text-center">
                  Already have double attack
                </div>
              ) : null}
              {selectedTower.type === "rapidShooter" && selectedTower.attackType === 'double' ? (
                <button 
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full"
                  onClick={upgradeToTrippleAttack}
                  disabled={money < 2500}
                >
                  Upgrade Tripple Attack (2500$)
                </button>
              ) : selectedTower.type === "rapidShooter" ?(
                <div className="bg-gray-500 text-white font-bold py-2 px-4 rounded w-full text-center">
                  Already have Tripple Attack
                </div>
              ) : null}
              {!selectedTower.canHitStealth ? (
                <button 
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full"
                  onClick={upgradeToHitStealth}
                  disabled={money < 2000}
                >
                  Upgrade to hit stealth (2000$)
                </button>
              ) : (
                <div className="bg-gray-500 text-white font-bold py-2 px-4 rounded w-full text-center">
                  Already can hit stealth
                </div>
              )}
              {selectedTower.type === "slower" && selectedTower.slowAmount !== selectedTower.maxSlow ? (
                <button 
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full"
                  onClick={upgradeSlow}
                  disabled={money < 1000}
                >
                  Upgrade Slow (1000$)
                </button>
              ) : (
                <div className="bg-gray-500 text-white font-bold py-2 px-4 rounded w-full text-center">
                  Slow already upgraded
                </div>
              )}
              <button 
                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded w-full mt-2"
                onClick={() => sellTower(selectedTower.price)}
              >
                Sell Tower
              </button>
              <button 
                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded w-full mt-2"
                onClick={closeUpgradeMenu}
              >
                Close
              </button>
              <div>
                <h1>Stats:</h1>
                <div>Attack: {selectedTower.attack}</div>
                <div>Attack Speed: {selectedTower.attackSpeed}</div>
                <div>Attack Type: {selectedTower.attackType}</div>
                <div>Can hit stealth: {selectedTower.canHitStealth ? 'Yes' : 'No'}</div>
              </div>
      </div>
    );
  }
  return null;
};
  const closeUpgradeMenu = () => {
    setShowUpgradeMenu(false);
  }
  
  const upgradeDamage = () => {
    if (money >= 250){
      setMoney((prevMoney) => prevMoney - 250);
      setTower((prevTower) => 
        prevTower.map((t) =>
          t.id === selectedTowerID ? { ...t, attack: Math.min(t.attack + 25, t.maxDamage) } : t
        )
      );
    }
    
  }
  const upgradeAttackSpeed = () => {
    if (money >= 500){
      setMoney((prevMoney) => prevMoney - 500);
      setTower((prevTower) => 
        prevTower.map((t) =>
          t.id === selectedTowerID ? { ...t, attackSpeed: Math.max(t.attackSpeed - 200, t.maxAttackSpeed) } : t
        )
      );
    }
  }
  const upgradeDoubleAttack = () => {
    if (money >= 1500){
      setMoney((prevMoney) => prevMoney - 1500);
      setTower((prevTower) => 
        prevTower.map((t) =>
          t.id === selectedTowerID ? { ...t,  attackType: 'double' } : t
        )
      );
    }
  }
  const upgradeToTrippleAttack = () => {
    if (money >= 2000){
      setMoney((prevMoney) => prevMoney - 2500);
      setTower((prevTower) => 
        prevTower.map((t) =>
          t.id === selectedTowerID ? { ...t, attackType: 'triple'} : t
        )
      );
    }
  }
  const upgradeToHitStealth = () => {
    if (money >= 2000){
      setMoney((prevMoney) => prevMoney - 2000);
      setTower((prevTower) => 
        prevTower.map((t) =>
          t.id === selectedTowerID ? { ...t, canHitStealth: true} : t
        )
      );
    }
  }
  const upgradeSlow = () => {
    if (money >= 1000){
      setMoney((prevMoney) => prevMoney - 1000);
      setTower((prevTower) => 
        prevTower.map((t) =>
          t.id === selectedTowerID ? { ...t, slowAmount: Math.max(t.slowAmount - 0.25, t.maxSlow) } : t
        )
      );
    }
  }
  const sellTower = (towerPrice: number) => {
    setMoney((prevMoney) => prevMoney + towerPrice / 2); // Add money back (changed from subtract)
    setTower((prevTower) => 
        prevTower.filter((t) => t.id !== selectedTowerID) // Filter out the selected tower
    );
    
    // Reset the building site image
    const towerElement = document.getElementById(selectedTowerID) as HTMLImageElement;
    if (towerElement) {
        towerElement.src = '/buildingSite.png';
    }
    
    setShowUpgradeMenu(false); // Close the upgrade menu after selling
};
  // Component for attack animation
  const attackAnimation = () => {
    return attackEffects.map((effect) => (
        <img
          src='/attack.png'
          key={effect.id}
          className='z-20 animate-slide h-6 w-6 absolute text-red-500'
          style={{
            '--tower-positionX': `${effect.towerPositionX + 1}%`,
            '--tower-positionY': `${effect.towerPositionY}%`,
            '--enemy-positionX': `${effect.enemyPositionX + 2.5}%`,
            '--enemy-positionY': `${effect.enemyPositionY + 2.5}%`,
            left: `${effect.towerPositionX}%`,
            animationDuration: `150ms`,
          } as React.CSSProperties}
        />
          
      ));
  };

  

  // Get the furthest enemy within a certain radius from the tower
  const getFurthestEnemyInRadius = (towerPositionX: number, radius: number, canHitStealth: boolean, attackType: string, attackDamage: number) => {
    const enemiesInRadius = enemies.filter((enemy) => {
      // Calculate distance between tower and enemy
      const dx = enemy.positionX - towerPositionX;
      const dy = enemy.positionY - selectedTower[0].towerPositionY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      const isInRange = distance <= radius;
      
      if (canHitStealth) {
        // Only consider enemy as targetable if it's not targeted OR if it's targeted but one more hit won't overkill it
        return isInRange && (!enemy.isTargeted || (enemy.hp - attackDamage > 0));
      } else {
        return isInRange && 
               (!enemy.isTargeted || (enemy.hp - attackDamage > 0)) && 
               (enemy.type !== "stealth" && enemy.type !== "stealthytank" && enemy.type !== "stealthyspeedy");
      }
    });
  
    if (enemiesInRadius.length === 0) {
      return null;
    }
  
    // Calculate progress value for each enemy based on their position in the path
    const enemiesWithProgress = enemiesInRadius.map(enemy => {
      let progress = 0;
      
      if (enemy.positionX < 30) {
        // First segment
        progress = enemy.positionX;
      } else if (enemy.positionX >= 30 && enemy.positionX < 50 && enemy.positionY > 15) {
        // Second segment
        progress = 30 + (50 - enemy.positionY);
      } else if (enemy.positionY <= 15 && enemy.positionX < 50) {
        // Third segment
        progress = 65 + enemy.positionX;
      } else if (enemy.positionX >= 50 && enemy.positionX < 75 && enemy.positionY < 82) {
        // Fourth segment
        progress = 115 + enemy.positionY;
      } else if (enemy.positionY >= 82 && enemy.positionX < 75) {
        // Fifth segment
        progress = 197 + enemy.positionX;
      } else if (enemy.positionX >= 70 && enemy.positionY > 50) {
        // Sixth segment
        progress = 272 + (82 - enemy.positionY);
      } else {
        // Final segment
        progress = 304 + enemy.positionX;
      }
      
      return { ...enemy, progress };
    });
  
    // Sort enemies by their progress value (highest progress = furthest along path)
    const sortedEnemies = enemiesWithProgress.sort((a, b) => b.progress - a.progress);
  
    // Return enemies based on attack type
    if (attackType === 'double' && sortedEnemies.length >= 2) {
      return sortedEnemies.slice(0, 2);
    } 
    else if (attackType === 'triple' && sortedEnemies.length >= 3) {
      return sortedEnemies.slice(0, 3);
    } else {
      return [sortedEnemies[0]];
    }
  };

// Add this new component near your other components
const RangeIndicator = ({ tower }: { tower: Tower }) => {
  return showUpgradeMenu && (
      <div
      className="absolute rounded-full border-2 border-blue-400 pointer-events-none"
      style={{
        width: `${tower.radius * 2}%`,    // Doubled the radius for diameter
        height: `${tower.radius * 2}%`,   // Doubled the radius for diameter
        left: `${tower.positionX}%`,
        top: `${tower.positionY}%`,
        transform: 'translate(-50%, -50%)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        zIndex: 5,
      }}
    />
  )
}

  return (
    <div className='relative h-[77%] border mt-10 border-white overflow-hidden' suppressHydrationWarning>
      <img src='/map.png' className='object-cover w-full h-full z-0' alt='map' />
      {/* Add range indicators for all towers */}
      {tower.map((t) => (
        <RangeIndicator key={`range-${t.id}`} tower={t} />
      ))}
      <img src='/buildingSite.png' className='absolute top-[28%] left-[20%] w-20 h-20 z-10' onClick={(event) => buyTowers(event, 20,28)} />
      <img src='/buildingSite.png' className='absolute top-[28%] left-[5%] w-20 h-20 z-10' onClick={(event) => buyTowers(event, 5,28)} />
      <img src='/buildingSite.png' className='absolute top-[35%] left-[41%] w-20 h-20 z-10' onClick={(event) => buyTowers(event, 41,35)} />
      <img src='/buildingSite.png' className='absolute top-[60%] left-[63%] w-20 h-20 z-10' onClick={(event) => buyTowers(event, 63,60)} />
      <img src='/buildingSite.png' className='absolute top-[20%] left-[63%] w-20 h-20 z-10' onClick={(event) => buyTowers(event, 63,20)} />
      <img src='/buildingSite.png' className='absolute top-[40%] left-[63%] w-20 h-20 z-10' onClick={(event) => buyTowers(event, 63,40)} />
      <img src='/buildingSite.png' className='absolute top-[25%] left-[85%] w-20 h-20 z-10' onClick={(event) => buyTowers(event, 85,25)} />
      <img src='/buildingSite.png' className='absolute top-[65%] left-[10%] w-20 h-20 z-10' onClick={(event) => buyTowers(event, 10,65)} />
      <img src='/buildingSite.png' className='absolute top-[65%] left-[25%] w-20 h-20 z-10' onClick={(event) => buyTowers(event, 25,65)} />
      <img src='/buildingSite.png' className='absolute top-[52.5%] left-[41%] w-20 h-20 z-10' onClick={(event) => buyTowers(event, 41,52.5)} />
      <img src='/buildingSite.png' className='absolute top-[70%] left-[41%] w-20 h-20 z-10' onClick={(event) => buyTowers(event, 41,70)} />
      <img src='/buildingSite.png' className='absolute top-[65%] left-[82%] w-20 h-20 z-10' onClick={(event) => buyTowers(event, 82,65)} />
      {createEnemy()}
      {upgradeTower()}
      {attackAnimation()}
      {showTowerSelectMenu && (
      <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-40 bg-slate-400 flex flex-col items-center justify-center p-4 rounded-lg gap-2'>
        <h1 className="text-xl font-bold mb-2">Tower Select Menu</h1>
        <div className='flex gap-4'>
          <div>
            <button onClick={() => selectTowerType("basic",selectedTowerID)}>
              <img src='/tower1.png' className='w-16 h-16'/>
            </button>
            <h1>100$</h1>
            <h1>Basic</h1>
          </div>
          <div>
            <button onClick={() => selectTowerType("sniper",selectedTowerID)}>
              <img src='/tower2.png' className='w-16 h-16'/>
            </button>
            <h1>200$</h1>
            <h1>Sniper</h1>
          </div>
          <div>
            <button onClick={() => selectTowerType("rapidShooter",selectedTowerID)}>
              <img src='/rapidShooter.png' className='w-16 h-16'/>
            </button>
            <h1>500$</h1>
            <h1>Rapid
               <p>Shooter</p></h1>
          </div>
          <div>
            <button onClick={() => selectTowerType("slower",selectedTowerID)}>
              <img src='/slower.png' className='w-16 h-16'/>
            </button>
            <h1>300$</h1>
            <h1>Slower</h1>
          </div>
        </div>
        <button 
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded w-full mt-2"
              onClick={closeTowerSelectMenu}
              >
                Close
              </button>
      </div>
    )}
    
    </div>
    
  );
};

export default Spawn;
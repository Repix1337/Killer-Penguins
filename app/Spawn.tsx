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
  position: number;
  hp: number;
  damage: number;
  src: string;
  type: string;
}

// Define the Tower interface
interface Tower {
  id: string;
  position: number;
  attack: number;
  attackSpeed: number;
  furthestEnemyInRange: Enemy | null;
  isAttacking: boolean;
  price: number;
  type: string;
  maxDamage: number;
  maxAttackSpeed: number;
  radius: number;
}

const Spawn: React.FC<SpawnProps> = ({ round, setHealthPoints, money, setMoney, setRound, hp }) => {
  // Game state
  const [enemies, setEnemies] = useState<Enemy[]>([]);
  const [tower, setTower] = useState<Tower[]>([]);
  const [attackEffects, setAttackEffects] = useState<{ 
    id: string; 
    towerPosition: number; 
    enemyPosition: number; 
    timestamp?: number 
  }[]>([]);
  const [enemyCount, setEnemyCount] = useState(0);
  const [showUpgradeMenu, setShowUpgradeMenu] = useState(false);
  const [showTowerSelectMenu, setShowTowerSelectMenu] = useState(false);
  const [selectedTowerID, setSelectedTowerID] = useState('');
  const [selectedTower, setSelectedTower] = useState<{ 
    towerPosition: number; 
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
  
  // Enemy spawning - creates new enemies every second
  useEffect(() => {
    if (!isPageVisible) return; // Stop if page is not visible

    const interval = setInterval(() => {
    if (round > 0 && enemyCount < 20 * round) {
       if (enemyCount % 5 !== 0) {
        setEnemies((prevEnemy) => [
          ...prevEnemy,
          { id: uuidv4(), position: -7, src: 'enemy1.png', hp: 100, damage: 5, type: 'basic' },
        ]);
        setEnemyCount((prevCount) => prevCount + 1);
      }
      else if (enemyCount % 5 === 0)
      {
        setEnemies((prevEnemy) => [
          ...prevEnemy,
          { id: uuidv4(), position: -7, src: 'enemy2.png', hp: 50, damage: 10, type: 'stealth' },
        ]);
        setEnemyCount((prevCount) => prevCount + 1);
      }
    }
    else if (round === 0) {
      setEnemies([]);
    }
    else if (enemyCount === 20 * round) {
      setRound((prevRound) => prevRound + 1);
      setEnemyCount(0);
    }
    if (hp <= 0) {
      setRound(0);
      setEnemyCount(0);
      setHealthPoints(100);
      setMoney(200);
      setEnemies([]);
      setTower([]);
      setShowUpgradeMenu(false);
      const tower1Elements = document.querySelectorAll('img[src="/tower1.png"]') as NodeListOf<HTMLImageElement>;
      const tower2Elements = document.querySelectorAll('img[src="/tower2.png"]') as NodeListOf<HTMLImageElement>;

      [...tower1Elements, ...tower2Elements].forEach((element) => {
        element.src = '/buildingSite.png';
      });
    }
  }, 1000 / round);
  return () => clearInterval(interval);
  }, [round,enemyCount,hp, isPageVisible]); // Add isPageVisible to dependencies

  // Enemy movement - updates position every 50ms
  useEffect(() => {
    if (!isPageVisible || round <= 0) return; // Stop if page is not visible

    const interval = setInterval(moveEnemy, 25);
    return () => clearInterval(interval);
  }, [round, isPageVisible]); // Add isPageVisible to dependencies

  // Main tower attack logic
  const towerAttack = useCallback((tower: Tower, furthestEnemy: Enemy) => {
    if (tower.isAttacking) return;
   
    setTower((prevTowers) =>
      prevTowers.map((t) =>
        t.id === tower.id ? { ...t, isAttacking: true } : t
      )
    );
  
    const newEffect = { 
      id: uuidv4(), 
      towerPosition: tower.position, 
      enemyPosition: furthestEnemy.position, 
      timestamp: Date.now() 
    };
    
    setAttackEffects((prevEffects) => [...prevEffects, newEffect]);
    setMoney((prevMoney) => prevMoney + tower.attack / 5);
    setTimeout(() => {
      setAttackEffects((prevEffects) => 
        prevEffects.filter((effect) => effect.id !== newEffect.id)
      );
      setTower((prevTowers) =>
        prevTowers.map((t) =>
          t.id === tower.id ? { ...t, isAttacking: false } : t
        )
      );
    }, tower.attackSpeed);
  
    setEnemies((prevEnemies) =>
      prevEnemies.map((enemy) => {
        if (furthestEnemy && enemy.id === furthestEnemy.id) {
          return { ...enemy, hp: enemy.hp - tower.attack };
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
        furthestEnemyInRange: getFurthestEnemyInRadius(tower.position, tower.radius, tower.type) ?? null
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
            top: '50%',
            left: `${enemy.position}%`,
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
        .map((enemy) => ({
          ...enemy,
          position: enemy.position + 0.125,
        }))
        .filter((enemy) => enemy.position <= 100)
        .filter((enemy) => enemy.hp > 0)
    );
  };

  // Reduce player's health points if enemies reach the end
  const damagePlayer = (enemies: Enemy[]) => {
    enemies.forEach((enemy) => {
      if (enemy.position >= 100) {
        setHealthPoints((prevHealthPoints) => prevHealthPoints - enemy.damage);
      }
    });
  };

  // Call damagePlayer whenever enemies change
  useEffect(() => {
    damagePlayer(enemies);
  }, [enemies]);

  // Buy towers and place them on the map
  const buyTowers = (event: React.MouseEvent<HTMLImageElement>, positionX: number,price: number) => {
    if (round > 0 && (event.target as HTMLImageElement).src.includes('buildingSite')) {
      setShowTowerSelectMenu(true);
      const newTowerId = uuidv4();  // Generate ID first
      (event.target as HTMLImageElement).id = newTowerId;  // Set the ID of the clicked element
      setSelectedTowerID(newTowerId);  // Set the selected tower ID
      setSelectedTower([{ towerPosition: positionX, element: event.target as HTMLImageElement }]);
    }
    else if (round > 0 && !(event.target as HTMLImageElement).src.includes('buildingSite')) {
      setShowUpgradeMenu(true);
      setSelectedTowerID((event.target as HTMLImageElement).id);
    }
  };
  const selectTowerType = (type: string, newTowerId: string) => {
    if (type === 'basic' && money >= 100) {
      selectedTower[0].element.src = "/tower1.png";
      setShowTowerSelectMenu(false);
      setMoney((prevMoney) => prevMoney - 100);
      setTower((prevTower) => {
        const newTower = { 
          id: newTowerId,  // Use the same ID
          position: selectedTower[0].towerPosition, 
          attack: 50, 
          attackSpeed: 1000,
          furthestEnemyInRange: null, 
          isAttacking: false, 
          price: 100, 
          type: type,
          maxDamage: 100,
          maxAttackSpeed: 300,
          radius: 10
        };
        return [...prevTower, newTower];
      });
    }
    else if (type === 'sniper' && money >= 200) {
      selectedTower[0].element.src = "/tower2.png";
      setShowTowerSelectMenu(false);
      setMoney((prevMoney) => prevMoney - 200);
      setTower((prevTower) => {
        const newTower = { 
          id: newTowerId,  // Use the same ID
          position: selectedTower[0].towerPosition, 
          attack: 100, 
          attackSpeed: 2000,
          furthestEnemyInRange: null, 
          isAttacking: false, 
          price: 200, 
          type: type,
          maxDamage: 100,
          maxAttackSpeed: 1000,
          radius: 80
        };
        return [...prevTower, newTower];
      });
    }
}
const closeTowerSelectMenu = () => {
  setShowTowerSelectMenu(false);
}
  const upgradeTower = () => {
    if (showUpgradeMenu) {
      const selectedTower = tower.find(t => t.id === selectedTowerID);
      
      return (
        <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-40 bg-slate-400 flex flex-col items-center justify-center p-4 rounded-lg gap-2'>
          <h1 className="text-xl font-bold mb-2">Upgrade Menu</h1>
          {selectedTower && (
            <>
              {selectedTower.attack < selectedTower.maxDamage ? (
                <button 
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded w-full"
                  onClick={upgradeDamage}
                  disabled={money < 150}
                >
                  Upgrade Damage (150$ for +25dmg)
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
                  disabled={money < 200}
                >
                  Upgrade Attack Speed (200$ for -100ms)
                </button>
              ) : (
                <div className="bg-gray-500 text-white font-bold py-2 px-4 rounded w-full text-center">
                  Max Attack Speed Reached
                </div>
              )}
              <button 
                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded w-full mt-2"
                onClick={closeUpgradeMenu}
              >
                Close
              </button>
            </>
          )}
        </div>
      );
    }
    return null;
  };

  const closeUpgradeMenu = () => {
    setShowUpgradeMenu(false);
  }
  
  const upgradeDamage = () => {
    if (money >= 150){
      setMoney((prevMoney) => prevMoney - 150);
      setTower((prevTower) => 
        prevTower.map((t) =>
          t.id === selectedTowerID ? { ...t, attack: t.attack + 25 } : t
        )
      );
    }
    
  }
  const upgradeAttackSpeed = () => {
    if (money >= 200){
      setMoney((prevMoney) => prevMoney - 200);
      setTower((prevTower) => 
        prevTower.map((t) =>
          t.id === selectedTowerID ? { ...t, attackSpeed: t.attackSpeed - 100 } : t
        )
      );
    }
  }
  // Component for attack animation
  const attackAnimation = () => {
    return attackEffects.map((effect) => (
        <img
          src='/attack.png'
          key={effect.id}
          className='z-20 animate-slide h-6 w-6 absolute text-red-500'
          style={{
            '--tower-position': `${effect.towerPosition + 1}%`,
            '--enemy-position': `${effect.enemyPosition + 2.5}%`,
            left: `${effect.towerPosition}%`,
            animationDuration: `100ms`,
          } as React.CSSProperties}
        />
          
      ));
  };

  

  // Get the furthest enemy within a certain radius from the tower
  const getFurthestEnemyInRadius = (towerPosition: number, radius: number, type: string) => {
    
    const enemiesInRadius = enemies.filter(
      (enemy) => enemy.position <= towerPosition + radius && enemy.position >= towerPosition - radius 
      && type === "sniper" ? enemy.type === "stealth" || enemy.type != "stealth"  : enemy.type != "stealth" 
    );

    if (enemiesInRadius.length === 0) {
      return null;
    }

    return enemiesInRadius.reduce((maxEnemy, currentEnemy) => {
      return currentEnemy.position > maxEnemy.position ? currentEnemy : maxEnemy;
    }, enemiesInRadius[0]);
  }
  return (
    <div className='relative h-4/5 border border-white overflow-hidden'>
      <img src='/map.png' className='object-cover w-full h-full z-0' alt='map' />
      <img src='/buildingSite.png' className='absolute top-[20%] left-[10%] w-20 h-20 z-10' onClick={(event) => buyTowers(event, 10,100)} />
      <img src='/buildingSite.png' className='absolute top-[20%] left-[25%] w-20 h-20 z-10' onClick={(event) => buyTowers(event, 25,150)} />
      <img src='/buildingSite.png' className='absolute top-[20%] left-[40%] w-20 h-20 z-10' onClick={(event) => buyTowers(event, 40,200)} />
      <img src='/buildingSite.png' className='absolute top-[20%] left-[55%] w-20 h-20 z-10' onClick={(event) => buyTowers(event, 55,250)} />
      <img src='/buildingSite.png' className='absolute top-[20%] left-[70%] w-20 h-20 z-10' onClick={(event) => buyTowers(event, 70,300)} />
      <img src='/buildingSite.png' className='absolute top-[20%] left-[85%] w-20 h-20 z-10' onClick={(event) => buyTowers(event, 85,350)} />
      {createEnemy()}
      {attackAnimation()}
      {upgradeTower()}
      {showTowerSelectMenu && (
      <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-40 bg-slate-400 flex flex-col items-center justify-center p-4 rounded-lg gap-2'>
        <h1 className="text-xl font-bold mb-2">Tower Select Menu</h1>
        <div>
          <button onClick={() => selectTowerType("basic",selectedTowerID)}>
            <img src='/tower1.png' className='w-16 h-16'/>
          </button>
          <button onClick={() => selectTowerType("sniper",selectedTowerID)}>
            <img src='/tower2.png' className='w-16 h-16'/>
          </button>
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
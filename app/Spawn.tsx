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
  isSpeedUp: boolean;  
  isPaused: boolean;
  setCanPause: React.Dispatch<React.SetStateAction<boolean>>;
  selectedTowerType: string;
}
interface TowerUpgrade {
  name: string;
  cost: number;
  description: string;
  effect: (tower: Tower) => Partial<Tower>;
  requires?: number; // Previous upgrade level required
}

// Define the Enemy interface
interface Enemy {
  id: string;
  positionX: number;
  positionY: number;
  hp: number;
  maxHp: number;
  speed: number;
  baseSpeed: number;
  isSlowed: boolean;
  slowSourceId?: string;
  slowStartTime?: number;
  damage: number;
  src: string;
  type: string;
  regen: number;
  isTargeted: boolean;  
  isPoisoned: boolean;
  poisonSourceId?: string;
  poisonStartTime?: number;
  canRegen: boolean;
  isArmored: boolean;
}

// Define the Tower interface
interface Tower {
  id: string;
  positionX: number;
  positionY: number;
  damageDone: number;
  baseAttackInterval: number;
  baseAttack: number;
  attack: number;
  attackInterval: number; // renamed from attackSpeed
  furthestEnemyInRange: Enemy[] | null;
  isAttacking: boolean;
  price: number;
  towerWorth: number;
  type: string;
  targettingType: string;
  maxDamage: number;
  maxAttackInterval: number; // renamed from maxAttackSpeed
  radius: number;
  attackType: string;
  canHitStealth: boolean;
  slowAmount?: number; // Make slowAmount optional
  maxSlow?:number; // Make maxSlow optional
  slowDuration?: number; // Make slowAmount optional
  poisonDamage: number;
  maxPoisonDamage: number;
  hasSpecialUpgrade: boolean;
  specialUpgradeAvailable: boolean;
  canStopRegen: boolean;
  src: string; // Add src property
  effectSrc: string; // Add effectSrc property
  explosionRadius: number;
  upgradeLevel: number;
  hasCritical?: boolean;
  criticalChance?: number;
  criticalMultiplier?: number;
  canHitArmored?: boolean;
}

const Spawn: React.FC<SpawnProps> = ({ round, setHealthPoints, money, setMoney, setRound, hp, isSpeedUp, isPaused, setCanPause, selectedTowerType }) => {
  // Game state
  const [enemies, setEnemies] = useState<Enemy[]>([]);
  const [tower, setTower] = useState<Tower[]>([]);
  const [attackEffects, setAttackEffects] = useState<{ 
    id: string; 
    towerPositionX: number; 
    towerPositionY: number; 
    enemyPositionX: number; 
    enemyPositionY: number;
    effectSrc: string; 
    timestamp?: number 
  }[]>([]);
  const [enemyCount, setEnemyCount] = useState(0);
  const [showUpgradeMenu, setShowUpgradeMenu] = useState(false);
  const [selectedTowerID, setSelectedTowerID] = useState('');
  const [explosionEffects, setExplosionEffects] = useState<{
      id: string;
      positionX: number;
      positionY: number;
      timestamp: number;
      
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
      src: 'basic.png',
      hp: 100,
      damage: 5,
      type: 'basic',
      speed: 0.225,    // from 0.150 * 1.5
      baseSpeed: 0.225, // from 0.150 * 1.5
      regen: 0,
      canRegen: false,
      isArmored: false,
    },
    STEALTH: {
      src: 'stealth.png',
      hp: 50,
      damage: 10,
      type: 'stealth',
      speed: 0.225,    // from 0.150 * 1.5
      baseSpeed: 0.225, // from 0.150 * 1.5
      regen: 0,
      canRegen: false,
      isArmored: false,
    },
    TANK: {
      src: 'tank.png',
      hp: 350,
      damage: 5,
      type: 'basic',
      speed: 0.1875,    // from 0.125 * 1.5
      baseSpeed: 0.1875, // from 0.125 * 1.5
      regen: 0,
      canRegen: false,
      isArmored: false,
    },
    SPEEDY: {
      src: 'speedy.png',
      hp: 50,
      damage: 35,
      type: 'speedy',
      speed: 1.5,    // from 1.0 * 1.5
      baseSpeed: 1.5, // from 1.0 * 1.5
      regen: 0,
      canRegen: false,
      isArmored: false,
    },
    STEALTHYTANK: {
      src: 'stealthyTank.png',
      hp: 250,
      damage: 20,
      type: 'stealthytank',
      speed: 0.1875,    // from 0.125 * 1.5
      baseSpeed: 0.1875, // from 0.125 * 1.5
      regen: 0,
      canRegen: false,
      isArmored: false,
    },
    STEALTHYSPEEDY: {
      src: 'stealthySpeedy.png',
      hp: 50,
      damage: 50,
      type: 'stealthyspeedy',
      speed: 1.5,    // from 1.0 * 1.5
      baseSpeed: 1.5, // from 1.0 * 1.5
      regen: 0,
      canRegen: false,
      isArmored: false,
    },
    REGENTANK: {
      src: 'regenTank.png',
      hp: 400,
      damage: 50,
      type: 'regentank',
      speed: 0.1875,    // from 0.125 * 1.5
      baseSpeed: 0.1875, // from 0.125 * 1.5
      regen: 100,
      canRegen: true,
      isArmored: false,
    },
    SPEEDYREGENTANK: {
      src: 'regenTank.png',
      hp: 500,
      damage: 50,
      type: 'speedyregentank',
      speed: 0.35,    // from 0.2 * 1.5
      baseSpeed: 0.35, // from 0.2 * 1.5
      regen: 150,
      canRegen: true,
      isArmored: false,
    }
    ,
    BOSS: {
      src: 'boss.png',
      hp: 40000,
      damage: 1000,
      type: 'boss',
      speed: 0.175,    
      baseSpeed: 0.175, 
      regen: 1200,
      canRegen: true,
      isArmored: false,
    },
    ULTRATANKS: {
      src: 'ultraTank.png',
      hp: 1500,
      damage: 1000,
      type: 'ultratank',
      speed: 0.15,    
      baseSpeed: 0.15, 
      regen: 0,
      canRegen: false,
      isArmored: false,
    },
    ARMOREDBASIC: {
      src: 'armoredbasic.png',
      hp: 150,
      damage: 30,
      type: 'armoredbasic',
      speed: 0.2,    
      baseSpeed: 0.2, 
      regen: 0,
      canRegen: false,
      isArmored: true,
    },
    ARMOREDTANK: {
      src: 'armoredtank.png',
      hp: 400,
      damage: 400,
      type: 'armoredtank',
      speed: 0.175,    
      baseSpeed: 0.175, 
      regen: 0,
      canRegen: false,
      isArmored: true,
    },
    ARMOREDULTRATANK: {
      src: 'armoredultraTank.png',
      hp: 1750,
      damage: 1000,
      type: 'armoredultratank',
      speed: 0.15,    
      baseSpeed: 0.15, 
      regen: 0,
      canRegen: false,
      isArmored: true,
    }
  };

// Add this near ENEMY_TYPES constant
const TOWER_TYPES = {
  BASIC: {
    src: '/tower1.png',
    baseAttack: 50,
    attack: 50,
    baseAttackInterval: 1000,
    attackInterval: 1000, // renamed from attackSpeed
    price: 100,
    towerWorth: 100,
    type: 'basic',
    maxDamage: 300,
    maxAttackInterval: 450, // renamed from maxAttackSpeed
    radius: 27,
    attackType: 'single',
    canHitStealth: false,
    poisonDamage: 0,
    maxPoisonDamage: 0,
    hasSpecialUpgrade: false,
    specialUpgradeAvailable: false,
    canStopRegen: false,
    explosionRadius: 0,
    effectSrc: '/basicAttack.png'
  },
  SNIPER: {
    src: '/tower2.png',
    baseAttack: 120,
    attack: 120,
    baseAttackInterval: 2000,
    attackInterval: 2000,
    price: 200,
    towerWorth: 200,
    type: 'sniper',
    maxDamage: 1500,
    maxAttackInterval: 1000,
    radius: 120,
    attackType: 'single',
    canHitStealth: true,
    poisonDamage: 0,
    maxPoisonDamage: 0,
    hasSpecialUpgrade: false,
    specialUpgradeAvailable: false,
    canStopRegen: false,
    explosionRadius: 0,
    effectSrc: '/sniperAttack.png'
  },
  RAPIDSHOOTER: {
    src: '/rapidShooter.png',
    baseAttack: 20,
    attack: 20,
    baseAttackInterval: 350,
    attackInterval: 350,
    price: 500,
    towerWorth: 500,
    type: 'rapidShooter',
    maxDamage: 68,
    maxAttackInterval: 200,
    radius: 27,
    attackType: 'double',
    canHitStealth: false,
    poisonDamage: 0,
    maxPoisonDamage: 0,
    hasSpecialUpgrade: false,
    specialUpgradeAvailable: false,
    canStopRegen: false,
    explosionRadius: 0,
    effectSrc: '/rapidAttack.png'
  },
  SLOWER: {
    src: '/slower.png',
    baseAttack: 10,
    attack: 10,
    baseAttackInterval: 1000,
    attackInterval: 1000,
    price: 300,
    towerWorth: 300,
    type: 'slower',
    maxDamage: 15,
    maxAttackInterval: 700,
    radius: 27,
    attackType: 'double',
    canHitStealth: false,
    slowAmount: 0.75,
    maxSlow: 0.5,
    slowDuration: 2000,
    poisonDamage: 0,
    maxPoisonDamage: 0,
    hasSpecialUpgrade: false,
    specialUpgradeAvailable: false,
    canStopRegen: false,
    explosionRadius: 0,
    effectSrc: '/slowerAttack.png'
  },
  GASSPITTER: {
    src: '/gasSpitter.png',
    baseAttack: 20,
    attack: 20,
    baseAttackInterval: 1000,
    attackInterval: 1000,
    price: 300,
    towerWorth: 300,
    type: 'gasspitter',
    maxDamage: 20,
    maxAttackInterval: 600,
    radius: 27,
    attackType: 'double',
    canHitStealth: false,
    poisonDamage: 20,
    maxPoisonDamage: 360,
    hasSpecialUpgrade: false,
    specialUpgradeAvailable: false,
    canStopRegen: false,
    explosionRadius: 0,
    effectSrc: '/poisonAttack.png'
  },
  MORTAR: {
    src: '/mortar.png',
    baseAttack: 50,
    attack: 50,
    baseAttackInterval: 7000,
    attackInterval: 7000,
    price: 1200,
    towerWorth: 1200,
    type: 'mortar',
    maxDamage: 550,
    maxAttackInterval: 4500,
    radius: 40,
    attackType: 'explosion',
    canHitStealth: false,
    poisonDamage: 0,
    maxPoisonDamage: 0,
    hasSpecialUpgrade: false,
    specialUpgradeAvailable: false,
    canStopRegen: false,
    explosionRadius: 20,
    effectSrc: '/sniperAttack.png'
  }
  ,
  CANNON: {
    src: '/cannon.png',
    baseAttack: 75,
    attack: 75,
    baseAttackInterval: 2000,
    attackInterval: 2000,
    price: 500,
    towerWorth: 500,
    type: 'cannon',
    maxDamage: 380,
    maxAttackInterval: 1000,
    radius: 27,
    attackType: 'explosion',
    canHitStealth: false,
    poisonDamage: 0,
    maxPoisonDamage: 0,
    hasSpecialUpgrade: false,
    specialUpgradeAvailable: false,
    canStopRegen: false,
    explosionRadius: 15,
    effectSrc: '/sniperAttack.png'
  }
};


// Add this helper function
const resetGame = () => {
  // Only target towers on the game board, not in the selection panel
  const buildingSites = document.querySelectorAll('img[id^="building-site-"], [id^="tower-"]');
  
  buildingSites.forEach(element => {
    if (element instanceof HTMLImageElement) {
      element.src = '/buildingSite.png';
    }
  });

  // Reset game state
  setRound(0);
  setEnemyCount(0);
  setHealthPoints(100);
  setMoney(200);
  setEnemies([]);
  setTower([]);
  setShowUpgradeMenu(false);
};

// Then create a helper function for creating new towers
const createNewTower = (type: keyof typeof TOWER_TYPES, positionX: number, positionY: number, id: string) => ({
  id: id,
  positionX: positionX,
  positionY: positionY,
  furthestEnemyInRange: null,
  isAttacking: false,
  targettingType: "first",
  damageDone: 0,
  upgradeLevel: 0,
  ...TOWER_TYPES[type]
});

// Then, create helper function for spawning enemies
const createNewEnemy = (type: keyof typeof ENEMY_TYPES) => {
  const enemyStats = ENEMY_TYPES[type];
  return {
    id: uuidv4(),
    positionX: -6,
    positionY: 54,
    isTargeted: false,
    isSlowed: false,
    isPoisoned: false,
    maxHp: enemyStats.hp, // Add this line
    ...enemyStats
  };
};

useEffect(() => {
  if (hp <= 0) {
    alert('Game Over! You lost!');
    resetGame();
  }
}, [hp]);

useEffect(() => {
  if (!isPageVisible || isPaused) return; // Add isPaused check
  const spawnEnemies = () => {
    // Check for game over first
    if (round > 40 && enemies.length === 0) {
      alert('Congratulations! You won!');
      resetGame();
      return;
    }

    // Early rounds - Basic enemies
    if ((round > 0 && round <= 4) || (round > 5 && round < 10)) {
      if (enemyCount < 10 * round) {
        setEnemies(prev => [...prev, createNewEnemy('BASIC')]);
        setEnemyCount(prev => prev + 1);
      }
      if (round === 4 && enemyCount === 0 )
      {
        alert("!!!Stealth enemies incoming next round!!!")
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
                       enemyCount % 3 === 1 ? 'SPEEDY' : 'ARMOREDBASIC';
      setEnemies(prev => [...prev, createNewEnemy(enemyType)]);
      setEnemyCount(prev => prev + 1);
    }
    else if (round > 15 && round <= 21 && enemyCount < 10 * round) {
      const enemyType = enemyCount % 3 === 0 ? 'STEALTH' : 
                       enemyCount % 3 === 1 ? 'SPEEDY' : 'TANK';
      setEnemies(prev => [...prev, createNewEnemy(enemyType)]);
      setEnemyCount(prev => prev + 1);
    }
    else if (round === 22 && enemyCount < 10 * round) {
      setEnemies(prev => [...prev, createNewEnemy("REGENTANK")]);
      setEnemyCount(prev => prev + 1);
    }
    else if (round >= 23 && round <= 25 && enemyCount < 15 * round) {
      const enemyType = enemyCount % 3 === 0 ? 'STEALTHYTANK' : 
                       enemyCount % 3 === 1 ? 'STEALTHYSPEEDY' : 'ARMOREDTANK';
      setEnemies(prev => [...prev, createNewEnemy(enemyType)]);
      setEnemyCount(prev => prev + 1);
    }
    else if (round >= 26 && round <= 31 && enemyCount < 15 * round) {
      const enemyType = enemyCount % 2 === 0 ? 'STEALTHYTANK' 
                        : 'SPEEDYREGENTANK';
      setEnemies(prev => [...prev, createNewEnemy(enemyType)]);
      setEnemyCount(prev => prev + 1);
    }
    else if (round === 32) {
      if (enemyCount < 320) {  // Changed from 15 * round to fixed 80
        setEnemies(prev => [...prev, createNewEnemy("BOSS")]);
        setEnemyCount(prev => prev + 80);
      }
    }
    else if (round > 32 && round <= 39) {
      if (enemyCount < 15 * round) {  // Changed from 15 * round to fixed 45
        const enemyType = enemyCount % 2 === 0 ? 'ARMOREDULTRATANK' 
                        : 'ULTRATANKS';
      setEnemies(prev => [...prev, createNewEnemy(enemyType)]);
        setEnemyCount(prev => prev + 3);
      }
    }
    else if (round === 40) {
      if (enemyCount < 15 * round) {  // Changed from 15 * round to fixed 40
        setEnemies(prev => [...prev, createNewEnemy("BOSS")]);
        setEnemyCount(prev => prev + 40);
      }
    }
    // Game reset
else if (round === 0) {
setEnemies([]);
}
  };

  const spawnInterval = setInterval(() => {
    if (round > 0) {
      spawnEnemies();
    }
  }, (round === 32  ? (isSpeedUp ? 2500 : 1250) : Math.max(1000 / round, 50)) / (isSpeedUp ? 2 : 1));

  // Cleanup
  return () => clearInterval(spawnInterval);
}, [round, enemyCount, enemies.length, isPageVisible, isSpeedUp, isPaused]); 


useEffect(() => {
  if (isPaused) return; // Add isPaused check
  if (enemies.length === 0 && (enemyCount >= 10 * round || enemyCount >= 15 * round)) {
    setCanPause(true); // Allow pausing when round is over
    
    const roundTimeout = setTimeout(() => {
      setRound(prev => prev + 1);
      setEnemyCount(0);
      setCanPause(false); // Disable pausing when new round starts
    }, 4000 / (isSpeedUp ? 2 : 1));

    return () => clearTimeout(roundTimeout);
  }
}, [enemies.length, enemyCount, round, isSpeedUp, isPaused]);

useEffect(() => {
  if (round > 0) {
    setCanPause(false); // Disable pausing when round is active
  }
}, [round]);

  // Enemy movement - updates position every 25ms
  useEffect(() => {
    if (!isPageVisible || round <= 0 || isPaused) return; 

    const interval = setInterval(moveEnemy, isSpeedUp ? 12.5 : 25); // Twice as fast when speed up
    return () => clearInterval(interval);
  }, [round, isPageVisible, isSpeedUp, isPaused]); // Add isPaused to dependencies

  // Heal enemy every second if it has health regeneration
  useEffect(() => {
    if (!isPageVisible || round <= 0 || isPaused) return; 

    const interval = setInterval(() => {
      setEnemies((prevEnemies) => 
        prevEnemies.map((enemy) => 
          enemy.regen > 0 && enemy.canRegen ? {...enemy, hp: enemy.hp + enemy.regen} : enemy
        )
      )
    }, 1500 / (isSpeedUp ? 2 : 1));
    return () => clearInterval(interval);
  }, [enemies, isPageVisible, isSpeedUp, isPaused]); // Add isPaused to dependencies

  // Main tower attack logic
  const towerAttack = useCallback((tower: Tower, targets: Enemy[]) => {
    if (tower.isAttacking) return;
  
    setTower((prevTowers) =>
      prevTowers.map((t) =>
        t.id === tower.id ? { ...t, isAttacking: true } : t
      )
    );
  
    let totalDamageDealt = 0;
  
    setEnemies((prevEnemies) => {
      let updatedEnemies;
      // Calculate critical hit if tower has that ability
      const isCriticalHit = tower.hasCritical && 
                           tower.criticalChance && 
                           Math.random() < tower.criticalChance;
      const damageMultiplier = isCriticalHit ? (tower.criticalMultiplier || 1) : 1;
  
      if (tower.attackType === 'explosion') {
        const primaryTarget = targets[0]; // Get the main target
        const enemiesInExplosionRadius = prevEnemies.filter(enemy => {
          if (enemy.hp <= 0 || enemy.id === primaryTarget.id) return false; // Skip dead enemies and primary target
  
          // Calculate distance between primary target and other enemies
          const dx = enemy.positionX - primaryTarget.positionX;
          const dy = enemy.positionY - primaryTarget.positionY;
          const distance = Math.sqrt(dx * dx + dy * dy);
  
          return distance <= tower.explosionRadius;
        });
        setExplosionEffects(prev => [...prev, {
          id: uuidv4(),
          positionX: primaryTarget.positionX,
          positionY: primaryTarget.positionY,
          timestamp: Date.now()
        }]);
  
        // Remove explosion effect after animation
        setTimeout(() => {
          setExplosionEffects(prev =>
            prev.filter(effect => effect.positionX !== primaryTarget.positionX)
          );
        }, 300);
        let explosionDamageTotal = 0;
        updatedEnemies = prevEnemies.map(enemy => {
          if (enemy.hp <= 0) return enemy;
  
          if (enemy.id === primaryTarget.id) {
            // Calculate actual damage for primary target
            const actualDamage = Math.max(Math.min(tower.attack * damageMultiplier, enemy.hp), 0);
            explosionDamageTotal += actualDamage;
            const newHp = enemy.hp - tower.attack;
            // Grant money if enemy dies
            if (newHp <= 0) {
              setMoney(prev => prev + Math.floor((enemy.maxHp / 10) * (round >= 33 ? 0.35 : round > 20 ? 0.5 : 1)));            }
            return {
              ...enemy,
              src: enemy.isArmored ? enemy.src.replace('armored', '') : enemy.src,
              isTargeted: true,
              hp: newHp,
              isArmored: false
            };
          }
  
          if (enemiesInExplosionRadius.some(e => e.id === enemy.id)) {
            const splashDamage = tower.attack / 2;
            const actualDamage = Math.min(splashDamage, enemy.hp);
            explosionDamageTotal += actualDamage; // Add to total damage
            const newHp = enemy.hp - splashDamage;
            // Grant money if enemy dies from splash
            if (newHp <= 0) {
              setMoney(prev => prev + Math.floor((enemy.maxHp / 10) * (round >= 33 ? 0.35 : round > 20 ? 0.5 : 1)));
            }
            return {
              ...enemy,
              src: enemy.isArmored ? enemy.src.replace('armored', '') : enemy.src,
              isTargeted: true,
              hp: newHp,
              isArmored: false
            };
          }
          return enemy;
        });
        totalDamageDealt = explosionDamageTotal;
      } else {
        // Non-explosion attack logic
        updatedEnemies = prevEnemies.map((enemy) => {
          const isTargeted = targets.some(target => target.id === enemy.id);
          if (!isTargeted) return enemy;
        
          // Update damage calculation to include critical hits
          const actualDamage = Math.min(tower.attack * damageMultiplier, enemy.hp);
          totalDamageDealt += actualDamage;
          let newHp = enemy.hp;
           if (tower.type === "gasspitter") {
            return {
              ...enemy,
              isPoisoned: true,
              poisonSourceId: tower.id,
              poisonStartTime: Date.now(),
              canRegen: tower.canStopRegen ? false : true,
              hp: enemy.isArmored ? enemy.hp : Math.max(enemy.hp - actualDamage, 0),
              isTargeted: true
            };
          } else if (tower.type === "slower") {
            return {
              ...enemy,
              isSlowed: true,
              slowSourceId: tower.id,
              slowStartTime: Date.now(),
              speed: tower.slowAmount ? 
                Math.max(enemy.speed * tower.slowAmount, enemy.baseSpeed * tower.slowAmount) :
                enemy.speed,
              hp: enemy.isArmored ? enemy.hp : Math.max(enemy.hp - actualDamage, 0),
              isTargeted: true
            };
          } else {
            // Regular towers can't damage armored enemies
            newHp = enemy.isArmored ? enemy.hp : Math.max(enemy.hp - actualDamage, 0);
            // Add money reward when basic tower kills an enemy
            if (newHp <= 0 && enemy.hp > 0) {
              setMoney(prev => prev + Math.floor((enemy.maxHp / 10) * (round >= 33 ? 0.35 : round > 20 ? 0.5 : 1)));            }
            return {
              ...enemy,
              hp: newHp,
              isTargeted: true
            };
          }
        });
      }
      return updatedEnemies;
    });

   
    

    // Handle attack effects
    const newEffects = targets.map(target => ({
      id: uuidv4(),
      towerPositionX: tower.positionX,
      towerPositionY: tower.positionY,
      enemyPositionX: target.positionX,
      enemyPositionY: target.positionY,
      timestamp: Date.now(),
      effectSrc: tower.effectSrc
    }));
  
    setAttackEffects((prevEffects) => [...prevEffects, ...newEffects]);
    const timeoutId = setTimeout(() => {
      if (!isPaused) {
        setAttackEffects((prevEffects) => 
          prevEffects.filter((effect) => !newEffects.find(e => e.id === effect.id))
        );
  
        setTower((prevTowers) =>
          prevTowers.map((t) =>
            t.id === tower.id ? { 
              ...t, 
              isAttacking: false, 
              damageDone: t.damageDone + totalDamageDealt /2 // Add damage only once
            } : t
          )
        );
        setEnemies((prevEnemies) =>
          prevEnemies.map((enemy) => {
            const wasTargeted = targets.some(target => target.id === enemy.id);
            return wasTargeted ? { ...enemy, isTargeted: false } : enemy;
          })
        );
      }
    }, tower.attackInterval / (isSpeedUp ? 2 : 1));
  
    return () => clearTimeout(timeoutId);
  
  }, [isSpeedUp, isPaused]);
  
// Get the furthest enemy within a certain radius from the tower
const getFurthestEnemyInRadius = (
  towerPositionX: number, 
  towerPositionY: number,
  towerType: string, 
  radius: number, 
  canHitStealth: boolean, 
  attackType: string, 
  attackDamage: number, 
  targettingType: string
) => {
  const enemiesInRadius = enemies.filter((enemy) => {
    // Only target enemies with positive hp
    if (enemy.hp <= 0) return false;
    
    // Calculate distance between tower and enemy
    const dx = enemy.positionX - towerPositionX;
    const dy = enemy.positionY - towerPositionY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    const isInRange = distance <= radius;
    
    // Different targeting logic based on tower type and capabilities
    if (canHitStealth) {
      return isInRange;
    } else if (towerType === "gasspitter" && canHitStealth) {
      return isInRange && !enemy.isPoisoned;
    } else if (towerType === "gasspitter" && !canHitStealth) {
      return isInRange && !enemy.isPoisoned && 
        (enemy.type !== "stealth" && enemy.type !== "stealthytank" && enemy.type !== "stealthyspeedy");
    } else if (towerType === "slower" && canHitStealth) {
      return isInRange && !enemy.isSlowed;
    } else if (towerType === "slower" && !canHitStealth) {
      return isInRange && !enemy.isSlowed && 
        (enemy.type !== "stealth" && enemy.type !== "stealthytank" && enemy.type !== "stealthyspeedy");
    } else {
      return isInRange && 
        (enemy.type !== "stealth" && enemy.type !== "stealthytank" && enemy.type !== "stealthyspeedy");
    }
  });

  if (enemiesInRadius.length === 0) {
    return null;
  }

  // Calculate progress value for each enemy based on their position in the path
  const enemiesWithProgress = enemiesInRadius.map(enemy => {
    let progress = 0;
    
    // Calculate progress based on enemy position along the path
    if (enemy.positionX < 28) {
      // First segment - diagonal path
      progress = enemy.positionX;
    } else if (enemy.positionX >= 28 && enemy.positionX < 52 && enemy.positionY > 15) {
      // Second segment - vertical path
      progress = 28 + (50 - enemy.positionY);
    } else if (enemy.positionY <= 15 && enemy.positionX < 52) {
      // Third segment - horizontal path
      progress = 63 + enemy.positionX;
    } else if (enemy.positionX >= 52 && enemy.positionX < 75 && enemy.positionY < 87) {
      // Fourth segment - vertical path down
      progress = 115 + enemy.positionY;
    } else if (enemy.positionY >= 87 && enemy.positionX < 75) {
      // Fifth segment - horizontal path
      progress = 202 + enemy.positionX;
    } else if (enemy.positionX >= 75 && enemy.positionY > 50) {
      // Sixth segment - diagonal path up
      progress = 277 + (87 - enemy.positionY);
    } else {
      // Final segment - horizontal path to end
      progress = 314 + enemy.positionX;
    }
    
    return { ...enemy, progress };
  });

  // Sort enemies based on targeting type
  if (targettingType === "highestHp") {
    enemiesWithProgress.sort((a, b) => b.hp - a.hp);
  } else if (targettingType === "last") {
    enemiesWithProgress.reverse();
  } else {
    // "first" targeting - already sorted by progress
    enemiesWithProgress.sort((a, b) => b.progress - a.progress);
  }

  // Return enemies based on attack type
   if (attackType === 'double') {
    return enemiesWithProgress.slice(0, Math.min(2, enemiesWithProgress.length));
  } else if (attackType === 'triple') {
    return enemiesWithProgress.slice(0, Math.min(3, enemiesWithProgress.length));
  } else if (attackType === 'quadruple') {
    return enemiesWithProgress.slice(0, Math.min(4, enemiesWithProgress.length));
  } else {
    // Single target
    return enemiesWithProgress.slice(0, 1);
  }
};

// Tower targeting system - updates target when enemies move
useEffect(() => {
  if (!isPageVisible || isPaused) return;

  // Only update if there are enemies to target
  if (enemies.length === 0) return;

  setTower(prevTowers =>
    prevTowers.map(tower => ({
      ...tower,
      furthestEnemyInRange: getFurthestEnemyInRadius(
        tower.positionX,
        tower.positionY,
        tower.type,
        tower.radius,
        tower.canHitStealth,
        tower.attackType,
        tower.attack,
        tower.targettingType
      ) ?? null
    }))
  );
}, [enemies, isPageVisible, isPaused]);
  
  // Tower attack execution - triggers attacks when targets are available
  useEffect(() => {
    if (!isPageVisible || isPaused) return; // Add isPaused check

    tower.forEach((t) => {
      if (t.furthestEnemyInRange && !t.isAttacking) {
        towerAttack(t, t.furthestEnemyInRange);
      }
    });
  }, [tower, towerAttack, isPageVisible, isPaused]); // Add isPaused to dependencies

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
          className='w-12 h-12'
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
          if (enemy.positionX < 28) {
            // First segment - Move right until x=30
            return { ...enemy, positionX: enemy.positionX + enemy.speed, positionY: enemy.positionY - enemy.speed / 10};
          } else if (enemy.positionX >= 28 && enemy.positionX < 52 && enemy.positionY > 15) {
            // Second segment - Move up until y=15
            return { ...enemy, positionY: enemy.positionY - (enemy.speed * 2), positionX: enemy.positionX + enemy.speed / 3 };
          } else if (enemy.positionY <= 15 && enemy.positionX < 52) {
            // Third segment - Move right until x=50
            return { ...enemy, positionX: enemy.positionX + enemy.speed };
          } else if (enemy.positionX >= 52 && enemy.positionX < 75 && enemy.positionY < 87) {
            // Fourth segment - Move down until y=85
            return { ...enemy, positionY: enemy.positionY + enemy.speed * 2 };
          } else if (enemy.positionY >= 87 && enemy.positionX < 75) {
            // Fifth segment - Move right until x=70
            return { ...enemy, positionX: enemy.positionX + enemy.speed };
          } else if (enemy.positionX >= 75 && enemy.positionY > 50) {
            // Sixth segment - Move up until y=50
            return { ...enemy, positionY: enemy.positionY - (enemy.speed * 2), positionX: enemy.positionX + enemy.speed / 10};
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
  useEffect(() => {
    damagePlayer(enemies);
  }, [enemies,tower]);
  useEffect(() => {
    if (!isPageVisible || isPaused) return;
    
    const slowInterval = setInterval(() => {
      const currentTime = Date.now();
  
      setEnemies(prevEnemies => {
        let hasChanges = false;
        const updatedEnemies = prevEnemies.map(enemy => {
          if (!enemy.isSlowed || !enemy.slowSourceId || !enemy.slowStartTime) return enemy;
          
          // Find the tower that applied the slow effect
          const slowTower = tower.find(t => t.id === enemy.slowSourceId);
          if (!slowTower) return enemy;

          // Use the tower's slowDuration property, or fall back to default values
          const slowDuration = isSpeedUp ? slowTower.slowDuration ?? 0 / 2 : slowTower.slowDuration; 
          
          if (currentTime - enemy.slowStartTime >= (slowDuration ?? 0)) {
            hasChanges = true;
            return {
              ...enemy,
              speed: enemy.baseSpeed,
              isSlowed: false,
              slowSourceId: undefined,
              slowStartTime: undefined
            };
          }
          return enemy;
        });
  
        // Only return new array if there were actual changes
        return hasChanges ? updatedEnemies : prevEnemies;
      });
    }, 1000); // Check every second
  
    return () => clearInterval(slowInterval);
}, [isPageVisible, isPaused, isSpeedUp, tower]); // Added tower to dependencies
  useEffect(() => {
    if (!isPageVisible || isPaused) return;
             
    const POISON_TICK_RATE = isSpeedUp ? 5 : 10; 
    const POISON_DURATION = isSpeedUp ? 2000 : 4000; 
    const TOTAL_TICKS = POISON_DURATION / POISON_TICK_RATE;
    
    const poisonInterval = setInterval(() => {
      const currentTime = Date.now();
      
      setEnemies(prevEnemies => {
        const poisonDamageByTower: { [key: string]: number } = {};
        
        const updatedEnemies = prevEnemies.map(enemy => {
          if (!enemy.isPoisoned || !enemy.poisonSourceId || !enemy.poisonStartTime) return enemy;
  
          if (currentTime - enemy.poisonStartTime >= POISON_DURATION) {
            return {
              ...enemy,
              isPoisoned: false,
              poisonSourceId: undefined,
              poisonStartTime: undefined,
              canRegen: true
            };
          }
  
          const poisonTower = tower.find(t => t.id === enemy.poisonSourceId);
          if (!poisonTower?.poisonDamage) return enemy;
  
          const damagePerTick = (4 * poisonTower.poisonDamage) / TOTAL_TICKS;
          const actualPoisonDamage = Math.min(damagePerTick, enemy.hp);
          
          if (!poisonDamageByTower[poisonTower.id]) {
            poisonDamageByTower[poisonTower.id] = 0;
          }
          poisonDamageByTower[poisonTower.id] += actualPoisonDamage;
  
          const newHp = enemy.hp - actualPoisonDamage;
          // Only grant money if the poison damage kills the enemy
          if (newHp <= 0 && enemy.hp > 0) {
            setMoney(prev => prev + Math.floor((enemy.maxHp / 10) * (round >= 33 ? 0.35 : round > 20 ? 0.5 : 1)));          }
  
          return {
            ...enemy,
            hp: newHp
          };
        });
  
        // Update tower damage counters
        setTower(prevTowers =>
          prevTowers.map(t => ({
            ...t,
            damageDone: t.damageDone + (poisonDamageByTower[t.id] || 0)
          }))
        );
  
        return updatedEnemies;
      });
    }, POISON_TICK_RATE);
  
    return () => clearInterval(poisonInterval);
  }, [enemies, tower, isPageVisible, isSpeedUp, isPaused, setMoney]);
  // Buy towers and place them on the map
  const buyTowers = (event: React.MouseEvent<HTMLImageElement>, positionX: number, positionY: number) => {
    if (round > 0 && selectedTowerType && (event.target as HTMLImageElement).src.includes('buildingSite')) {
      const newTowerId = `tower-${uuidv4()}`; // Add 'tower-' prefix
      (event.target as HTMLImageElement).id = newTowerId;
      
      
      // Check if we have enough money for the selected tower
      const towerConfig = TOWER_TYPES[selectedTowerType.toUpperCase() as keyof typeof TOWER_TYPES];
      if (towerConfig && money >= towerConfig.price) {
        (event.target as HTMLImageElement).src = towerConfig.src;
        setMoney((prevMoney) => prevMoney - towerConfig.price);
        setTower((prevTower) => [...prevTower, createNewTower(selectedTowerType.toUpperCase() as keyof typeof TOWER_TYPES, positionX, positionY, newTowerId)]);
      }
    } else if (round > 0 && !(event.target as HTMLImageElement).src.includes('buildingSite')) {
      setShowUpgradeMenu(true);
      setSelectedTowerID((event.target as HTMLImageElement).id);
    }
  };
  
const upgradeTower = () => {
  if (showUpgradeMenu) {
    const selectedTower = tower.find(t => t.id === selectedTowerID);
    if (!selectedTower) return null;

    const availableUpgrades = TOWER_UPGRADES[selectedTower.type]?.filter(upgrade => 
      upgrade.requires === selectedTower.upgradeLevel) || [];

    const currentUpgrade = availableUpgrades[0]; // Get the next available upgrade

    return (
      <div 
        data-upgrade-menu
        className='absolute top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-40 bg-slate-800 
          flex items-start justify-between p-6 rounded-lg gap-6 shadow-lg border border-blue-400'
        style={{left: selectedTower.positionX < 50 ? '70%' : '30%', width: '700px'}}
        onClick={(e) => e.stopPropagation()}
      >
        <div className='flex flex-col space-y-3 w-1/2'>
          <h1 className="text-2xl font-bold mb-4 text-white border-b border-blue-400 pb-2">Upgrade Menu</h1>
          
          {currentUpgrade && (
            <button 
              className="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 
                text-white font-bold py-3 px-4 rounded-lg w-full transition-all duration-200 shadow-md
                disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => performUpgrade(selectedTower, currentUpgrade)}
              disabled={money < currentUpgrade.cost}
            >
              {currentUpgrade.name} (${currentUpgrade.cost})
              <div className="text-sm text-gray-200">{currentUpgrade.description}</div>
            </button>
          )}

          {/* Tower targeting type button */}
          <div className="pt-4">
            <button 
              className="bg-blue-400 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg w-full
                transition-all duration-200 shadow-md"
              onClick={changeTowerTargetting}
            >
              Targeting: {selectedTower.targettingType === "first" ? "First" : 
                         selectedTower.targettingType === "highestHp" ? "Highest HP" : "Last"}
            </button>
          </div>

          {/* Control buttons */}
          <div className="flex gap-2 mt-4">
            <button 
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg flex-1 
                transition-all duration-200 shadow-md"
              onClick={() => sellTower(selectedTower.towerWorth)}
            >
              Sell Tower ({Math.floor(selectedTower.towerWorth * 0.75)}$)
            </button>
            <button 
              className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg flex-1 
                transition-all duration-200 shadow-md"
              onClick={closeUpgradeMenu}
            >
              Close
            </button>
          </div>
        </div>

        {/* Stats panel remains the same */}
        <div className='bg-slate-700 p-4 rounded-lg space-y-4 w-1/2'>
          <h2 className="text-xl font-bold text-white border-b border-blue-400 pb-2">Tower Stats</h2>
          
          <div className="space-y-3 text-gray-200">
  <div>
    <div className="flex justify-between items-center mb-1">
      <span>Attack:</span>
      <span>{selectedTower.attack} / {selectedTower.maxDamage}</span>
    </div>
    <div className="w-full bg-gray-600 rounded-full h-2">
      <div className="bg-red-500 h-2 rounded-full" 
        style={{width: `${(selectedTower.attack / selectedTower.maxDamage) * 100}%`}}
      />
    </div>
    
  </div>

  <div>
    <div className="flex justify-between items-center mb-1">
      <span>Attack Interval:</span>
      <span>{selectedTower.attackInterval} / {selectedTower.maxAttackInterval}</span>
    </div>
    <div className="w-full bg-gray-600 rounded-full h-2">
      <div className="bg-blue-500 h-2 rounded-full" 
        style={{width: `${((selectedTower.attackInterval - selectedTower.maxAttackInterval) / (selectedTower.baseAttackInterval - selectedTower.maxAttackInterval)) * 100}%`}}
      />
    </div>
    
  </div>
  
  {selectedTower.type === "gasspitter" && selectedTower.maxPoisonDamage != undefined && selectedTower.poisonDamage != undefined && (
  <div>
    <div className="flex justify-between items-center mb-1">
      <span>Poison Damage:</span>
      <span>{selectedTower.poisonDamage * 4} / {selectedTower.maxPoisonDamage * 4}</span>
    </div>
    <div className="w-full bg-gray-600 rounded-full h-2">
      <div className="bg-green-500 h-2 rounded-full" 
        style={{width: `${(selectedTower.poisonDamage / selectedTower.maxPoisonDamage) * 100}%`}}
      />
    </div>
    
  </div>
  )}
            <div className="pt-2 border-t border-gray-600">
              <div>Attack Type: {selectedTower.attackType}</div>
              <div>Can hit stealth: {selectedTower.canHitStealth ? 'Yes' : 'No'}</div>
              <div>Damage done to enemies: {Math.floor(selectedTower.damageDone)}</div>
              {selectedTower.type === "slower" && (
                <div>
                  <div>Slow Amount: {selectedTower.slowAmount ? selectedTower.slowAmount.toFixed(2) : 'N/A'} / {selectedTower.maxSlow}</div>
                  
                </div>
              )}
        </div>
      </div>
      </div>
    </div>
    );
  }
  return null;
};
  const closeUpgradeMenu = () => {
    setShowUpgradeMenu(false);
  }
  const performUpgrade = (tower: Tower, upgrade: TowerUpgrade) => {
    if (money >= upgrade.cost) {
      setMoney(prev => prev - upgrade.cost);
      setTower(prevTowers => 
        prevTowers.map(t => {
          if (t.id === tower.id) {
            const newLevel = (t.upgradeLevel || 0) + 1;
            // Create a new tower object with all upgrades
            return {
              ...t,
              ...upgrade.effect(t),
              upgradeLevel: newLevel,
              // Ensure other properties are preserved
              id: t.id,
              positionX: t.positionX,
              positionY: t.positionY,
              isAttacking: t.isAttacking,
              furthestEnemyInRange: t.furthestEnemyInRange,
              damageDone: t.damageDone
            };
          }
          return t;
        })
      );
  
      // Update the tower image if it's on the board
      const towerElement = document.getElementById(tower.id) as HTMLImageElement;
      if (towerElement && upgrade.effect(tower).src) {
        if (upgrade.effect(tower).src) {
          towerElement.src = upgrade.effect(tower).src!;
        }
      }
    }
  };
  const changeTowerTargetting = () => {
    setTower(() => 
      tower.map((t) =>
        t.id === selectedTowerID ? { 
          ...t, 
          targettingType: t.targettingType === "first" 
            ? "highestHp" 
            : t.targettingType === "highestHp" 
            ? "last" 
            : "first" 
        } : t
    ))
  }
  
  const sellTower = (towerPrice: number) => {
    setMoney((prevMoney) => prevMoney + towerPrice / 1.5); // Add money back (changed from subtract)
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
          src={effect.effectSrc}
          key={effect.id}
          className='z-20 animate-slide h-6 w-6 absolute text-red-500'
          style={{
            '--tower-positionX': `${effect.towerPositionX + 1}%`,
            '--tower-positionY': `${effect.towerPositionY + 2.5}%`,
            '--enemy-positionX': `${effect.enemyPositionX + 1.5}%`,
            '--enemy-positionY': `${effect.enemyPositionY}%`,
            left: `${effect.towerPositionX}%`,
            animationDuration: `${isSpeedUp ? '50ms' : '100ms'}`,
          } as React.CSSProperties}
        />
          
      ));
  };
  
  
const renderExplosions = () => {
  return explosionEffects.map((effect) => {
    // Find the tower that caused this explosion
    const explosionTower = tower.find(t => t.attackType === 'explosion');
    const explosionSize = explosionTower ? explosionTower.explosionRadius * 2 : 50; // Default to 50 if no tower found

    return (
      <div
        key={effect.id}
        className="absolute rounded-full animate-explosion z-30"
        style={{
          left: `${effect.positionX}%`,
          top: `${effect.positionY}%`,
          width: `${explosionSize / 1.5}%`,
          height: `${explosionSize / 1.5}%`,
          transform: 'translate(-50%, -50%)',
          background: 'radial-gradient(circle, rgba(255,0,0,0.5) 0%, rgba(255,0,0,0) 70%)',
        }}
      />
    );
  });
};

// Define upgrade paths for each tower type
const TOWER_UPGRADES: { [key: string]: TowerUpgrade[] } = {
  basic: [
    {
      name: "Enhanced Targeting",
      cost: 400,
      requires: 0,
      description: "Increases attack damage by 40",
      effect: (tower) => ({ 
        attack: tower.attack + 40,
        towerWorth: tower.towerWorth + 400
      })
    },
    {
      name: "Combat Accelerator",  // was "Rapid Fire"
      cost: 600,
      description: "Reduces attack interval by 250ms",
      requires: 1,
      effect: (tower) => ({ 
        attackInterval: tower.attackInterval - 250,
        towerWorth: tower.towerWorth + 600
      })
    },
    {
      name: "Double Shot",
      cost: 1500,
      description: "Attacks two targets at once",
      requires: 2,
      effect: (tower) => ({ 
        attackType: 'double',
        towerWorth: tower.towerWorth + 1500
      })
    },
    {
      name: "Armor Piercing and stealth detection",
      cost: 2500,
      description: "Can damage armored enemies and detect stealth enemies",
      requires: 3,
      effect: (tower) => ({ 
        attack: tower.attack + 60,
        canHitArmored: true,
        canHitStealth: true,
        towerWorth: tower.towerWorth + 2500
      })
    },
    {
      name: "Extended Range",
      cost: 3000,
      description: "Increases attack range by 30%",
      requires: 4,
      effect: (tower) => ({ 
        radius: tower.radius * 1.3,
        towerWorth: tower.towerWorth + 3000
      })
    },
    {
      name: "Critical Strike",
      cost: 5000,
      description: "25% chance to deal double damage",
      requires: 5,
      effect: (tower) => ({ 
        hasCritical: true,
        criticalChance: 0.25,
        criticalMultiplier: 2,
        towerWorth: tower.towerWorth + 5000
      })
    },
    {
      name: "Artillery Master",
      cost: 15000,
      description: "Converts to explosive damage with increased area",
      requires: 6,
      effect: (tower) => ({
        attackType: 'explosion',
        explosionRadius: 15,
        attack: tower.attack * 2,
        src: '/basicSpecial.png',
        towerWorth: tower.towerWorth + 15000
      })
    }
  ],
  sniper: [
    {
      name: "High-Caliber Rounds",  // was "Precision Scope"
      cost: 800,
      requires: 0,
      description: "Increases attack damage by 80",
      effect: (tower) => ({
        attack: tower.attack + 80,
        towerWorth: tower.towerWorth + 800
      })
    },
    {
      name: "Neural Interface",  // was "Advanced Targeting"
      cost: 1000,
      description: "Reduces attack interval by 500ms",
      requires: 1,
      effect: (tower) => ({
        attackInterval: tower.attackInterval - 500,
        towerWorth: tower.towerWorth + 1000
      })
    },
    {
      name: "Armor Piercing Rounds",
      cost: 2000,
      description: "Can damage armored enemies",
      requires: 2,
      effect: (tower) => ({
        canHitArmored: true,
        attack: tower.attack + 100,
        towerWorth: tower.towerWorth + 2000
      })
    },
    {
      name: "Rapid targeting",
      cost: 2500,
      description: "reduce attack interval by 500 ms",
      requires: 3,
      effect: (tower) => ({
        attackInterval: tower.attackInterval - 500,
        towerWorth: tower.towerWorth + 2500
      })
    },
    {
      name: "Critical Strike",
      cost: 4000,
      description: "35% chance to deal triple damage",
      requires: 4,
      effect: (tower) => ({
        hasCritical: true,
        criticalChance: 0.35,
        criticalMultiplier: 3,
        towerWorth: tower.towerWorth + 2000
      })
    },
    {
      name: "Double Shot",
      cost: 5000,
      description: "Can target two enemies at once",
      requires: 5,
      effect: (tower) => ({
        attackType: 'double',
        towerWorth: tower.towerWorth + 5000
      })
    },
    {
      name: "Elite Sniper",
      cost: 10000,
      description: "Quadruples damage and gains ultimate precision",
      requires: 6,
      effect: (tower) => ({
        attack: tower.attack * 5,
        src: '/sniperSpecial.png',
        towerWorth: tower.towerWorth + 10000
      })
    }
  ],
  rapidShooter: [
    {
      name: "Rapid Fire",
      cost: 500,
      requires: 0,
      description: "Reduces attack interval by 100ms",
      effect: (tower) => ({
        attackInterval: tower.attackInterval - 100,
        towerWorth: tower.towerWorth + 500
      })
    },
    {
      name: "Enhanced Damage",
      cost: 1000,
      description: "Increases attack damage by 25",
      requires: 1,
      effect: (tower) => ({
        attack: tower.attack + 25,
        towerWorth: tower.towerWorth + 1000
      })
    },
    {
      name: "Triple Shot",
      cost: 2500,
      description: "Can target three enemies at once",
      requires: 2,
      effect: (tower) => ({
        attackType: 'triple',
        towerWorth: tower.towerWorth + 2500
      })
    },
    {
      name: "Quick Loader",
      cost: 2000,
      description: "Further reduces attack interval by 100ms",
      requires: 3,
      effect: (tower) => ({
        attackInterval: tower.attackInterval - 100,
        towerWorth: tower.towerWorth + 2000
      })
    },
    {
      name: "Extended Range",
      cost: 5000,
      description: "Increases attack range by 25%, stealth detection",
      requires: 4,
      effect: (tower) => ({
        radius: tower.radius * 1.25,
        canHitStealth: true,
        towerWorth: tower.towerWorth + 5000
      })
    },
    {
      name: "Quadruple Shot",
      cost: 7500,
      description: "Can target four enemies at once",
      requires: 5,
      effect: (tower) => ({
        attackType: 'quadruple',
        towerWorth: tower.towerWorth + 7500
      })
    },
    {
      name: "Gatling Master",
      cost: 10000,
      description: "Massive attack speed and damage increase",
      requires: 6,
      effect: (tower) => ({
        attack: tower.attack * 1.5,
        attackInterval: tower.attackInterval * 0.6,
        src: '/rapidShooterSpecial.png',
        towerWorth: tower.towerWorth + 10000
      })
    }
  ],
  slower: [
    {
      name: "Enhanced Slow",
      cost: 400,
      requires: 0,
      description: "Increases slow effect by 10%",
      effect: (tower) => ({
        slowAmount: tower.slowAmount ? tower.slowAmount * 0.8 : 0.8,
        towerWorth: tower.towerWorth + 400
      })
    },
    {
      name: "Double Target",
      cost: 1000,
      description: "Can slow two targets simultaneously",
      requires: 1,
      effect: (tower) => ({
        attackType: 'double',
        towerWorth: tower.towerWorth + 1000
      })
    },
    {
      name: "Extended Duration",
      cost: 1500,
      description: "Slow effect lasts longer and stealth detection",
      requires: 2,
      effect: (tower) => ({
        attack: tower.attack + 5,
        canHitStealth: true,
        towerWorth: tower.towerWorth + 1500
      })
    },
    {
      name: "Triple Target",
      cost: 4500,
      description: "Can slow three targets at once",
      requires: 3,
      effect: (tower) => ({
        attackType: 'triple',
        towerWorth: tower.towerWorth + 4500
      })
    },
    {
      name: "Potent Slow",
      cost: 5000,
      description: "Further increases slow effect by 15%",
      requires: 4,
      effect: (tower) => ({
        slowAmount: tower.slowAmount ? tower.slowAmount * 0.75 : 0.75,
        towerWorth: tower.towerWorth + 1500
      })
    },
    {
      name: "Extended Range",
      cost: 7500,
      description: "Increases range by 40%",
      requires: 5,
      effect: (tower) => ({
        radius: tower.radius * 1.4,
        towerWorth: tower.towerWorth + 2000
      })
    },
    {
      name: "Time Warper",
      cost: 10000,
      description: "Maximum slow effect and area control",
      requires: 6,
      effect: (tower) => ({
        slowAmount: tower.slowAmount ? tower.slowAmount * 0.5 : 0.5,
        radius: tower.radius * 1.2,
        src: '/slowerSpecial.png',
        towerWorth: tower.towerWorth + 10000
      })
    }
  ],
  gasspitter: [
    {
      name: "Virulent Strain",  // was "Potent Toxin"
      cost: 300,
      requires: 0,
      description: "Increases poison damage by 20",
      effect: (tower) => ({
        poisonDamage: tower.poisonDamage + 20,
        towerWorth: tower.towerWorth + 300
      })
    },
    {
      name: "Caustic Catalyst",  // was "Better Toxin"
      cost: 600,
      description: "Increases poison damage by 20",
      requires: 1,
      effect: (tower) => ({
        poisonDamage: tower.poisonDamage + 20,
        towerWorth: tower.towerWorth + 600
      })
    },
    {
      name: "Double Spray",
      cost: 1200,
      description: "Can poison two targets simultaneously",
      requires: 2,
      effect: (tower) => ({
        attackType: 'double',
        towerWorth: tower.towerWorth + 1200
      })
    },
    {
      name: "Concentrated Toxin",
      cost: 1500,
      description: "Further increases poison damage by 30",
      requires: 3,
      effect: (tower) => ({
        poisonDamage: tower.poisonDamage + 30,
        towerWorth: tower.towerWorth + 1500
      })
    },
    {
      name: "Extended Range",
      cost: 2500,
      description: "Increases range by 25%",
      requires: 4,
      effect: (tower) => ({
        radius: tower.radius * 1.25,
        towerWorth: tower.towerWorth + 2500
      })
    },
    {
      name: "Triple Spray",
      cost: 5000,
      description: "Can poison three targets",
      requires: 5,
      effect: (tower) => ({
        attackType: 'triple',
        towerWorth: tower.towerWorth + 5000
      })
    },
    {
      name: "Plague Master",
      cost: 10000,
      description: "Massively enhanced poison and stops regeneration",
      requires: 6,
      effect: (tower) => ({
        poisonDamage: tower.poisonDamage * 4,
        canStopRegen: true,
        src: '/gasSpitterSpecial.png',
        towerWorth: tower.towerWorth + 10000
      })
    }
  ],
  mortar: [
    {
      name: "Seismic Shells",  // was "Heavy Shells"
      cost: 400,
      requires: 0,
      description: "Increases explosion damage by 50",
      effect: (tower) => ({
        attack: tower.attack + 50,
        towerWorth: tower.towerWorth + 400
      })
    },
    {
      name: "Rapid Reloader",  // was "Faster Reload"
      cost: 1000,
      description: "Reduces attack interval by 1000ms",
      requires: 1,
      effect: (tower) => ({
        attackInterval: tower.attackInterval - 1000,
        towerWorth: tower.towerWorth + 1000
      })
    },
    {
      name: "Shockwave Amplifier",  // was "Bigger Explosions"
      cost: 2000,
      description: "Increases explosion radius by 20%",
      requires: 2,
      effect: (tower) => ({
        explosionRadius: tower.explosionRadius * 1.20,
        towerWorth: tower.towerWorth + 1000
      })
    },
    {
      name: "Better shells",
      cost: 4000,
      description: "+75 damage and faster reload",
      requires: 3,
      effect: (tower) => ({
        attackInterval: tower.attackInterval - 1000,
        attack: tower.attack + 75,
        towerWorth: tower.towerWorth + 1500
      })
    },
    {
      name: "Extended Range",
      cost: 5000,
      description: "Increases range by 30%",
      requires: 4,
      effect: (tower) => ({
        radius: tower.radius * 1.3,
        towerWorth: tower.towerWorth + 2000
      })
    },
    {
      name: "Devastating Blast",
      cost: 7500,
      description: "Further increases explosion damage and radius",
      requires: 5,
      effect: (tower) => ({
        attack: tower.attack + 100,
        explosionRadius: tower.explosionRadius * 1.25,
        towerWorth: tower.towerWorth + 2500
      })
    },
    {
      name: "Artillery Master",
      cost: 15000,
      description: "Maximum explosive power",
      requires: 6,
      effect: (tower) => ({
        attack: tower.attack * 2,
        radius: tower.radius * 1.3,
        src: '/mortarSpecial.png',
        towerWorth: tower.towerWorth + 15000
      })
    }
  ],
  cannon: [
    {
      name: "Tungsten Core",  // was "Heavy Ammunition"
      cost: 400,
      requires: 0,
      description: "Increases explosion damage by 40",
      effect: (tower) => ({
        attack: tower.attack + 40,
        towerWorth: tower.towerWorth + 400
      })
    },
    {
      name: "Autoloader System",  // was "Rapid Loading"
      cost: 1000,
      description: "Reduces attack interval by 300ms",
      requires: 1,
      effect: (tower) => ({
        attackInterval: tower.attackInterval - 300,
        towerWorth: tower.towerWorth + 1000
      })
    },
    {
      name: "Blast Radius",
      cost: 1500,
      description: "Increases explosion radius by 20%",
      requires: 2,
      effect: (tower) => ({
        explosionRadius: tower.explosionRadius * 1.2,
        towerWorth: tower.towerWorth + 800
      })
    },
    {
      name: "Better shells",
      cost: 4000,
      description: "+75 damage and faster reload",
      requires: 3,
      effect: (tower) => ({
        attackInterval: tower.attackInterval - 400,
        attack: tower.attack + 75,
        towerWorth: tower.towerWorth + 4000
      })
    },
    {
      name: "Extended Range",
      cost: 6000,
      description: "Increases range by 25%",
      requires: 4,
      effect: (tower) => ({
        radius: tower.radius * 1.25,
        towerWorth: tower.towerWorth + 1500
      })
    },
    {
      name: "Critical Strike",
      cost: 8000,
      description: "30% chance to deal double damage",
      requires: 5,
      effect: (tower) => ({
        hasCritical: true,
        criticalChance: 0.3,
        criticalMultiplier: 2,
        towerWorth: tower.towerWorth + 8000
      })
    },
    {
      name: "Siege Master",
      cost: 15000,
      description: "Ultimate explosive power",
      requires: 6,
      effect: (tower) => ({
        attack: tower.attack * 2,
        explosionRadius: tower.explosionRadius * 1.20,
        src: '/cannonSpecial.png',
        towerWorth: tower.towerWorth + 10000
      })
    }
  ]
};
// Add this new component near your other components
const RangeIndicator = ({ tower }: { tower: Tower }) => {
  const gameAreaWidth = 100; // Adjust this value based on your game area width
  const gameAreaHeight = 100; // Adjust this value based on your game area height

  return showUpgradeMenu && tower.id === selectedTowerID && (
    <div
      className="absolute rounded-full border-2 border-blue-400 pointer-events-none"
      style={{
        width: `${(tower.radius * 2) / gameAreaWidth * 100}%`,    // Adjusted for game area width
        height: `${(tower.radius * 2) / gameAreaHeight * 100}%`,   // Adjusted for game area height
        left: `${tower.positionX}%`,
        top: `${tower.positionY}%`,
        transform: 'translate(-50%, -50%)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        zIndex: 5,
      }}
    />
  )
}

// Add this function near your other event handlers
const handleOutsideClick = (event: React.MouseEvent) => {
  // Check if the click was outside the upgrade menu
  const upgradeMenu = document.querySelector('[data-upgrade-menu]');
  if (upgradeMenu && !upgradeMenu.contains(event.target as Node)) {
    setShowUpgradeMenu(false);
  }
};

  return (
    <>
   <div 
      className='relative min-h-[75vh] w-full border border-white overflow-hidden' 
      suppressHydrationWarning
      onClick={handleOutsideClick}
    >
  <img 
    src='/map.png' 
    className=' w-full h-full object-fill top-0 left-0 z-0' 
    alt='map' 
  />
      {/* Add range indicators for all towers */}
      {tower.map((t) => (
        <RangeIndicator key={`range-${t.id}`} tower={t} />
      ))}
      <div>
  {round > 0 && (
    <>
      {[
        { top: '30%', left: '20%', x: 21, y: 32 },
        { top: '30%', left: '10%', x: 11, y: 32 },
        { top: '60%', left: '66%', x: 66, y: 62.5 },
        { top: '30%', left: '63%', x: 63, y: 32 },
        { top: '42.5%', left: '63%', x: 63, y: 44.5 },
        { top: '30%', left: '85%', x: 85, y: 32 },
        { top: '65%', left: '2%', x: 2, y: 65 },
        { top: '65%', left: '25%', x: 25, y: 66 },
        { top: '40%', left: '41%', x: 41, y: 41 },
        { top: '52.5%', left: '41%', x: 41, y: 53.5 },
        { top: '65%', left: '41%', x: 42, y: 67 },
        { top: '65%', left: '82%', x: 83, y: 66 }
      ].map((pos, index) => {
        const existingTower = tower.find(t => t.positionX === pos.x && t.positionY === pos.y);
        
        // Only render if there's an existing tower or if a tower type is selected
        const shouldShow = existingTower || selectedTowerType;
        
        return shouldShow ? (
          <img
            key={index}
            id={existingTower?.id || `building-site-${index}`}
            src={existingTower ? existingTower.src : '/buildingSite.png'}
            className='absolute w-14 h-14 z-10 hover:opacity-75 transition-opacity'
            style={{ top: pos.top, left: pos.left }}
            onClick={(event) => buyTowers(event, pos.x, pos.y)}
          />
        ) : null;
      })}
    </>
  )}
</div>
      {createEnemy()}
      
      {attackAnimation()}
      {renderExplosions()}
    </div>
    {upgradeTower()}
    </>
  );
};

export default Spawn;


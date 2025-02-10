import React, { useState, useEffect, useCallback, use } from 'react';
import { v4 as uuidv4 } from 'uuid';

// Define the props for the Spawn component
interface SpawnProps {
  round: number;
  setHealthPoints: React.Dispatch<React.SetStateAction<number>>;
  money: number;
  setMoney: React.Dispatch<React.SetStateAction<number>>;
}

// Define the Enemy interface
interface Enemy {
  id: string;
  position: number;
  hp: number;
  src: string;
}

// Define the Tower interface
interface Tower {
  id: string;
  position: number;
  attack: number;
  furthestEnemyInRange: Enemy | null;
  isAttacking: boolean;
  price: number;
}

const Spawn: React.FC<SpawnProps> = ({ round, setHealthPoints, money, setMoney }) => {
  // Game state
  const [enemies, setEnemies] = useState<Enemy[]>([]);
  const [tower, setTower] = useState<Tower[]>([]);
  const [attackEffects, setAttackEffects] = useState<{ 
    id: string; 
    towerPosition: number; 
    enemyPosition: number; 
    timestamp?: number 
  }[]>([]);
  // Enemy spawning - creates new enemies every second
  useEffect(() => {
    if (round === 1) {
      const interval = setInterval(() => {
        setEnemies((prevEnemy) => [
          ...prevEnemy,
          { id: uuidv4(), position: -7, src: 'enemy1.png', hp: 100 },
        ]);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [round]);

  // Enemy movement - updates position every 50ms
  useEffect(() => {
    if (round === 1) {
      const interval = setInterval(moveEnemy, 50);
      return () => clearInterval(interval);
    }
  }, [round]);

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
    setMoney((prevMoney) => prevMoney + 10);
    setTimeout(() => {
      setAttackEffects((prevEffects) => 
        prevEffects.filter((effect) => effect.id !== newEffect.id)
      );
      setTower((prevTowers) =>
        prevTowers.map((t) =>
          t.id === tower.id ? { ...t, isAttacking: false } : t
        )
      );
    }, 1000);
  
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
    setTower((prevTowers) =>
      prevTowers.map((tower) => ({
        ...tower,
        furthestEnemyInRange: getFurthestEnemyInRadius(tower.position, 10)
      }))
    );
  }, [enemies]);

  // Tower attack execution - triggers attacks when targets are available
  useEffect(() => {
    tower.forEach((t) => {
      if (t.furthestEnemyInRange && !t.isAttacking) {
        towerAttack(t, t.furthestEnemyInRange);
      }
    });
  }, [tower, towerAttack]); // Added towerAttack to dependencies

  // Create enemy elements
  const createEnemy = () => {
    if (round === 1) {
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
          position: enemy.position + 0.25,
        }))
        .filter((enemy) => enemy.position <= 100)
        .filter((enemy) => enemy.hp > 0)
    );
  };

  // Reduce player's health points if enemies reach the end
  const damagePlayer = (enemies: Enemy[]) => {
    enemies.forEach((enemy) => {
      if (enemy.position >= 100) {
        setHealthPoints((prevHealthPoints) => prevHealthPoints - 1);
      }
    });
  };

  // Call damagePlayer whenever enemies change
  useEffect(() => {
    damagePlayer(enemies);
  }, [enemies]);

  // Buy towers and place them on the map
  const buyTowers = (event: React.MouseEvent<HTMLImageElement>, siteNumber: number) => {
    if (round === 1 && (event.target as HTMLImageElement).src.includes('buildingSite') && money >= 100) {
      (event.target as HTMLImageElement).src = '/tower1.png';
      setMoney((prevMoney) => prevMoney - 100);
      setTower((prevTower) => {
        const newTower = { id: uuidv4(), position: 15 * siteNumber, attack: 50,
           furthestEnemyInRange: null, isAttacking: false, price: 100 };
        return [...prevTower, newTower];
      });
      
    }
  };
  
  // Component for attack animation
  const attackAnimation = () => {
    return attackEffects.map((effect) => (
        <img
          src='/attack.png'
          key={effect.id}
          className='z-20 animate-slide h-6 w-6 absolute text-red-500'
          style={{
            '--tower-position': `${effect.towerPosition}%`,
            '--enemy-position': `${effect.enemyPosition + 2.5}%`,
            left: `${effect.towerPosition}%`,
            animationDuration: `100ms`,
          } as React.CSSProperties}
        />
          
      ));
  };

  

  // Get the furthest enemy within a certain radius from the tower
  const getFurthestEnemyInRadius = (towerPosition: number, radius: number) => {
    const enemiesInRadius = enemies.filter(
      (enemy) => enemy.position <= towerPosition + radius && enemy.position >= towerPosition - radius
    );

    if (enemiesInRadius.length === 0) {
      return null;
    }

    return enemiesInRadius.reduce((maxEnemy, currentEnemy) => {
      return currentEnemy.position > maxEnemy.position ? currentEnemy : maxEnemy;
    }, enemiesInRadius[0]);
  };

  return (
    <div className='relative h-4/5 border border-white overflow-hidden'>
      <img src='/map.png' className='object-cover w-full h-full z-0' alt='map' />
      <img src='/buildingSite.png' className='absolute top-[20%] left-[15%] w-20 h-20 z-10' onClick={(event) => buyTowers(event, 1)} />
      <img src='/buildingSite.png' className='absolute top-[20%] left-[30%] w-20 h-20 z-10' onClick={(event) => buyTowers(event, 2)} />
      <img src='/buildingSite.png' className='absolute top-[20%] left-[45%] w-20 h-20 z-10' onClick={(event) => buyTowers(event, 3)} />
      <img src='/buildingSite.png' className='absolute top-[20%] left-[60%] w-20 h-20 z-10' onClick={(event) => buyTowers(event, 4)} />
      {createEnemy()}
      {attackAnimation()}
    </div>
  );
};

export default Spawn;
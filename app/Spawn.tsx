import React, { useState, useEffect, JSX } from 'react';
import { v4 as uuidv4 } from 'uuid';


// Define the props for the Spawn component
interface SpawnProps {
  round: number;
  setHealthPoints: React.Dispatch<React.SetStateAction<number>>;
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
}

const Spawn: React.FC<SpawnProps> = ({ round, setHealthPoints }) => {
  const [enemies, setEnemies] = useState<Enemy[]>([]);
  const [attackEffects, setAttackEffects] = useState<{id: string, towerPosition: number; enemyPosition: number }[]>([]);
  const [tower, setTower] = useState<Tower[]>([]);
  const attackDuration = 1000;
  // Spawn enemies at regular intervals when the round is 1
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

  // Move enemies at regular intervals when the round is 1
  useEffect(() => {
    if (round === 1) {
      const interval = setInterval(() => {
        moveEnemy();
      }, 50);
      return () => clearInterval(interval);
    }
  }, [round]);

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
    if (round === 1 && (event.target as HTMLImageElement).src.includes('buildingSite')) {
      (event.target as HTMLImageElement).src = '/tower1.png';
      setTower((prevTower) => {
        const newTower = { id: uuidv4(), position: 15 * siteNumber, attack: 50, furthestEnemyInRange: null };
        return [...prevTower, newTower];
      });
    }
  };

  // Handle tower attacks on enemies
  const towerAttack = (tower: Tower, furthestEnemy: Enemy) => {
    setEnemies((prevEnemies) =>
      prevEnemies.map((enemy) => {
        if (furthestEnemy && enemy.id === furthestEnemy.id) {
          const newEffect = { id: uuidv4(), towerPosition: tower.position, enemyPosition: furthestEnemy.position };
          setAttackEffects((prevAttackEffects) => [...prevAttackEffects, newEffect]);

          // Remove the attack effect after a certain duration
          setTimeout(() => {
            setAttackEffects((prevAttackEffects) => prevAttackEffects.filter((effect) => effect.id !== newEffect.id));
          }, attackDuration); // Adjust the duration as needed

          return { ...enemy, hp: enemy.hp - tower.attack };
        }
        return enemy;
      })
    );
  };

  // Component for attack animation
  const AttackAnimation: React.FC<{ towerPosition: number; enemyPosition: number; onAnimationEnd: () => void }> = ({
    towerPosition,
    enemyPosition,
    onAnimationEnd,
  }) => {
    return (
      <div
        className='z-20 animate-slide absolute text-red-500'
        style={{
          '--tower-position': `${towerPosition}%`,
          '--enemy-position': `${enemyPosition}%`,
          left: `${towerPosition}%`,
          
        } as React.CSSProperties}
        onAnimationEnd={onAnimationEnd}
      >
        hit
      </div>
    );
  };

  // Update towers to target the furthest enemy in range
  useEffect(() => {
    setTower((prevTowers) =>
      prevTowers.map((tower) => {
        const furthestEnemy = getFurthestEnemyInRadius(tower.position, 10);
        if (furthestEnemy && furthestEnemy.id !== tower.furthestEnemyInRange?.id) {
          return { ...tower, furthestEnemyInRange: furthestEnemy };
        }
        return tower;
      })
    );
  }, [enemies]);

  // Handle tower attacks at regular intervals
  useEffect(() => {
    const interval = setInterval(() => {
      setTower((prevTowers) =>
        prevTowers.map((tower) => {
          if (tower.furthestEnemyInRange) {
            towerAttack(tower, tower.furthestEnemyInRange);
          }
          const furthestEnemy = getFurthestEnemyInRadius(tower.position, 10);
          return furthestEnemy?.id !== tower.furthestEnemyInRange?.id
            ? { ...tower, furthestEnemyInRange: furthestEnemy }
            : tower;
        })
      );
    }, attackDuration);

    return () => clearInterval(interval);
  }, []);

  // Remove attack effects after a certain time
  useEffect(() => {
    const interval = setInterval(() => {
      setAttackEffects((prevAttackEffects) => prevAttackEffects.filter((effect) => !enemies.some(enemy => enemy.id === effect.id)));
    }, 1000);

    
    return () => clearInterval(interval);
  }, [attackEffects]);
  useEffect(() => {
    console.log('attackEffects:', attackEffects);
  }, [attackEffects]);
  useEffect(() => {
    const interval = setInterval(() => {
      setAttackEffects((prevAttackEffects) => prevAttackEffects.filter((effect) => {
        const enemy = enemies.find((enemy) => enemy.id === effect.id);
        return enemy && enemy.hp > 0;
      }));
    }, attackDuration);
  
    return () => clearInterval(interval);
  }, [enemies]);
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
      {attackEffects
        .filter((effect) => {
          const towers = tower.find((tower) => tower.position === effect.towerPosition);
          const enemy = enemies.find((enemy) => enemy.position === effect.enemyPosition);
          const radius = 10;
          return towers && enemy && enemy.position <= towers.position + radius && enemy.position >= towers.position - radius;
        })
        .map((effect) => (
          <AttackAnimation
            key={effect.id}
            towerPosition={effect.towerPosition}
            enemyPosition={effect.enemyPosition}
            onAnimationEnd={() => {
              setAttackEffects((prevAttackEffects) => prevAttackEffects.filter((e) => e.id !== effect.id));
            }}
          />
        ))}
    </div>
  );
};

export default Spawn;
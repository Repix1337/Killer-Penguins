import React, { useState, useEffect, JSX } from 'react'
import { v4 as uuidv4 } from 'uuid'

interface SpawnProps {
  round: number;
  setHealthPoints: React.Dispatch<React.SetStateAction<number>>;
}
interface Enemy {
  id: string;
  position: number;
  hp: number;
  src: string;
}
interface Tower {
  id: string;
  position: number;
  attack: number;
  furthestEnemyInRange: Enemy | null;
}

const Spawn: React.FC<SpawnProps> = ({ round,setHealthPoints }) => {
  const [enemies, setEnemies] = useState<Enemy[]>([]);
  const [attackEffects, setAttackEffects] = useState<{ towerPosition: number, enemyPosition: number }[]>([]);
  const [tower, setTower] = useState<Tower[]>([]);
    useEffect(() => {
        if (round === 1) {
          const interval = setInterval(() => {
            setEnemies((prevEnemy) => [
              ...prevEnemy,
              { id: uuidv4(), position: -7, src: 'enemy1.png', hp: 100 },
            ])
            
        }, 1000)
        return () => clearInterval(interval)
        }
    }, [round])

    useEffect(() => {
      if (round === 1) {
        const interval = setInterval(() => {
          moveEnemy()
          
      }, 50)
      return () => clearInterval(interval)
      }
  }, [round])
    const createEnemy = () => {
      if (round === 1) {
      return enemies.map(enemies => (
        <img
          key={enemies.id}
          src={enemies.src}
          alt='enemies'
          style={{
            position: 'absolute',
            top: '50%',
            left: `${enemies.position}%`,
            transform: 'translateY(-50%)',
            zIndex: 10
          }}
          />
        ))}
    }
    const moveEnemy = () => {
      setEnemies((prevEnemies) =>
          prevEnemies
            .map((enemies) => ({
              ...enemies,
              position: enemies.position + 0.25,
            }))
            .filter((enemies) => enemies.position <= 100)
            .filter((enemies) => enemies.hp > 0),
        );
    }
    const damagePlayer = (enemies: Enemy[]) => {
      enemies.forEach((enemy) => {
        if (enemy.position >= 100) {
          setHealthPoints((prevHealthPoints) => prevHealthPoints - 1);
          
        }
      });
    };
    useEffect(() => {
      damagePlayer(enemies);
    }, [enemies]);

    const buyTowers = (event: React.MouseEvent<HTMLImageElement>, siteNumber:number) => {
      if (round === 1 && (event.target as HTMLImageElement).src.includes('buildingSite')) {
        (event.target as HTMLImageElement).src = '/tower1.png';
        setTower((prevTower) => {
          const newTower = { id: uuidv4(), position: 15 * siteNumber, attack: 50, furthestEnemyInRange: null };
          console.log([...prevTower, newTower]);
          return [...prevTower, newTower];
        });
      }
    }
    const towerAttack = (tower: Tower, furthestEnemy: Enemy) => {
      setEnemies((prevEnemies) =>
        prevEnemies.map((enemy) => {
          if (furthestEnemy && enemy.id === furthestEnemy.id) {
            setAttackEffects((prevAttackEffects) => [...prevAttackEffects, { towerPosition: tower.position, enemyPosition: furthestEnemy.position }]);
            return { ...enemy, hp: enemy.hp - tower.attack };
          }
          return enemy;
        })
      );
    };
    const AttackAnimation: React.FC<{ towerPosition: number, enemyPosition: number, onAnimationEnd: () => void }> = ({ towerPosition, enemyPosition, onAnimationEnd }) => {
      return (
        <div
          className='z-20 animate-slide absolute text-red-500'
          style={{ '--tower-position': `${towerPosition}%`, '--enemy-position': `${enemyPosition}%`, top: '20%' } as React.CSSProperties}
          onAnimationEnd={onAnimationEnd}
        >
          hit
        </div>
      )
    }

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
      }, 1000);
    
      return () => clearInterval(interval);
    }, []); 
    
    useEffect(() => {
      const interval = setInterval(() => {
        setAttackEffects((prevAttackEffects) => prevAttackEffects.filter((_, i) => i !== 0));
      }, 1000);
    
      return () => clearInterval(interval);
    }, [attackEffects]);

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
  <div className='relative  h-4/5 border border-white overflow-hidden'>
    <img src='/map.png' className='object-cover w-full h-full z-0' alt='map' />
    <img src='/buildingSite.png' className='absolute top-[20%] left-[15%] w-20 h-20 z-10' onClick={(event) => buyTowers(event, 1)} />
    <img src='/buildingSite.png' className='absolute top-[20%] left-[30%] w-20 h-20 z-10' onClick={(event) => buyTowers(event, 2)}/>
    <img src='/buildingSite.png' className='absolute top-[20%] left-[45%] w-20 h-20 z-10' onClick={(event) => buyTowers(event, 3)}/>
    <img src='/buildingSite.png' className='absolute top-[20%] left-[60%] w-20 h-20 z-10' onClick={(event) => buyTowers(event, 4)}/>
    {createEnemy()}
    {attackEffects.map((effect, index) => (
      <AttackAnimation
        key={index}
        towerPosition={effect.towerPosition}
        enemyPosition={effect.enemyPosition}
        onAnimationEnd={() => {
          setAttackEffects((prevAttackEffects) => prevAttackEffects.filter((_, i) => i !== index));
        }}
      />
    ))}
  </div>
  )
}

export default Spawn
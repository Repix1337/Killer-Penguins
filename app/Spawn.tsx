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
  atack: number;
}

const Spawn: React.FC<SpawnProps> = ({ round,setHealthPoints }) => {
  const [enemies, setEnemies] = useState<Enemy[]>([]);
  const [tower, setTower] = useState<Tower[]>([]);
    useEffect(() => {
        if (round === 1) {
          const interval = setInterval(() => {
            setEnemies((prevEnemy) => [
              ...prevEnemy,
              { id: uuidv4(), position: -7, src: 'enemy1.png', hp: 100 },
            ])
            
        }, 2000)
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
      console.log(enemies);
    }, [enemies]);

    const buyTowers = (event: React.MouseEvent<HTMLImageElement>) => {
      if (round === 1) {
        (event.target as HTMLImageElement).src = '/tower1.png';
        setTower((prevTower) => {
          const newTower = { id: uuidv4(), position: 15 * (prevTower.length + 1), atack: 50 };
          console.log([...prevTower, newTower]);
          return [...prevTower, newTower];
        });
      }
    }
    const towerAttack = (towerPosition: number, towerAttack:number,furthestEnemy:Enemy) => {
      setEnemies((prevEnemies) =>
        prevEnemies.map((enemy) => {
          if (furthestEnemy && enemy.id === furthestEnemy.id) {
            return { ...enemy, hp: enemy.hp - towerAttack };
          }
          return enemy;
        })
      );
  };
  useEffect(() => {
    if (round === 1) {
    const interval = setInterval(() => {
      tower.forEach(towers => {
        const furthestEnemy = getFurthestEnemyInRadius(towers.position, 20);
        if (furthestEnemy) {
          towerAttack(towers.position, towers.atack, furthestEnemy);
        }
      });
    }, 500); 
  
    return () => clearInterval(interval);
}}, [tower, round]);
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
    <img src='/buildingSite.png' className='absolute top-[20%] left-[15%] w-20 h-20 z-10' onClick={buyTowers} />
    <img src='/buildingSite.png' className='absolute top-[20%] left-[30%] w-20 h-20 z-10' onClick={buyTowers}/>
    <img src='/buildingSite.png' className='absolute top-[20%] left-[45%] w-20 h-20 z-10' onClick={buyTowers}/>
    <img src='/buildingSite.png' className='absolute top-[20%] left-[60%] w-20 h-20 z-10' onClick={buyTowers}/>
    {createEnemy()}
  </div>
      
      
  )
}

export default Spawn
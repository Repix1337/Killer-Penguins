import React, { useState, useEffect, JSX } from 'react'
import { v4 as uuidv4 } from 'uuid'

interface SpawnProps {
  round: number;
  setHealthPoints: React.Dispatch<React.SetStateAction<number>>;
}
interface Enemy {
  id: string;
  position: number;
  src: string;
}
interface Tower {
  id: string;
  position: number;
  
}

const Spawn: React.FC<SpawnProps> = ({ round,setHealthPoints }) => {
  const [enemies, setEnemies] = useState<Enemy[]>([
    { id: uuidv4(), position: -7, src: 'enemy1.png' }
  ]);
  const [tower, setTower] = useState<Tower[]>([]);
    useEffect(() => {
        if (round === 1) {
          const interval = setInterval(() => {
            setEnemies((prevEnemy) => [
              ...prevEnemy,
              { id: uuidv4(), position: -7, src: 'enemy1.png' },
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
          .filter((enemies) => enemies.position <= 100))
    }
    const damagePlayer = (enemies: Enemy[]) => {
      enemies.forEach((enemy) => {
        if (enemy.position >= 100) {
          setHealthPoints((prevHealthPoints) => prevHealthPoints - 1);
          console.log('Player damaged');
        }
      });
    };
    useEffect(() => {
      damagePlayer(enemies);
    }, [enemies]);

    const buyTowers = (event: React.MouseEvent<HTMLImageElement>) => {
      if (round === 1) {
        (event.target as HTMLImageElement).src = '/tower1.png';
        setTower((prevTower) => {
          const newTower = { id: uuidv4(), position: 15 * prevTower.length };
          console.log([...prevTower, newTower]);
          return [...prevTower, newTower];
        });
      }
    }
    const towerAttack = (towerPosition: number) => {
      setEnemies((prevEnemies) =>
        prevEnemies.filter((enemy) => {
          console.log(`Enemy position: ${enemy.position}`);
          return !((enemy.position + towerPosition) > 20 && (enemy.position + towerPosition) < 45);
        })
      );
  };
  useEffect(() => {
    if (round === 1) {
    const interval = setInterval(() => {
      tower.forEach(towers => {
        
        towerAttack(towers.position);
      });
    }, 1000); 
  
    return () => clearInterval(interval);
}}, [tower, round]);
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
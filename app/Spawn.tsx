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

const Spawn: React.FC<SpawnProps> = ({ round,setHealthPoints }) => {
  const [enemies, setEnemies] = useState<Enemy[]>([
    { id: uuidv4(), position: 0, src: 'enemy1.png' }
  ]);
    useEffect(() => {
        if (round === 1) {
          const interval = setInterval(() => {
            setEnemies((prevEnemy) => [
              ...prevEnemy,
              { id: uuidv4(), position: 0, src: 'enemy1.png' },
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
          .filter((enemies) => enemies.position <= 90))
    }
    const damagePlayer = (enemies: Enemy[]) => {
      enemies.forEach((enemy) => {
        if (enemy.position >= 90) {
          setHealthPoints((prevHealthPoints) => prevHealthPoints - 1);
          console.log('Player damaged');
        }
      });
    };
    useEffect(() => {
      damagePlayer(enemies);
    }, [enemies]);
  return (
    <div>
      {createEnemy()}
      </div>
  )
}

export default Spawn
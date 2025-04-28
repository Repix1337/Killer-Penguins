import React from "react";
import { Enemy } from "./EnemyInterface";
import { EnemyType } from "./EnemyInterface";
import { Tower } from "./TowerInterface";
import {
  AttackEffect,
  ExplosionEffect,
  LingeringEffect,
} from "./EffectInterfaces";

type TowerAttackDependencies = {
  setTower: React.Dispatch<React.SetStateAction<Tower[]>>;
  setEnemies: React.Dispatch<React.SetStateAction<Enemy[]>>;
  setAttackEffects: React.Dispatch<React.SetStateAction<AttackEffect[]>>;
  setExplosionEffects: React.Dispatch<React.SetStateAction<ExplosionEffect[]>>;
  setLingeringEffects: React.Dispatch<React.SetStateAction<LingeringEffect[]>>;
  isPaused: boolean;
  isSpeedUp: number;
  uuidv4: () => string;
  createNewEnemy: (type: EnemyType, x: number, y: number) => Enemy;
  grantMoneyForKill: (enemy: Enemy) => void;
};

export const towerAttack = (
  tower: Tower,
  targets: Enemy[],
  dependencies: TowerAttackDependencies
) => {
  if (tower.isAttacking) return;

  const {
    setTower,
    setEnemies,
    setAttackEffects,
    setExplosionEffects,
    setLingeringEffects,
    isPaused,
    isSpeedUp,
    uuidv4,
    createNewEnemy,
    grantMoneyForKill,
  } = dependencies;

  setTower((prevTowers) =>
    prevTowers.map((t) => (t.id === tower.id ? { ...t, isAttacking: true } : t))
  );

  let totalDamageDealt = 0;

  // Handle attack effects
  const newEffects = targets.map((target) => ({
    id: uuidv4(),
    towerPositionX: tower.positionX,
    towerPositionY: tower.positionY,
    enemyPositionX: target.positionX,
    enemyPositionY: target.positionY,
    timestamp: Date.now(),
    effectSrc: tower.effectSrc,
  }));

  // Batch state updates together
  const updateStates = () => {
    // Mark tower as attacking
    setTower((prevTowers) =>
      prevTowers.map((t) =>
        t.id === tower.id ? { ...t, isAttacking: true } : t
      )
    );

    // Add new effects
    setAttackEffects((prevEffects) => [...prevEffects, ...newEffects]);

    // Handle enemy updates and damage
    setEnemies((prevEnemies) => {
      let updatedEnemies;
      // Calculate critical hit if tower has that ability
      const isCriticalHit =
        tower.hasCritical &&
        tower.criticalChance &&
        Math.random() <= tower.criticalChance;
      const damageMultiplier = isCriticalHit
        ? tower.criticalMultiplier || 1
        : 1;

      if (tower.attackType === "explosion") {
        const primaryTarget = targets[0];

        // Find enemies in radius
        const enemiesInExplosionRadius = prevEnemies.filter((enemy) => {
          if (enemy.hp <= 0 || enemy.id === primaryTarget.id) return false;
          const dx = enemy.positionX - primaryTarget.positionX;
          const dy = enemy.positionY - primaryTarget.positionY;
          const distance = Math.sqrt(dx * dx + dy * dy);
          return distance <= tower.explosionRadius;
        });

        // Add explosion effect
        setExplosionEffects((prev) => [
          ...prev,
          {
            id: uuidv4(),
            positionX: primaryTarget.positionX,
            positionY: primaryTarget.positionY,
            timestamp: Date.now(),
            sourceId: tower.id,
          },
        ]);
        setTimeout(() => {
          setExplosionEffects((prev) =>
            prev.filter(
              (effect) => effect.positionX !== primaryTarget.positionX
            )
          );
        }, 250);
        // If tower has lingering effect, create lingering zone
        if (tower.hasLingering) {
          setLingeringEffects((prev) => [
            ...prev,
            {
              id: uuidv4(),
              positionX: primaryTarget.positionX,
              positionY: primaryTarget.positionY,
              damage: tower.lingeringDamage || tower.attack * 0.1,
              enemyCurrentHpDmgMultiplier:
                tower.enemyCurrentHpDmgMultiplier ?? 0,
              radius: tower.lingeringRadius || 15,
              timestamp: Date.now(),
              duration: tower.lingeringDuration || 2000,
              canStopRegen: tower.canStopRegen,
              color: tower.lingeringColor || "rgba(255, 69, 0, 0.5)",
              towerId: tower.id, 
            },
          ]);
        }

        let explosionDamageTotal = 0;
        updatedEnemies = prevEnemies.map((enemy) => {
          if (enemy.hp <= 0) return enemy;

          const isInExplosion =
            enemy.id === primaryTarget.id ||
            enemiesInExplosionRadius.some((e) => e.id === enemy.id);

          if (isInExplosion) {
            const baseDamage =
              enemy.id === primaryTarget.id ? tower.attack : tower.attack / 4;
            const markMultiplier = enemy.marked ? enemy.markedDamageMultiplier ?? 1 : 1;
            const damage = baseDamage * damageMultiplier * markMultiplier;
            const actualDamage = Math.min(damage, enemy.hp);
            explosionDamageTotal += actualDamage;

            const newHp =
              enemy.isArmored && !tower.canHitArmored
                ? enemy.hp
                : Math.max(enemy.hp - actualDamage, 0);

            let updatedEnemy = {
              ...enemy,
              maxHp:
                tower.healthReduction && !enemy.hasReducedHealth
                  ? enemy.maxHp * (1 - tower.healthReduction)
                  : enemy.maxHp,
              hp:
                (tower.healthReduction && !enemy.hasReducedHealth
                  ? enemy.hp * (1 - tower.healthReduction)
                  : enemy.hp) -
                  (enemy.type === "boss"
                    ? actualDamage * (tower.bossDamageMultiplier ?? 1)
                    : actualDamage),
              hasReducedHealth: tower.healthReduction ? true : false,
            };
            // Remove armor if tower can hit armored enemies
            if (tower.canHitArmored && enemy.isArmored) {
              updatedEnemy = {
                ...updatedEnemy,
                isArmored: false,
                src: enemy.src.replace("armored", ""),
              };
            }
            if (newHp <= 0 && enemy.hp > 0) {
              if (enemy.canSpawn && enemy.spawnType) {
                const spawnBatch = async () => {
                  for (let i = 0; i < 5; i++) {
                    // Add a small delay between spawns
                    await new Promise((resolve) => setTimeout(resolve, 50));
                    setEnemies((prev) => [
                      ...prev,
                      createNewEnemy(
                        enemy.spawnType ?? "ARMOREDSPEEDYMEGATANK",
                        enemy.positionX,
                        enemy.positionY
                      ),
                    ]);
                  }
                };
                spawnBatch();
              }

              grantMoneyForKill(enemy);
            }
            // Apply additional effects like stun/slow
            if (tower.canStun) {
              if (
                updatedEnemy.isStunned &&
                updatedEnemy.stunStartTime &&
                updatedEnemy.stunDuration
              ) {
                // If already stunned, add to the remaining duration
                const remainingDuration =
                  updatedEnemy.stunDuration -
                  (Date.now() - updatedEnemy.stunStartTime);
                const newDuration =
                  Math.max(0, remainingDuration) +
                  (tower.stunDuration || 150) * (enemy.stunReduction || 1);

                updatedEnemy = {
                  ...updatedEnemy,
                  stunDuration: newDuration,
                };
              } else {
                // If not stunned, apply new stun
                updatedEnemy = {
                  ...updatedEnemy,
                  isStunned: true,
                  stunSourceId: tower.id,
                  stunStartTime: Date.now(),
                  stunDuration:
                    (tower.stunDuration || 150) * (enemy.stunReduction || 1),
                  speed: 0,
                };
              }
            }

            if (tower.slowAmount) {
              const newSlowAmount = tower.slowAmount;
              if (
                !updatedEnemy.isSlowed ||
                newSlowAmount <= (updatedEnemy.slowValue || 1)
              ) {
                updatedEnemy = {
                  ...updatedEnemy,
                  isSlowed: true,
                  slowSourceId: tower.id,
                  slowStartTime: Date.now(),
                  slowValue: newSlowAmount,
                  speed: !updatedEnemy.isStunned
                    ? enemy.baseSpeed * newSlowAmount
                    : 0,
                };
              }
            }
            if (tower.poisonDamage > 0) {
              updatedEnemy = {
                ...updatedEnemy,
                isPoisoned: true,
                poisonSourceId: tower.id,
                poisonStartTime: Date.now(),
                canRegen: enemy.canRegen && !tower.canStopRegen,
              };
            }

            return updatedEnemy;
          }
          return enemy;
        });

        totalDamageDealt = explosionDamageTotal;
      } else if (tower.attackType === "chain") {
        // Get initial target
        const chainEffects: {
          id: string;
          towerPositionX: number;
          towerPositionY: number;
          enemyPositionX: number;
          enemyPositionY: number;
          effectSrc: string;
          timestamp: number;
        }[] = [];
        
        let currentTarget = targets[0];
        let chainsLeft = tower.chainCount || 1;
        const chainedEnemies = new Set([targets[0].id]);
        let chainDamage = 0;

        // Create the first chain effect
        chainEffects.push({
          id: uuidv4(),
          towerPositionX: tower.positionX,
          towerPositionY: tower.positionY,
          enemyPositionX: currentTarget.positionX,
          enemyPositionY: currentTarget.positionY,
          effectSrc: "/chainLightning.png",
          timestamp: Date.now(),
        });

        while (chainsLeft > 1) {
          const nextTarget = prevEnemies.find((enemy) => {
            if (enemy.hp <= 0 || chainedEnemies.has(enemy.id)) return false;
            const dx = enemy.positionX - currentTarget.positionX;
            const dy = enemy.positionY - currentTarget.positionY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            return distance <= (tower.chainRange || 15);
          });

          if (!nextTarget) break;

          chainedEnemies.add(nextTarget.id);

          // Create chain effect between previous and next target
          chainEffects.push({
            id: uuidv4(),
            towerPositionX: currentTarget.positionX,
            towerPositionY: currentTarget.positionY,
            enemyPositionX: nextTarget.positionX,
            enemyPositionY: nextTarget.positionY,
            effectSrc: "/chainLightning.png",
            timestamp: Date.now(),
          });

          currentTarget = nextTarget;
          chainsLeft--;
        }

        // Add all chain effects at once
        setAttackEffects((prev) => [...prev, ...chainEffects]);

        // Set a single cleanup timeout for all chain effects
        const effectIds = chainEffects.map((effect) => effect.id);
        setTimeout(() => {
          if (!isPaused) {
            setAttackEffects((prev) =>
              prev.filter((effect) => !effectIds.includes(effect.id))
            );
          }
        }, Math.min(tower.attackInterval, 500) / (isSpeedUp === 2 ? 3 : isSpeedUp ? 2 : 1));

        // Handle chain damage
        updatedEnemies = prevEnemies.map((enemy) => {
          if (chainedEnemies.has(enemy.id)) {
            const markMultiplier = enemy.marked ? enemy.markedDamageMultiplier ?? 1 : 1;
            const damage = Math.min(
              tower.attack * damageMultiplier * markMultiplier,
              enemy.hp
            );
            chainDamage += damage;

            let updatedEnemy = { ...enemy };

            if (tower.canStun) {
              if (
                enemy.isStunned &&
                enemy.stunStartTime &&
                enemy.stunDuration
              ) {
                // If already stunned, add to the remaining duration
                const remainingDuration =
                  enemy.stunDuration -
                  (Date.now() - enemy.stunStartTime);
                const newDuration =
                  Math.max(0, remainingDuration) +
                  (tower.stunDuration || 150) * (enemy.stunReduction || 1);

                updatedEnemy = {
                  ...updatedEnemy,
                  stunDuration: newDuration,
                };
              } else {
                // If not stunned, apply new stun
                updatedEnemy = {
                  ...updatedEnemy,
                  isStunned: true,
                  stunSourceId: tower.id,
                  stunStartTime: Date.now(),
                  stunDuration: (tower.stunDuration || 150) * (enemy.stunReduction || 1),
                  speed: 0,
                };
              }
            }

            return {
              ...updatedEnemy,
              hp: enemy.hp -
                (enemy.type === "boss"
                  ? damage * (tower.bossDamageMultiplier ?? 1)
                  : damage),
              isTargeted: true,
            };
          }
          return enemy;
        });

        totalDamageDealt = chainDamage;
      } else if (tower.attackType === "lingering") {
        setLingeringEffects((prev) => [
          ...prev,
          {
            id: uuidv4(),
            positionX: targets[0].positionX,
            positionY: targets[0].positionY,
            damage: tower.lingeringDamage || tower.attack * 0.1,
            enemyCurrentHpDmgMultiplier: tower.enemyCurrentHpDmgMultiplier ?? 0,
            radius: tower.lingeringRadius || 10,
            timestamp: Date.now(),
            duration: tower.lingeringDuration || 2000,
            canStopRegen: tower.canStopRegen,
            color: tower.lingeringColor || "rgba(144, 238, 144, 0.5)",
            towerId: tower.id, 
          },
        ]);

        // Apply initial impact damage
        updatedEnemies = prevEnemies.map((enemy) => {
          const isTargeted = targets.some((target) => target.id === enemy.id);
          if (!isTargeted) return enemy;

          const markMultiplier = enemy.marked ? enemy.markedDamageMultiplier ?? 1 : 1;
          const actualDamage = Math.min(
            tower.attack * damageMultiplier * markMultiplier,
            enemy.hp
          );
          return {
            ...enemy,
            hp:
              enemy.hp -
              (enemy.type === "boss"
                ? actualDamage * (tower.bossDamageMultiplier ?? 1)
                : actualDamage),
          };
        });
        totalDamageDealt = tower.lingeringDamage || tower.attack * 0.1;
      } else {
        // normal attack logic
        updatedEnemies = prevEnemies.map((enemy) => {
          const isTargeted = targets.some((target) => target.id === enemy.id);
          if (!isTargeted) return enemy;
          let updatedEnemy = { ...enemy };
          
          if (tower.acceleration) {
            updatedEnemy = {
              ...updatedEnemy,
              acceleratedHitCount: enemy.acceleratedHitCount + 1,
              accelerationValue: tower.accelerationValue,
            };
          }
          const markMultiplier = updatedEnemy.marked
            ? updatedEnemy.markedDamageMultiplier ?? 1
            : 1;
          if (tower.canMark) {
            updatedEnemy = {
              ...updatedEnemy,
              marked: true,
              markedDamageMultiplier: tower.markedDamageMultiplier,
              markedExplosion: tower.markedExplosion,
            };
          }

          const actualDamage = Math.min(
            tower.attack *
              damageMultiplier *
              markMultiplier *
              (1 +
                (enemy.accelerationValue ?? 0.1) * enemy.acceleratedHitCount),
            enemy.hp
          );
          totalDamageDealt += actualDamage;

          // Apply stun effect if tower has it
          if (tower.canStun) {
            if (
              updatedEnemy.isStunned &&
              updatedEnemy.stunStartTime &&
              updatedEnemy.stunDuration
            ) {
              // If already stunned, add to the remaining duration
              const remainingDuration =
                updatedEnemy.stunDuration -
                (Date.now() - updatedEnemy.stunStartTime);
              const newDuration =
                Math.max(0, remainingDuration) +
                (tower.stunDuration || 150) * (enemy.stunReduction || 1);

              updatedEnemy = {
                ...updatedEnemy,
                stunDuration: newDuration,
              };
            } else {
              // If not stunned, apply new stun
              updatedEnemy = {
                ...updatedEnemy,
                isStunned: true,
                stunSourceId: tower.id,
                stunStartTime: Date.now(),
                stunDuration:
                  (tower.stunDuration || 150) * (enemy.stunReduction || 1),
                speed: 0,
              };
            }
          }

          // Apply slow effect if tower has it
          if (tower.slowAmount) {
            const newSlowAmount = tower.slowAmount;
            const currentSlowAmount = updatedEnemy.slowValue || 1;

            // Only apply new slow if it's stronger or there's no current slow
            if (!updatedEnemy.isSlowed || newSlowAmount < currentSlowAmount) {
              const calculatedSpeed = enemy.baseSpeed * newSlowAmount;

              updatedEnemy = {
                ...updatedEnemy,
                isSlowed: true,
                slowSourceId: tower.id,
                slowStartTime: Date.now(),
                slowValue: newSlowAmount,
                speed: !updatedEnemy.isStunned ? calculatedSpeed : 0,
              };
            }
          }

          // Apply other effects (poison, etc.)
          if (tower.type === "gasspitter") {
            updatedEnemy = {
              ...updatedEnemy,
              isPoisoned: true,
              poisonSourceId: tower.id,
              poisonStartTime: Date.now(),
              canRegen: tower.canStopRegen ? false : true,
            };
          }

          // Apply damage based on armor
          updatedEnemy.hp =
            enemy.isArmored && !tower.canHitArmored
              ? enemy.hp
              : Math.max(
                  enemy.hp -
                    (enemy.type === "boss"
                      ? actualDamage * (tower.bossDamageMultiplier ?? 1)
                      : actualDamage),
                  0
                );
          updatedEnemy.executed =
            (updatedEnemy.hp / enemy.maxHp) * 100 <=
            (tower.executeTreshhold ?? 1);
          // Then check for kill and grant money
          if ((updatedEnemy.hp <= 0 && enemy.hp > 0) || enemy.executed) {
            if (enemy.canSpawn && enemy.spawnType) {
              const spawnBatch = async () => {
                for (let i = 0; i < 5; i++) {
                  // Add a small delay between spawns
                  await new Promise((resolve) => setTimeout(resolve, 50));
                  setEnemies((prev) => [
                    ...prev,
                    createNewEnemy(
                      enemy.spawnType ?? "ARMOREDSPEEDYMEGATANK",
                      enemy.positionX,
                      enemy.positionY
                    ),
                  ]);
                }
              };
              spawnBatch();
            }

            grantMoneyForKill(enemy);
          }
          updatedEnemy.isTargeted = true;
          return updatedEnemy;
        });
      }

      return updatedEnemies;
    });
  };

  // Execute updates
  updateStates();

  // Clean up effects after animation
  const cleanupTimeout = setTimeout(() => {
    if (!isPaused) {
      // Create a cleanup batch to avoid multiple state updates
      const batchedUpdates = () => {
        const effectsToRemove = newEffects.map((e) => e.id);
        const targetIds = targets.map((t) => t.id);

        // Single state update for attack effects
        setAttackEffects((prevEffects) =>
          prevEffects.filter((effect) => !effectsToRemove.includes(effect.id))
        );

        // Single state update for towers
        setTower((prevTowers) =>
          prevTowers.map((t) =>
            t.id === tower.id
              ? {
                  ...t,
                  isAttacking: false,
                  damageDone: t.damageDone + totalDamageDealt,
                }
              : t
          )
        );

        // Single state update for enemies
        setEnemies((prevEnemies) =>
          prevEnemies.map((enemy) =>
            targetIds.includes(enemy.id)
              ? { ...enemy, isTargeted: false }
              : enemy
          )
        );
      };

      // Execute all updates in one batch
      batchedUpdates();
    }
  }, tower.attackInterval / (isSpeedUp === 2 ? 3 : isSpeedUp ? 2 : 1));

  return () => {
    clearTimeout(cleanupTimeout);
  };
};

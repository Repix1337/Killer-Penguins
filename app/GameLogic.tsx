import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import { useSettings } from "./context/SettingsContext";
import { saveGameResult } from "@/app/saveGameResult";
import { towerUpgrades } from "./towerUpgrades";
import Image from "next/image";
import { towerAttack } from "./towerAttack";
import { Tower } from "./TowerInterface";
import { Enemy } from "./EnemyInterface";
import { LingeringEffect } from "./EffectInterfaces";
import PopUp from "./PopUp";

// Define the props for the Spawn component
interface SpawnProps {
  round: number;
  setHealthPoints: React.Dispatch<React.SetStateAction<number>>;
  money: number;
  setMoney: React.Dispatch<React.SetStateAction<number>>;
  setRound: React.Dispatch<React.SetStateAction<number>>;
  hp: number;
  isSpeedUp: number;
  setIsSpeedUp: React.Dispatch<React.SetStateAction<number>>;
  setIsPaused: React.Dispatch<React.SetStateAction<boolean>>;
  isPaused: boolean;
  canPause: boolean;
  setCanPause: React.Dispatch<React.SetStateAction<boolean>>;
  selectedTowerType: string;
  gameMode: string;
}

interface TowerUpgrade {
  name: string;
  cost: number;
  description: string;
  path: number;
  effect: (tower: Tower) => Partial<Tower>;
  requires: number; // Previous upgrade level required
}

const Spawn: React.FC<SpawnProps> = ({
  gameMode,
  round,
  setHealthPoints,
  money,
  setMoney,
  setRound,
  hp,
  setIsSpeedUp,
  isSpeedUp,
  setIsPaused,
  canPause,
  isPaused,
  setCanPause,
  selectedTowerType,
}) => {
  // Game state
  const [enemies, setEnemies] = useState<Enemy[]>([]);
  const [tower, setTower] = useState<Tower[]>([]);
  const [attackEffects, setAttackEffects] = useState<
    {
      id: string;
      towerPositionX: number;
      towerPositionY: number;
      enemyPositionX: number;
      enemyPositionY: number;
      effectSrc: string;
      timestamp: number;
    }[]
  >([]);
  const [enemyCount, setEnemyCount] = useState(0);
  const [showUpgradeMenu, setShowUpgradeMenu] = useState(false);
  const [selectedTowerID, setSelectedTowerID] = useState("");
  const [showEnemyAlert, setShowEnemyAlert] = useState(false);
  const [enemyAlertDescription, setEnemyAlertDescription] = useState("");
  const [explosionEffects, setExplosionEffects] = useState<
    {
      id: string;
      positionX: number;
      positionY: number;
      timestamp: number;
    }[]
  >([]);

  // Add this new state near other state declarations
  const [isPageVisible, setIsPageVisible] = useState(true);
  const [showGameOver, setShowGameOver] = useState(false);
  const [showWinScreen, setShowWinScreen] = useState(false);
  const [hasWon, setHasWon] = useState(false);

  const [lingeringEffects, setLingeringEffects] = useState<LingeringEffect[]>(
    []
  );
  const {
    showRangeIndicators,
    showHealthBars,
    confirmTowerSell,
    autoStartRounds,
  } = useSettings();
  // Add this new useEffect for visibility tracking
  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsPageVisible(!document.hidden);
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  // Add this state to track which enemies have granted money
  const [processedEnemies] = useState(() => new Set<string>());

  // First, extract enemy types as constants
  const ENEMY_TYPES = useMemo(() => ({
    BASIC: {
      src: "basicEnemy.png",
      hp: 100,
      damage: 5,
      type: "basic",
      speed: 0.25, // from 0.150 * 1.5
      baseSpeed: 0.25, // from 0.150 * 1.5
      regen: 0,
      canRegen: false,
      isArmored: false,
    },
    STEALTH: {
      src: "stealth.png",
      hp: 50,
      damage: 10,
      type: "stealth",
      speed: 0.25, // from 0.150 * 1.5
      baseSpeed: 0.25, // from 0.150 * 1.5
      regen: 0,
      canRegen: false,
      isArmored: false,
    },
    TANK: {
      src: "tank.png",
      hp: 350,
      damage: 5,
      type: "basic",
      speed: 0.2, // from 0.125 * 1.5
      baseSpeed: 0.2, // from 0.125 * 1.5
      regen: 0,
      canRegen: false,
      isArmored: false,
    },
    SPEEDY: {
      src: "speedy.png",
      hp: 40,
      damage: 35,
      type: "speedy",
      speed: 1.6, // from 1.0 * 1.5
      baseSpeed: 1.6, // from 1.0 * 1.5
      regen: 0,
      canRegen: false,
      isArmored: false,
    },
    STEALTHYTANK: {
      src: "stealthyTank.png",
      hp: 250,
      damage: 20,
      type: "stealth",
      speed: 0.2, // from 0.125 * 1.5
      baseSpeed: 0.2, // from 0.125 * 1.5
      regen: 0,
      canRegen: false,
      isArmored: false,
    },
    STEALTHYSPEEDY: {
      src: "stealthySpeedy.png",
      hp: 50,
      damage: 50,
      type: "stealth",
      speed: 1.6, // from 1.0 * 1.5
      baseSpeed: 1.6, // from 1.0 * 1.5
      regen: 0,
      canRegen: false,
      isArmored: false,
    },
    REGENTANK: {
      src: "regenTank.png",
      hp: 400,
      damage: 50,
      type: "regentank",
      speed: 0.2, // from 0.125 * 1.5
      baseSpeed: 0.2, // from 0.125 * 1.5
      regen: 75,
      canRegen: true,
      isArmored: false,
    },
    SPEEDYREGENTANK: {
      src: "regenTank.png",
      hp: 600,
      damage: 50,
      type: "speedyregentank",
      speed: 0.375, // from 0.2 * 1.5
      baseSpeed: 0.375, // from 0.2 * 1.5
      regen: 125,
      canRegen: true,
      isArmored: false,
    },
    BOSS: {
      src: "boss.png",
      hp: 50000,
      damage: 1000,
      type: "boss",
      speed: 0.16,
      baseSpeed: 0.16,
      regen: 1000,
      canRegen: true,
      isArmored: false,
      stunReduction: 0.8,
      slowReduction: 0.8,
    },
    ULTRATANKS: {
      src: "ultraTank.png",
      hp: 1750,
      damage: 1000,
      type: "ultratank",
      speed: 0.17,
      baseSpeed: 0.17,
      regen: 0,
      canRegen: false,
      isArmored: false,
    },
    ARMOREDBASIC: {
      src: "armoredbasicEnemy.png",
      hp: 125,
      damage: 30,
      type: "armoredbasic",
      speed: 0.225,
      baseSpeed: 0.225,
      regen: 0,
      canRegen: false,
      isArmored: true,
    },
    ARMOREDTANK: {
      src: "armoredtank.png",
      hp: 400,
      damage: 400,
      type: "armoredtank",
      speed: 0.2,
      baseSpeed: 0.2,
      regen: 0,
      canRegen: false,
      isArmored: true,
    },
    ARMOREDULTRATANK: {
      src: "armoredultraTank.png",
      hp: 2000,
      damage: 1000,
      type: "armoredultratank",
      speed: 0.225,
      baseSpeed: 0.225,
      regen: 0,
      canRegen: false,
      isArmored: true,
    },
    ARMOREDSPEEDYMEGATANK: {
      src: "armoredspeedyMegaTank.png",
      hp: 3500,
      damage: 1000,
      type: "armoredultratank",
      speed: 0.6,
      baseSpeed: 0.6,
      regen: 0,
      canRegen: false,
      isArmored: true,
    },
    SPEEDYMEGATANK: {
      src: "speedyMegaTank.png",
      hp: 3000,
      damage: 1000,
      type: "armoredultratank",
      speed: 0.6,
      baseSpeed: 0.6,
      regen: 0,
      canRegen: false,
      isArmored: true,
    },
    MEGABOSS: {
      src: "megaBoss.png",
      hp: 125000,
      damage: 1000,
      type: "boss",
      speed: 0.225,
      baseSpeed: 0.225,
      regen: 5000,
      canRegen: true,
      isArmored: false,
      stunReduction: 0.4,
      slowReduction: 0.4,
    },
    ULTRABOSS: {
      src: "boss.png",
      hp: 500000,
      damage: 1000,
      type: "boss",
      speed: 0.325,
      baseSpeed: 0.325,
      regen: 50000,
      canRegen: true,
      isArmored: false,
      stunReduction: 0.2,
      slowReduction: 0.2,
    },
    SPAWNER: {
      src: "boss.png",
      hp: 2000,
      damage: 100,
      type: "spawner",
      speed: 0.2,
      baseSpeed: 0.2,
      regen: 0,
      canRegen: false,
      isArmored: false,
      canSpawn: true,
      spawnType: "SPEEDYMEGATANK",
    },
    GIGASPAWNER: {
      src: "boss.png",
      hp: 5000,
      damage: 100,
      type: "spawner",
      speed: 0.2,
      baseSpeed: 0.2,
      regen: 0,
      canRegen: false,
      isArmored: false,
      canSpawn: true,
      spawnType: "SPEEDYGIGATANK",
    },
    MEGABOSSSPAWNER: {
      src: "boss.png",
      hp: 25000,
      damage: 100,
      type: "spawner",
      speed: 0.2,
      baseSpeed: 0.2,
      regen: 0,
      canRegen: false,
      isArmored: false,
      canSpawn: true,
      spawnType: "MEGABOSS",
    },
    SPEEDYGIGATANK: {
      src: "speedyGigaTank.png",
      hp: 10000,
      damage: 1000,
      type: "speedygigatank",
      speed: 0.5,
      baseSpeed: 0.5,
      regen: 0,
      canRegen: false,
      isArmored: true,
    },
  }), []);

  // Add this near ENEMY_TYPES constant
  const TOWER_TYPES = {
    BASIC: {
      src: "/basic.png",
      baseAttack: 50,
      attack: 50,
      baseAttackInterval: 1000,
      attackInterval: 1000, // renamed from attackSpeed
      price: 100,
      towerWorth: 100,
      type: "basic",
      maxDamage: 300,
      maxAttackInterval: 450, // renamed from maxAttackSpeed
      radius: 27,
      attackType: "single",
      canHitStealth: false,
      poisonDamage: 0,
      maxPoisonDamage: 0,
      hasSpecialUpgrade: false,
      specialUpgradeAvailable: false,
      canStopRegen: false,
      explosionRadius: 0,
      effectSrc: "/basicAttack.png",
    },
    SNIPER: {
      src: "/sniper.png",
      baseAttack: 120,
      attack: 120,
      baseAttackInterval: 2000,
      attackInterval: 2000,
      price: 200,
      towerWorth: 200,
      type: "sniper",
      maxDamage: 1500,
      maxAttackInterval: 1000,
      radius: 120,
      attackType: "single",
      canHitStealth: true,
      poisonDamage: 0,
      maxPoisonDamage: 0,
      hasSpecialUpgrade: false,
      specialUpgradeAvailable: false,
      canStopRegen: false,
      explosionRadius: 0,
      effectSrc: "/sniperAttack.png",
    },
    RAPIDSHOOTER: {
      src: "/rapidShooter.png",
      baseAttack: 20,
      attack: 20,
      baseAttackInterval: 350,
      attackInterval: 350,
      price: 500,
      towerWorth: 500,
      type: "rapidShooter",
      maxDamage: 68,
      maxAttackInterval: 200,
      radius: 27,
      attackType: "double",
      canHitStealth: false,
      poisonDamage: 0,
      maxPoisonDamage: 0,
      hasSpecialUpgrade: false,
      specialUpgradeAvailable: false,
      canStopRegen: false,
      explosionRadius: 0,
      effectSrc: "/rapidAttack.png",
    },
    SLOWER: {
      src: "/slower.png",
      baseAttack: 10,
      attack: 10,
      baseAttackInterval: 1000,
      attackInterval: 1000,
      price: 300,
      towerWorth: 300,
      type: "slower",
      maxDamage: 15,
      maxAttackInterval: 700,
      radius: 27,
      attackType: "double",
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
      effectSrc: "/slowerAttack.png",
    },
    GASSPITTER: {
      src: "/gasSpitter.png",
      baseAttack: 20,
      attack: 20,
      baseAttackInterval: 1000,
      attackInterval: 1000,
      price: 300,
      towerWorth: 300,
      type: "gasspitter",
      maxDamage: 20,
      maxAttackInterval: 600,
      radius: 27,
      attackType: "double",
      canHitStealth: false,
      poisonDamage: 25,
      maxPoisonDamage: 360,
      poisonDuration: 4000,
      hasSpecialUpgrade: false,
      specialUpgradeAvailable: false,
      canStopRegen: false,
      explosionRadius: 0,
      effectSrc: "/poisonAttack.png",
    },
    MORTAR: {
      src: "/mortar.png",
      baseAttack: 450,
      attack: 450,
      baseAttackInterval: 8500,
      attackInterval: 8500,
      price: 1200,
      towerWorth: 1200,
      type: "mortar",
      maxDamage: 650,
      maxAttackInterval: 4500,
      radius: 60,
      attackType: "explosion",
      canHitStealth: false,
      poisonDamage: 0,
      maxPoisonDamage: 0,
      hasSpecialUpgrade: false,
      specialUpgradeAvailable: false,
      canStopRegen: false,
      explosionRadius: 20,
      canHitArmored: true,
      effectSrc: "/sniperAttack.png",
    },
    CANNON: {
      src: "/cannon.png",
      baseAttack: 75,
      attack: 75,
      baseAttackInterval: 2750,
      attackInterval: 2750,
      price: 500,
      towerWorth: 500,
      type: "cannon",
      maxDamage: 380,
      maxAttackInterval: 1000,
      radius: 27,
      attackType: "explosion",
      canHitStealth: false,
      poisonDamage: 0,
      maxPoisonDamage: 0,
      hasSpecialUpgrade: false,
      specialUpgradeAvailable: false,
      canStopRegen: false,
      explosionRadius: 15,
      effectSrc: "/sniperAttack.png",
      canHitArmored: true,
    },
  };

  // Add this helper function
  const resetGame = useCallback(() => {
    // Only target towers on the game board, not in the selection panel
    const buildingSites = document.querySelectorAll(
      'img[id^="building-site-"], [id^="tower-"]'
    );

    buildingSites.forEach((element) => {
      if (element instanceof HTMLImageElement) {
        element.src = "/buildingSite.png";
      }
    });

    // Reset game state
    lastRound.current = 0;
    setRound(0);
    setEnemyCount(0);
    setHealthPoints(100);
    setMoney(200);
    setEnemies([]);
    setTower([]);
    setShowUpgradeMenu(false);
    setShowGameOver(false);
    setShowWinScreen(false);
    setIsPaused(false);
  }, [setRound, setEnemyCount, setHealthPoints, setMoney, setEnemies, setTower, setShowUpgradeMenu, setShowGameOver, setShowWinScreen, setIsPaused]);

  // Then create a helper function for creating new towers
  const createNewTower = (
    type: keyof typeof TOWER_TYPES,
    positionX: number,
    positionY: number,
    id: string
  ): Tower => ({
    id: id,
    positionX: positionX,
    positionY: positionY,
    furthestEnemyInRange: null,
    isAttacking: false,
    targettingType: "first",
    damageDone: 0,
    upgradeLevel: 0,
    path1Level: 0,
    path2Level: 0,
    path: 0,
    ...TOWER_TYPES[type],
  });

  // Then, create helper function for spawning enemies
  const createNewEnemy = useCallback((
    type: keyof typeof ENEMY_TYPES,
    positionX?: number,
    positionY?: number
  ) => {
    const enemyStats = ENEMY_TYPES[type];
    return {
      id: uuidv4(),
      positionX: positionX ?? -6, // Use provided X or default to -6
      positionY: positionY ?? 56, // Use provided Y or default to 56
      isTargeted: false,
      isSlowed: false,
      isPoisoned: false,
      isStunned: false,
      slowReduction: 1,
      stunReduction: 1,
      maxHp: enemyStats.hp,
      executed: false,
      marked: false,
      acceleratedHitCount: 1,
      hasReducedHealth: false,
      ...enemyStats,
    };
  }, [ENEMY_TYPES]);
  useEffect(() => {
    if (hp <= 0) {
      setIsPaused(true);
      setShowGameOver(true);
    }
  }, [hp,setIsPaused]);

  const getEnemyLimit = (round: number) => {
    switch (true) {
      case round <= 26:
        return 10 * round;
      case round > 30:
        return Math.ceil((15 * round) / 2); // Half enemies after round 30
      default:
        return 15 * round;
    }
  };
  useEffect(() => {
    if (!isPageVisible || isPaused) return;

    const spawnEnemies = () => {
      if (
        round >= 50 &&
        enemies.length === 0 &&
        enemyCount >= getEnemyLimit(round)
      ) {
        if (hasWon === false) {
          setHasWon(true);
          setIsPaused(true);
          setShowWinScreen(true);
        }
        return; // Don't spawn more enemies if game is ended
      }

      switch (true) {
        case round === 0:
          setEnemies([]);
          break;

        case round <= 4 || (round > 5 && round < 10):
          if (enemyCount < getEnemyLimit(round)) {
            setEnemies((prev) => [...prev, createNewEnemy("BASIC")]);
            setEnemyCount((prev) => prev + 1);
          }
          if (round === 4 && enemies.length === 0) {
            setShowEnemyAlert(true);
            setEnemyAlertDescription(
              "Stealth enemies are coming next round! Make sure u have stealth detection"
            );
          }
          break;

        case round === 5:
          if (enemyCount < getEnemyLimit(round)) {
            const type5 = enemyCount % 2 === 0 ? "STEALTH" : "SPEEDY";
            setEnemies((prev) => [...prev, createNewEnemy(type5)]);
            setEnemyCount((prev) => prev + 1);
          }
          break;

        case round >= 10 && round <= 12:
          if (enemyCount < getEnemyLimit(round)) {
            const type10 =
              enemyCount % 3 === 0
                ? "STEALTH"
                : enemyCount % 3 === 1
                ? "SPEEDY"
                : "BASIC";
            setEnemies((prev) => [...prev, createNewEnemy(type10)]);
            setEnemyCount((prev) => prev + 1);
          }
          if (round === 12 && enemies.length === 0) {
            setShowEnemyAlert(true);
            setEnemyAlertDescription(
              "Armored Enemies are coming next round! Make sure u have explosion towers"
            );
          }
          break;
        case round >= 13 && round <= 15:
          if (enemyCount < getEnemyLimit(round)) {
            const type10 =
              enemyCount % 3 === 0
                ? "STEALTH"
                : enemyCount % 3 === 1
                ? "SPEEDY"
                : "ARMOREDBASIC";
            setEnemies((prev) => [...prev, createNewEnemy(type10)]);
            setEnemyCount((prev) => prev + 1);
          }
          break;

        case round > 15 && round <= 21:
          if (enemyCount < getEnemyLimit(round)) {
            const type15 =
              enemyCount % 3 === 0
                ? "STEALTH"
                : enemyCount % 3 === 1
                ? "SPEEDY"
                : "TANK";
            setEnemies((prev) => [...prev, createNewEnemy(type15)]);
            setEnemyCount((prev) => prev + 1);
          }
          if (round === 21 && enemies.length === 0) {
            setShowEnemyAlert(true);
            setEnemyAlertDescription(
              "Regen Enemies are coming next round! Make sure u have enough dmg or you can stop your regen"
            );
          }
          break;

        case round === 22:
          if (enemyCount < getEnemyLimit(round)) {
            setEnemies((prev) => [...prev, createNewEnemy("REGENTANK")]);
            setEnemyCount((prev) => prev + 1);
          }
          break;

        case round >= 23 && round <= 25:
          if (enemyCount < getEnemyLimit(round)) {
            const type23 =
              enemyCount % 3 === 0
                ? "STEALTHYTANK"
                : enemyCount % 3 === 1
                ? "STEALTHYSPEEDY"
                : "ARMOREDTANK";
            setEnemies((prev) => [...prev, createNewEnemy(type23)]);
            setEnemyCount((prev) => prev + 1);
          }
          break;

        case round >= 26 && round <= 31:
          if (enemyCount < getEnemyLimit(round)) {
            const type26 =
              enemyCount % 2 === 0 ? "STEALTHYTANK" : "SPEEDYREGENTANK";
            setEnemies((prev) => [...prev, createNewEnemy(type26)]);
            setEnemyCount((prev) => prev + 1);
          }
          if (round === 31 && enemies.length === 0) {
            setShowEnemyAlert(true);
            setEnemyAlertDescription(
              "Bosses are coming next round! Make sure u are strong enough"
            );
          }
          break;

        case round === 32:
          if (enemyCount < 320) {
            setEnemies((prev) => [...prev, createNewEnemy("BOSS")]); // Boss HP unchanged
            setEnemyCount((prev) => prev + 80);
          }
          break;

        case round > 32 && round <= 39:
          if (enemyCount < getEnemyLimit(round)) {
            const type32 =
              enemyCount % 50 === 0
                ? "BOSS"
                : enemyCount % 2 === 0
                ? "ARMOREDULTRATANK"
                : "ULTRATANKS";
            setEnemies((prev) => [...prev, createNewEnemy(type32)]);
            setEnemyCount((prev) => prev + 2);
          }
          break;

        case round === 40:
          if (enemyCount < getEnemyLimit(round)) {
            setEnemies((prev) => [...prev, createNewEnemy("BOSS")]); // Boss HP unchanged
            setEnemyCount((prev) => prev + 35);
          }
          break;

        case round >= 41 && round <= 44:
          if (enemyCount < getEnemyLimit(round)) {
            const type41 =
              enemyCount % 50 === 0
                ? "BOSS"
                : enemyCount % 2 === 0
                ? "ARMOREDSPEEDYMEGATANK"
                : "SPEEDYMEGATANK";
            setEnemies((prev) => [
              ...prev,
              type41 === "BOSS"
                ? createNewEnemy(type41)
                : createNewEnemy(type41),
            ]);
            setEnemyCount((prev) => prev + 1);
          }
          if (round === 44 && enemies.length === 0) {
            setShowEnemyAlert(true);
            setEnemyAlertDescription(
              "Mega Boss are coming next round! Make sure u are strong enough"
            );
          }
          break;

        case round === 45:
          if (enemyCount < getEnemyLimit(round)) {
            setEnemies((prev) => [...prev, createNewEnemy("MEGABOSS")]);
            setEnemyCount((prev) => prev + 50);
          }
          break;
        case round >= 46 && round <= 49:
          if (enemyCount < getEnemyLimit(round)) {
            const type46 =
              enemyCount % 100 === 0
                ? "MEGABOSS"
                : enemyCount % 2 === 0
                ? "SPAWNER"
                : "SPEEDYMEGATANK";
            setEnemies((prev) => [
              ...prev,
              type46 === "MEGABOSS"
                ? createNewEnemy(type46)
                : createNewEnemy(type46),
            ]);
            setEnemyCount((prev) => prev + 1);
            if (round === 49 && enemies.length === 0) {
              setShowEnemyAlert(true);
              setEnemyAlertDescription(
                "Last round is coming! Prepare for ultimate battle"
              );
            }
          }
          break;
        case round === 50:
          if (enemyCount < getEnemyLimit(round)) {
            setEnemies((prev) => [...prev, createNewEnemy("MEGABOSS")]);
            setEnemyCount((prev) => prev + 35);
          }
          break;
        case round >= 51 && round <= 55:
          if (enemyCount < getEnemyLimit(round)) {
            const type51 =
              enemyCount % 100 === 0
                ? "MEGABOSS"
                : enemyCount % 3 === 0
                ? "SPEEDYGIGATANK"
                : enemyCount % 2 === 0
                ? "ARMOREDSPEEDYMEGATANK"
                : "GIGASPAWNER";
            setEnemies((prev) => [...prev, createNewEnemy(type51)]);
            setEnemyCount((prev) => prev + (type51 === "MEGABOSS" ? 50 : 1));
          }
          break;

        case round >= 56 && round <= 60:
          if (enemyCount < getEnemyLimit(round)) {
            // Intense wave of mixed armored and fast enemies
            const type56 =
              enemyCount % 150 === 0
                ? "MEGABOSS"
                : enemyCount % 4 === 0
                ? "ARMOREDULTRATANK"
                : enemyCount % 3 === 0
                ? "SPEEDYGIGATANK"
                : enemyCount % 2 === 0
                ? "ARMOREDSPEEDYMEGATANK"
                : "GIGASPAWNER";
            setEnemies((prev) => [...prev, createNewEnemy(type56)]);
            setEnemyCount((prev) => prev + (type56 === "MEGABOSS" ? 75 : 1));
          }
          break;

        case round >= 61 && round <= 65:
          if (enemyCount < getEnemyLimit(round) * 1.5) {
            // Increased enemy limit
            // Super challenging wave with multiple MEGABOSS spawns
            const type61 =
              enemyCount % 120 === 0
                ? "MEGABOSS"
                : enemyCount % 3 === 0
                ? "ARMOREDSPEEDYMEGATANK"
                : enemyCount % 2 === 0
                ? "GIGASPAWNER"
                : "SPEEDYGIGATANK";
            const enemy = createNewEnemy(type61);
            // Increase base stats for these rounds
            enemy.hp *= 1.5;
            enemy.maxHp *= 1.5;
            enemy.speed *= 1.2;
            enemy.stunReduction *= 0.5;
            enemy.slowReduction *= 0.5;
            setEnemies((prev) => [...prev, enemy]);
            setEnemyCount((prev) => prev + (type61 === "MEGABOSS" ? 100 : 1));
          }
          break;

        case round >= 66 && round <= 149:
          if (enemyCount < getEnemyLimit(round) * 2) {
            // Double enemy limit
            // Ultimate challenge with enhanced enemies
            const type66 =
              enemyCount % 50 === 0 ? "MEGABOSS" : "SPEEDYGIGATANK";
            const enemy = createNewEnemy(type66);

            // Logarithmic scaling for speed
            const speedIncrease =
              1.5 * (Math.log(round - 65) * 0.25 + (round - 65) * 0.005);
            const newSpeed = enemy.speed * (1 + speedIncrease); // Apply scaling
            enemy.speed = newSpeed;
            enemy.baseSpeed = newSpeed;
            enemy.hp *= 5 + (round - 65) * 0.1; // Scales with rounds
            enemy.maxHp *= 5 + (round - 65) * 0.1;
            enemy.slowReduction = 0.3;
            enemy.stunReduction = 0.2;
            enemy.regen *= 1.5;

            setEnemies((prev) => [...prev, enemy]);
            setEnemyCount((prev) => prev + (type66 === "MEGABOSS" ? 32 : 3));
          }
          break;
        case round >= 150:
          if (enemyCount < getEnemyLimit(round) * 2) {
            // Double enemy limit
            // Ultimate challenge with enhanced enemies
            const type66 = enemyCount % 160 === 0 ? "ULTRABOSS" : "MEGABOSS";
            const enemy = createNewEnemy(type66);

            // Logarithmic scaling for speed
            const speedIncrease =
              1.75 * (Math.log(round - 65) * 0.25 + (round - 65) * 0.005);
            const newSpeed = enemy.speed * (1 + speedIncrease); // Apply scaling
            enemy.speed = newSpeed;
            enemy.baseSpeed = newSpeed;
            enemy.hp *= 16 + (round - 65) * 0.15; // Scales with rounds
            enemy.maxHp *= 16 + (round - 65) * 0.15;
            enemy.slowReduction = 0.2;
            enemy.stunReduction = 0.15;
            enemy.regen *= 1.5;

            setEnemies((prev) => [...prev, enemy]);
            setEnemyCount((prev) => prev + (type66 === "ULTRABOSS" ? 112 : 16));
          }
          break;
      }
    };

    const spawnInterval = setInterval(
      spawnEnemies,
      (round === 32 ? (isSpeedUp ? 2500 : 1250) : Math.max(1000 / round, 80)) /
        (isSpeedUp === 2 ? 3 : isSpeedUp ? 2 : 1)
    );

    return () => clearInterval(spawnInterval);
  }, [
    round,
    enemyCount,
    enemies.length,
    isPageVisible,
    isSpeedUp,
    isPaused,
    hasWon,
    createNewEnemy,
    setIsPaused
  ]);

  const lastRound = useRef(round); // Store the last valid round

  useEffect(() => {
    if (isPaused) return;

    if (
      round !== lastRound.current + 1 &&
      round !== 0 &&
      gameMode === "normal"
    ) {
      alert("Kys");
      resetGame();
      return;
    }

    if (
      enemies.length === 0 &&
      enemyCount >= getEnemyLimit(round) &&
      round !== 0
    ) {
      setCanPause(true); // Allow pausing when round is over

      if (autoStartRounds) {
        const roundTimeout = setTimeout(() => {
          lastRound.current = round; // Update last valid round
          setRound((prev) => prev + 1);
          setEnemies([]);
          setEnemyCount(0);
          setCanPause(false); // Disable pausing when new round starts
        }, 4000 / (isSpeedUp === 2 ? 3 : isSpeedUp ? 2 : 1));
        return () => clearTimeout(roundTimeout);
      } else {
        setIsPaused(true);
      }
    }
  }, [enemies.length, enemyCount, round, isSpeedUp, isPaused, autoStartRounds,gameMode,resetGame,setCanPause,setIsPaused,setRound]);
  const grantMoneyForKill = useCallback(
    (enemy: Enemy) => {
      if (!processedEnemies.has(enemy.id)) {
        processedEnemies.add(enemy.id);

        // Base reward calculation
        let reward = enemy.maxHp / 6.5;

        // Apply round-based reduction more explicitly
        let multiplier;
        if (round >= 33 ) {
          multiplier = 0.15; // 7% of original reward
        } else if (round > 22 && round < 33) {
          multiplier = 0.35; // 30% of original reward
        } else if (round <= 22) {
          multiplier = 1; // 5.5% of original reward
        }

        // Apply multiplier to reward
        reward = reward * (multiplier ?? 1);

        // Ensure the reward is at least 1
        reward = Math.max(1, Math.floor(reward));

        // Update money
        setMoney((prev) => prev + reward);
      }
    },
    [processedEnemies, round,setMoney]
  );
  // Modify the round change effect to handle round starts
  useEffect(() => {
    if (round > 0) {
      if (!autoStartRounds) {
        // When autorounds is off, allow manual resume
        setCanPause(true);
      } else {
        // When autorounds is on, disable pause at round start
        setCanPause(false);
      }
    }
  }, [round, autoStartRounds,setCanPause]);

  // Add a new effect to handle manual round advancement
  useEffect(() => {
    if (!isPaused && round > 0 && !autoStartRounds) {
      if (enemies.length === 0 && enemyCount >= getEnemyLimit(round)) {
        setRound((prev) => prev + 1);
        setEnemies([]);
        setEnemyCount(0);
      }
    }
  }, [isPaused,autoStartRounds, enemies.length, enemyCount, round,setRound,setEnemies,setEnemyCount,]);
  const sellTower = useCallback((towerPrice: number) => {
    if (confirmTowerSell) {
      const confirmed = window.confirm(
        "Are you sure you want to sell this tower?"
      );
      if (!confirmed) return;
    }

    setMoney((prevMoney) => prevMoney + towerPrice / 1.5);
    setTower((prevTower) => prevTower.filter((t) => t.id !== selectedTowerID));

    const towerElement = document.getElementById(
      selectedTowerID
    ) as HTMLImageElement;
    if (towerElement) {
      towerElement.src = "/buildingSite.png";
      towerElement.id = `building-site-${uuidv4()}`;
    }

    setShowUpgradeMenu(false);
  }, [confirmTowerSell, selectedTowerID, setMoney, setTower, setShowUpgradeMenu]);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (!isPageVisible) return;

      switch (event.code) {
        case "Space":
          event.preventDefault(); // Prevent page scroll
          if (canPause) {
            setIsPaused((prev) => !prev);
            if (isSpeedUp) {
              setIsSpeedUp(0);
            }
          }
          break;
        case "Digit1":
          if (!isPaused) {
            setIsSpeedUp(3);
          }
          break;
        case "Digit2":
          if (!isPaused) {
            setIsSpeedUp(1);
          }
          break;
        case "Digit3":
          if (!isPaused) {
            setIsSpeedUp(2);
          }
          break;
        case "Delete":
        case "Backspace":
          if (selectedTowerID && confirmTowerSell) {
            const selectedTower = tower.find((t) => t.id === selectedTowerID);
            if (selectedTower) {
              if (window.confirm("Are you sure you want to sell this tower?")) {
                sellTower(selectedTower.towerWorth);
              }
            }
          } else if (selectedTowerID) {
            const selectedTower = tower.find((t) => t.id === selectedTowerID);
            if (selectedTower) {
              sellTower(selectedTower.towerWorth);
            }
          }
          break;
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [isPageVisible, canPause, isPaused, isSpeedUp,sellTower, selectedTowerID, tower, confirmTowerSell,setIsPaused, setIsSpeedUp]);
  const moveEnemy = useCallback(() => {
    if (!isPageVisible || isPaused) return;

    setEnemies((prevEnemies) =>
      prevEnemies
        .map((enemy) => {
          if (enemy.positionX < 29.5) {
            return {
              ...enemy,
              positionX: enemy.positionX + enemy.speed,
              positionY: enemy.positionY - enemy.speed / 10,
            };
          } else if (
            enemy.positionX >= 29.5 &&
            enemy.positionX < 52 &&
            enemy.positionY > 20
          ) {
            return {
              ...enemy,
              positionY: enemy.positionY - enemy.speed * 2,
              positionX: enemy.positionX + enemy.speed / 3,
            };
          } else if (enemy.positionY <= 20 && enemy.positionX < 53) {
            return { ...enemy, positionX: enemy.positionX + enemy.speed };
          } else if (
            enemy.positionX >= 53 &&
            enemy.positionX < 75 &&
            enemy.positionY < 87
          ) {
            return { ...enemy, positionY: enemy.positionY + enemy.speed * 2 };
          } else if (enemy.positionY >= 87 && enemy.positionX < 76.5) {
            return { ...enemy, positionX: enemy.positionX + enemy.speed };
          } else if (enemy.positionX >= 76.5 && enemy.positionY > 53) {
            return {
              ...enemy,
              positionY: enemy.positionY - enemy.speed * 2,
              positionX: enemy.positionX + enemy.speed / 10,
            };
          } else {
            return { ...enemy, positionX: enemy.positionX + enemy.speed };
          }
        })
        .filter((enemy) => enemy.hp > 0 && !enemy.executed)
    );
  }, [isPageVisible, isPaused]);
  // Enemy movement - updates position every 25ms
  useEffect(() => {
    if (!isPageVisible || round <= 0 || isPaused) return;

    const interval = setInterval(
      moveEnemy,
      30 / (isSpeedUp === 2 ? 3 : isSpeedUp ? 2 : 1)
    );
    return () => clearInterval(interval);
  }, [isPageVisible, round, isPaused, isSpeedUp, moveEnemy]);

  // Heal enemy every second if it has health regeneration
  useEffect(() => {
    if (!isPageVisible || round <= 0 || isPaused) return;

    const interval = setInterval(() => {
      setEnemies((prevEnemies) =>
        prevEnemies.map((enemy) =>
          enemy.canRegen
            ? { ...enemy, hp: Math.min(enemy.hp + enemy.regen, enemy.maxHp) }
            : enemy
        )
      );
    }, 4500 / (isSpeedUp === 2 ? 3 : isSpeedUp ? 2 : 1)); // Adjusted for 3x speed
    return () => clearInterval(interval);
  }, [round, isPageVisible, isSpeedUp, isPaused]); // Add isPaused to dependencies

  const handleTowerAttack = useCallback((tower: Tower, targets: Enemy[]) => {
    towerAttack(tower, targets, {
      setTower,
      setEnemies,
      setAttackEffects,
      setExplosionEffects,
      setLingeringEffects,
      isPaused,
      isSpeedUp,
      uuidv4,
      createNewEnemy: createNewEnemy as (
        type: string,
        x: number,
        y: number
      ) => Enemy,
      grantMoneyForKill,
    });
  }, [
    setTower,
    setEnemies,
    setAttackEffects,
    setExplosionEffects,
    setLingeringEffects,
    isPaused,
    isSpeedUp,
    createNewEnemy,
    grantMoneyForKill
  ]);

  // Get the furthest enemy within a certain radius from the tower
  const getFurthestEnemyInRadius = useCallback((
    towerPositionX: number,
    towerPositionY: number,
    towerType: string,
    radius: number,
    canHitStealth: boolean,
    attackType: string,
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
        return (
          isInRange &&
          !enemy.isPoisoned &&
          enemy.type !== "stealth" &&
          enemy.type !== "stealthytank" &&
          enemy.type !== "stealthyspeedy"
        );
      }  else if (towerType === "slower" && canHitStealth) {
        return isInRange && !enemy.isSlowed;
      } else if (towerType === "slower" && !canHitStealth) {
        return (
          isInRange &&
          !enemy.isSlowed &&
          enemy.type !== "stealth" &&
          enemy.type !== "stealthytank" &&
          enemy.type !== "stealthyspeedy"
        );
      } else {
        return (
          isInRange &&
          enemy.type !== "stealth" &&
          enemy.type !== "stealthytank" &&
          enemy.type !== "stealthyspeedy"
        );
      }
    });

    if (enemiesInRadius.length === 0) {
      return null;
    }

    // Calculate progress value for each enemy based on their position in the path
    const enemiesWithProgress = enemiesInRadius.map((enemy) => {
      let progress = 0;

      // Calculate progress based on enemy position along the path
      if (enemy.positionX < 28) {
        // First segment - diagonal path
        progress = enemy.positionX;
      } else if (
        enemy.positionX >= 28 &&
        enemy.positionX < 52 &&
        enemy.positionY > 15
      ) {
        // Second segment - vertical path
        progress = 28 + (50 - enemy.positionY);
      } else if (enemy.positionY <= 15 && enemy.positionX < 52) {
        // Third segment - horizontal path
        progress = 63 + enemy.positionX;
      } else if (
        enemy.positionX >= 52 &&
        enemy.positionX < 75 &&
        enemy.positionY < 87
      ) {
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
    if (targettingType === "stealth") {
      // First sort by stealth status (stealth enemies first), then by progress
      enemiesWithProgress.sort((a, b) => {
        // If one is stealth and the other isn't, prioritize the stealth enemy
        if (a.type === "stealth" && b.type !== "stealth") return -1;
        if (a.type !== "stealth" && b.type === "stealth") return 1;
        // If both have same stealth status, sort by progress (further along first)
        return b.progress - a.progress;
      });
    } else if (targettingType === "highestMaxHp") {
      enemiesWithProgress.sort((a, b) => b.maxHp - a.maxHp);
    } else if (targettingType === "last") {
      enemiesWithProgress.reverse();
    } else if (targettingType === "mark") {
      console.log(enemiesWithProgress)
      enemiesWithProgress.sort((a, b) => {
        // First prioritize marked enemies
        if (!a.marked && b.marked) return -1;
        if (a.marked && !b.marked) return 1;
        
        // If both enemies have the same marked status,
        // prioritize enemies further along the path
        return b.progress - a.progress;
      });
    } else {
      // "first" targeting - already sorted by progress
      enemiesWithProgress.sort((a, b) => b.progress - a.progress);
    }

    // Return enemies based on attack type
    if (attackType === "double") {
      return enemiesWithProgress.slice(
        0,
        Math.min(2, enemiesWithProgress.length)
      );
    } else if (attackType === "triple") {
      return enemiesWithProgress.slice(
        0,
        Math.min(3, enemiesWithProgress.length)
      );
    } else if (attackType === "quadruple") {
      return enemiesWithProgress.slice(
        0,
        Math.min(4, enemiesWithProgress.length)
      );
    } else if (attackType === "five") {
      return enemiesWithProgress.slice(
        0,
        Math.min(5, enemiesWithProgress.length)
      );
    } else if (attackType === "aura") {
      return enemiesWithProgress;
    } else {
      // Single target
      return enemiesWithProgress.slice(0, 1);
    }
  }, [enemies]);

  // Tower targeting system - updates target when enemies move
  useEffect(() => {
    if (!isPageVisible || isPaused) return;

    // Only update if there are enemies to target
    if (enemies.length === 0) return;

    setTower((prevTowers) =>
      prevTowers.map((tower) => ({
        ...tower,
        furthestEnemyInRange:
          getFurthestEnemyInRadius(
            tower.positionX,
            tower.positionY,
            tower.type,
            tower.radius,
            tower.canHitStealth,
            tower.attackType,
            tower.targettingType
          ) ?? null,
      }))
    );
  }, [enemies, isPageVisible, isPaused, getFurthestEnemyInRadius]); // Add isPaused to dependencies

  // Tower attack execution - triggers attacks when targets are available
  useEffect(() => {
    if (!isPageVisible || isPaused) return; // Add isPaused check

    tower.forEach((t) => {
      if (t.furthestEnemyInRange && !t.isAttacking) {
        handleTowerAttack(t, t.furthestEnemyInRange);
      }
    });
  }, [tower, handleTowerAttack, isPageVisible, isPaused]); // Add isPaused to dependencies

  const HealthBar = ({ enemy }: { enemy: Enemy }) => {
    if (!showHealthBars) return null;

    const healthPercentage = (enemy.hp / enemy.maxHp) * 100;
    const barColor =
      healthPercentage > 50
        ? "bg-green-500"
        : healthPercentage > 25
        ? "bg-yellow-500"
        : "bg-red-500";

    return (
      <div className="absolute -top-2 left-0 w-full h-1.5 bg-gray-800/50 rounded overflow-hidden">
        <div
          className={`h-full ${barColor} transition-all duration-200`}
          style={{ width: `${healthPercentage}%` }}
        />
      </div>
    );
  };

  // Create enemy elements
  const createEnemy = () => {
    if (round > 0) {
      return enemies.map((enemy) => (
        <div
          key={enemy.id}
          className="absolute"
          style={{
            top: `${enemy.positionY}%`,
            left: `${enemy.positionX}%`,
            transform: "translate(-50%, -50%)",
            zIndex: 10,
          }}
        >
          <div className="absolute" style={{ width: "40px" }}>
            <HealthBar enemy={enemy} />
          </div>
          <Image
            src={"/" + enemy.src}
            alt="enemy"
            width={35} // width of the image
            height={35} // height of the image
            className="w-9 h-9" // Optional, for styling purposes
          />
        </div>
      ));
    }
  };

  // Reduce player's health points if enemies reach the end
  const damagePlayer = useCallback((enemies: Enemy[]) => {
    enemies.forEach((enemy) => {
      if (enemy.positionX > 99) {
        setHealthPoints((prevHealthPoints) => prevHealthPoints - enemy.damage);
        setEnemies((prevEnemies) =>
          prevEnemies.filter((e) => e.id !== enemy.id)
        );
      }
    });
  }, [setHealthPoints, setEnemies]);

  useEffect(() => {
    damagePlayer(enemies);
  }, [enemies, tower, damagePlayer]);
  useEffect(() => {
    if (!isPageVisible || isPaused) return;

    const slowCheckInterval =
      10 * (isSpeedUp === 2 ? 1 / 3 : isSpeedUp ? 1 / 2 : 1);

    const slowInterval = setInterval(() => {
      const currentTime = Date.now();

      setEnemies((prevEnemies) => {
        let hasChanges = false;
        const updatedEnemies = prevEnemies.map((enemy) => {
          if (!enemy.isSlowed || !enemy.slowSourceId || !enemy.slowStartTime)
            return enemy;

          // Find the tower that applied the effect
          const effectTower = tower.find((t) => t.id === enemy.slowSourceId);
          if (!effectTower) return enemy;

          const effectDuration = effectTower.slowDuration || 2500;

          const adjustedDuration =
            (effectDuration / (isSpeedUp === 2 ? 3 : isSpeedUp ? 2 : 1)) *
            (enemy.slowReduction || 1);

          if (currentTime - enemy.slowStartTime >= adjustedDuration) {
            hasChanges = true;
            return {
              ...enemy,
              speed: !enemy.isStunned ? enemy.baseSpeed : enemy.speed,
              isSlowed: false,
              slowSourceId: undefined,
              slowStartTime: undefined,
            };
          }
          return enemy;
        });

        return hasChanges ? updatedEnemies : prevEnemies;
      });
    }, slowCheckInterval);

    return () => clearInterval(slowInterval);
  }, [isPageVisible, isPaused, isSpeedUp, tower]); // Added tower to dependencies
  useEffect(() => {
    if (!isPageVisible || isPaused) return;

    const stunCheckInterval =
      10 * (isSpeedUp === 2 ? 1 / 3 : isSpeedUp ? 1 / 2 : 1);

    const stunInterval = setInterval(() => {
      const currentTime = Date.now();

      setEnemies((prevEnemies) => {
        let hasChanges = false;
        const updatedEnemies = prevEnemies.map((enemy) => {
          if (
            !enemy.isStunned ||
            !enemy.stunSourceId ||
            !enemy.stunStartTime ||
            !enemy.stunDuration
          )
            return enemy;

          // If it's a stun (speed = 0), use the stun duration
          const adjustedDuration =
            enemy.stunDuration / (isSpeedUp === 2 ? 3 : isSpeedUp ? 2 : 1);

          if (currentTime - enemy.stunStartTime >= adjustedDuration) {
            hasChanges = true;
            return {
              ...enemy,
              speed: enemy.isSlowed
                ? enemy.baseSpeed * (enemy.slowValue ?? 1)
                : enemy.baseSpeed,
              isStunned: false,
              stunSourceId: undefined,
              stunStartTime: undefined,
              stunDuration: undefined,
            };
          }
          return enemy;
        });

        return hasChanges ? updatedEnemies : prevEnemies;
      });
    }, stunCheckInterval);

    return () => clearInterval(stunInterval);
  }, [isPageVisible, isPaused, isSpeedUp, tower]);
  useEffect(() => {
    if (!isPageVisible || isPaused) return;

    const LINGERING_TICK_RATE = 50;

    const lingeringInterval = setInterval(() => {
      const currentTime = Date.now();

      // Remove expired lingering effects
      setLingeringEffects((prev) =>
        prev.filter(
          (effect) => currentTime - effect.timestamp < effect.duration
        )
      );

      // Track damage done by each tower
      const towerDamage: { [key: string]: number } = {};

      // Apply damage to enemies in lingering areas
      setEnemies((prevEnemies) => {
        let hasChanges = false;
        const updatedEnemies = prevEnemies.map((enemy) => {
          let totalDamage = 0;
          let insideRegenStoppingEffect = false;

          // Check each lingering effect
          lingeringEffects.forEach((effect) => {
            const dx = enemy.positionX - effect.positionX;
            const dy = enemy.positionY - effect.positionY;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance <= effect.radius) {
              // Apply mark multiplier if enemy is marked
              const markMultiplier = enemy.marked ? (enemy.markedDamageMultiplier ?? 1.15) : 1;
              
              totalDamage +=
                (effect.damage +
                (enemy.hp * (effect.enemyCurrentHpDmgMultiplier ?? 0)) / 20) * markMultiplier;

              if (effect.canStopRegen) {
                insideRegenStoppingEffect = true;
              }

              if (!towerDamage[effect.towerId]) {
                towerDamage[effect.towerId] = 0;
              }
              towerDamage[effect.towerId] += effect.damage * markMultiplier;
            }
          });

          // Set canRegen based on whether the enemy is inside a regen-stopping effect
          const newCanRegen = !insideRegenStoppingEffect;

          if (totalDamage > 0 || enemy.canRegen !== newCanRegen) {
            hasChanges = true;
            const newHp = Math.max(0, enemy.hp - totalDamage);

            // Check for kill
            if ((newHp <= 0 && enemy.hp > 0) || enemy.executed) {
              grantMoneyForKill(enemy);
            }

            return { ...enemy, hp: newHp, canRegen: newCanRegen };
          }

          return enemy;
        });

        return hasChanges ? updatedEnemies : prevEnemies;
      });

      // Update tower damage counters
      setTower((prevTowers) =>
        prevTowers.map((t) => ({
          ...t,
          damageDone: t.damageDone + (towerDamage[t.id] || 0),
        }))
      );
    }, LINGERING_TICK_RATE);

    return () => clearInterval(lingeringInterval);
  }, [isPageVisible, isPaused, lingeringEffects,grantMoneyForKill]);

  useEffect(() => {
    if (!isPageVisible || isPaused) return;

    const POISON_TICK_RATE = isSpeedUp === 2 ? 3 : isSpeedUp ? 5 : 10;

    const poisonInterval = setInterval(() => {
      const currentTime = Date.now();

      setEnemies((prevEnemies) => {
        const poisonDamageByTower: { [key: string]: number } = {};

        const updatedEnemies = prevEnemies.map((enemy) => {
          if (
            !enemy.isPoisoned ||
            !enemy.poisonSourceId ||
            !enemy.poisonStartTime
          )
            return enemy;

          const poisonTower = tower.find((t) => t.id === enemy.poisonSourceId);
          if (!poisonTower?.poisonDamage) return enemy;

          const POISON_DURATION =
            (poisonTower.poisonDuration ?? 4000) /
            (isSpeedUp === 2 ? 3 : isSpeedUp ? 2 : 1);

          if (currentTime - enemy.poisonStartTime >= POISON_DURATION) {
            return {
              ...enemy,
              isPoisoned: false,
              poisonSourceId: undefined,
              poisonStartTime: undefined,
              canRegen: enemy.regen > 0 ? true : enemy.canRegen,
            };
          }

          // Calculate damage with mark multiplier
          const markMultiplier = enemy.marked ? (poisonTower.markedDamageMultiplier ?? 1.5) : 1;
          const speedMultiplier = isSpeedUp === 2 ? 3 : isSpeedUp ? 2 : 1;
          const damagePerSecond = 
            poisonTower.poisonDamage * 
            (enemy.type === "boss" ? poisonTower.bossDamageMultiplier ?? 1 : 1) *
            markMultiplier;
          const damagePerTick = (damagePerSecond / (1000 / POISON_TICK_RATE)) * speedMultiplier;
          const actualPoisonDamage = Math.min(damagePerTick, enemy.hp);

          if (!poisonDamageByTower[poisonTower.id]) {
            poisonDamageByTower[poisonTower.id] = 0;
          }
          poisonDamageByTower[poisonTower.id] += actualPoisonDamage;

          const newHp = enemy.hp - actualPoisonDamage;
          const canRegen = poisonTower.canStopRegen ? false : enemy.canRegen;

          if (newHp <= 0 && enemy.hp > 0) {
            if (enemy.canSpawn && enemy.spawnType) {
              const spawnBatch = async () => {
                for (let i = 0; i < 5; i++) {
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

          return {
            ...enemy,
            hp: newHp,
            canRegen: canRegen,
          };
        });

        setTower((prevTowers) =>
          prevTowers.map((t) => ({
            ...t,
            damageDone: t.damageDone + (poisonDamageByTower[t.id] || 0),
          }))
        );

        return updatedEnemies;
      });
    }, POISON_TICK_RATE);

    return () => clearInterval(poisonInterval);
  }, [enemies, tower, isPageVisible, isSpeedUp, isPaused, setMoney, createNewEnemy,grantMoneyForKill]);
  // Buy towers and place them on the map
  const buyTowers = (
    event: React.MouseEvent<HTMLImageElement>,
    positionX: number,
    positionY: number
  ) => {
    if (
      selectedTowerType &&
      (event.target as HTMLImageElement).src.includes("buildingSite")
    ) {
      const newTowerId = `tower-${uuidv4()}`; // Add 'tower-' prefix
      (event.target as HTMLImageElement).id = newTowerId;

      // Check if we have enough money for the selected tower
      const towerConfig =
        TOWER_TYPES[
          selectedTowerType.toUpperCase() as keyof typeof TOWER_TYPES
        ];
      if (towerConfig && money >= towerConfig.price) {
        (event.target as HTMLImageElement).src = towerConfig.src;
        (event.target as HTMLImageElement).className =
          "absolute sm:w-7 sm:h-7 md:w-16 md:h-16 z-10 hover:opacity-75 transition-opacity";
        setMoney((prevMoney) => prevMoney - towerConfig.price);
        setTower((prevTower) => [
          ...prevTower,
          createNewTower(
            selectedTowerType.toUpperCase() as keyof typeof TOWER_TYPES,
            positionX,
            positionY,
            newTowerId
          ),
        ]);
      }
    } else if (
      !(event.target as HTMLImageElement).src.includes("buildingSite")
    ) {
      setShowUpgradeMenu(true);
      setSelectedTowerID((event.target as HTMLImageElement).id);
    }
  };

  const upgradeTower = () => {
    if (showUpgradeMenu) {
      const selectedTower = tower.find((t) => t.id === selectedTowerID);
      if (!selectedTower) return null;

      const availableUpgrades =
        towerUpgrades[selectedTower.type]
          ?.filter((upgrade) => {
            const hasChosenPath =
              selectedTower.path1Level >= 3 || selectedTower.path2Level >= 3;

            if (hasChosenPath) {
              if (selectedTower.path1Level >= 3) {
                if (
                  upgrade.path === 2 &&
                  upgrade.requires < 2 &&
                  upgrade.requires === selectedTower.path2Level
                ) {
                  return true;
                }
                return (
                  upgrade.path === 1 &&
                  upgrade.requires === selectedTower.path1Level
                );
              }
              if (selectedTower.path2Level >= 3) {
                if (
                  upgrade.path === 1 &&
                  upgrade.requires < 2 &&
                  upgrade.requires === selectedTower.path1Level
                ) {
                  return true;
                }
                return (
                  upgrade.path === 2 &&
                  upgrade.requires === selectedTower.path2Level
                );
              }
            }

            return (
              (upgrade.path === 1 &&
                upgrade.requires === selectedTower.path1Level) ||
              (upgrade.path === 2 &&
                upgrade.requires === selectedTower.path2Level)
            );
          })
          .filter(Boolean) || [];

      return (
        <div
          data-upgrade-menu
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-40 
            bg-slate-800 flex flex-col md:flex-row items-start justify-between p-2 md:p-4 rounded-lg gap-2 md:gap-4 
            shadow-xl border-2 border-blue-500 w-[95vw] max-w-[700px] md:max-w-[700px] md:w-[700px] text-sm"
          style={{ left: selectedTower.positionX < 50 ? "65%" : "35%" }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Left Panel - Tower Info & Stats */}
          <div className="flex flex-col space-y-2 w-full md:w-1/2 p-2 md:p-3 bg-gray-950/80 rounded-lg border border-blue-900/30 shadow-lg">
            <div className="text-white">
              <h1 className="text-sm md:text-xl font-bold mb-1 text-blue-400 flex items-center">
                <img
                  src={selectedTower.src}
                  alt="Tower"
                  className="w-5 h-5 mr-1 md:w-8 md:h-8 md:mr-2"
                />
                {selectedTower.type.charAt(0).toUpperCase() +
                  selectedTower.type.slice(1)}{" "}
                Tower
              </h1>
              <div className="h-px bg-gradient-to-r from-blue-500 to-transparent mb-2"></div>

              {/* Tower Basic Info */}
              <div className="flex items-center gap-2 mb-2 bg-gray-900/50 p-1 md:p-2 rounded-lg border border-blue-800/20">
                <img
                  src={selectedTower.src}
                  alt="Tower"
                  className="w-8 h-8 md:w-10 md:h-10 p-1 bg-blue-900/30 rounded-lg shadow-md"
                />
                <div className="flex-1 text-xs">
                  <div className="grid grid-cols-2 gap-1">
                    <div>
                      Level:{" "}
                      <span className="text-blue-300 font-bold">
                        {Math.max(
                          selectedTower.path1Level,
                          selectedTower.path2Level
                        )}
                      </span>
                    </div>
                    <div>
                      Value:{" "}
                      <span className="text-green-300 font-bold">
                        ${Math.floor(selectedTower.towerWorth)}
                      </span>
                    </div>
                    <div>
                      Path 1:{" "}
                      <span className="text-blue-300">
                        {selectedTower.path1Level}
                      </span>
                    </div>
                    <div>
                      Path 2:{" "}
                      <span className="text-blue-300">
                        {selectedTower.path2Level}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats Section - Collapsed on mobile, expandable */}
              <div className="flex flex-col md:flex-row gap-2 mb-2">
                <div className="w-full md:w-2/3">
                  <div className="text-xs font-semibold text-gray-300 mb-1">
                    Primary Stats
                  </div>
                  <div className="h-px bg-gradient-to-r from-blue-500 to-transparent mb-1 md:mb-2"></div>
                  <div className="grid grid-cols-2 gap-1 md:gap-2">
                    <StatBlock
                      label="Attack"
                      value={Math.floor(selectedTower.attack)}
                      icon="⚔️"
                    />
                    <StatBlock
                      label="Speed"
                      value={`${Math.floor(selectedTower.attackInterval)}ms`}
                      icon="⚡"
                    />
                    <StatBlock
                      label="Range"
                      value={Math.floor(selectedTower.radius)}
                      icon="📏"
                    />
                    <StatBlock
                      label="Type"
                      value={selectedTower.attackType}
                      icon="🎯"
                    />
                    <StatBlock
                      label="Target"
                      value={selectedTower.targettingType}
                      icon="👁️"
                    />
                    <StatBlock
                      label="Total Damage"
                      value={Math.floor(
                        selectedTower.damageDone
                      ).toLocaleString()}
                      highlight={true}
                      icon="💥"
                    />
                  </div>
                </div>

                {/* Special Abilities */}
                <div className="w-full md:w-1/3">
                  <div className="text-xs font-semibold text-gray-300 mb-1">
                    Special Abilities
                  </div>
                  <div className="h-px bg-gradient-to-r from-blue-500 to-transparent mb-1 md:mb-2"></div>
                  <div className="grid grid-cols-2 md:grid-cols-1 gap-1 md:gap-2">
                    {selectedTower.hasCritical && (
                      <>
                        <StatBlock
                          label="Crit Chance"
                          value={`${(
                            (selectedTower.criticalChance || 0) * 100
                          ).toFixed(1)}%`}
                          icon="✨"
                        />
                        <StatBlock
                          label="Crit Mult"
                          value={`${selectedTower.criticalMultiplier}x`}
                          icon="⚡"
                        />
                      </>
                    )}

                    {selectedTower.slowAmount && (
                      <>
                        <StatBlock
                          label="Slow"
                          value={`${Math.floor(
                            (1 - selectedTower.slowAmount) * 100
                          )}%`}
                          icon="❄️"
                        />
                        <StatBlock
                          label="Duration"
                          value={`${selectedTower.slowDuration}ms`}
                          icon="⏱️"
                        />
                      </>
                    )}

                    {selectedTower.poisonDamage > 0 && (
                      <>
                        <StatBlock
                          label="Poison/Sec"
                          value={selectedTower.poisonDamage}
                          icon="☠️"
                        />
                        <StatBlock
                          label="Total Poison"
                          value={
                            selectedTower.poisonDamage *
                            ((selectedTower.poisonDuration ?? 4000) / 1000)
                          }
                          icon="⚗️"
                        />
                        <StatBlock
                          label="Poison Duration"
                          value={`${
                            (selectedTower.poisonDuration ?? 4000) / 1000
                          }s`}
                          icon="⚗️"
                        />
                      </>
                    )}

                    {selectedTower.canStun && (
                      <StatBlock
                        label="Stun"
                        value={`${selectedTower.stunDuration}ms`}
                        icon="⭐"
                      />
                    )}

                    {selectedTower.explosionRadius > 0 && (
                      <StatBlock
                        label="Explosion Radius"
                        value={Math.floor(selectedTower.explosionRadius)}
                        icon="💥"
                      />
                    )}

                    {selectedTower.bossDamageMultiplier && (
                      <StatBlock
                        label="Boss Dmg"
                        value={`${selectedTower.bossDamageMultiplier}x`}
                        icon="👑"
                      />
                    )}

                    {selectedTower.canExecute && (
                      <StatBlock
                        label="Execute"
                        value={`${selectedTower.executeTreshhold || 0}%`}
                        icon="⚰️"
                      />
                    )}

                    {selectedTower.canExecute && (
                      <StatBlock
                        label="Execute"
                        value={`${selectedTower.executeTreshhold || 0}%`}
                        icon="⚰️"
                      />
                    )}

                    {selectedTower.acceleration && (
                      <StatBlock
                        label="Acceleration"
                        value={`${selectedTower.acceleration}`}
                        icon="🚀"
                      />
                    )}
                    {selectedTower.accelerationValue && (
                      <StatBlock
                        label="Acceleration"
                        value={`${
                          (selectedTower.accelerationValue || 0) * 100
                        }%`}
                        icon="🚀"
                      />
                    )}

                    {selectedTower.canMark && (
                      <StatBlock
                        label="Mark Bonus"
                        value={`${
                          (selectedTower.markedDamageMultiplier || 0) * 100
                        }%`}
                        icon="🎯"
                      />
                    )}
                    {selectedTower.enemyCurrentHpDmgMultiplier && (
                      <StatBlock
                        label="Current enemy hp %dmg"
                        value={`${
                          (selectedTower.enemyCurrentHpDmgMultiplier || 0) * 100
                        }%`}
                        icon="🎯"
                      />
                    )}
                    {selectedTower.healthReduction && (
                      <StatBlock
                        label="% Health reduction"
                        value={`${(selectedTower.healthReduction || 0) * 100}%`}
                        icon="🎯"
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* Area Effects - Only show if relevant */}
              {(selectedTower.chainCount || selectedTower.hasLingering) && (
                <div className="mb-2">
                  <div className="text-xs font-semibold text-gray-300 mb-1">
                    Area Effects
                  </div>
                  <div className="h-px bg-gradient-to-r from-blue-500 to-transparent mb-1 md:mb-2"></div>
                  <div className="grid grid-cols-2 gap-1 md:gap-2">
                    {selectedTower.chainCount && (
                      <>
                        <StatBlock
                          label="Chain Count"
                          value={selectedTower.chainCount}
                          icon="⛓️"
                        />
                        <StatBlock
                          label="Chain Range"
                          value={selectedTower.chainRange}
                          icon="🔗"
                        />
                      </>
                    )}

                    {selectedTower.hasLingering && (
                      <>
                        <StatBlock
                          label="Lingering Dmg"
                          value={selectedTower.lingeringDamage}
                          icon="🔥"
                        />
                        <StatBlock
                          label="Linger Radius"
                          value={selectedTower.lingeringRadius}
                          icon="⭕"
                        />
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* Target Capabilities - More compact on mobile */}
              <div className="mb-2">
                <div className="text-xs font-semibold text-gray-300 mb-1">
                  Capabilities
                </div>
                <div className="h-px bg-gradient-to-r from-blue-500 to-transparent mb-1 md:mb-2"></div>
                <div className="flex justify-between text-xs">
                  <div>
                    Stealth:{" "}
                    <span
                      className={
                        selectedTower.canHitStealth
                          ? "text-green-400"
                          : "text-red-400"
                      }
                    >
                      {selectedTower.canHitStealth ? "✓" : "✗"}
                    </span>
                  </div>
                  <div>
                    Armored:{" "}
                    <span
                      className={
                        selectedTower.canHitArmored
                          ? "text-green-400"
                          : "text-red-400"
                      }
                    >
                      {selectedTower.canHitArmored ? "✓" : "✗"}
                    </span>
                  </div>
                  <div>
                    Stop Regen:{" "}
                    <span
                      className={
                        selectedTower.canStopRegen
                          ? "text-green-400"
                          : "text-red-400"
                      }
                    >
                      {selectedTower.canStopRegen ? "✓" : "✗"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Special Upgrades */}
              {selectedTower.hasSpecialUpgrade && (
                <div className="mb-2">
                  <div className="text-xs font-semibold text-gray-300 mb-1">
                    Special
                  </div>
                  <div className="h-px bg-gradient-to-r from-blue-500 to-transparent mb-1 md:mb-2"></div>
                  <div className="p-2 rounded bg-purple-900/40 border border-purple-500/30 text-xs">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="text-purple-300 font-bold">
                          Special Upgrade
                        </div>
                        <div className="text-gray-400">
                          {selectedTower.specialUpgradeAvailable
                            ? "Available"
                            : "Locked"}
                        </div>
                      </div>
                      {selectedTower.specialUpgradeAvailable && (
                        <button className="bg-purple-600 hover:bg-purple-700 text-white px-2 py-1 text-xs rounded transition-all duration-200 shadow-md">
                          Upgrade
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Control Buttons */}
            <div className="flex gap-2 mt-1">
              <button
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-1 md:py-2 px-2 md:px-4 rounded-lg transition-all duration-200 shadow-md text-xs"
                onClick={() => sellTower(selectedTower.towerWorth)}
              >
                <span className="mr-1">💰</span> Sell ($
                {Math.floor(selectedTower.towerWorth * 0.75)})
              </button>
              <button
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-1 md:py-2 px-2 md:px-4 rounded-lg transition-all duration-200 shadow-md text-xs"
                onClick={changeTowerTargetting}
              >
                <span className="mr-1">🎯</span> {selectedTower.targettingType}
              </button>
            </div>
          </div>

          {/* Right Panel - Upgrades */}
          <div className="w-full md:w-1/2 space-y-1 md:space-y-2">
            <h2 className="text-sm md:text-lg font-bold text-blue-400 mb-1 md:mb-2">
              Upgrades
            </h2>
            <div className="max-h-48 md:max-h-64 overflow-y-auto pr-1">
              {availableUpgrades.map((upgrade) => (
                <button
                  key={upgrade.name}
                  className={`w-full text-left p-2 md:p-3 rounded-lg transition-all duration-200 shadow-md mb-1 md:mb-2
                    ${
                      upgrade.path === 1
                        ? "bg-gradient-to-r from-red-900 to-red-800 hover:from-red-800 hover:to-red-700 border-l-4 border-red-500"
                        : "bg-gradient-to-r from-blue-900 to-blue-800 hover:from-blue-800 hover:to-blue-700 border-l-4 border-blue-500"
                    }
                    ${
                      money < upgrade.cost
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:scale-102"
                    }`}
                  onClick={() => performUpgrade(selectedTower, upgrade)}
                  disabled={money < upgrade.cost}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-white text-xs">
                      {upgrade.name}
                    </span>
                    <span className="text-xs text-gray-300">
                      ${upgrade.cost}
                    </span>
                  </div>
                  <p className="text-xs text-gray-300 mt-1">
                    {upgrade.description}
                  </p>
                  <div className="flex justify-between text-xs mt-1">
                    <span className="text-gray-500">
                      {upgrade.path === 1 ? "Path 1" : "Path 2"}
                    </span>
                    <span className="text-green-300">
                      Upgrades left: {Math.abs(upgrade.requires - 6)}
                    </span>
                  </div>
                </button>
              ))}
            </div>
            <button
              className="w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-1 md:py-2 px-4 rounded-lg
                transition-all duration-200 shadow-md mt-1 md:mt-2 text-xs md:text-sm"
              onClick={closeUpgradeMenu}
            >
              Close
            </button>
          </div>
        </div>
      );
    }
  };
  // Add this helper component for stats
  const StatBlock = ({
    label,
    value,
    highlight = false,
    icon = null,
  }: {
    label: string;
    value: string | number | undefined;
    highlight?: boolean;
    icon?: string | null;
  }) => (
    <div
      className={`p-2 rounded flex items-center ${
        highlight
          ? "bg-blue-900/60 border border-blue-500/50"
          : "bg-gray-900/60 border border-blue-700/20"
      } transition-all hover:shadow-lg hover:scale-102`}
    >
      {icon && <div className="mr-2 text-lg text-blue-300">{icon}</div>}
      <div className="flex-1">
        <div className="text-xs font-medium text-gray-400">{label}</div>
        <div
          className={`text-sm ${
            highlight ? "text-blue-300 font-bold" : "text-white"
          }`}
        >
          {value}
        </div>
      </div>
    </div>
  );

  const closeUpgradeMenu = () => {
    setShowUpgradeMenu(false);
  };
  const performUpgrade = (tower: Tower, upgrade: TowerUpgrade) => {
    if (money >= upgrade.cost) {
      setMoney((prev) => prev - upgrade.cost);
      setTower((prevTowers) =>
        prevTowers.map((t) => {
          if (t.id === tower.id) {
            // Determine which path level to increment
            const newPath1Level =
              upgrade.path === 1 ? t.path1Level + 1 : t.path1Level;
            const newPath2Level =
              upgrade.path === 2 ? t.path2Level + 1 : t.path2Level;

            // Set path if reaching level 3 in either path
            const newPath =
              newPath1Level === 3 && !t.path
                ? 1
                : newPath2Level === 3 && !t.path
                ? 2
                : t.path;

            return {
              ...t,
              ...upgrade.effect(t),
              path1Level: newPath1Level,
              path2Level: newPath2Level,
              path: newPath,
              // Ensure other properties are preserved
              id: t.id,
              positionX: t.positionX,
              positionY: t.positionY,
              isAttacking: t.isAttacking,
              furthestEnemyInRange: t.furthestEnemyInRange,
              damageDone: t.damageDone,
            };
          }
          return t;
        })
      );

      // Update the tower image if it's on the board
      const towerElement = document.getElementById(
        tower.id
      ) as HTMLImageElement;
      if (towerElement && upgrade.effect(tower).src) {
        towerElement.src = upgrade.effect(tower).src!;
      }
    }
  };
  const changeTowerTargetting = () => {
    setTower(() =>
      tower.map((t) =>
        t.id === selectedTowerID
          ? {
              ...t,
              targettingType:
                t.targettingType === "first"
                  ? "highestMaxHp"
                  : t.targettingType === "highestMaxHp"
                  ? "last"
                  : t.targettingType === "last" && t.canHitStealth
                  ? "stealth"
                  : t.targettingType === "stealth" && t.canMark
                  ? "mark"
                  : "first",
            }
          : t
      )
    );
  };

  // Component for attack animation
  const attackAnimation = () => {
    // Create a Set to track unique combinations of source and target
    const uniqueEffects = new Set();

    const animationDuration = 100 / (isSpeedUp === 2 ? 3 : isSpeedUp ? 2 : 1);

    return attackEffects
      .filter((effect) => {
        // Create a unique key for each tower-enemy pair
        const effectKey = `${effect.towerPositionX}-${effect.towerPositionY}-${effect.enemyPositionX}-${effect.enemyPositionY}`;

        // Check if animation should be complete based on timestamp
        const now = Date.now();
        const animationEndTime = effect.timestamp + animationDuration;

        // Filter out completed animations
        if (now > animationEndTime) {
          return false;
        }

        // If we've seen this effect before, filter it out
        if (uniqueEffects.has(effectKey)) {
          return false;
        }

        // Otherwise, add it to our set and keep it
        uniqueEffects.add(effectKey);
        return true;
      })
      .map((effect) => (
        <img
          src={effect.effectSrc}
          key={effect.id}
          className="pointer-events-none animate-slide h-4 w-4 absolute"
          style={
            {
              "--tower-positionX": `${effect.towerPositionX + 1}%`,
              "--tower-positionY": `${effect.towerPositionY + 2.5}%`,
              "--enemy-positionX": `${effect.enemyPositionX + 1.5}%`,
              "--enemy-positionY": `${effect.enemyPositionY}%`,
              left: `${effect.towerPositionX}%`,
              animationDuration: `${animationDuration}ms`,
              filter:
                "drop-shadow(0 0 2px rgba(0,0,0,1)) brightness(1.2) contrast(1.2)",
              mixBlendMode: "normal",
              zIndex: 20,
            } as React.CSSProperties
          }
        />
      ));
  };

  const renderExplosions = () => {
    return explosionEffects.map((effect) => {
      // Find the tower that caused this explosion
      const explosionTower = tower.find((t) => t.attackType === "explosion");
      const explosionSize = explosionTower
        ? explosionTower.explosionRadius * 2
        : 50;

      // Define explosion colors based on tower type
      let explosionColor;
      if (explosionTower) {
        switch (explosionTower.type) {
          case "mortar":
            explosionColor = "rgba(255, 69, 0, 0.5)"; // Orange-red
            break;
          case "cannon":
            explosionColor = "rgba(255, 215, 0, 0.5)"; // Golden
            break;
          case "gasspitter":
            explosionColor = "rgba(0, 255, 0, 0.5)"; // Toxic green
            break;
          case "basic":
            explosionColor = "rgba(255, 0, 0, 0.5)"; // Red
            break;
          case "slower":
            explosionColor = "rgba(0, 191, 255, 0.5)"; // Deep sky blue
            break;
          default:
            explosionColor = "rgba(255, 0, 0, 0.5)"; // Default red
        }
      }

      return (
        <div
          key={effect.id}
          className="absolute pointer-events-none rounded-full animate-explosion z-[5]"
          style={{
            left: `${effect.positionX}%`,
            top: `${effect.positionY}%`,
            width: `${explosionSize / 1.5}%`,
            height: `${explosionSize / 1.5}%`,
            transform: "translate(-50%, -50%)",
            background: `radial-gradient(circle, ${explosionColor} 0%, rgba(255,255,255,0) 70%)`,
          }}
        />
      );
    });
  };

  // Add this new component near your other components
  const RangeIndicator = ({ tower }: { tower: Tower }) => {
    if (!showRangeIndicators) return null;

    return (
      showUpgradeMenu &&
      tower.id === selectedTowerID && (
        <div
          className="absolute rounded-full border-2 border-yellow-400 pointer-events-none"
          style={{
            width: `${tower.radius * 2}%`,
            height: `${tower.radius * 2}%`,
            left: `${tower.positionX}%`,
            top: `${tower.positionY}%`,
            transform: "translate(-50%, -50%)",
            backgroundColor: "rgba(59, 130, 246, 0.1)",
            zIndex: 5,
          }}
        />
      )
    );
  };

  // Add this function near your other event handlers
  const handleOutsideClick = (event: React.MouseEvent) => {
    // Check if the click was outside the upgrade menu
    const upgradeMenu = document.querySelector("[data-upgrade-menu]");
    if (upgradeMenu && !upgradeMenu.contains(event.target as Node)) {
      setShowUpgradeMenu(false);
    }
  };

  useEffect(() => {
    if (
      enemies.length === 0 &&
      (enemyCount >= 10 * round || enemyCount >= 15 * round)
    ) {
      // Clear processed enemies when round is complete
      processedEnemies.clear();
    }
  }, [enemies.length, enemyCount, round,processedEnemies]);

  

  // Add this near your other useEffects
  useEffect(() => {
    // Check for dead enemies that haven't granted money yet
    setEnemies((prevEnemies) => {
      let hasChanges = false;
      const updatedEnemies = prevEnemies.map((enemy) => {
        if (
          enemy.hp <= 0 ||
          (enemy.executed && !processedEnemies.has(enemy.id))
        ) {
          grantMoneyForKill(enemy);
          hasChanges = true;
        }
        return enemy;
      });
      return hasChanges ? updatedEnemies : prevEnemies;
    });
  }, [enemies, grantMoneyForKill,processedEnemies]);
  useEffect(() => {
    if (hp > 101 && gameMode === "normal") {
      alert("kys");
      resetGame();
    }
    if (round < 30 && money > 1000000 && gameMode === "normal") {
      alert("kys");
      resetGame();
    }
    if (round >= 150 && money < 10000 && gameMode === "normal") {
      alert("kys");
      resetGame();
    }
  }, [hp, round, money,gameMode,resetGame]);

  // Add a helper function to calculate rotation
  const getTowerRotation = (tower: Tower, target: Enemy) => {
    if (!target) return "";
    const shootingRight = target.positionX > tower.positionX;
    return shootingRight ? "scaleX(-1)" : "";
  };
  const LingeringEffects = () => {
    return (
      <>
        {lingeringEffects.map((effect) => (
          <div
            key={effect.id}
            className="absolute  pointer-events-none animate-pulse"
            style={{
              left: `${effect.positionX}%`,
              top: `${effect.positionY}%`,
              width: `${effect.radius * 2.5}%`,
              height: `${effect.radius * 2.5}%`,
              aspectRatio: "1 / 1", // Ensure a perfect circle
              transform: "translate(-50%, -50%)",
              borderRadius: "50%",
              background: `radial-gradient(circle, ${effect.color} 0%, transparent 50%)`,
              opacity: 0.5,
              zIndex: 4,
            }}
          />
        ))}
      </>
    );
  };
  const GameOverScreen = () => {
    const [username, setUsername] = useState("");
    const [isSaved, setIsSaved] = useState(false);
    const [error, setError] = useState("");

    const handleSave = () => {
      if (!username.trim()) {
        setError("Please enter a username");
        return;
      }

      saveGameResult(round, username)
        .then(() => {
          setIsSaved(true);
          setError("");
          console.log("Game result saved successfully");
        })
        .catch((error) => {
          setError("Failed to save score. Please try again.");
          console.error("Failed to save game result:", error);
        });
    };

    return (
      showGameOver && (
        <PopUp>
          <span className="text-yellow-400 text-6xl">⛔</span>
          <h2
            className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 
          bg-clip-text text-transparent mb-4 mt-3 animate-pulse"
          >
            GAME OVER
          </h2>
          <p className="text-xl text-blue-300 mb-8">
            You made it to round {round}!
          </p>

          {!isSaved && gameMode === "normal" ? (
            <div className="mb-6 space-y-4">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                className="w-full px-4 py-2 bg-slate-700 border border-blue-500 rounded-lg 
                text-white placeholder-gray-400 focus:outline-none focus:ring-2 
                focus:ring-blue-500"
                maxLength={20}
              />
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <button
                onClick={handleSave}
                className="bg-gradient-to-r from-blue-600 to-blue-800 text-white px-8 py-3 
                rounded-lg text-lg font-bold transform transition duration-200 w-full
                hover:scale-105 hover:shadow-lg hover:from-blue-500 hover:to-blue-700
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              >
                Save Score
              </button>
            </div>
          ) : gameMode === "sandbox" ? (
            <p className="text-sm text-green-400 mb-4">Cant save on sandbox</p>
          ) : (
            <p className="text-sm text-green-400 mb-4">
              Score saved successfully!
            </p>
          )}

          <button
            onClick={resetGame}
            className="bg-gradient-to-r from-red-600 to-red-800 text-white px-8 py-3 
            rounded-lg text-lg font-bold transform transition duration-200 w-full
            hover:scale-105 hover:shadow-lg hover:from-red-500 hover:to-red-700
            focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
          >
            RESTART
          </button>
        </PopUp>
      )
    );
  };
  const WinScreen = () => {
    return (
      showWinScreen && (
        <div className="absolute top-0 left-0 overflow-hidden w-full h-full bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div
            className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-12 rounded-2xl 
        text-center border-4 border-blue-500 shadow-2xl transform scale-100 animate-pop-in"
          >
            <div className="animate-bounce mb-6">
              <span className="text-yellow-400 text-6xl">🏆</span>
            </div>
            <h2
              className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 
          bg-clip-text text-transparent mb-4 animate-pulse"
            >
              VICTORY!
            </h2>
            <p className="text-xl text-blue-300 mb-8">
              Do you wish to continue?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => {
                  setShowWinScreen(false);
                  setIsPaused(false);
                  setHasWon(true);
                }}
                className="bg-gradient-to-r from-blue-600 to-blue-800 text-white px-8 py-3 
              rounded-lg text-lg font-bold transform transition duration-200 
              hover:scale-105 hover:shadow-lg hover:from-blue-500 hover:to-blue-700
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              >
                Continue
              </button>
              <button
                onClick={resetGame}
                className="bg-gradient-to-r from-red-600 to-red-800 text-white px-8 py-3 
              rounded-lg text-lg font-bold transform transition duration-200 
              hover:scale-105 hover:shadow-lg hover:from-red-500 hover:to-red-700
              focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
              >
                RESET
              </button>
            </div>
          </div>
        </div>
      )
    );
  };
  const enemyAlert = () => {
    return (
      showEnemyAlert && (
        <div
          className="absolute top-[25vh] left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-40 
      bg-slate-800 flex flex-col justify-center items-center p-4 md:p-6 rounded-lg gap-4 
      shadow-xl border-2 border-blue-500 w-[95vw] max-w-[700px] md:w-[700px] text-sm"
        >
          <div className="flex justify-between items-center mb-6 w-full">
            <h1
              className="text-4xl font-bold bg-gradient-to-r from-red-400 to-pink-500 
        bg-clip-text text-transparent mb-4 mt-3 animate-pulse mx-auto"
            >
              ALERT
            </h1>
            <button
              onClick={() => setShowEnemyAlert(false)}
              className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors 
        text-3xl font-extrabold text-red-600"
            >
              X
            </button>
          </div>

          <div className="text-red-300 text-lg md:text-xl font-semibold text-center px-4 py-2 bg-red-900/30 rounded-lg shadow-md border border-red-500">
            {enemyAlertDescription}
          </div>
        </div>
      )
    );
  };
  return (
    <>
      <div
        className="relative min-h-[73vh]  w-full "
        suppressHydrationWarning
        onClick={handleOutsideClick}
      >
        <img
          src="/test.webp"
          className=" w-full h-full object-fill top-0 left-0 z-0"
          alt="map"
        />
        {/* Add range indicators for all towers */}
        {tower.map((t) => (
          <RangeIndicator key={`range-${t.id}`} tower={t} />
        ))}
        <div>
          {
            <>
              {[
                { top: "35%", left: "20%", x: 21, y: 36 },
                { top: "35%", left: "10%", x: 11, y: 36 },
                { top: "60%", left: "66%", x: 66, y: 61 },
                { top: "58%", left: "60%", x: 60, y: 59 },
                { top: "30%", left: "63%", x: 63, y: 31 },
                { top: "42.5%", left: "63%", x: 63, y: 43.5 },
                { top: "35%", left: "85%", x: 85, y: 36 },
                { top: "65%", left: "2%", x: 2, y: 66 },
                { top: "65%", left: "25%", x: 25, y: 66 },
                { top: "8%", left: "30%", x: 30, y: 9 },
                { top: "8%", left: "50%", x: 50, y: 9 },
                { top: "5%", left: "41%", x: 41, y: 6 },
                { top: "40%", left: "41%", x: 41, y: 41 },
                { top: "52.5%", left: "41%", x: 41, y: 53.5 },
                { top: "57%", left: "35%", x: 35, y: 58 },
                { top: "65%", left: "41%", x: 42, y: 67 },
                { top: "65%", left: "80%", x: 80, y: 66 },
                { top: "80%", left: "80%", x: 80, y: 81 },
              ].map((pos, index) => {
                const existingTower = tower.find(
                  (t) => t.positionX === pos.x && t.positionY === pos.y
                );

                // Only render if there's an existing tower or if a tower type is selected
                const shouldShow = existingTower || selectedTowerType;

                return shouldShow ? (
                  <img
                    key={index}
                    id={existingTower?.id || `building-site-${index}`}
                    src={
                      existingTower ? existingTower.src : "/buildingSite.png"
                    }
                    className="absolute sm:w-7 md:w-14 sm:h-7 md:h-14 z-10 hover:opacity-75 transition-opacity"
                    style={{
                      top: pos.top,
                      left: pos.left,
                      transform: existingTower?.furthestEnemyInRange?.[0]
                        ? getTowerRotation(
                            existingTower,
                            existingTower.furthestEnemyInRange[0]
                          )
                        : "",
                    }}
                    onClick={(event) => buyTowers(event, pos.x, pos.y)}
                  />
                ) : null;
              })}
            </>
          }
        </div>
        {createEnemy()}
        {attackAnimation()}
        {renderExplosions()}
        {LingeringEffects()}
      </div>
      {upgradeTower()}
      {enemyAlert()}
      {GameOverScreen()}
      {WinScreen()}
    </>
  );
};

export default Spawn;

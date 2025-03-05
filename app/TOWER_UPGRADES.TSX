import React from "react";
interface Tower {
  id: string;
  positionX: number;
  positionY: number;
  damageDone: number;
  baseAttackInterval: number;
  baseAttack: number;
  attack: number;
  attackInterval: number; // renamed from attackSpeed
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
  canStun?: boolean;
  stunDuration?: number;
  chainCount?: number;
  chainRange?: number;
  hasLingering?: boolean;
  lingeringDamage?: number;
  lingeringRadius?: number;
  lingeringDuration?: number;
  lingeringColor?: string;
  path1Level: number;
  path2Level: number;
  path: number;
}

interface TowerUpgrade {
    name: string;
    cost: number;
    description: string;
    path: number;
    effect: (tower: Tower) => Partial<Tower>;
    requires: number; // Previous upgrade level required
  }
export const TOWER_UPGRADES: { [key: string]: TowerUpgrade[] } = {
    basic: [
      // Path 1 - Attack Speed focused
      {
        name: "Stealth Tracker",
        cost: 400,
        requires: 0,
        path: 1,
        description: "Can detect and attack stealth units",
        effect: (tower) => ({ 
          canHitStealth: true,
          towerWorth: tower.towerWorth + 400,
          path: 1
        })
      },
      {
        name: "Hyperfire Gear",
        cost: 800,
        description: "Significantly reduces attack interval",
        requires: 1,
        path: 1,
        effect: (tower) => ({ 
          attackInterval: tower.attackInterval - 300,
          towerWorth: tower.towerWorth + 800,
          path: 1
        })
      },
      {
        name: "Twin Fang Arsenal",
        cost: 2000,
        description: "Fires two shots at once with increased speed.",
        requires: 2,
        path: 1,
        effect: (tower) => ({ 
          attackType: 'double',
          attackInterval: tower.attackInterval - 200,
          towerWorth: tower.towerWorth + 2000,
          path: 1
        })
      },
      {
        name: "Blitz Commander",
        cost: 15000,
        description: "Unleashes a triple-shot barrage at supreme speed",
        requires: 3,
        path: 1,
        effect: (tower) => ({
          attackInterval: tower.attackInterval - 250,
          attackType: 'triple',
          attack: tower.attack * 1.5,
          src: '/basicSpecial.png',
          towerWorth: tower.towerWorth + 15000,
          path: 1
        })
      },
      {
        name: "Tempest Onslaught",
        cost: 25000,
        description: "Fires four shots per attack with near-instant firing rate",
        requires: 4,
        path: 1,
        effect: (tower) => ({
          attackInterval: tower.attackInterval - 100,
          attackType: 'quadruple',
          attack: tower.attack * 1.8,
          towerWorth: tower.towerWorth + 25000,
          path: 1
        })
      },
      {
        name: "Endless Storm",
        cost: 150000,
        description: "A relentless, ceaseless stream of destruction",
        requires: 5,
        path: 1,
        effect: (tower) => ({
          attackInterval: tower.attackInterval - 35,
          attackType: 'quadruple',
          attack: tower.attack * 2.5,
          canHitStealth: true,
          canHitArmored: true,
          towerWorth: tower.towerWorth + 150000
        })
      },
  
      // Path 2 - Heavy Damage focused
      {
        name: "Deadeye Calibration",
        cost: 600,
        requires: 0,
        path: 2,
        description: "Increases damage output significantly",
        effect: (tower) => ({ 
          attack: tower.attack + 60,
          towerWorth: tower.towerWorth + 600,
          path: 2
        })
      },
      {
        name: "Impact Core Rounds",
        cost: 2000,
        description: "Further increases damage and adds armor piercing",
        requires: 1,
        path: 2,
        effect: (tower) => ({ 
          attack: tower.attack + 80,
          canHitArmored: true,
          towerWorth: tower.towerWorth + 2000,
          path: 2
        })
      },
      {
        name: "Critical Strike",
        cost: 5000,
        description: "30% chance to deal triple damage",
        requires: 2,
        path: 2,
        effect: (tower) => ({ 
          hasCritical: true,
          criticalChance: 0.30,
          criticalMultiplier: 3,
          towerWorth: tower.towerWorth + 5000,
          path: 2
        })
      },
      {
        name: "Demolition Expert",
        cost: 15000,
        description: "Converts to massive explosive damage",
        requires: 3,
        path: 2,
        effect: (tower) => ({
          attackType: 'explosion',
          explosionRadius: 25,
          attack: tower.attack * 3,
          src: '/basicSpecial2.png',
          towerWorth: tower.towerWorth + 15000,
          path: 2
        })
      },
      {
        name: "Nuclear Strike",
        cost: 30000,
        description: "Devastating explosion",
        requires: 4,
        path: 2,
        effect: (tower) => ({
          explosionRadius: tower.explosionRadius * 1.4,
          attack: tower.attack * 1.5,
          towerWorth: tower.towerWorth + 30000,
          path: 2
        })
      },
      {
        name: "Apocalypse Protocol",
        cost: 150000,
        description: "World-ending explosion radius and damage",
        requires: 5,
        path: 2,
        effect: (tower) => ({
          explosionRadius: tower.explosionRadius * 2,
          attack: tower.attack * 4,
          canHitStealth: true,
          canHitArmored: true,
          criticalChance: 0.5,
          criticalMultiplier: 5,
          towerWorth: tower.towerWorth + 150000
        })
      }
    ],
    sniper: [
      // Path 1 - High Damage/Stun
      {
        name: "Precision Scope",
        cost: 1000,
        requires: 0,
        path: 1,
        description: "Increases damage by 100",
        effect: (tower) => ({
          attack: tower.attack + 100,
          towerWorth: tower.towerWorth + 1000,
          path: 1
        })
      },
      {
        name: "Stun Rounds",
        cost: 2500,
        requires: 1,
        path: 1,
        description: "20% chance to stun enemies",
        effect: (tower) => ({
          canStun: true,
          stunDuration: 75, // Reduced from 150
          criticalChance: 0.2,
          towerWorth: tower.towerWorth + 2500,
          path: 1
        })
      },
      {
        name: "Armor Piercing",
        cost: 5000,
        requires: 2,
        path: 1,
        description: "Can hit armored enemies and +150 damage",
        effect: (tower) => ({
          canHitArmored: true,
          attack: tower.attack + 150,
          towerWorth: tower.towerWorth + 5000,
          path: 1
        })
      },
      {
        name: "Heavy Impact",
        cost: 12000,
        requires: 3,
        path: 1,
        description: "40% stun chance and doubled damage",
        effect: (tower) => ({
          attack: tower.attack * 2,
          criticalChance: 0.4,
          stunDuration: 150, // Reduced from 300
          src: '/sniperSpecial.png',
          towerWorth: tower.towerWorth + 12000,
          path: 1
        })
      },
      {
        name: "Ultimate Destroyer",
        cost: 25000,
        requires: 4,
        path: 1,
        description: "Massive damage and guaranteed stun",
        effect: (tower) => ({
          attack: tower.attack * 3,
          criticalChance: 1.0,
          stunDuration: 250, // Reduced from 500
          towerWorth: tower.towerWorth + 25000,
          path: 1
        })
      },
      {
        name: "Omega Striker",
        cost: 150000,
        description: "Perfect accuracy with devastating power",
        requires: 5,
        path: 1,
        effect: (tower) => ({
          attack: tower.attack * 5,
          criticalChance: 1.0,
          stunDuration: 500,
          canHitStealth: true,
          canHitArmored: true,
          towerWorth: tower.towerWorth + 150000
        })
      },
  
      // Path 2 - Attack Speed
      {
        name: "Quick Loader",
        cost: 800,
        requires: 0,
        path: 2,
        description: "Reduces attack interval by 400ms",
        effect: (tower) => ({
          attackInterval: tower.attackInterval - 400,
          towerWorth: tower.towerWorth + 800,
          path: 2
        })
      },
      {
        name: "Double Shot",
        cost: 2000,
        requires: 1,
        path: 2,
        description: "Can target two enemies",
        effect: (tower) => ({
          attackType: 'double',
          attackInterval: tower.attackInterval - 200,
          towerWorth: tower.towerWorth + 2000,
          path: 2
        })
      },
      {
        name: "Advanced Targeting",
        cost: 4500,
        requires: 2,
        path: 2,
        description: "Triple shot and faster firing",
        effect: (tower) => ({
          attackType: 'triple',
          attackInterval: tower.attackInterval - 300,
          towerWorth: tower.towerWorth + 4500,
          path: 2
        })
      },
      {
        name: "Rapid Fire Master",
        cost: 15000,
        requires: 3,
        path: 2,
        description: "Extremely fast attack speed",
        effect: (tower) => ({
          attackInterval: tower.attackInterval - 450,
          attack: tower.attack * 1.3,
          src: '/sniperSpecial2.png',
          towerWorth: tower.towerWorth + 15000,
          path: 2
        })
      },
      {
        name: "Machine Gun Mode",
        cost: 25000,
        requires: 4,
        path: 2,
        description: "Quadruple shot with insane speed",
        effect: (tower) => ({
          attackType: 'quadruple',
          attackInterval: tower.attackInterval - 350,
          attack: tower.attack * 1.5,
          towerWorth: tower.towerWorth + 25000,
          path: 2
        })
      },
      {
        name: "Infinite Chambers",
        cost: 150000,
        description: "Superhuman firing speed with multiple targets",
        requires: 5,
        path: 2,
        effect: (tower) => ({
          attackType: 'quadruple',
          attackInterval: tower.attackInterval - 170,
          attack: tower.attack * 1.5,
          canHitStealth: true,
          canHitArmored: true,
          towerWorth: tower.towerWorth + 150000
        })
      }
    ],
    rapidShooter: [
      // Path 1 - Multi-target Attack Speed Path
      {
        name: "Faster Firing",
        cost: 500,
        requires: 0,
        path: 1,
        description: "Reduces attack interval by 75ms",
        effect: (tower) => ({
          attackInterval: tower.attackInterval - 75,
          towerWorth: tower.towerWorth + 500,
          path: 1
        })
      },
      {
        name: "Enhanced Targeting",
        cost: 1200,
        requires: 1,
        path: 1,
        description: "Increases damage by 15 and attack speed",
        effect: (tower) => ({
          attack: tower.attack + 15,
          attackInterval: tower.attackInterval - 50,
          towerWorth: tower.towerWorth + 1200,
          path: 1
        })
      },
      {
        name: "Triple Shot",
        cost: 3500,
        requires: 2,
        path: 1,
        description: "Can target three enemies at once",
        effect: (tower) => ({
          attackType: 'triple',
          attackInterval: tower.attackInterval - 25,
          towerWorth: tower.towerWorth + 3500,
          path: 1
        })
      },
      {
        name: "Quad Shot",
        cost: 8000,
        requires: 3,
        path: 1,
        description: "Four targets and enhanced speed",
        effect: (tower) => ({
          attackType: 'quadruple',
          attackInterval: tower.attackInterval - 50,
          attack: tower.attack + 10,
          src: '/rapidShooterSpecial1.png',
          towerWorth: tower.towerWorth + 8000,
          path: 1
        })
      },
      {
        name: "Bullet Storm",
        cost: 25000,
        requires: 4,
        path: 1,
        description: "Maximum attack speed and damage",
        effect: (tower) => ({
          attackInterval: tower.attackInterval - 65,
          attack: tower.attack * 1.6,
          towerWorth: tower.towerWorth + 25000,
          path: 1
        })
      },
      {
        name: "Light Speed",
        cost: 150000,
        description: "Attacks at impossible speeds",
        requires: 5,
        path: 1,
        effect: (tower) => ({
          attackInterval: tower.attackInterval - 40,
          attack: tower.attack * 2.5,
          attackType: 'quadruple',
          canHitArmored: true,
          canHitStealth: true,
          towerWorth: tower.towerWorth + 150000
        })
      },
  
      // Path 2 - Chain Lightning Path
      {
        name: "Static Charge",
        cost: 800,
        requires: 0,
        path: 2,
        description: "Adds 25 damage and slight range",
        effect: (tower) => ({
          attack: tower.attack + 25,
          radius: tower.radius * 1.1,
          towerWorth: tower.towerWorth + 800,
          path: 2
        })
      },
      {
        name: "Enhanced Range",
        cost: 1500,
        requires: 1,
        path: 2,
        description: "Further increases range, damage and stealth detection",
        effect: (tower) => ({
          radius: tower.radius * 1.2,
          attack: tower.attack + 15,
          canHitStealth: true,
          towerWorth: tower.towerWorth + 1500,
          path: 2
        })
      },
      {
        name: "Chain Lightning",
        cost: 4500,
        requires: 2,
        path: 2,
        description: "Attacks chain to 2 nearby enemies",
        effect: (tower) => ({
          attackType: 'chain',
          chainCount: 2,
          chainRange: 20,
          effectSrc: '/chainLightning.png',
          src: '/rapidShooterSpecial2.png',
          attack: tower.attack + 20,
          towerWorth: tower.towerWorth + 4500,
          path: 2
        })
      },
      {
        name: "Storm Caller",
        cost: 12000,
        requires: 3,
        path: 2,
        description: "Chain to 3 enemies with increased damage",
        effect: (tower) => ({
          chainCount: 3,
          chainRange: 25,
          attack: tower.attack * 1.4,
          attackInterval: tower.attackInterval - 25,
          src: '/rapidShooterSpecial2.png',
          towerWorth: tower.towerWorth + 12000,
          path: 2
        })
      },
      {
        name: "Lightning Master",
        cost: 25000,
        requires: 4,
        path: 2,
        description: "Maximum chain potential and massive damage",
        effect: (tower) => ({
          chainCount: 4,
          chainRange: 30,
          attack: tower.attack * 2,
          attackInterval: tower.attackInterval - 50,
          towerWorth: tower.towerWorth + 25000,
          path: 2
        })
      },
      {
        name: "Zeus's Wrath",
        cost: 150000,
        description: "Ultimate chain lightning mastery",
        requires: 5,
        path: 2,
        effect: (tower) => ({
          chainCount: 6,
          chainRange: 40,
          attack: tower.attack * 3,
          attackInterval: tower.attackInterval - 25,
          canHitArmored: true,
          towerWorth: tower.towerWorth + 150000
        })
      }
  ],
  slower: [
    // Path 1 - Time Warping Path
    {
      name: "Enhanced Slow",
      cost: 400,
      requires: 0,
      path: 1,
      description: "Increases slow effect by 10%",
      effect: (tower) => ({
        slowAmount: tower.slowAmount ? tower.slowAmount * 0.9 : 0.9,
        towerWorth: tower.towerWorth + 400,
        path: 1
      })
    },
    {
      name: "Time Distortion",
      cost: 1500,
      requires: 1,
      path: 1,
      description: "Further increases slow effect and duration",
      effect: (tower) => ({
        slowAmount: tower.slowAmount ? tower.slowAmount * 0.8 : 0.8,
        slowDuration: 3000,
        towerWorth: tower.towerWorth + 1500,
        path: 1
      })
    },
    {
      name: "Temporal Field",
      cost: 3500,
      requires: 2,
      path: 1,
      description: "Creates slowing field around targets",
      effect: (tower) => ({
        attackType: 'explosion',
        explosionRadius: 15,
        slowAmount: tower.slowAmount ? tower.slowAmount * 0.7: 0.7,
        src: '/slowerSpecial1.png',
        towerWorth: tower.towerWorth + 3500,
        path: 1
      })
    },
    {
      name: "Chrono Break",
      cost: 8000,
      requires: 3,
      path: 1,
      description: "Massive slow effect in larger area",
      effect: (tower) => ({
        explosionRadius: 20,
        slowAmount: tower.slowAmount ? tower.slowAmount * 0.6: 0.6,
        slowDuration: 4000,
        towerWorth: tower.towerWorth + 8000,
        path: 1
      })
    },
    {
      name: "Time Lord",
      cost: 20000,
      requires: 4,
      path: 1,
      description: "Ultimate time manipulation",
      effect: (tower) => ({
        explosionRadius: 25,
        slowAmount: tower.slowAmount ? tower.slowAmount * 0.6 : 0.6,
        canHitStealth: true,
        towerWorth: tower.towerWorth + 20000,
        path: 1
      })
    },
    {
      name: "Time Stop",
      cost: 150000,
      description: "Nearly stops time itself",
      requires: 5,
      path: 1,
      effect: (tower) => ({
        explosionRadius: 35,
        slowAmount: 0.4,
        slowDuration: 6000,
        attack: tower.attack * 3,
        canHitArmored: true,
        towerWorth: tower.towerWorth + 150000
      })
    },
    // Path 2 - Multi-target Freezing Path
    {
      name: "Frost Touch",
      cost: 600,
      requires: 0,
      path: 2,
      description: "Adds freezing damage",
      effect: (tower) => ({
        attack: tower.attack + 15,
        towerWorth: tower.towerWorth + 600,
        path: 2
      })
    },
    {
      name: "Frost Touch 2",
      cost: 1200,
      requires: 1,
      path: 2,
      description: "Faster freeze",
      effect: (tower) => ({
        attackInterval: tower.attackInterval - 250,
        towerWorth: tower.towerWorth + 600,
        path: 2
      })
    },
    {
      name: "Arctic Wind",
      cost: 4500,
      requires: 2,
      path: 2,
      description: "Triple target and increased range",
      effect: (tower) => ({
        attackType: 'triple',
        radius: tower.radius * 1.3,
        attack: tower.attack + 25,
        src: '/slowerSpecial2.png',
        towerWorth: tower.towerWorth + 4500,
        path: 2
      })
    },
    {
      name: "Deep Freeze",
      cost: 12000,
      requires: 3,
      path: 2,
      description: "Quad target and chance to stun",
      effect: (tower) => ({
        attackType: 'quadruple',
        canStun: true,
        stunDuration: 100, // Reduced from 200
        attack: tower.attack + 30,
        towerWorth: tower.towerWorth + 12000,
        path: 2
      })
    },
    {
      name: "Permafrost",
      cost: 20000,
      requires: 4,
      path: 2,
      description: "Maximum freeze potential",
      effect: (tower) => ({
        attack: tower.attack * 2,
        stunDuration: 250, // Reduced from 400
        radius: tower.radius * 1.5,
        towerWorth: tower.towerWorth + 20000,
        path: 2
      })
    },
    {
      name: "Absolute Zero",
      cost: 150000,
      description: "Complete battlefield control",
      requires: 5,
      path: 2,
      effect: (tower) => ({
        attackType: 'quadruple',
        attack: tower.attack * 4,
        stunDuration: 500,
        canHitStealth: true,
        canHitArmored: true,
        radius: tower.radius * 2,
        towerWorth: tower.towerWorth + 150000
      })
    }
  ],
  
  gasspitter: [
    // Path 1 - DOT Damage Path
    {
      name: "Virulent Strain",
      cost: 400,
      requires: 0,
      path: 1,
      description: "Increases poison damage",
      effect: (tower) => ({
        poisonDamage: tower.poisonDamage + 25,
        towerWorth: tower.towerWorth + 400,
        path: 1
      })
    },
    {
      name: "Lingering Toxin",
      cost: 1200,
      requires: 1,
      path: 1,
      description: "Longer lasting poison",
      effect: (tower) => ({
        poisonDamage: tower.poisonDamage + 30,
        towerWorth: tower.towerWorth + 1200,
        path: 1
      })
    },
    {
      name: "Acid Pools",
      cost: 3000,
      requires: 2,
      path: 1,
      description: "Creates damaging acid pools on impact",
      effect: (tower) => ({
        attackType: 'lingering',
        lingeringDamage: tower.poisonDamage * 0.025,
        lingeringRadius: 15,
        attackInterval: tower.attackInterval + 1500,
        lingeringDuration: 2000,
        lingeringColor: 'rgba(0, 255, 0, 0.5)',
        towerWorth: tower.towerWorth + 3000
      })
    },
    {
      name: "Toxic Catalyst",
      cost: 8000,
      requires: 3,
      path: 1,
      description: "Extreme poison damage, Can stop regen and hit stealth",
      effect: (tower) => ({
        poisonDamage: tower.poisonDamage * 2.25,
        canHitStealth: true,
        canStopRegen: true,
        towerWorth: tower.towerWorth + 8000,
        path: 1
      })
    },
    {
      name: "Bio Weaponry",
      cost: 15000,
      requires: 4,
      path: 1,
      description: "Ultimate poison damage",
      effect: (tower) => ({
        poisonDamage: tower.poisonDamage * 2.75,
        attack: tower.attack * 1.5,
        src: '/gasSpitterSpecial1.png',
        towerWorth: tower.towerWorth + 15000,
        path: 1
      })
    },
    {
      name: "Omega Virus",
      cost: 150000,
      description: "The ultimate biological weapon",
      requires: 5,
      path: 1,
      effect: (tower) => ({
        poisonDamage: tower.poisonDamage * 4,
        attack: tower.attack * 2,
        canHitArmored: true,
        canHitStealth: true,
        canStopRegen: true,
        towerWorth: tower.towerWorth + 150000
      })
    },
  
    // Path 2 - Gas Cloud Path
    {
      name: "Wider Spray",
      cost: 600,
      requires: 0,
      path: 2,
      description: "Increases attack radius",
      effect: (tower) => ({
        radius: tower.radius * 1.2,
        towerWorth: tower.towerWorth + 600,
        path: 2
      })
    },
    {
      name: "Faster Attack",
      cost: 2000,
      requires: 1,
      path: 2,
      description: "Reduces attack interval",
      effect: (tower) => ({
        attackInterval: tower.attackInterval - 200,
        radius: tower.radius * 1.2,
        towerWorth: tower.towerWorth + 2000,
        path: 2
      })
    },
    {
      name: "Gas Cloud",
      cost: 4500,
      requires: 2,
      path: 2,
      description: "Creates poisonous explosion",
      effect: (tower) => ({
        attackType: 'explosion',
        explosionRadius: 20,
        poisonDamage: tower.poisonDamage + 20,
        towerWorth: tower.towerWorth + 4500,
        path: 2
      })
    },
    {
      name: "Dense Vapors",
      cost: 12000,
      requires: 3,
      path: 2,
      description: "Larger explosion and slowing effect",
      effect: (tower) => ({
        explosionRadius: 25,
        slowAmount: 0.8,
        slowDuration: 2000,
        poisonDamage: tower.poisonDamage + 30,
        towerWorth: tower.towerWorth + 12000,
        src: '/gasSpitterSpecial2.png',
        path: 2
      })
    },
    {
      name: "Chemical Warfare",
      cost: 20000,
      requires: 4,
      path: 2,
      description: "Maximum area control",
      effect: (tower) => ({
        explosionRadius: 30,
        slowAmount: 0.7,
        poisonDamage: tower.poisonDamage * 1.5,
        towerWorth: tower.towerWorth + 20000,
        path: 2
      })
    },
    {
      name: "Toxic Apocalypse",
      cost: 150000,
      description: "Global contamination",
      requires: 5,
      path: 2,
      effect: (tower) => ({
        explosionRadius: 40,
        poisonDamage: tower.poisonDamage * 2,
        attack: tower.attack * 2,
        slowAmount: 0.3,
        slowDuration: 5000,
        canHitArmored: true,
        towerWorth: tower.towerWorth + 150000
      })
    }
  ],
  mortar: [
    {
      name: "High Explosive Shells",
      cost: 800,
      requires: 0,
      path: 1,
      description: "More powerful explosions",
      effect: (tower) => ({
        attack: tower.attack + 100,
        explosionRadius: tower.explosionRadius * 1.1,
        towerWorth: tower.towerWorth + 800,
        path: 1
      })
    },
    {
      name: "Heavy Ordnance",
      cost: 2000,
      requires: 1,
      path: 1,
      description: "Massively enhanced explosion damage",
      effect: (tower) => ({
        explosionRadius: tower.explosionRadius * 1.2,
        attack: tower.attack * 1.3,
        towerWorth: tower.towerWorth + 2000,
        path: 1
      })
    },
    {
      name: "Concentrated Blast",
      cost: 4500,
      requires: 2,
      path: 1,
      description: "Extreme explosive power",
      effect: (tower) => ({
        attack: tower.attack * 1.5,
        canHitArmored: true,
        src: '/mortarSpecial.png',
        towerWorth: tower.towerWorth + 4500,
        path: 1
      })
    },
    {
      name: "Napalm Shells",
      cost: 8000,
      requires: 3,
      path: 1,
      description: "Devastating area damage",
      effect: (tower) => ({
        attack: tower.attack * 1.75,
        explosionRadius: tower.explosionRadius * 1.3,
        canHitStealth: true,
        towerWorth: tower.towerWorth + 8000,
        path: 1
      })
    },
    {
      name: "Nuclear Artillery",
      cost: 30000,
      requires: 4,
      path: 1,
      description: "Ultimate destruction",
      effect: (tower) => ({
        attack: tower.attack * 2.5,
        explosionRadius: tower.explosionRadius * 1.4,
        attackInterval: tower.attackInterval * 1.5, // Slower but more powerful
        criticalChance: 0.3,
        criticalMultiplier: 2,
        towerWorth: tower.towerWorth + 30000,
        path: 1
      })
    },
    {
      name: "Doomsday Device",
      cost: 150000,
      description: "Extinction-level explosions",
      requires: 5,
      path: 1,
      effect: (tower) => ({
        attack: tower.attack * 4,
        explosionRadius: tower.explosionRadius * 1.8,
        criticalChance: 0.5,
        criticalMultiplier: 5,
        canHitStealth: true,
        towerWorth: tower.towerWorth + 150000
      })
    },
  
    // Path 2 - Tactical Support (crowd control)
    {
      name: "EMP Shells",
      cost: 1000,
      requires: 0,
      path: 2,
      description: "Shells temporarily disable enemies",
      effect: (tower) => ({
        canStun: true,
        stunDuration: 100,
        explosionRadius: tower.explosionRadius * 1.1,
        towerWorth: tower.towerWorth + 1000,
        path: 2
      })
    },
    {
      name: "Cryogenic Payload",
      cost: 2500,
      requires: 1,
      path: 2,
      description: "Freezing explosions slow enemies",
      effect: (tower) => ({
        slowAmount: 0.7,
        slowDuration: 2000,
        explosionRadius: tower.explosionRadius * 1.2,
        towerWorth: tower.towerWorth + 2500,
        path: 2
      })
    },
    {
      name: "Shockwave Artillery",
      cost: 5000,
      requires: 2,
      path: 2,
      description: "Enhanced control effects",
      effect: (tower) => ({
        explosionRadius: tower.explosionRadius * 1.3,
        stunDuration: 300,
        slowAmount: 0.6,
        attack: tower.attack + 50,
        towerWorth: tower.towerWorth + 5000,
        path: 2
      })
    },
    {
      name: "Shock and Awe",
      cost: 12000,
      requires: 3,
      path: 2,
      description: "Devastating crowd control",
      effect: (tower) => ({
        explosionRadius: tower.explosionRadius * 1.4,
        slowAmount: 0.5,
        slowDuration: 3000,
        stunDuration: 400,
        attack: tower.attack + 100,
        src: '/mortarSpecial2.png',
        towerWorth: tower.towerWorth + 12000,
        path: 2
      })
    },
    {
      name: "Strategic Command",
      cost: 25000,
      requires: 4,
      path: 2,
      description: "Ultimate battlefield control",
      effect: (tower) => ({
        explosionRadius: tower.explosionRadius * 1.5,
        attack: tower.attack * 1.5,
        slowAmount: 0.4,
        slowDuration: 4000,
        canHitStealth: true,
        towerWorth: tower.towerWorth + 20000,
        path: 2
      })
    },
    {
      name: "Supreme Commander",
      cost: 150000,
      description: "Ultimate tactical superiority",
      requires: 5,
      path: 2,
      effect: (tower) => ({
        explosionRadius: tower.explosionRadius * 2,
        attack: tower.attack * 2.5,
        slowAmount: 0.3,
        slowDuration: 5000,
        stunDuration: 600,
        canHitStealth: true,
        towerWorth: tower.towerWorth + 150000
      })
    }
  ],
  
  cannon: [
    // Path 1 - Anti-Tank Specialist
    {
      name: "Reinforced Barrel",
      cost: 800,
      requires: 0,
      path: 1,
      description: "Increased damage ",
      effect: (tower) => ({
        attack: tower.attack + 50,
        towerWorth: tower.towerWorth + 800
      })
    },
    {
      name: "Armor Piercing Rounds",
      cost: 2000,
      requires: 1,
      path: 1,
      description: "Specialized anti-armor ammunition",
      effect: (tower) => ({
        attack: tower.attack + 75,
        hasCritical: true,
        criticalChance: 0.2,
        criticalMultiplier: 2,
        towerWorth: tower.towerWorth + 2000
      })
    },
    {
      name: "Depleted Uranium",
      cost: 4500,
      requires: 2,
      path: 1,
      description: "Extreme armor penetration",
      effect: (tower) => ({
        attack: tower.attack * 1.5,
        criticalChance: 0.3,
        criticalMultiplier: 2.5,
        towerWorth: tower.towerWorth + 4500
      })
    },
    {
      name: "Tank Hunter",
      cost: 8000,
      requires: 3,
      path: 1,
      description: "Specialized in destroying tough enemies",
      effect: (tower) => ({
        attack: tower.attack * 1.75,
        criticalChance: 0.4,
        criticalMultiplier: 3,
        attackInterval: tower.attackInterval - 500,
        src: '/cannonSpecial.png',
        towerWorth: tower.towerWorth + 8000
      })
    },
    {
      name: "Siege Breaker",
      cost: 25000,
      requires: 4,
      path: 1,
      description: "Ultimate anti-armor capabilities",
      effect: (tower) => ({
        attack: tower.attack * 1.5,
        criticalChance: 0.5,
        criticalMultiplier: 4,
        canHitStealth: true,
        towerWorth: tower.towerWorth + 25000
      })
    },
    {
      name: "Titan Slayer",
      cost: 150000,
      description: "Unstoppable anti-everything weapon",
      requires: 5,
      path: 1,
      effect: (tower) => ({
        attack: tower.attack * 2,
        criticalChance: 0.6,
        criticalMultiplier: 5,
        canHitStealth: true,
        attackInterval: tower.attackInterval - 500,
        towerWorth: tower.towerWorth + 150000
      })
    },
  
    // Path 2 - Anti-Group Specialist
    {
      name: "Wide Shells",
      cost: 1000,
      requires: 0,
      path: 2,
      description: "Increases explosion radius",
      effect: (tower) => ({
        explosionRadius: tower.explosionRadius * 1.2,
        attack: tower.attack - 15, // Small damage penalty for bigger radius
        towerWorth: tower.towerWorth + 1000,
      })
    },
    {
      name: "Cluster Bombs",
      cost: 2500,
      requires: 1,
      path: 2,
      description: "Creates multiple small explosions",
      effect: (tower) => ({
        explosionRadius: tower.explosionRadius * 1.3,
        attackInterval: tower.attackInterval - 125, 
        attack: tower.attack + 15,
        towerWorth: tower.towerWorth + 2500,
      })
    },
    {
      name: "Inferno Zone",
      cost: 5000,
      requires: 2,
      path: 2,
      description: "Massive burning zones after explosions",
      effect: (tower) => ({
        hasLingering: true,
        lingeringDamage: tower.attack * 0.05,
        lingeringRadius: 20,
        attackInterval: tower.attackInterval + 1000,
        lingeringDuration: 4000,
        attack: tower.attack + 75,
        explosionRadius: tower.explosionRadius * 1.3,
        towerWorth: tower.towerWorth + 5000
      })
    },
    {
      name: "Hellfire Cannon",
      cost: 12000,
      requires: 3,
      path: 2,
      description: "Devastating explosions with intense burning",
      effect: (tower) => ({
        lingeringRadius: 25,
        lingeringDuration: 5000,
        attack: tower.attack * 1.4,
        explosionRadius: tower.explosionRadius * 1.4,
        src: '/cannonSpecial2.png',
        towerWorth: tower.towerWorth + 12000
      })
    },
    {
      name: "Solar Inferno",
      cost: 25000,
      requires: 4,
      path: 2,
      description: "Ultimate area denial with massive damage",
      effect: (tower) => ({
        lingeringDamage: tower.attack * 0.06,
        lingeringRadius: 30,
        lingeringDuration: 6000,
        attack: tower.attack * 1.6,
        explosionRadius: tower.explosionRadius * 1.5,
        canHitArmored: true,
        towerWorth: tower.towerWorth + 25000
      })
    },
    {
      name: "Supernova",
      cost: 150000,
      description: "Creates a star-like explosion",
      requires: 5,
      path: 2,
      effect: (tower) => ({
        lingeringDamage: tower.attack * 0.1,
        lingeringRadius: 40,
        lingeringDuration: 8000,
        attack: tower.attack * 2.5,
        explosionRadius: tower.explosionRadius * 2,
        canHitArmored: true,
        canHitStealth: true,
        towerWorth: tower.towerWorth + 150000
      })
    }
    ]};
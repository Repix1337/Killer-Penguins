import { Tower } from "./TowerInterface";
interface TowerUpgrade {
    name: string;
    cost: number;
    description: string;
    path: number;
    effect: (tower: Tower) => Partial<Tower>;
    requires: number; // Previous upgrade level required
  }
export const towerUpgrades: { [key: string]: TowerUpgrade[] } = {
  basic: [
    // Path 1 - Attack Speed focused
    {
      name: "Stealth Tracker",
      cost: 400,
      requires: 0,
      path: 1,
      description: "Grants stealth detection",
      effect: (tower) => ({ 
        canHitStealth: true,
        towerWorth: tower.towerWorth + 400,
        path: 1
      })
    },
    {
      name: "Hyperfire Gear",
      cost: 800,
      description: "Reduces attack interval by 100",
      requires: 1,
      path: 1,
      effect: (tower) => ({ 
        attackInterval: tower.attackInterval - 100,
        towerWorth: tower.towerWorth + 800,
        path: 1
      })
    },
    {
      name: "Twin Fang Arsenal",
      cost: 3000,
      description: "Gains 5% attack speed acceleration and -100 attack interval",
      requires: 2,
      path: 1,
      effect: (tower) => ({ 
        acceleration: true,
        accelerationValue: 0.05,
        attackInterval: tower.attackInterval - 100,
        towerWorth: tower.towerWorth + 2000,
        path: 1
      })
    },
    {
      name: "Blitz Commander",
      cost: 10000,
      description: "10% acceleration, -200 interval, +20% damage",
      requires: 3,
      path: 1,
      effect: (tower) => ({
        acceleration: true,
        accelerationValue: 0.1,
        attackInterval: tower.attackInterval - 200,
        attack: tower.attack * 1.2,
        src: '/basicSpecial.png',
        towerWorth: tower.towerWorth + 15000,
        path: 1
      })
    },
    {
      name: "Tempest Onslaught",
      cost: 25000,
      description: "25% acceleration, -200 interval, +25% damage",
      requires: 4,
      path: 1,
      effect: (tower) => ({
        acceleration: true,
        accelerationValue: 0.25,
        attackInterval: tower.attackInterval - 250,
        attack: tower.attack * 1.25,
        towerWorth: tower.towerWorth + 25000,
        path: 1
      })
    },
    {
      name: "Endless Storm",
      cost: 150000,
      description: "40% acceleration, -225 interval, +100% damage, hits stealth/armored",
      requires: 5,
      path: 1,
      effect: (tower) => ({
        acceleration: true,
        accelerationValue: 0.4,
        attackInterval: tower.attackInterval - 225,
        attack: tower.attack * 2,
        canHitStealth: true,
        canHitArmored: true,
        towerWorth: tower.towerWorth + 150000
      })
    },
      // Path 2 - Heavy Damage focused
      {
        name: "Deadeye Calibration",
        cost: 800,
        requires: 0,
        path: 2,
        description: "+50 damage",
        effect: (tower) => ({
          attack: tower.attack + 50,
          towerWorth: tower.towerWorth + 800
        })
      },
      {
        name: "Impact Core Rounds",
        cost: 2500,
        requires: 1,
        path: 2,
        description: "+50 damage, gains armored damage",
        effect: (tower) => ({
          attack: tower.attack + 50,
          canHitArmored: true,
          towerWorth: tower.towerWorth + 2500
        })
      },
      {
        name: "Execution Shot",
        cost: 6000,
        requires: 2,
        path: 2,
        description: "Double attack, marks enemies (+15% damage), +75 damage",
        effect: (tower) => ({
          attackType: "double",
          canMark: true,
          markedDamageMultiplier: 1.15,
          attack: tower.attack + 75,
          targettingType: "mark",
          towerWorth: tower.towerWorth + 6000
        })
      },
      {
        name: "Annihilator Protocol",
        cost: 15000,
        requires: 3,
        path: 2,
        description: "Mark multiplier 1.3x,-100 interval, +25% damage",
        effect: (tower) => ({
          markedDamageMultiplier: 1.3,
          attack: tower.attack * 1.25,
          attackInterval: tower.attackInterval - 100,
          src: "/basicSpecial2.png",
          towerWorth: tower.towerWorth + 17000
        })
      },
      {
        name: "Tectonic Warhead",
        cost: 25000,
        requires: 4,
        path: 2,
        description: "Mark multiplier 1.6x,-250 interval, +100% damage",
        effect: (tower) => ({
          markedDamageMultiplier: 1.6,
          attack: tower.attack * 2,
          attackInterval: tower.attackInterval - 250,
          towerWorth: tower.towerWorth + 35000
        })
      },
      {
        name: "Armageddon’s Call",
        cost: 150000,
        requires: 5,
        path: 2,
        description: "Mark multiplier 2.25x,-150 interval,+150% damage, hits stealth/armored",
        effect: (tower) => ({
          markedDamageMultiplier: 2.25,
          attack: tower.attack * 1.5,
          attackInterval: tower.attackInterval - 150,
          canHitStealth: true,
          canHitArmored: true,
          towerWorth: tower.towerWorth + 150000
        })
      }
    ],
    sniper: [
        // Path 1 - High Damage/Stun Path
        {
          name: "Hawkeye Calibration",
          cost: 1000,
          requires: 0,
          path: 1,
          description: "+80 damage",
          effect: (tower) => ({
            attack: tower.attack + 80,
            towerWorth: tower.towerWorth + 1000,
            path: 1
          })
        },
        {
          name: "Shock Impact Rounds",
          cost: 1500,
          requires: 1,
          path: 1,
          description: "25% crit chance",
          effect: (tower) => ({
            criticalChance: 0.25,
            towerWorth: tower.towerWorth + 2500,
            path: 1
          })
        },
        {
          name: "Titan Piercer",
          cost: 5000,
          requires: 2,
          path: 1,
          description: "+150 damage, 75ms stun, hits armored",
          effect: (tower) => ({
            canStun: true,
            stunDuration: 75,
            canHitArmored: true,
            attack: tower.attack + 250,
            towerWorth: tower.towerWorth + 5000,
            path: 1
          })
        },
        {
          name: "Colossus Strike",
          cost: 12000,
          requires: 3,
          path: 1,
          description: "2x damage, 50% crit, 150ms stun",
          effect: (tower) => ({
            attack: tower.attack * 2,
            criticalChance: 0.5,
            stunDuration: 150,
            src: '/sniperSpecial.png',
            towerWorth: tower.towerWorth + 12000,
            path: 1
          })
        },
        {
          name: "Oblivion Shot",
          cost: 25000,
          requires: 4,
          path: 1,
          description: "4x damage, 60% crit, 250ms stun",
          effect: (tower) => ({
            attack: tower.attack * 5,
            criticalChance: 0.6,
            stunDuration: 250,
            towerWorth: tower.towerWorth + 25000,
            path: 1
          })
        },
        {
          name: "Omega Executioner",
          cost: 150000,
          requires: 5,
          path: 1,
          description: "5x damage, 80% crit, 500ms stun, hits all types",
          effect: (tower) => ({
            attack: tower.attack * 6,
            criticalChance: 0.8,
            stunDuration: 500,
            canHitStealth: true,
            canHitArmored: true,
            towerWorth: tower.towerWorth + 150000
          })
        },
        
        // Path 2 - Attack Speed Path
        {
          name: "Lightning Reflexes",
          cost: 800,
          requires: 0,
          path: 2,
          description: "-400ms attack interval",
          effect: (tower) => ({
            attackInterval: tower.attackInterval - 300,
            towerWorth: tower.towerWorth + 800,
            path: 2
          })
        },
        {
          name: "Dual Repeater",
          cost: 2000,
          requires: 1,
          path: 2,
          description: "Hits 2 targets, -200ms interval",
          effect: (tower) => ({
            attackType: 'double',
            attackInterval: tower.attackInterval - 300,
            towerWorth: tower.towerWorth + 2000,
            path: 2
          })
        },
        {
          name: "Storm Sniper",
          cost: 4500,
          requires: 2,
          path: 2,
          description: "-300ms attack interval",
          effect: (tower) => ({
            attackInterval: tower.attackInterval - 300,
            towerWorth: tower.towerWorth + 4500,
            path: 2
          })
        },
        {
          name: "Bulletstorm Elite",
          cost: 15000,
          requires: 3,
          path: 2,
          description: "Hits 3 targets, -450ms interval, +30% damage",
          effect: (tower) => ({
            attackType: 'triple',
            attackInterval: tower.attackInterval - 450,
            attack: tower.attack * 1.3,
            src: '/sniperSpecial2.png',
            towerWorth: tower.towerWorth + 15000,
            path: 2
          })
        },
        {
          name: "Hypervelocity Mode",
          cost: 25000,
          requires: 4,
          path: 2,
          description: "-350ms interval, +50% damage",
          effect: (tower) => ({
            attackInterval: tower.attackInterval - 450,
            attack: tower.attack * 1.5,
            towerWorth: tower.towerWorth + 25000,
            path: 2
          })
        },
        {
          name: "Infinity Barrage",
          cost: 150000,
          requires: 5,
          path: 2,
          description: "Hits 4 targets, -220ms interval, +20% damage, hits all types",
          effect: (tower) => ({
            attackType: 'quadruple',
            attackInterval: tower.attackInterval - 120,
            attack: tower.attack * 1.4,
            canHitStealth: true,
            canHitArmored: true,
            towerWorth: tower.towerWorth + 150000
          })
        }
      ],
      rapidShooter: [
        // Path 1 - Multi-Target Path
        {
          name: "Turbo Chamber",
          cost: 500,
          requires: 0,
          path: 1,
          description: "-75ms attack interval",
          effect: (tower) => ({
            attackInterval: tower.attackInterval - 75,
            towerWorth: tower.towerWorth + 500,
            path: 1
          })
        },
        {
          name: "Vortex Precision",
          cost: 1200,
          requires: 1,
          path: 1,
          description: "+15 damage, -50ms interval",
          effect: (tower) => ({
            attack: tower.attack + 15,
            attackInterval: tower.attackInterval - 50,
            towerWorth: tower.towerWorth + 1200,
            path: 1
          })
        },
        {
          name: "Triple Barrage",
          cost: 3500,
          requires: 2,
          path: 1,
          description: "Hits 3 targets, -25ms interval",
          effect: (tower) => ({
            attackType: 'triple',
            attackInterval: tower.attackInterval - 25,
            towerWorth: tower.towerWorth + 3500,
            path: 1
          })
        },
        {
          name: "Quadstrike Arsenal",
          cost: 8000,
          requires: 3,
          path: 1,
          description: "Hits 4 targets, -50ms interval, +10 damage",
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
          name: "Hailstorm Frenzy",
          cost: 25000,
          requires: 4,
          path: 1,
          description: "Executes below 10% HP, -65ms interval, +60% damage",
          effect: (tower) => ({
            canExecute: true,
            executeTreshhold: 10,
            attackInterval: tower.attackInterval - 65,
            attack: tower.attack * 1.6,
            towerWorth: tower.towerWorth + 25000,
            path: 1
          })
        },
        {
          name: "Quantum Flurry",
          cost: 150000,
          requires: 5,
          path: 1,
          description: "Hits 5 targets, executes 20% HP, -40ms interval, +150% damage, hits all types",
          effect: (tower) => ({
            attackInterval: tower.attackInterval - 40,
            executeTreshhold: 20,
            attack: tower.attack * 2.5,
            attackType: 'five',
            canHitArmored: true,
            canHitStealth: true,
            towerWorth: tower.towerWorth + 150000
          })
        },
    
        // Path 2 - Chain Lightning Path
        {
          name: "Electro Charge",
          cost: 800,
          requires: 0,
          path: 2,
          description: "+25 damage, +10% range",
          effect: (tower) => ({
            attack: tower.attack + 25,
            radius: tower.radius * 1.1,
            towerWorth: tower.towerWorth + 800,
            path: 2
          })
        },
        {
          name: "Amplified Arc",
          cost: 1500,
          requires: 1,
          path: 2,
          description: "+15 damage, +20% range, hits stealth",
          effect: (tower) => ({
            radius: tower.radius * 1.2,
            attack: tower.attack + 15,
            canHitStealth: true,
            towerWorth: tower.towerWorth + 1500,
            path: 2
          })
        },
        {
          name: "Storm Surge",
          cost: 4500,
          requires: 2,
          path: 2,
          description: "Chain to 2 targets, 20 range, +20 damage",
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
          name: "Maelstrom Core",
          cost: 12000,
          requires: 3,
          path: 2,
          description: "Chain to 3 targets, 25 range, +40% damage, -25ms interval",
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
          name: "Thunderlord’s Wrath",
          cost: 25000,
          requires: 4,
          path: 2,
          description: "Chain to 4 targets, 30 range, +100% damage, -50ms interval",
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
          name: "Divine Tempest",
          cost: 150000,
          requires: 5,
          path: 2,
          description: "Chain to 6 targets,short stun, 40 range, +200% damage, hits armored",
          effect: (tower) => ({
            chainCount: 6,
            chainRange: 40,
            attack: tower.attack * 3,
            canStun: true,
            stunDuration: 20,
            attackInterval: tower.attackInterval - 25,
            canHitArmored: true,
            towerWorth: tower.towerWorth + 150000
          })
        }
      ],
      slower: [
        // Path 1 - Time Manipulation Path
        {
          name: "Temporal Drag",
          cost: 400,
          requires: 0,
          path: 1,
          description: "Reduces enemy speed to 95%",
          effect: (tower) => ({
            slowAmount: tower.slowAmount ? tower.slowAmount * 0.95 : 0.95,
            towerWorth: tower.towerWorth + 400,
            path: 1
          })
        },
        {
          name: "Reality Distortion",
          cost: 1500,
          requires: 1,
          path: 1,
          description: "Reduces speed to 85%, 3s duration",
          effect: (tower) => ({
            slowAmount: tower.slowAmount ? tower.slowAmount * 0.85 : 0.85,
            slowDuration: 3000,
            towerWorth: tower.towerWorth + 1500,
            path: 1
          })
        },
        {
          name: "Chrono Field",
          cost: 3500,
          requires: 2,
          path: 1,
          description: "AoE slow, 15 radius, 50% slow",
          effect: (tower) => ({
            attackType: 'explosion',
            explosionRadius: 15,
            slowAmount: 0.5,
            src: '/slowerSpecial1.png',
            towerWorth: tower.towerWorth + 3500,
            path: 1
          })
        },
        {
          name: "Dimensional Rift",
          cost: 8000,
          requires: 3,
          path: 1,
          description: "60% slow, 4s duration",
          effect: (tower) => ({
            slowAmount: 0.4,
            slowDuration: 4000,
            towerWorth: tower.towerWorth + 8000,
            path: 1
          })
        },
        {
          name: "Master of Time",
          cost: 20000,
          requires: 4,
          path: 1,
          description: "70% slow, 20 radius, hits stealth",
          effect: (tower) => ({
            explosionRadius: 20,
            slowAmount: 0.3,
            canHitStealth: true,
            towerWorth: tower.towerWorth + 20000,
            path: 1
          })
        },
        {
          name: "Absolute Time Lock",
          cost: 150000,
          requires: 5,
          path: 1,
          description: "85% slow, 22.5 radius, 7s duration, -300ms interval, hits armored",
          effect: (tower) => ({
            explosionRadius: 22.5 ,
            slowAmount: 0.15,
            slowDuration: 7000,
            attackInterval: tower.attackInterval - 300,
            canHitArmored: true,
            towerWorth: tower.towerWorth + 150000
          })
        },
    
        // Path 2 - Freeze Path
        {
          name: "Glacial Touch",
          cost: 600,
          requires: 0,
          path: 2,
          description: "+15 damage",
          effect: (tower) => ({
            attack: tower.attack + 15,
            towerWorth: tower.towerWorth + 600,
            path: 2
          })
        },
        {
          name: "Icy Embrace",
          cost: 1200,
          requires: 1,
          path: 2,
          description: "-250ms attack interval",
          effect: (tower) => ({
            attackInterval: tower.attackInterval - 250,
            towerWorth: tower.towerWorth + 1200,
            path: 2
          })
        },
        {
          name: "Arctic Tempest",
          cost: 4500,
          requires: 2,
          path: 2,
          description: "Aura attack, 250ms stun",
          effect: (tower) => ({
            attackType: 'aura',
            attackInterval: tower.attackInterval + 500,
            canStun: true,
            stunDuration: 250,
            src: '/slowerSpecial2.png',
            towerWorth: tower.towerWorth + 4500,
            path: 2
          })
        },
        {
          name: "Permafrost Surge",
          cost: 12000,
          requires: 3,
          path: 2,
          description: "500ms stun, +30 damage",
          effect: (tower) => ({
            stunDuration: 500,
            attack: tower.attack + 30,
            towerWorth: tower.towerWorth + 12000,
            path: 2
          })
        },
        {
          name: "Frozen Dominion",
          cost: 20000,
          requires: 4,
          path: 2,
          description: "2x damage, 1s stun",
          effect: (tower) => ({
            attack: tower.attack * 2,
            stunDuration: 1000,
            towerWorth: tower.towerWorth + 20000,
            path: 2
          })
        },
        {
          name: "Absolute Zero",
          cost: 150000,
          requires: 5,
          path: 2,
          description: "3x damage, 2.5s stun, +20% range, hits all types",
          effect: (tower) => ({
            attack: tower.attack * 3,
            attackInterval: tower.attackInterval + 1350,
            stunDuration: 2500,
            canHitStealth: true,
            canHitArmored: true,
            radius: tower.radius * 1.2,
            towerWorth: tower.towerWorth + 150000
          })
        }
    ],
    gasspitter: [
        // Path 1 - Poison Damage Path
        {
          name: "Toxic Infusion",
          cost: 400,
          requires: 0,
          path: 1,
          description: "+25 poison damage",
          effect: (tower) => ({
            poisonDamage: tower.poisonDamage + 25,
            towerWorth: tower.towerWorth + 400,
            path: 1
          })
        },
        {
          name: "Plagueborn Essence",
          cost: 1200,
          requires: 1,
          path: 1,
          description: "+30 poison damage",
          effect: (tower) => ({
            poisonDamage: tower.poisonDamage + 30,
            towerWorth: tower.towerWorth + 1200,
            path: 1
          })
        },
        {
          name: "Venom Pools",
          cost: 3000,
          requires: 2,
          path: 1,
          description: "Creates puddles dealing 3% poison damage, 15 radius, 2.5s duration",
          effect: (tower) => ({
            hasLingering: true,
            attackType: 'lingering',
            lingeringDamage: tower.poisonDamage * 0.03,
            lingeringRadius: 15,
            attackInterval: tower.attackInterval + 1200,
            lingeringDuration: 2500,
            lingeringColor: 'rgba(0, 255, 0, 0.5)',
            towerWorth: tower.towerWorth + 3000
          })
        },
        {
          name: "Mutagenic Corruption",
          cost: 10000,
          requires: 3,
          path: 1,
          description: "3x poison damage, 20 radius, hits stealth",
          effect: (tower) => ({
            poisonDamage: tower.poisonDamage * 3,
            lingeringRadius: 20,
            canHitStealth: true,
            towerWorth: tower.towerWorth + 8000,
            path: 1
          })
        },
        {
          name: "Biohazard Warfare",
          cost: 25000,
          requires: 4,
          path: 1,
          description: "2.5x poison, 6% puddle damage, 3s duration, +50% damage",
          effect: (tower) => ({
            poisonDamage: tower.poisonDamage * 2.5,
            lingeringDamage: tower.poisonDamage * 0.06,
            lingeringDuration: 3000,
            attack: tower.attack * 1.5,
            src: '/gasSpitterSpecial1.png',
            towerWorth: tower.towerWorth + 15000,
            path: 1
          })
        },
        {
          name: "Doomsday Pathogen",
          cost: 150000,
          requires: 5,
          path: 1,
          description: "5x poison, 11% puddle damage, 25 radius, 4s duration, hits all",
          effect: (tower) => ({
            poisonDamage: tower.poisonDamage * 5,
            attack: tower.attack * 2,
            lingeringRadius: 25,
            lingeringDuration: 4000,
            lingeringDamage: tower.poisonDamage * 0.11,
            canHitArmored: true,
            canHitStealth: true,
            towerWorth: tower.towerWorth + 150000
          })
        },
        
        // Path 2 - Gas Cloud Path
        {
          name: "Expansive Fumes",
          cost: 600,
          requires: 0,
          path: 2,
          description: "+20% attack radius",
          effect: (tower) => ({
            radius: tower.radius * 1.2,
            towerWorth: tower.towerWorth + 600,
            path: 2
          })
        },
        {
          name: "Toxic Jetstreams",
          cost: 2000,
          requires: 1,
          path: 2,
          description: "-200ms interval, +20% range, stops regen",
          effect: (tower) => ({
            attackInterval: tower.attackInterval - 200,
            canStopRegen: true,
            radius: tower.radius * 1.2,
            towerWorth: tower.towerWorth + 2000,
            path: 2
          })
        },
        {
          name: "Necrotic Haze",
          cost: 4500,
          requires: 2,
          path: 2,
          description: "2x poison damage, +1s duration",
          effect: (tower) => ({
            poisonDamage: tower.poisonDamage * 2,
            poisonDuration: (tower.poisonDuration ?? 4000) + 1000,
            towerWorth: tower.towerWorth + 4500,
            path: 2
          })
        },
        {
          name: "Plague Winds",
          cost: 12000,
          requires: 3,
          path: 2,
          description: "3x poison damage, +1s duration",
          effect: (tower) => ({
            poisonDamage: tower.poisonDamage * 3,
            poisonDuration: (tower.poisonDuration ?? 4000) + 1000,
            towerWorth: tower.towerWorth + 12000,
            src: '/gasSpitterSpecial2.png',
            path: 2
          })
        },
        {
          name: "Chemical Hellstorm",
          cost: 20000,
          requires: 4,
          path: 2,
          description: "4x poison damage, 2x boss damage",
          effect: (tower) => ({
            poisonDamage: tower.poisonDamage * 4,
            bossDamageMultiplier: 2,
            towerWorth: tower.towerWorth + 20000,
            path: 2
          })
        },
        {
          name: "World’s End Plague",
          cost: 150000,
          requires: 5,
          path: 2,
          description: "6x poison, 8x boss damage, +2s duration, 2x attack speed",
          effect: (tower) => ({
            poisonDamage: tower.poisonDamage * 6,
            bossDamageMultiplier: 8,
            poisonDuration: (tower.poisonDuration ?? 4000) + 2000,
            attackInterval: tower.attackInterval / 2,
            towerWorth: tower.towerWorth + 150000
          })
        }
  ],
  mortar: [
    // Path 1 - High Damage Explosions
    {
      name: "Blastwave Shells",
      cost: 800,
      requires: 0,
      path: 1,
      description: "+200 damage",
      effect: (tower) => ({
        attack: tower.attack + 150,
        towerWorth: tower.towerWorth + 800,
        path: 1
      })
    },
    {
      name: "Obliterator Rounds",
      cost: 1500,
      requires: 1,
      path: 1,
      description: "+200 damage, +20% radius",
      effect: (tower) => ({
        explosionRadius: tower.explosionRadius * 1.2,
        attack: tower.attack + 200,
        towerWorth: tower.towerWorth + 2000,
        path: 1
      })
    },
    {
      name: "Thermobaric Devastation",
      cost: 4000,
      requires: 2,
      path: 1,
      description: "+50% damage",
      effect: (tower) => ({
        attack: tower.attack * 2,
        towerWorth: tower.towerWorth + 4500,
        path: 1
      })
    },
    {
      name: "Napalm Storm",
      cost: 8000,
      requires: 3,
      path: 1,
      description: "+75% damage, +15% radius, 2x boss damage, hits stealth",
      effect: (tower) => ({
        attack: tower.attack * 1.75,
        explosionRadius: tower.explosionRadius * 1.15,
        bossDamageMultiplier: 2,
        src: '/mortarSpecial.png',
        canHitStealth: true,
        towerWorth: tower.towerWorth + 8000,
        path: 1
      })
    },
    {
      name: "Cataclysmic Strike",
      cost: 25000,
      requires: 4,
      path: 1,
      description: "2x damage, +20% radius, -500ms interval, 5x boss damage",
      effect: (tower) => ({
        attack: tower.attack * 2,
        explosionRadius: tower.explosionRadius * 1.2,
        attackInterval: tower.attackInterval - 500,
        bossDamageMultiplier: 6,
        criticalChance: 0.3,
        criticalMultiplier: 2,
        towerWorth: tower.towerWorth + 30000,
        path: 1
      })
    },
    {
      name: "Extinction Cannon",
      cost: 150000,
      requires: 5,
      path: 1,
      description: "3x damage, +30% radius, hits all types",
      effect: (tower) => ({
        attack: tower.attack * 3,
        explosionRadius: tower.explosionRadius * 1.3,
        attackInterval: tower.attackInterval - 1250,
        bossDamageMultiplier: 12,
        canHitStealth: true,
        towerWorth: tower.towerWorth + 150000
      })
    },

    // Path 2 - Health Reduction
    {
      name: "Enhanced Explosives",
      cost: 1000,
      requires: 0,
      path: 2,
      description: "+10% radius, hits stealth",
      effect: (tower) => ({
        explosionRadius: tower.explosionRadius * 1.1,
        canHitStealth: true,
        towerWorth: tower.towerWorth + 1000,
        path: 2
      })
    },
    {
      name: "Precision Targeting",
      cost: 2500,
      requires: 1,
      path: 2,
      description: "-500ms interval, +20% radius",
      effect: (tower) => ({
        attackInterval: tower.attackInterval - 500,
        explosionRadius: tower.explosionRadius * 1.2,
        towerWorth: tower.towerWorth + 2500,
        path: 2
      })
    },
    {
      name: "Cellular Disruption",
      cost: 5000,
      requires: 2,
      path: 2,
      description: "-5% enemy max HP, +50 damage",
      effect: (tower) => ({
        healthReduction: 0.05, // Reduces max HP by 15%
        attack: tower.attack + 50,
        towerWorth: tower.towerWorth + 5000,
        path: 2
      })
    },
    {
      name: "Degenerative Payload",
      cost: 10000,
      requires: 3,
      path: 2,
      description: "-10% enemy HP, +120 damage, 150ms stun",
      effect: (tower) => ({
        healthReduction: 0.1,
        attack: tower.attack + 120,
        canStun: true,
        stunDuration: 150,
        src: '/mortarSpecial2.png',
        towerWorth: tower.towerWorth + 12000,
        path: 2
      })
    },
    {
      name: "Entropic Bombardment",
      cost: 22500,
      requires: 4,
      path: 2,
      description: "-15% HP, +60% damage, 250ms stun",
      effect: (tower) => ({
        healthReduction: 0.15,
        explosionRadius: tower.explosionRadius * 1.15,
        attackInterval: tower.attackInterval - 1000,
        stunDuration: 250,
        attack: tower.attack * 1.6,
        towerWorth: tower.towerWorth + 25000,
        path: 2
      })
    },
    {
      name: "Existential Decay",
      cost: 150000,
      requires: 5,
      path: 2,
      description: "-22.5% HP, 3x damage, 500ms stun, -1.5s interval",
      effect: (tower) => ({
        healthReduction: 0.225,
        attackInterval: tower.attackInterval - 1500,
        explosionRadius: tower.explosionRadius * 1.25,
        stunDuration: 500,
        attack: tower.attack * 3,
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
      description: "+50 damage",
      effect: (tower) => ({
        attack: tower.attack + 50,
        towerWorth: tower.towerWorth + 800
      })
    },
    {
      name: "Piercing Devastator",
      cost: 2000,
      requires: 1,
      path: 1,
      description: "+125 damage",
      effect: (tower) => ({
        attack: tower.attack + 125,
        towerWorth: tower.towerWorth + 2000
      })
    },
    {
      name: "Uranium Core Shells",
      cost: 4500,
      requires: 2,
      path: 1,
      description: "+50% damage, 30% crit (2.5x)",
      effect: (tower) => ({
        attack: tower.attack * 1.5,
        hasCritical: true,
        criticalChance: 0.3,
        criticalMultiplier: 2.5,
        towerWorth: tower.towerWorth + 4500
      })
    },
    {
      name: "Titan Breaker",
      cost: 8000,
      requires: 3,
      path: 1,
      description: "2x damage, 40% crit (3x), -500ms interval",
      effect: (tower) => ({
        attack: tower.attack * 2,
        criticalChance: 0.4,
        criticalMultiplier: 3,
        attackInterval: tower.attackInterval - 500,
        src: '/cannonSpecial.png',
        towerWorth: tower.towerWorth + 8000
      })
    },
    {
      name: "Siege Annihilator",
      cost: 25000,
      requires: 4,
      path: 1,
      description: "2.5x damage, 50% crit (4x), 100ms stun, hits stealth",
      effect: (tower) => ({
        attack: tower.attack * 2.5,
        canStun: true,
        stunDuration: 100,
        criticalChance: 0.5,
        criticalMultiplier: 4,
        canHitStealth: true,
        towerWorth: tower.towerWorth + 25000
      })
    },
    {
      name: "World Shatterer",
      cost: 150000,
      requires: 5,
      path: 1,
      description: "3x damage, 60% crit (5x), 250ms stun, -500ms interval",
      effect: (tower) => ({
        attack: tower.attack * 3,
        criticalChance: 0.6,
        criticalMultiplier: 5,
        stunDuration: 250,
        canHitStealth: true,
        attackInterval: tower.attackInterval - 500,
        towerWorth: tower.towerWorth + 150000
      })
    },

    // Path 2 - Anti-Group Specialist
    {
      name: "Shockwave Payload",
      cost: 1000,
      requires: 0,
      path: 2,
      description: "+20% explosion radius",
      effect: (tower) => ({
        explosionRadius: tower.explosionRadius * 1.2,
        towerWorth: tower.towerWorth + 1000
      })
    },
    {
      name: "Cluster Armageddon",
      cost: 2500,
      requires: 1,
      path: 2,
      description: "+30% radius, -300ms interval, +15 damage",
      effect: (tower) => ({
        explosionRadius: tower.explosionRadius * 1.3,
        attackInterval: tower.attackInterval - 300,
        attack: tower.attack + 15,
        towerWorth: tower.towerWorth + 2500
      })
    },
    {
      name: "Infernal Rain",
      cost: 5000,
      requires: 2,
      path: 2,
      description: "3% DoT, 13 radius, 2.5s duration, +75 damage",
      effect: (tower) => ({
        hasLingering: true,
        lingeringDamage: tower.attack * 0.03,
        lingeringRadius: 13,
        attackInterval: tower.attackInterval + 1000,
        lingeringDuration: 2500,
        attack: tower.attack + 75,
        explosionRadius: tower.explosionRadius * 1.3,
        towerWorth: tower.towerWorth + 5000
      })
    },
    {
      name: "Hellstorm Barrage",
      cost: 12000,
      requires: 3,
      path: 2,
      description: "18 radius, 3s duration, +50% damage, 1% current HP damage",
      effect: (tower) => ({
        lingeringRadius: 18,
        lingeringDuration: 3000,
        attack: tower.attack * 1.25,
        lingeringDamage: tower.attack * 0.03,
        enemyCurrentHpDmgMultiplier: 0.01, 
        explosionRadius: tower.explosionRadius * 1.4,
        src: '/cannonSpecial2.png',
        towerWorth: tower.towerWorth + 12000
      })
    },
    {
      name: "Solar Cataclysm",
      cost: 25000,
      requires: 4,
      path: 2,
      description: "22 radius, 3.5s duration, 2x damage, 3% HP damage, hits armored",
      effect: (tower) => ({
        lingeringRadius: 22,
        lingeringDuration: 3500,
        attack: tower.attack * 1.5,
        lingeringDamage: tower.attack * 0.03,
        explosionRadius: tower.explosionRadius * 1.5,
        canHitArmored: true,
        enemyCurrentHpDmgMultiplier: 0.03, 
        towerWorth: tower.towerWorth + 25000
      })
    },
    {
      name: "Supernova Detonation",
      cost: 150000,
      requires: 5,
      path: 2,
      description: "27 radius, 4.5s duration, 2.5x damage, 6% HP damage, hits all",
      effect: (tower) => ({
        lingeringDamage: tower.attack * 0.03,
        lingeringRadius: 27,
        lingeringDuration: 4500,
        attack: tower.attack * 2,
        enemyCurrentHpDmgMultiplier: 0.06, 
        explosionRadius: tower.explosionRadius * 2,
        canHitArmored: true,
        canHitStealth: true,
        towerWorth: tower.towerWorth + 150000
      })
    }
  ]
};
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
  bossDamageMultiplier?: number;
  canExecute? : boolean;
  executeTreshhold?: number;
  acceleration?: boolean
  accelerationValue?: number
  canMark?: boolean
  markedDamageMultiplier?: number
}

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
      description: "This upgrade enables the tower to detect and attack stealth units, ensuring no enemy goes undetected.",
      effect: (tower) => ({ 
        canHitStealth: true,
        towerWorth: tower.towerWorth + 400,
        path: 1
      })
    },
    {
      name: "Hyperfire Gear",
      cost: 800,
      description: "Reduces the tower's attack interval significantly, allowing for faster, more frequent shots to overwhelm enemies.",
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
      cost: 3000,
      description: "make the attacks faster and better against tanks.",
      requires: 2,
      path: 1,
      effect: (tower) => ({ 
        acceleration: true,
        accelerationValue: 0.1,
        attackInterval: tower.attackInterval - 250,
        towerWorth: tower.towerWorth + 2000,
        path: 1
      })
    },
    {
      name: "Blitz Commander",
      cost: 10000,
      description: "Unleashes a rapid barrage with extreme speed, quickly overwhelming even the toughest of enemies.",
      requires: 3,
      path: 1,
      effect: (tower) => ({
        acceleration: true,
        accelerationValue: 0.2,
        attackInterval: tower.attackInterval - 250,
        attack: tower.attack * 1.2,
        src: '/basicSpecial.png',
        towerWorth: tower.towerWorth + 15000,
        path: 1
      })
    },
    {
      name: "Tempest Onslaught",
      cost: 25000,
      description: "Achieves a near-instant fire rate, allowing the tower to bombard enemies with continuous, rapid-fire destruction.",
      requires: 4,
      path: 1,
      effect: (tower) => ({
        acceleration: true,
        accelerationValue: 0.35,
        attackInterval: tower.attackInterval - 100,
        attack: tower.attack * 1.25,
        towerWorth: tower.towerWorth + 25000,
        path: 1
      })
    },
    {
      name: "Endless Storm",
      cost: 150000,
      description: "Transforms the tower into an unstoppable force, with an unrelenting stream of rapid-fire shots that can pierce through all defenses, including stealth and armored units.",
      requires: 5,
      path: 1,
      effect: (tower) => ({
        acceleration: true,
        accelerationValue: 0.5,
        attackInterval: tower.attackInterval - 35,
        attack: tower.attack * 1.5,
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
        description: "Enhances precision, increasing damage.",
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
        description: "Specialized rounds pierce an additional enemy and can now penetrate armored targets.",
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
        description: "Shots now mark enemies and amplify dmg done by other towers to that enemy.",
        effect: (tower) => ({
          attackType: "double",
          canMark: true,
          markedDamageMultiplier: 1.15,
          attack: tower.attack + 75,
          towerWorth: tower.towerWorth + 6000
        })
      },
      {
        name: "Annihilator Protocol",
        cost: 17000,
        requires: 3,
        path: 2,
        description: "Marked enemies are even weaker.",
        effect: (tower) => ({
          markedDamageMultiplier: 1.3,
          attack: tower.attack * 1.5,
          src: "/basicSpecial2.png",
          towerWorth: tower.towerWorth + 17000
        })
      },
      {
        name: "Tectonic Warhead",
        cost: 35000,
        requires: 4,
        path: 2,
        description: "Shots gain immense power, increasing overall damage. Marked enemies take significantly more damage.",
        effect: (tower) => ({
          markedDamageMultiplier: 1.6,
          attack: tower.attack * 2.25,
          towerWorth: tower.towerWorth + 35000
        })
      },
      {
        name: "Armageddon’s Call",
        cost: 150000,
        requires: 5,
        path: 2,
        description: "Unleashes absolute destruction—marked enemies suffer catastrophic fate, attacks triple in power, and all defenses are bypassed.",
        effect: (tower) => ({
          markedDamageMultiplier: 2.25,
          attack: tower.attack * 2.5,
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
          description: "Enhances precision for increased base damage.",
          effect: (tower) => ({
            attack: tower.attack + 80,
            towerWorth: tower.towerWorth + 1000,
            path: 1
          })
        },
        {
          name: "Shock Impact Rounds",
          cost: 2500,
          requires: 1,
          path: 1,
          description: "Better rounds.",
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
          description: "Armor-piercing rounds with +150 damage.",
          effect: (tower) => ({
            canStun: true,
            stunDuration: 75,
            canHitArmored: true,
            attack: tower.attack + 150,
            towerWorth: tower.towerWorth + 5000,
            path: 1
          })
        },
        {
          name: "Colossus Strike",
          cost: 12000,
          requires: 3,
          path: 1,
          description: "40% chance to stun with doubled damage.",
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
          description: "Massive damage with guaranteed stun.",
          effect: (tower) => ({
            attack: tower.attack * 4,
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
          description: "Perfect accuracy with godlike destructive force.",
          effect: (tower) => ({
            attack: tower.attack * 8,
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
          description: "Reduces reload time for faster firing.",
          effect: (tower) => ({
            attackInterval: tower.attackInterval - 400,
            towerWorth: tower.towerWorth + 800,
            path: 2
          })
        },
        {
          name: "Dual Repeater",
          cost: 2000,
          requires: 1,
          path: 2,
          description: "Targets two enemies per shot.",
          effect: (tower) => ({
            attackType: 'double',
            attackInterval: tower.attackInterval - 200,
            towerWorth: tower.towerWorth + 2000,
            path: 2
          })
        },
        {
          name: "Storm Sniper",
          cost: 4500,
          requires: 2,
          path: 2,
          description: "Fires at three targets with increased speed.",
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
          description: "Extremely rapid-fire shots with increased damage.",
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
          description: "Quad-shot bursts with unparalleled speed.",
          effect: (tower) => ({
            attackInterval: tower.attackInterval - 350,
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
          description: "A relentless storm of unstoppable firepower.",
          effect: (tower) => ({
            attackType: 'quadruple',
            attackInterval: tower.attackInterval - 160,
            attack: tower.attack * 1.2,
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
          description: "Enhances firing speed by reducing attack interval.",
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
          description: "Increases both damage and attack speed for efficiency.",
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
          description: "Allows the tower to fire at three targets simultaneously.",
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
          description: "Expands targeting to four enemies with improved speed.",
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
          description: "Unleashes a blizzard of bullets at extreme velocity and allow tower to execute.",
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
          description: "Attacks at incomprehensible speeds, overwhelming enemies.",
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
          description: "Infuses attacks with electricity, slightly increasing damage.",
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
          description: "Extends attack range, damage, and adds stealth detection.",
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
          description: "Lightning attacks chain to two additional enemies.",
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
          description: "Lightning now jumps to three enemies with increased power.",
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
          description: "Maximum chaining potential with devastating electric force.",
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
          description: "A godlike storm of lightning obliterates all enemies.",
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
        // Path 1 - Time Manipulation Path
        {
          name: "Temporal Drag",
          cost: 400,
          requires: 0,
          path: 1,
          description: "Enhances slow effect, reducing enemy speed further.",
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
          description: "Extends the slow effect and duration for greater impact.",
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
          description: "Creates an area that slows all enemies within its reach.",
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
          description: "Expands slow radius and amplifies its effect.",
          effect: (tower) => ({
            explosionRadius: 20,
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
          description: "Achieves near-total enemy immobilization.",
          effect: (tower) => ({
            explosionRadius: 25,
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
          description: "Bends reality itself, nearly stopping enemies entirely.",
          effect: (tower) => ({
            explosionRadius: 35,
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
          description: "Adds frost damage to slow and weaken enemies.",
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
          description: "Speeds up freeze application on enemies.",
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
          description: "Unleashes a fierce frost storm.",
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
          description: "Freezes more.",
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
          description: "Absolute freezing control over the battlefield.",
          effect: (tower) => ({
            attack: tower.attack * 2,
            stunDuration: 1000,
            attackInterval: tower.attackInterval + 750,
            towerWorth: tower.towerWorth + 20000,
            path: 2
          })
        },
        {
          name: "Absolute Zero",
          cost: 150000,
          requires: 5,
          path: 2,
          description: "A frost-bound apocalypse, freezing all in its wake.",
          effect: (tower) => ({
            attack: tower.attack * 3,
            attackInterval: tower.attackInterval + 2500,
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
          description: "Enhances poison potency, increasing damage over time.",
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
          description: "Extends poison duration for prolonged suffering.",
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
          description: "Creates acidic puddles that deal continuous damage.",
          effect: (tower) => ({
            attackType: 'lingering',
            lingeringDamage: tower.poisonDamage * 0.04,
            lingeringRadius: 15,
            attackInterval: tower.attackInterval + 1200,
            lingeringDuration: 2500,
            lingeringColor: 'rgba(0, 255, 0, 0.5)',
            towerWorth: tower.towerWorth + 3000
          })
        },
        {
          name: "Mutagenic Corruption",
          cost: 8000,
          requires: 3,
          path: 1,
          description: "Hyper-toxic venom.",
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
          cost: 15000,
          requires: 4,
          path: 1,
          description: "Unleashes extreme poison devastation.",
          effect: (tower) => ({
            poisonDamage: tower.poisonDamage * 3,
            lingeringDamage: tower.poisonDamage * 0.08,
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
          description: "A lethal biological weapon that dissolves all.",
          effect: (tower) => ({
            poisonDamage: tower.poisonDamage * 4,
            attack: tower.attack * 2,
            lingeringRadius: 25,
            lingeringDuration: 4000,
            lingeringDamage: tower.poisonDamage * 0.15,
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
          description: "Increases attack radius and poison dispersion.",
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
          description: "Speeds up poison dispersion for a wider spread (disable enemy regen).",
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
          description: "Creates deadly poison clouds upon impact.",
          effect: (tower) => ({
            poisonDamage: tower.poisonDamage * 2,
            towerWorth: tower.towerWorth + 4500,
            path: 2
          })
        },
        {
          name: "Plague Winds",
          cost: 12000,
          requires: 3,
          path: 2,
          description: "Expands poison cloud size and adds slowing effects.",
          effect: (tower) => ({
            poisonDamage: tower.poisonDamage * 3,
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
          description: "Unleashes maximum area control with toxic devastation.",
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
          description: "A poisonous miasma engulfs the battlefield.",
          effect: (tower) => ({
            poisonDamage: tower.poisonDamage * 6,
            bossDamageMultiplier: 8,
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
      description: "Enhances explosion power, dealing increased damage.",
      effect: (tower) => ({
        attack: tower.attack + 100,
        explosionRadius: tower.explosionRadius * 1.1,
        towerWorth: tower.towerWorth + 800,
        path: 1
      })
    },
    {
      name: "Obliterator Rounds",
      cost: 1500,
      requires: 1,
      path: 1,
      description: "Massively enhances explosion damage and impact.",
      effect: (tower) => ({
        explosionRadius: tower.explosionRadius * 1.2,
        attack: tower.attack * 1.3,
        towerWorth: tower.towerWorth + 2000,
        path: 1
      })
    },
    {
      name: "Thermobaric Devastation",
      cost: 4000,
      requires: 2,
      path: 1,
      description: "Extreme explosive force with amplified radius.",
      effect: (tower) => ({
        attack: tower.attack * 1.5,
        towerWorth: tower.towerWorth + 4500,
        path: 1
      })
    },
    {
      name: "Napalm Storm",
      cost: 8000,
      requires: 3,
      path: 1,
      description: "Explosions leave fiery destruction in their wake.",
      effect: (tower) => ({
        attack: tower.attack * 1.75,
        explosionRadius: tower.explosionRadius * 1.3,
        bossDamageMultiplier: 1.25,
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
      description: "Unleashes nuclear-level devastation.",
      effect: (tower) => ({
        attack: tower.attack * 2.5,
        explosionRadius: tower.explosionRadius * 1.4,
        bossDamageMultiplier: 1.5,
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
      description: "Apocalyptic blasts erase everything in their path.",
      effect: (tower) => ({
        attack: tower.attack * 5,
        explosionRadius: tower.explosionRadius * 2,
        attackInterval: tower.attackInterval - 1000,
        criticalChance: 0.5,
        bossDamageMultiplier: 3,
        criticalMultiplier: 5,
        canHitStealth: true,
        towerWorth: tower.towerWorth + 150000
      })
    },

    // Path 2 - Tactical Support
    {
      name: "EMP Shock",
      cost: 1000,
      requires: 0,
      path: 2,
      description: "Shells temporarily disable enemy movement.",
      effect: (tower) => ({
        canStun: true,
        stunDuration: 100,
        explosionRadius: tower.explosionRadius * 1.1,
        towerWorth: tower.towerWorth + 1000,
        path: 2
      })
    },
    {
      name: "Cryo Payload",
      cost: 2500,
      requires: 1,
      path: 2,
      description: "Freezing explosions drastically slow enemies.",
      effect: (tower) => ({
        slowAmount: 0.7,
        slowDuration: 2000,
        explosionRadius: tower.explosionRadius * 1.2,
        towerWorth: tower.towerWorth + 2500,
        path: 2
      })
    },
    {
      name: "Seismic Bombardment",
      cost: 5000,
      requires: 2,
      path: 2,
      description: "Massive control effects slow and stun enemies.",
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
      name: "Thunderous Reckoning",
      cost: 10000,
      requires: 3,
      path: 2,
      description: "Unleashes devastating waves of disruption.",
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
      name: "Tactical Superiority",
      cost: 22500,
      requires: 4,
      path: 2,
      description: "The battlefield bends to your command.",
      effect: (tower) => ({
        explosionRadius: tower.explosionRadius * 1.5,
        attack: tower.attack * 1.5,
        slowAmount: 0.4,
        slowDuration: 2000,
        canHitStealth: true,
        towerWorth: tower.towerWorth + 25000,
        path: 2
      })
    },
    {
      name: "Commander's Wrath",
      cost: 150000,
      requires: 5,
      path: 2,
      description: "Unstoppable control, rendering enemies helpless.",
      effect: (tower) => ({
        explosionRadius: tower.explosionRadius * 2,
        attack: tower.attack * 2.5,
        slowAmount: 0.3,
        slowDuration: 4000,
        stunDuration: 1200,
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
      description: "Enhances firepower, increasing base damage.",
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
      description: "Specialized anti-armor rounds for maximum penetration.",
      effect: (tower) => ({
        attack: tower.attack + 75,
        hasCritical: true,
        criticalChance: 0.2,
        criticalMultiplier: 2,
        towerWorth: tower.towerWorth + 2000
      })
    },
    {
      name: "Uranium Core Shells",
      cost: 4500,
      requires: 2,
      path: 1,
      description: "Extreme armor penetration with increased damage output.",
      effect: (tower) => ({
        attack: tower.attack * 1.5,
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
      description: "Devastating firepower specialized in destroying massive enemies.",
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
      description: "The pinnacle of anti-armor weaponry.",
      effect: (tower) => ({
        attack: tower.attack * 2,
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
      description: "An unstoppable force that obliterates everything in its path.",
      effect: (tower) => ({
        attack: tower.attack * 3.5,
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
      description: "Expands explosion radius, affecting more enemies.",
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
      description: "Creates multiple small but powerful explosions.",
      effect: (tower) => ({
        explosionRadius: tower.explosionRadius * 1.3,
        attackInterval: tower.attackInterval - 125,
        attack: tower.attack + 15,
        towerWorth: tower.towerWorth + 2500
      })
    },
    {
      name: "Infernal Rain",
      cost: 5000,
      requires: 2,
      path: 2,
      description: "Explosions ignite the battlefield with lingering fire damage.",
      effect: (tower) => ({
        hasLingering: true,
        lingeringDamage: tower.attack * 0.03,
        lingeringRadius: 13,
        attackInterval: tower.attackInterval + 1000,
        lingeringDuration: 3000,
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
      description: "Devastating explosive payloads leave scorched earth behind.",
      effect: (tower) => ({
        lingeringRadius: 18,
        lingeringDuration: 4000,
        attack: tower.attack * 1.4,
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
      description: "Harnesses the power of a miniature sun to incinerate enemies.",
      effect: (tower) => ({
        lingeringRadius: 22,
        lingeringDuration: 5000,
        attack: tower.attack * 1.5,
        explosionRadius: tower.explosionRadius * 1.5,
        canHitArmored: true,
        towerWorth: tower.towerWorth + 25000
      })
    },
    {
      name: "Supernova Detonation",
      cost: 150000,
      requires: 5,
      path: 2,
      description: "Unleashes an explosion of cosmic proportions.",
      effect: (tower) => ({
        lingeringDamage: tower.attack * 0.06,
        lingeringRadius: 25,
        lingeringDuration: 6000,
        attack: tower.attack * 2,
        explosionRadius: tower.explosionRadius * 2,
        canHitArmored: true,
        canHitStealth: true,
        towerWorth: tower.towerWorth + 150000
      })
    }
  ]
};
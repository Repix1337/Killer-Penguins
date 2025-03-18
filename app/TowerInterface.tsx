interface Tower {
    id: string;
    positionX: number;
    positionY: number;
    damageDone: number;
    baseAttackInterval: number;
    baseAttack: number;
    attack: number;
    attackInterval: number; // renamed from attackSpeed
    furthestEnemyInRange: Enemy[] | null;
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
    markedExplosion?: boolean
    enemyCurrentHpDmgMultiplier?: number
    healthReduction?: number
  
  }
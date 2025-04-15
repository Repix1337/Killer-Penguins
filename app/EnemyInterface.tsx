export type EnemyType = "SPEEDYMEGATANK" | "SPEEDYGIGATANK" | "MEGABOSS" | "BASIC" | "STEALTH" | 
                "TANK" | "SPEEDY" | "STEALTHYTANK" | "STEALTHYSPEEDY" | "REGENTANK" | 
                "SPEEDYREGENTANK" | "BOSS" | "ULTRATANKS" | "ARMOREDSPEEDYMEGATANK" | 
                "MEGABOSSSPAWNER" | 
                string;

export interface Enemy {
    id: string;
    positionX: number;
    positionY: number;
    hp: number;
    maxHp: number;
    speed: number;
    baseSpeed: number;
    isSlowed: boolean;
    slowReduction: number;
    slowValue?: number;
    slowSourceId?: string;
    slowStartTime?: number;
    damage: number;
    src: string;
    type: EnemyType;
    regen: number;
    isTargeted: boolean;  
    isPoisoned: boolean;
    poisonSourceId?: string;
    poisonStartTime?: number;
    canRegen: boolean;
    isArmored: boolean;
    isStunned: boolean;
    stunReduction: number;
    stunSourceId?: string;
    stunStartTime?: number;
    stunDuration?: number;
    canSpawn?: boolean;
    spawnType?: "SPEEDYMEGATANK" | "SPEEDYGIGATANK" | "BASIC" | "STEALTH" | "TANK" | 
"SPEEDY" | "STEALTHYTANK" | "STEALTHYSPEEDY" | "REGENTANK" | 
"SPEEDYREGENTANK" | "BOSS" | "ULTRATANKS" | "MEGABOSSSPAWNER" | "ARMOREDSPEEDYMEGATANK";
    executed: boolean;
    acceleratedHitCount: number;
    accelerationValue?: number;
    marked: boolean;
    markedDamageMultiplier?: number;
    markedExplosion?: boolean;
    hasReducedHealth: boolean;
}

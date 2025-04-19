export interface AttackEffect {
    id: string;
    towerPositionX: number;
    towerPositionY: number;
    enemyPositionX: number;
    enemyPositionY: number;
    timestamp: number;
    effectSrc: string;
  }
  
  export interface ExplosionEffect {
    id: string;
    positionX: number;
    positionY: number;
    timestamp: number;
    sourceId: string;
  }
  
  export interface LingeringEffect {
    id: string;
    positionX: number;
    positionY: number;
    damage: number;
    enemyCurrentHpDmgMultiplier: number;
    radius: number;
    timestamp: number;
    duration: number;
    canStopRegen: boolean;
    color: string;
    towerId: string;
  }
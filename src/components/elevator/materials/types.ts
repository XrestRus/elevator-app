import * as THREE from 'three';

/**
 * Расширенные параметры для физического материала
 */
export type ExtendedMaterialParameters = THREE.MeshStandardMaterialParameters & { 
  anisotropy?: number; 
  anisotropyRotation?: number;
  transmission?: number;
  refractionRatio?: number;
  ior?: number;
  emissive?: THREE.Color;
  emissiveIntensity?: number;
};

/**
 * Параметры для эффекта свечения (эмиссии)
 */
export interface EmissionProps {
  value: number;
  color: string;
  enabled: boolean;
}

/**
 * Параметры для эффекта прозрачности
 */
export interface TransparencyProps {
  value: number;
  enabled: boolean;
}

/**
 * Параметры для эффекта преломления
 */
export interface RefractionProps {
  value: number;
  enabled: boolean;
}

/**
 * Параметры для эффекта анизотропии
 */
export interface AnisotropyProps {
  value: number;
  direction: number;
  enabled: boolean;
}

/**
 * Интерфейс результата хука useMaterialsManager
 */
export interface MaterialsManagerResult {
  actualWallMaterial: THREE.Material;
  actualFloorMaterial: THREE.Material;
  actualCeilingMaterial: THREE.Material;
  actualDoorMaterial: THREE.Material;
  actualFrontWallMaterial: THREE.Material;
  sideWallMaterial: THREE.Material;
  backWallMaterial: THREE.Material;
  handrailMaterial: THREE.Material;
  decorationStripesMaterial: THREE.Material | null;
  jointStripeMaterial: THREE.Material | null;
}

/**
 * Интерфейс результата хука useTexturesManager
 */
export interface TexturesManagerResult {
  wallTextures: Record<string, THREE.Texture>;
  floorTextures: Record<string, THREE.Texture>;
  ceilingTextures: Record<string, THREE.Texture>;
  doorsTextures: Record<string, THREE.Texture>;
  frontWallTextures: Record<string, THREE.Texture>;
  wallPBRMaterial: THREE.Material | null;
  floorPBRMaterial: THREE.Material | null;
  ceilingPBRMaterial: THREE.Material | null;
  doorsPBRMaterial: THREE.Material | null;
  frontWallPBRMaterial: THREE.Material | null;
}

/**
 * Интерфейс структуры материалов
 */
export interface MaterialsConfig {
  walls: string;
  floor: string;
  ceiling: string;
  doors: string;
  handrails: string;
  mirror: string;
  metalness: {
    walls: number;
    floor: number;
    ceiling: number;
    doors: number;
  };
  roughness: {
    walls: number;
    floor: number;
    ceiling: number;
    doors: number;
  };
  emission: {
    enabled: boolean;
    color: string;
    walls: number;
    floor: number;
    ceiling: number;
    doors: number;
  };
  transparency: {
    enabled: boolean;
    walls: number;
    floor: number;
    ceiling: number;
    doors: number;
  };
  refraction: {
    enabled: boolean;
    walls: number;
    floor: number;
    ceiling: number;
    doors: number;
  };
  anisotropy: {
    enabled: boolean;
    direction: number;
    walls: number;
    floor: number;
    ceiling: number;
    doors: number;
  };
  isMirror: {
    walls: boolean;
    floor: boolean;
    ceiling: boolean;
    doors: boolean;
  };
  texture?: {
    walls?: string;
    floor?: string;
    ceiling?: string;
    doors?: string;
    frontWall?: string;
  };
} 
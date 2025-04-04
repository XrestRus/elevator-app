/**
 * Тип светильника для потолка лифта
 */
export enum LightType {
  SPOTLIGHT = 'spotlight', // Точечный встроенный светильник
  PLAFOND = 'plafond'     // Светильник-плафон
}

/**
 * Конфигурация параметров светильника для потолка лифта
 */
export interface LightConfig {
  color: string;
  intensity: number;
  enabled: boolean;
  count: number;
  diffusion: number;
  position: [number, number, number];
  type: LightType;
}

/**
 * Размеры светильника в зависимости от их количества и типа
 */
export interface LightSize {
  housingRadius: number;
  glassRadius: number;
  glowSize: number;
  height?: number;
} 
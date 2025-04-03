import { createSlice, PayloadAction } from '@reduxjs/toolkit';

/**
 * Интерфейс для размеров лифта
 */
export interface Dimensions {
  width: number;
  height: number;
  depth: number;
}

/**
 * Интерфейс для настроек освещения лифта
 */
export interface LightingOptions {
  count: number;
  color: string;
  intensity: number;
  enabled: boolean;
}

/**
 * Интерфейс для настроек камеры
 */
export interface CameraOptions {
  fov: number;
  freeCamera: boolean;
  cameraHeight?: number;
  position?: {
    x: number;
    y: number;
    z: number;
  };
}

/**
 * Интерфейс для материалов лифта
 */
export interface Materials {
  floor: string;
  ceiling: string;
  walls: string;
  doors: string;
  isMirror: {
    walls: boolean;
  };
  mirror: {
    width: number;
    height: number;
    type: 'full' | 'double' | 'triple';
    position: number;
  };
  texture: {
    walls: string | null;
    floor: string | null;
    ceiling: string | null;
    doors: string | null;
    frontWall: string | null;
  };
  roughness: {
    walls: number;
    floor: number;
    ceiling: number;
    doors: number;
  };
  metalness: {
    walls: number;
    floor: number;
    ceiling: number;
    doors: number;
  };
}

/**
 * Интерфейс для настроек видимости декоративных элементов
 */
export interface VisibilityOptions {
  decorations: boolean;
  controlPanel: boolean;
  handrails: boolean;
  infoPanel: boolean;
  floorIndicator: boolean;
  mirror: boolean;
  emergencyButton: boolean;
  floorNumber: boolean;
}

/**
 * Интерфейс для настроек декоративных полос
 */
export interface DecorationStripesOptions {
  enabled: boolean;
  position: 'top' | 'middle' | 'bottom' | 'all';
  count: number;
  width: number;
  material: 'metal' | 'glossy' | 'wood';
  color: string;
  orientation: 'horizontal' | 'vertical';
  spacing: number;
  skipMirrorWall: boolean;
  offset: number;
  showOnDoors: boolean;
  qualityFactor?: number; // Фактор качества для оптимизации (0.0-1.0), где 1.0 - высокое качество
}

/**
 * Интерфейс для настроек стыков между стенами
 */
export interface JointOptions {
  enabled: boolean;
  width: number;
  color: string;
  material: 'metal' | 'glossy' | 'wood';
  protrusion: number; // Выступ стыков в мм
  qualityFactor?: number; // Фактор качества для оптимизации (0.0-1.0), где 1.0 - высокое качество
}

/**
 * Интерфейс для настроек зеркала
 */
export interface MirrorOptions {
  width: number;
  height: number;
  type: 'full' | 'double' | 'triple';
  position: number;
}

/**
 * Интерфейс состояния лифта
 */
export interface ElevatorState {
  dimensions: Dimensions;
  doorsOpen: boolean;
  materials: Materials;
  lighting: LightingOptions;
  visibility: VisibilityOptions;
  camera: CameraOptions;
  decorationStripes?: DecorationStripesOptions;
  joints?: JointOptions;
}

/**
 * Начальное состояние лифта
 */
const initialState: ElevatorState = {
  dimensions: {
    width: 2.0,
    height: 2.3,
    depth: 2.0
  },
  doorsOpen: false,
  materials: {
    floor: '#F5F5F5',
    ceiling: '#F5F5F5',
    walls: '#E8E8E8',
    doors: '#A9A9A9',
    isMirror: {
      walls: false
    },
    mirror: {
      width: 1.2,
      height: 1.5,
      type: 'full',
      position: 0
    },
    texture: {
      walls: null,
      floor: null,
      ceiling: null,
      doors: null,
      frontWall: null
    },
    roughness: {
      walls: 0.4,
      floor: 0.7,
      ceiling: 0.2,
      doors: 0.3
    },
    metalness: {
      walls: 0.1,
      floor: 0.1,
      ceiling: 0.1,
      doors: 0.3
    }
  },
  lighting: {
    count: 4,
    color: '#ffffff',
    intensity: 6,
    enabled: true
  },
  visibility: {
    decorations: true,
    controlPanel: true,
    handrails: true,
    infoPanel: true,
    floorIndicator: true,
    mirror: true,
    emergencyButton: true,
    floorNumber: true
  },
  camera: {
    fov: 90,
    freeCamera: false,
    cameraHeight: 0.2
  },
  decorationStripes: {
    enabled: true,
    position: 'all',
    count: 4,
    width: 0.1,
    material: 'metal',
    color: '#C0C0C0',
    orientation: 'vertical',
    spacing: 3,
    skipMirrorWall: true,
    offset: 0,
    showOnDoors: true,
    qualityFactor: 1.0
  },
  joints: {
    enabled: true,
    width: 2.5,
    color: '#888888', 
    material: 'metal',
    protrusion: 0,
    qualityFactor: 1.0
  }
};

/**
 * Slice для управления состоянием лифта
 */
const elevatorSlice = createSlice({
  name: 'elevator',
  initialState,
  reducers: {
    // Установка размеров лифта
    setElevatorDimensions: (state, action: PayloadAction<Partial<Dimensions>>) => {
      state.dimensions = { ...state.dimensions, ...action.payload };
    },
    
    // Открытие/закрытие дверей
    toggleDoors: (state) => {
      state.doorsOpen = !state.doorsOpen;
    },
    
    // Изменение материала
    setMaterial: (state, action: PayloadAction<{ part: 'floor' | 'ceiling' | 'walls' | 'doors', color: string }>) => {
      const { part, color } = action.payload;
      state.materials[part] = color;
    },
    
    // Обновление зеркальных поверхностей
    setMirrorSurface: (state, action: PayloadAction<{ part: keyof Materials['isMirror'], value: boolean }>) => {
      const { part, value } = action.payload;
      state.materials.isMirror[part] = value;
    },
    
    // Обновление текстур
    setTexture: (state, action: PayloadAction<{ part: keyof Materials['texture'], value: string | null }>) => {
      const { part, value } = action.payload;
      
      // Текущий цвет для этой части лифта (будет применен к текстуре)
      const currentColor = state.materials[part as keyof Pick<Materials, 'walls' | 'floor' | 'ceiling' | 'doors'>];
      
      console.log(`Устанавливаю текстуру для ${part}:`, value, `(текущий цвет: ${currentColor})`);
      
      // Сохраняем выбранную текстуру
      state.materials.texture[part] = value;
      
      // Важно: цвет НЕ сбрасывается при смене текстуры
      // Цвет материала сохраняется и применяется к новой текстуре
    },
    
    // Обновление шероховатости
    setRoughness: (state, action: PayloadAction<{ part: keyof Materials['roughness'], value: number }>) => {
      const { part, value } = action.payload;
      state.materials.roughness[part] = value;
    },
    
    // Обновление металличности
    setMetalness: (state, action: PayloadAction<{ part: keyof Materials['metalness'], value: number }>) => {
      const { part, value } = action.payload;
      state.materials.metalness[part] = value;
    },
    
    // Обновление настроек освещения
    setLighting: (state, action: PayloadAction<Partial<LightingOptions>>) => {
      state.lighting = { ...state.lighting, ...action.payload };
    },
    
    // Обновление видимости элементов
    setVisibility: (state, action: PayloadAction<{ element: keyof VisibilityOptions, visible: boolean }>) => {
      const { element, visible } = action.payload;
      state.visibility[element] = visible;
    },
    
    // Обновление настроек камеры
    setCamera: (state, action: PayloadAction<Partial<CameraOptions>>) => {
      state.camera = { ...state.camera, ...action.payload };
    },
    
    // Обновление настроек зеркала
    setMirrorOptions: (state, action: PayloadAction<Partial<Materials['mirror']>>) => {
      state.materials.mirror = { ...state.materials.mirror, ...action.payload };
    },
    
    // Обновление настроек декоративных полос
    setDecorationStripes: (state, action: PayloadAction<Partial<DecorationStripesOptions>>) => {
      if (!state.decorationStripes) {
        state.decorationStripes = {
          enabled: false,
          position: 'all',
          count: 4,
          width: 5,
          material: 'metal',
          color: '#C0C0C0',
          orientation: 'vertical',
          spacing: 3,
          skipMirrorWall: true,
          offset: 0,
          showOnDoors: false
        };
      }
      state.decorationStripes = { ...state.decorationStripes, ...action.payload };
    },
    
    // Обновление настроек стыков
    setJoints: (state, action: PayloadAction<Partial<JointOptions>>) => {
      if (!state.joints) {
        state.joints = {
          enabled: false,
          width: 2.5,
          color: '#888888',
          material: 'metal',
          protrusion: 0
        };
      }
      state.joints = { ...state.joints, ...action.payload };
    }
  }
});

// Экспорт actions
export const { 
  setElevatorDimensions, 
  toggleDoors, 
  setMaterial,
  setMirrorSurface,
  setTexture,
  setRoughness,
  setMetalness,
  setLighting,
  setVisibility,
  setCamera,
  setMirrorOptions,
  setDecorationStripes,
  setJoints
} = elevatorSlice.actions;

// Экспорт reducer
export default elevatorSlice.reducer; 
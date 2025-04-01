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
  texture: {
    walls: string | null;
    floor: string | null;
    ceiling: string | null;
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
 * Интерфейс состояния лифта
 */
export interface ElevatorState {
  dimensions: Dimensions;
  doorsOpen: boolean;
  materials: Materials;
  lighting: LightingOptions;
  visibility: VisibilityOptions;
  camera: CameraOptions;
}

/**
 * Начальное состояние лифта
 */
const initialState: ElevatorState = {
  dimensions: {
    width: 2,
    height: 2.4,
    depth: 2
  },
  doorsOpen: false,
  materials: {
    floor: '#8B4513',
    ceiling: '#F5F5F5',
    walls: '#E8E8E8',
    doors: '#A9A9A9',
    isMirror: {
      walls: false
    },
    texture: {
      walls: null,
      floor: null,
      ceiling: null
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
    intensity: 2,
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
    fov: 75
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
      console.log(`Устанавливаю текстуру для ${part}:`, value);
      state.materials.texture[part] = value;
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
  setCamera
} = elevatorSlice.actions;

// Экспорт reducer
export default elevatorSlice.reducer; 
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import * as THREE from 'three';

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
  diffusion: number; // Рассеивание света
  enabled: boolean;
  type?: string; // Тип светильника: spotlight, plafond, square
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
  handrails: string;
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
  emission: {
    walls: number;
    floor: number;
    ceiling: number;
    doors: number;
    color: string;
    enabled: boolean;
  };
  transparency: {
    walls: number;
    floor: number;
    ceiling: number;
    doors: number;
    enabled: boolean;
  };
  refraction: {
    walls: number;
    floor: number;
    ceiling: number;
    doors: number;
    enabled: boolean;
  };
  anisotropy: {
    walls: number;
    floor: number;
    ceiling: number;
    doors: number;
    direction: number;
    enabled: boolean;
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
  lights: boolean;
}

/**
 * Интерфейс для настроек декоративных полос
 */
export interface DecorationStripesOptions {
  enabled: boolean;
  count: number;
  width: number;
  material: 'metal' | 'glossy' | 'wood';
  color: string;
  orientation: 'horizontal' | 'vertical';
  spacing: number; // Расстояние между полосами в сантиметрах
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
  selectedJoint?: string; // Название выбранного стыка для отображения информации
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
 * Интерфейс настроек логотипа на дверях
 */
export interface DoorLogoOptions {
  enabled: boolean;
  scale?: number;
  offsetY?: number;
  offsetX?: number; // Смещение логотипа по горизонтали
  color?: string; // Цвет логотипа
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
  doorLogo?: DoorLogoOptions;
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
    handrails: '#808080',
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
    },
    emission: {
      walls: 0,
      floor: 0,
      ceiling: 0,
      doors: 0,
      color: '#ffffff',
      enabled: false
    },
    transparency: {
      walls: 0,
      floor: 0,
      ceiling: 0,
      doors: 0,
      enabled: false
    },
    refraction: {
      walls: 1.5,
      floor: 1.5,
      ceiling: 1.5,
      doors: 1.5,
      enabled: false
    },
    anisotropy: {
      walls: 0,
      floor: 0,
      ceiling: 0,
      doors: 0,
      direction: 0,
      enabled: false
    }
  },
  lighting: {
    count: 4,
    color: '#ffffff',
    intensity: 5,
    diffusion: 0.1, // Значение рассеивания по умолчанию
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
    floorNumber: true,
    lights: true
  },
  camera: {
    fov: 90,
    freeCamera: false,
    cameraHeight: 0.2
  },
  decorationStripes: {
    enabled: true,
    count: 4,
    width: 0.01,
    material: 'glossy',
    color: '#ffffff',
    orientation: 'vertical',
    spacing: 30,
    skipMirrorWall: true,
    offset: 0,
    showOnDoors: true,
    qualityFactor: 1.0
  },
  joints: {
    enabled: true,
    width: 2.4,
    color: '#ffffff', 
    material: 'glossy',
    protrusion: 0,
    qualityFactor: .9
  },
  doorLogo: {
    enabled: true,
    scale: 1.2,
    offsetY: 0.25,
    offsetX: 0.16,
    color: '#253D98'
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
    setMaterial: (state, action: PayloadAction<{ part: 'floor' | 'ceiling' | 'walls' | 'doors' | 'handrails', color: string }>) => {
      const { part, color } = action.payload;
      state.materials[part] = color;
      
      // Если меняется цвет стен, автоматически обновляем цвет поручней
      if (part === 'walls') {
        // Создаем Color из hex строки, делаем его светлее и возвращаем обратно в hex
        const wallColor = new THREE.Color(color);
        wallColor.multiplyScalar(1.2); // Делаем светлее на 20%
        state.materials.handrails = '#' + wallColor.getHexString();
      }
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
    
    // Обновление эмиссии (свечения поверхности)
    setEmission: (state, action: PayloadAction<{ part?: keyof Omit<Materials['emission'], 'color' | 'enabled'>, value?: number, color?: string, enabled?: boolean }>) => {
      const { part, value, color, enabled } = action.payload;
      
      if (part && typeof value === 'number') {
        state.materials.emission[part] = value;
      }
      
      if (color !== undefined) {
        state.materials.emission.color = color;
      }
      
      if (enabled !== undefined) {
        state.materials.emission.enabled = enabled;
      }
    },
    
    // Обновление прозрачности
    setTransparency: (state, action: PayloadAction<{ part?: keyof Omit<Materials['transparency'], 'enabled'>, value?: number, enabled?: boolean }>) => {
      const { part, value, enabled } = action.payload;
      
      if (part && typeof value === 'number') {
        state.materials.transparency[part] = value;
      }
      
      if (enabled !== undefined) {
        state.materials.transparency.enabled = enabled;
      }
    },
    
    // Обновление преломления
    setRefraction: (state, action: PayloadAction<{ part?: keyof Omit<Materials['refraction'], 'enabled'>, value?: number, enabled?: boolean }>) => {
      const { part, value, enabled } = action.payload;
      
      if (part && typeof value === 'number') {
        state.materials.refraction[part] = value;
      }
      
      if (enabled !== undefined) {
        state.materials.refraction.enabled = enabled;
      }
    },
    
    // Обновление анизотропности
    setAnisotropy: (state, action: PayloadAction<{ part?: keyof Omit<Materials['anisotropy'], 'direction' | 'enabled'>, value?: number, direction?: number, enabled?: boolean }>) => {
      const { part, value, direction, enabled } = action.payload;
      
      if (part && typeof value === 'number') {
        state.materials.anisotropy[part] = value;
      }
      
      if (direction !== undefined) {
        state.materials.anisotropy.direction = direction;
      }
      
      if (enabled !== undefined) {
        state.materials.anisotropy.enabled = enabled;
      }
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
      
      // Обновляем state
      state.decorationStripes = { ...state.decorationStripes, ...action.payload };
    },
    
    // Обновление настроек стыков
    setJoints: (state, action: PayloadAction<Partial<JointOptions>>) => {
      if (!state.joints) {
        state.joints = {
          enabled: false,
          width: 2.4,
          color: '#ffffff', 
          material: 'glossy',
          protrusion: 0,
          qualityFactor: .9
        };
      }
      state.joints = { ...state.joints, ...action.payload };
    },
    
    // Обновление настроек логотипа на дверях
    setDoorLogo: (state, action: PayloadAction<Partial<DoorLogoOptions>>) => {
      if (!state.doorLogo) {
        state.doorLogo = {
          enabled: false,
          scale: 1,
          offsetY: 0,
          offsetX: 0
        };
      }
      state.doorLogo = { ...state.doorLogo, ...action.payload };
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
  setEmission,
  setTransparency,
  setRefraction,
  setAnisotropy,
  setLighting,
  setVisibility,
  setCamera,
  setMirrorOptions,
  setDecorationStripes,
  setJoints,
  setDoorLogo
} = elevatorSlice.actions;

// Экспорт reducer
export default elevatorSlice.reducer; 
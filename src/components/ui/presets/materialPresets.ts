import { ThunkDispatch } from "redux-thunk";
import { AnyAction } from "redux";
import {
  setMaterial,
  setMetalness,
  setRoughness,
  setTexture,
  setDecorationStripes,
  setMirrorOptions,
  setLighting,
  setMirrorSurface,
} from "../../../store/elevatorSlice";

/**
 * Интерфейс для пресета материалов
 */
export interface MaterialPreset {
  id: string;
  label: string;
  apply: (dispatch: ThunkDispatch<unknown, unknown, AnyAction>) => void;
}

/**
 * Функция сброса всех настроек к стандартным значениям
 * @param dispatch Функция dispatch для Redux
 */
const resetToDefault = (dispatch: ThunkDispatch<unknown, unknown, AnyAction>) => {
  // Сбрасываем базовые цвета и материалы
  dispatch(setMaterial({ part: 'walls', color: '#E8E8E8' }));
  dispatch(setMaterial({ part: 'ceiling', color: '#F5F5F5' }));
  dispatch(setMaterial({ part: 'floor', color: '#F5F5F5' }));
  dispatch(setMaterial({ part: 'doors', color: '#A9A9A9' }));
  dispatch(setMaterial({ part: 'handrails', color: '#808080' }));
  dispatch(setMaterial({ part: 'controlPanel', color: '#A9A9A9' }));

  // Сбрасываем металличность
  dispatch(setMetalness({ part: 'walls', value: 0.1 }));
  dispatch(setMetalness({ part: 'ceiling', value: 0.1 }));
  dispatch(setMetalness({ part: 'doors', value: 0.3 }));
  dispatch(setMetalness({ part: 'floor', value: 0.1 }));
  dispatch(setMetalness({ part: 'controlPanel', value: 0.1 }));

  // Сбрасываем шероховатость
  dispatch(setRoughness({ part: 'walls', value: 0.4 }));
  dispatch(setRoughness({ part: 'ceiling', value: 0.2 }));
  dispatch(setRoughness({ part: 'doors', value: 0.3 }));
  dispatch(setRoughness({ part: 'floor', value: 0.7 }));
  dispatch(setRoughness({ part: 'controlPanel', value: 0.1 }));

  // Сбрасываем текстуры
  dispatch(setTexture({ part: 'walls', value: null }));
  dispatch(setTexture({ part: 'ceiling', value: null }));
  dispatch(setTexture({ part: 'floor', value: null }));
  dispatch(setTexture({ part: 'doors', value: null }));
  dispatch(setTexture({ part: 'frontWall', value: null }));
  dispatch(setTexture({ part: 'controlPanel', value: null }));

  // Сбрасываем зеркало
  dispatch(setMirrorSurface({ part: 'walls', value: false }));
  dispatch(setMirrorOptions({ width: 1.2, height: 1.5, type: 'full', position: 0 }));

  // Сбрасываем освещение
  dispatch(setLighting({ count: 4, color: '#FFFFFF', intensity: 8, diffusion: 0.7, enabled: true, type: 'spotlight' }));

  // Сбрасываем декоративные полосы
  dispatch(setDecorationStripes({
    enabled: false,
    count: 4,
    width: 0.05,
    material: 'metal',
    color: '#C0C0C0',
    orientation: 'vertical',
    spacing: 0.5,
    skipMirrorWall: true,
    offset: 0,
    showOnDoors: false
  }));
};

/**
 * Пресеты материалов для оформления лифта
 */
export const materialPresets: MaterialPreset[] = [
  {
    id: 'default',
    label: 'Стандартный',
    apply: (dispatch) => {
      resetToDefault(dispatch);

      dispatch(setMaterial({ part: 'walls', color: '#E8E8E8' }));
      dispatch(setMaterial({ part: 'ceiling', color: '#F5F5F5' }));
      dispatch(setMaterial({ part: 'floor', color: '#F5F5F5' }));
      dispatch(setMaterial({ part: 'doors', color: '#A9A9A9' }));
      dispatch(setMaterial({ part: 'handrails', color: '#808080' }));
      dispatch(setMaterial({ part: 'controlPanel', color: '#A9A9A9' }));
      dispatch(setMetalness({ part: 'walls', value: 0.1 }));
      dispatch(setMetalness({ part: 'ceiling', value: 0.1 }));
      dispatch(setMetalness({ part: 'doors', value: 0.3 }));
      dispatch(setMetalness({ part: 'floor', value: 0.1 }));
      dispatch(setMetalness({ part: 'controlPanel', value: 0.1 }));
      dispatch(setRoughness({ part: 'walls', value: 0.4 }));
      dispatch(setRoughness({ part: 'ceiling', value: 0.2 }));
      dispatch(setRoughness({ part: 'doors', value: 0.3 }));
      dispatch(setRoughness({ part: 'floor', value: 0.7 }));
      dispatch(setRoughness({ part: 'controlPanel', value: 0.1 }));
      dispatch(setTexture({ part: 'walls', value: null }));
      dispatch(setTexture({ part: 'ceiling', value: null }));
      dispatch(setTexture({ part: 'floor', value: null }));
      dispatch(setTexture({ part: 'doors', value: null }));
      dispatch(setTexture({ part: 'frontWall', value: null }));
      dispatch(setTexture({ part: 'controlPanel', value: null }));
      dispatch(setDecorationStripes({ color: '#C0C0C0', material: 'metal' }));
    }
  },
  {
    id: 'gold',
    label: 'Золотой',
    apply: (dispatch) => {
      resetToDefault(dispatch);

      dispatch(setMaterial({ part: 'walls', color: '#D4AF37' }));
      dispatch(setMaterial({ part: 'ceiling', color: '#D4AF37' }));
      dispatch(setMaterial({ part: 'floor', color: '#332211' }));
      dispatch(setMaterial({ part: 'doors', color: '#D4AF37' }));
      dispatch(setMaterial({ part: 'handrails', color: '#FFD700' }));
      dispatch(setMaterial({ part: 'controlPanel', color: '#D4AF37' }));
      dispatch(setMetalness({ part: 'walls', value: 0.9 }));
      dispatch(setMetalness({ part: 'ceiling', value: 0.9 }));
      dispatch(setMetalness({ part: 'doors', value: 0.9 }));
      dispatch(setMetalness({ part: 'floor', value: 0.5 }));
      dispatch(setMetalness({ part: 'controlPanel', value: 0.5 }));
      dispatch(setRoughness({ part: 'walls', value: 0.1 }));
      dispatch(setRoughness({ part: 'ceiling', value: 0.1 }));
      dispatch(setRoughness({ part: 'doors', value: 0.1 }));
      dispatch(setRoughness({ part: 'floor', value: 0.3 }));
      dispatch(setRoughness({ part: 'controlPanel', value: 0.1 }));
      dispatch(setTexture({ part: 'walls', value: null }));
      dispatch(setTexture({ part: 'ceiling', value: null }));
      dispatch(setTexture({ part: 'floor', value: null }));
      dispatch(setTexture({ part: 'doors', value: null }));
      dispatch(setTexture({ part: 'frontWall', value: null }));
      dispatch(setTexture({ part: 'controlPanel', value: null }));
      dispatch(setDecorationStripes({ color: '#302010', material: 'metal' }));
    }
  },
  {
    id: 'silver',
    label: 'Серебряный',
    apply: (dispatch) => {
      resetToDefault(dispatch);

      dispatch(setMaterial({ part: 'walls', color: '#C0C0C0' }));
      dispatch(setMaterial({ part: 'ceiling', color: '#C0C0C0' }));
      dispatch(setMaterial({ part: 'floor', color: '#303030' }));
      dispatch(setMaterial({ part: 'doors', color: '#C0C0C0' }));
      dispatch(setMaterial({ part: 'handrails', color: '#D3D3D3' }));
      dispatch(setMaterial({ part: 'controlPanel', color: '#C0C0C0' }));
      dispatch(setMetalness({ part: 'walls', value: 0.9 }));
      dispatch(setMetalness({ part: 'ceiling', value: 0.9 }));
      dispatch(setMetalness({ part: 'doors', value: 0.9 }));
      dispatch(setMetalness({ part: 'floor', value: 0.7 }));
      dispatch(setMetalness({ part: 'controlPanel', value: 0.7 }));
      dispatch(setRoughness({ part: 'walls', value: 0.1 }));
      dispatch(setRoughness({ part: 'ceiling', value: 0.1 }));
      dispatch(setRoughness({ part: 'doors', value: 0.1 }));
      dispatch(setRoughness({ part: 'floor', value: 0.2 }));
      dispatch(setRoughness({ part: 'controlPanel', value: 0.1 }));
      dispatch(setTexture({ part: 'walls', value: null }));
      dispatch(setTexture({ part: 'ceiling', value: null }));
      dispatch(setTexture({ part: 'floor', value: null }));
      dispatch(setTexture({ part: 'doors', value: null }));
      dispatch(setTexture({ part: 'frontWall', value: null }));
      dispatch(setTexture({ part: 'controlPanel', value: null }));
      dispatch(setDecorationStripes({ color: '#1A1A1A', material: 'metal' }));
    }
  },
  {
    id: 'copper',
    label: 'Медный',
    apply: (dispatch) => {
      resetToDefault(dispatch);

      dispatch(setMaterial({ part: 'walls', color: '#B87333' }));
      dispatch(setMaterial({ part: 'ceiling', color: '#B87333' }));
      dispatch(setMaterial({ part: 'floor', color: '#2D2D2D' }));
      dispatch(setMaterial({ part: 'doors', color: '#B87333' }));
      dispatch(setMaterial({ part: 'handrails', color: '#CC8844' }));
      dispatch(setMaterial({ part: 'controlPanel', color: '#B87333' }));
      dispatch(setMetalness({ part: 'walls', value: 0.8 }));
      dispatch(setMetalness({ part: 'ceiling', value: 0.8 }));
      dispatch(setMetalness({ part: 'doors', value: 0.8 }));
      dispatch(setMetalness({ part: 'floor', value: 0.6 }));
      dispatch(setMetalness({ part: 'controlPanel', value: 0.8 }));
      dispatch(setRoughness({ part: 'walls', value: 0.2 }));
      dispatch(setRoughness({ part: 'ceiling', value: 0.2 }));
      dispatch(setRoughness({ part: 'doors', value: 0.2 }));
      dispatch(setRoughness({ part: 'floor', value: 0.3 }));
      dispatch(setRoughness({ part: 'controlPanel', value: 0.2 }));
      dispatch(setTexture({ part: 'walls', value: null }));
      dispatch(setTexture({ part: 'ceiling', value: null }));
      dispatch(setTexture({ part: 'floor', value: null }));
      dispatch(setTexture({ part: 'doors', value: null }));
      dispatch(setTexture({ part: 'frontWall', value: null }));
      dispatch(setTexture({ part: 'controlPanel', value: null }));
      dispatch(setDecorationStripes({ color: '#FFCA80', material: 'metal' }));
    }
  },
  {
    id: 'minimalist',
    label: 'Минимализм',
    apply: (dispatch) => {
      resetToDefault(dispatch);

      dispatch(setMaterial({ part: 'walls', color: '#F2F2F2' }));
      dispatch(setMaterial({ part: 'ceiling', color: '#FFFFFF' }));
      dispatch(setMaterial({ part: 'floor', color: '#333333' }));
      dispatch(setMaterial({ part: 'doors', color: '#E0E0E0' }));
      dispatch(setMaterial({ part: 'handrails', color: '#A9A9A9' }));
      dispatch(setMaterial({ part: 'controlPanel', color: '#E0E0E0' }));
      dispatch(setMetalness({ part: 'walls', value: 0.1 }));
      dispatch(setMetalness({ part: 'ceiling', value: 0.0 }));
      dispatch(setMetalness({ part: 'doors', value: 0.3 }));
      dispatch(setMetalness({ part: 'floor', value: 0.2 }));
      dispatch(setMetalness({ part: 'controlPanel', value: 0.3 }));
      dispatch(setRoughness({ part: 'walls', value: 0.7 }));
      dispatch(setRoughness({ part: 'ceiling', value: 0.8 }));
      dispatch(setRoughness({ part: 'doors', value: 0.4 }));
      dispatch(setRoughness({ part: 'floor', value: 0.5 }));
      dispatch(setRoughness({ part: 'controlPanel', value: 0.4 }));
      dispatch(setTexture({ part: 'walls', value: null }));
      dispatch(setTexture({ part: 'ceiling', value: null }));
      dispatch(setTexture({ part: 'floor', value: null }));
      dispatch(setTexture({ part: 'doors', value: null }));
      dispatch(setTexture({ part: 'frontWall', value: null }));
      dispatch(setTexture({ part: 'controlPanel', value: null }));
      dispatch(setDecorationStripes({ color: '#000000', material: 'glossy' }));
    }
  },
  // Пресеты с текстурами
  {
    id: 'wood-classic',
    label: 'Классическое дерево',
    apply: (dispatch) => {
      resetToDefault(dispatch);

      const woodTexture = "./textures/example/wood_0066_1k_HoQeAg";
      dispatch(setMaterial({ part: 'walls', color: '#B08C63' }));
      dispatch(setMaterial({ part: 'ceiling', color: '#EFE4D5' }));
      dispatch(setMaterial({ part: 'floor', color: '#5D3A1A' }));
      dispatch(setMaterial({ part: 'doors', color: '#8B6640' }));
      dispatch(setMaterial({ part: 'handrails', color: '#8B4513' }));
      dispatch(setMaterial({ part: 'controlPanel', color: '#8B6640' }));
      dispatch(setMetalness({ part: 'walls', value: 0.1 }));
      dispatch(setMetalness({ part: 'ceiling', value: 0.1 }));
      dispatch(setMetalness({ part: 'doors', value: 0.2 }));
      dispatch(setMetalness({ part: 'floor', value: 0.2 }));
      dispatch(setMetalness({ part: 'controlPanel', value: 0.2 }));
      dispatch(setRoughness({ part: 'walls', value: 0.7 }));
      dispatch(setRoughness({ part: 'ceiling', value: 0.6 }));
      dispatch(setRoughness({ part: 'doors', value: 0.5 }));
      dispatch(setRoughness({ part: 'floor', value: 0.5 }));
      dispatch(setRoughness({ part: 'controlPanel', value: 0.5 }));
      dispatch(setTexture({ part: 'walls', value: woodTexture }));
      dispatch(setTexture({ part: 'ceiling', value: null }));
      dispatch(setTexture({ part: 'floor', value: woodTexture }));
      dispatch(setTexture({ part: 'doors', value: woodTexture }));
      dispatch(setTexture({ part: 'frontWall', value: woodTexture }));
      dispatch(setTexture({ part: 'controlPanel', value: woodTexture }));
      dispatch(setDecorationStripes({ color: '#4F3824', material: 'wood' }));
    }
  },
  {
    id: 'modern-metal',
    label: 'Современный металл',
    apply: (dispatch) => {
      resetToDefault(dispatch);

      const metalTexture = "./textures/example/metal_0019_1k_NrVP9t";
      dispatch(setMaterial({ part: 'walls', color: '#C0C0C0' }));
      dispatch(setMaterial({ part: 'ceiling', color: '#E5E5E5' }));
      dispatch(setMaterial({ part: 'floor', color: '#2C2C2C' }));
      dispatch(setMaterial({ part: 'doors', color: '#A0A0A0' }));
      dispatch(setMaterial({ part: 'handrails', color: '#B0B0B0' }));
      dispatch(setMaterial({ part: 'controlPanel', color: '#A0A0A0' }));
      dispatch(setMetalness({ part: 'walls', value: 0.8 }));
      dispatch(setMetalness({ part: 'ceiling', value: 0.7 }));
      dispatch(setMetalness({ part: 'doors', value: 0.9 }));
      dispatch(setMetalness({ part: 'floor', value: 0.9 }));
      dispatch(setMetalness({ part: 'controlPanel', value: 0.9 }));
      dispatch(setRoughness({ part: 'walls', value: 0.3 }));
      dispatch(setRoughness({ part: 'ceiling', value: 0.2 }));
      dispatch(setRoughness({ part: 'doors', value: 0.2 }));
      dispatch(setRoughness({ part: 'floor', value: 0.1 }));
      dispatch(setRoughness({ part: 'controlPanel', value: 0.1 }));
      dispatch(setTexture({ part: 'walls', value: metalTexture }));
      dispatch(setTexture({ part: 'ceiling', value: null }));
      dispatch(setTexture({ part: 'floor', value: "./textures/example/metal_0044_1k_QzepB1" }));
      dispatch(setTexture({ part: 'doors', value: metalTexture }));
      dispatch(setTexture({ part: 'frontWall', value: metalTexture }));
      dispatch(setTexture({ part: 'controlPanel', value: metalTexture }));
      dispatch(setDecorationStripes({ color: '#1E90FF', material: 'glossy' }));
    }
  },
  {
    id: 'ice-crystal',
    label: 'Ледяной кристалл',
    apply: (dispatch) => {
      resetToDefault(dispatch);

      dispatch(setMaterial({ part: 'walls', color: '#E0F0FF' }));
      dispatch(setMaterial({ part: 'ceiling', color: '#FFFFFF' }));
      dispatch(setMaterial({ part: 'floor', color: '#D0E0F0' }));
      dispatch(setMaterial({ part: 'doors', color: '#C0D8FF' }));
      dispatch(setMaterial({ part: 'handrails', color: '#B0C4DE' }));
      dispatch(setMaterial({ part: 'controlPanel', color: '#C0D8FF' }));
      dispatch(setMetalness({ part: 'walls', value: 0.9 }));
      dispatch(setMetalness({ part: 'ceiling', value: 0.8 }));
      dispatch(setMetalness({ part: 'doors', value: 0.8 }));
      dispatch(setMetalness({ part: 'floor', value: 0.9 }));
      dispatch(setMetalness({ part: 'controlPanel', value: 0.8 }));
      dispatch(setRoughness({ part: 'walls', value: 0.1 }));
      dispatch(setRoughness({ part: 'ceiling', value: 0.1 }));
      dispatch(setRoughness({ part: 'doors', value: 0.15 }));
      dispatch(setRoughness({ part: 'floor', value: 0.2 }));
      dispatch(setRoughness({ part: 'controlPanel', value: 0.15 }));

      // Добавляем ледяную текстуру для передней стены
      const iceTexture = "./textures/example/metal_0016_1k_bN2ZC3";
      dispatch(setTexture({ part: 'walls', value: null }));
      dispatch(setTexture({ part: 'ceiling', value: null }));
      dispatch(setTexture({ part: 'floor', value: null }));
      dispatch(setTexture({ part: 'doors', value: null }));
      dispatch(setTexture({ part: 'frontWall', value: iceTexture }));
      dispatch(setTexture({ part: 'controlPanel', value: iceTexture }));

      dispatch(setDecorationStripes({
        enabled: true,
        count: 2,
        width: 0.02,
        material: 'glossy',
        color: '#FFFFFF',
        orientation: 'vertical',
        spacing: 0.5,
        skipMirrorWall: false,
        offset: 0.2,
        showOnDoors: true
      }));
    }
  },
  {
    id: 'warm-burgundy',
    label: 'Тёплый бордо',
    apply: (dispatch) => {
      resetToDefault(dispatch);

      dispatch(setMaterial({ part: 'walls', color: '#6D071A' }));
      dispatch(setMaterial({ part: 'ceiling', color: '#F0F0F0' }));
      dispatch(setMaterial({ part: 'floor', color: '#421C17' }));
      dispatch(setMaterial({ part: 'doors', color: '#8C001A' }));
      dispatch(setMaterial({ part: 'handrails', color: '#D4AF37' }));
      dispatch(setMaterial({ part: 'controlPanel', color: '#8C001A' }));
      dispatch(setMetalness({ part: 'walls', value: 0.3 }));
      dispatch(setMetalness({ part: 'ceiling', value: 0.1 }));
      dispatch(setMetalness({ part: 'doors', value: 0.4 }));
      dispatch(setMetalness({ part: 'floor', value: 0.2 }));
      dispatch(setMetalness({ part: 'controlPanel', value: 0.4 }));
      dispatch(setRoughness({ part: 'walls', value: 0.3 }));
      dispatch(setRoughness({ part: 'ceiling', value: 0.5 }));
      dispatch(setRoughness({ part: 'doors', value: 0.4 }));
      dispatch(setRoughness({ part: 'floor', value: 0.5 }));
      dispatch(setRoughness({ part: 'controlPanel', value: 0.4 }));

      const woodTexture = "./textures/example/wood_0066_1k_HoQeAg";
      dispatch(setTexture({ part: 'walls', value: null }));
      dispatch(setTexture({ part: 'ceiling', value: null }));
      dispatch(setTexture({ part: 'floor', value: woodTexture }));
      dispatch(setTexture({ part: 'doors', value: null }));
      dispatch(setTexture({ part: 'frontWall', value: null }));
      dispatch(setTexture({ part: 'controlPanel', value: woodTexture }));

      // Зеркало
      dispatch(setMirrorSurface({ part: 'walls', value: false }));
      dispatch(setMirrorOptions({ width: 1.0, height: 1.5, type: 'full', position: 0 }));
      dispatch(setDecorationStripes({
        enabled: true,
        count: 4,
        width: 0.01,
        material: 'metal',
        color: '#D4AF37',
        orientation: 'horizontal',
        spacing: 0.3,
        skipMirrorWall: true,
        offset: 0.6,
        showOnDoors: true
      }));
    }
  },
  {
    id: 'forest-green',
    label: 'Лесная зелень',
    apply: (dispatch) => {
      resetToDefault(dispatch);

      dispatch(setMaterial({ part: 'walls', color: '#2E4033' }));
      dispatch(setMaterial({ part: 'ceiling', color: '#ECECE7' }));
      dispatch(setMaterial({ part: 'floor', color: '#3D291B' }));
      dispatch(setMaterial({ part: 'doors', color: '#43594F' }));
      dispatch(setMaterial({ part: 'handrails', color: '#6D4C41' }));
      dispatch(setMaterial({ part: 'controlPanel', color: '#43594F' }));
      dispatch(setMetalness({ part: 'walls', value: 0.2 }));
      dispatch(setMetalness({ part: 'ceiling', value: 0.0 }));
      dispatch(setMetalness({ part: 'doors', value: 0.3 }));
      dispatch(setMetalness({ part: 'floor', value: 0.1 }));
      dispatch(setMetalness({ part: 'controlPanel', value: 0.3 }));
      dispatch(setRoughness({ part: 'walls', value: 0.6 }));
      dispatch(setRoughness({ part: 'ceiling', value: 0.7 }));
      dispatch(setRoughness({ part: 'doors', value: 0.5 }));
      dispatch(setRoughness({ part: 'floor', value: 0.7 }));
      dispatch(setRoughness({ part: 'controlPanel', value: 0.5 }));

      const woodTexture = "./textures/example/wood_0066_1k_HoQeAg";
      dispatch(setTexture({ part: 'walls', value: null }));
      dispatch(setTexture({ part: 'ceiling', value: null }));
      dispatch(setTexture({ part: 'floor', value: woodTexture }));
      dispatch(setTexture({ part: 'doors', value: null }));
      dispatch(setTexture({ part: 'frontWall', value: woodTexture }));
      dispatch(setTexture({ part: 'controlPanel', value: woodTexture }));

      // Зеркало
      dispatch(setMirrorSurface({ part: 'walls', value: false }));
      dispatch(setMirrorOptions({ width: 1.0, height: 1.4, type: 'double', position: 0 }));
      dispatch(setDecorationStripes({
        enabled: true,
        count: 2,
        width: 0.04,
        material: 'wood',
        color: '#6D4C41',
        orientation: 'horizontal',
        spacing: 1.0,
        skipMirrorWall: true,
        offset: 0.8,
        showOnDoors: false
      }));

      // Зеркальные поверхности
      dispatch(setMirrorSurface({ part: 'walls', value: true }));
      dispatch(setMirrorOptions({ width: 1.5, height: 1.8, type: 'triple', position: 0 }));
    }
  }
]; 
import { ThunkDispatch } from "redux-thunk";
import { AnyAction } from "redux";
import { 
  setMaterial, 
  setMetalness, 
  setRoughness, 
  setTexture, 
  setDecorationStripes 
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
 * Пресеты материалов для оформления лифта
 */
export const materialPresets: MaterialPreset[] = [
  {
    id: 'default',
    label: 'Стандартный',
    apply: (dispatch) => {
      dispatch(setMaterial({ part: 'walls', color: '#E8E8E8' }));
      dispatch(setMaterial({ part: 'ceiling', color: '#F5F5F5' }));
      dispatch(setMaterial({ part: 'floor', color: '#F5F5F5' }));
      dispatch(setMaterial({ part: 'doors', color: '#A9A9A9' }));
      dispatch(setMaterial({ part: 'handrails', color: '#808080' }));
      dispatch(setMetalness({ part: 'walls', value: 0.1 }));
      dispatch(setMetalness({ part: 'ceiling', value: 0.1 }));
      dispatch(setMetalness({ part: 'doors', value: 0.3 }));
      dispatch(setMetalness({ part: 'floor', value: 0.1 }));
      dispatch(setRoughness({ part: 'walls', value: 0.4 }));
      dispatch(setRoughness({ part: 'ceiling', value: 0.2 }));
      dispatch(setRoughness({ part: 'doors', value: 0.3 }));
      dispatch(setRoughness({ part: 'floor', value: 0.7 }));
      dispatch(setTexture({ part: 'walls', value: null }));
      dispatch(setTexture({ part: 'ceiling', value: null }));
      dispatch(setTexture({ part: 'floor', value: null }));
      dispatch(setTexture({ part: 'doors', value: null }));
      dispatch(setTexture({ part: 'frontWall', value: null }));
      dispatch(setDecorationStripes({ color: '#C0C0C0', material: 'metal' }));
    }
  },
  {
    id: 'gold',
    label: 'Золотой',
    apply: (dispatch) => {
      dispatch(setMaterial({ part: 'walls', color: '#D4AF37' }));
      dispatch(setMaterial({ part: 'ceiling', color: '#D4AF37' }));
      dispatch(setMaterial({ part: 'floor', color: '#332211' }));
      dispatch(setMaterial({ part: 'doors', color: '#D4AF37' }));
      dispatch(setMaterial({ part: 'handrails', color: '#FFD700' }));
      dispatch(setMetalness({ part: 'walls', value: 0.9 }));
      dispatch(setMetalness({ part: 'ceiling', value: 0.9 }));
      dispatch(setMetalness({ part: 'doors', value: 0.9 }));
      dispatch(setMetalness({ part: 'floor', value: 0.5 }));
      dispatch(setRoughness({ part: 'walls', value: 0.1 }));
      dispatch(setRoughness({ part: 'ceiling', value: 0.1 }));
      dispatch(setRoughness({ part: 'doors', value: 0.1 }));
      dispatch(setRoughness({ part: 'floor', value: 0.3 }));
      dispatch(setTexture({ part: 'walls', value: null }));
      dispatch(setTexture({ part: 'ceiling', value: null }));
      dispatch(setTexture({ part: 'floor', value: null }));
      dispatch(setTexture({ part: 'doors', value: null }));
      dispatch(setTexture({ part: 'frontWall', value: null }));
      dispatch(setDecorationStripes({ color: '#302010', material: 'metal' }));
    }
  },
  {
    id: 'bronze',
    label: 'Бронзовый',
    apply: (dispatch) => {
      dispatch(setMaterial({ part: 'walls', color: '#CD7F32' }));
      dispatch(setMaterial({ part: 'ceiling', color: '#CD7F32' }));
      dispatch(setMaterial({ part: 'floor', color: '#3D2B1F' }));
      dispatch(setMaterial({ part: 'doors', color: '#CD7F32' }));
      dispatch(setMaterial({ part: 'handrails', color: '#B87333' }));
      dispatch(setMetalness({ part: 'walls', value: 0.8 }));
      dispatch(setMetalness({ part: 'ceiling', value: 0.8 }));
      dispatch(setMetalness({ part: 'doors', value: 0.8 }));
      dispatch(setMetalness({ part: 'floor', value: 0.4 }));
      dispatch(setRoughness({ part: 'walls', value: 0.2 }));
      dispatch(setRoughness({ part: 'ceiling', value: 0.2 }));
      dispatch(setRoughness({ part: 'doors', value: 0.2 }));
      dispatch(setRoughness({ part: 'floor', value: 0.5 }));
      dispatch(setTexture({ part: 'walls', value: null }));
      dispatch(setTexture({ part: 'ceiling', value: null }));
      dispatch(setTexture({ part: 'floor', value: null }));
      dispatch(setTexture({ part: 'doors', value: null }));
      dispatch(setTexture({ part: 'frontWall', value: null }));
      dispatch(setDecorationStripes({ color: '#E2C87A', material: 'metal' }));
    }
  },
  {
    id: 'silver',
    label: 'Серебряный',
    apply: (dispatch) => {
      dispatch(setMaterial({ part: 'walls', color: '#C0C0C0' }));
      dispatch(setMaterial({ part: 'ceiling', color: '#C0C0C0' }));
      dispatch(setMaterial({ part: 'floor', color: '#303030' }));
      dispatch(setMaterial({ part: 'doors', color: '#C0C0C0' }));
      dispatch(setMaterial({ part: 'handrails', color: '#D3D3D3' }));
      dispatch(setMetalness({ part: 'walls', value: 0.9 }));
      dispatch(setMetalness({ part: 'ceiling', value: 0.9 }));
      dispatch(setMetalness({ part: 'doors', value: 0.9 }));
      dispatch(setMetalness({ part: 'floor', value: 0.7 }));
      dispatch(setRoughness({ part: 'walls', value: 0.1 }));
      dispatch(setRoughness({ part: 'ceiling', value: 0.1 }));
      dispatch(setRoughness({ part: 'doors', value: 0.1 }));
      dispatch(setRoughness({ part: 'floor', value: 0.2 }));
      dispatch(setTexture({ part: 'walls', value: null }));
      dispatch(setTexture({ part: 'ceiling', value: null }));
      dispatch(setTexture({ part: 'floor', value: null }));
      dispatch(setTexture({ part: 'doors', value: null }));
      dispatch(setTexture({ part: 'frontWall', value: null }));
      dispatch(setDecorationStripes({ color: '#1A1A1A', material: 'metal' }));
    }
  },
  {
    id: 'copper',
    label: 'Медный',
    apply: (dispatch) => {
      dispatch(setMaterial({ part: 'walls', color: '#B87333' }));
      dispatch(setMaterial({ part: 'ceiling', color: '#B87333' }));
      dispatch(setMaterial({ part: 'floor', color: '#2D2D2D' }));
      dispatch(setMaterial({ part: 'doors', color: '#B87333' }));
      dispatch(setMaterial({ part: 'handrails', color: '#CC8844' }));
      dispatch(setMetalness({ part: 'walls', value: 0.8 }));
      dispatch(setMetalness({ part: 'ceiling', value: 0.8 }));
      dispatch(setMetalness({ part: 'doors', value: 0.8 }));
      dispatch(setMetalness({ part: 'floor', value: 0.6 }));
      dispatch(setRoughness({ part: 'walls', value: 0.2 }));
      dispatch(setRoughness({ part: 'ceiling', value: 0.2 }));
      dispatch(setRoughness({ part: 'doors', value: 0.2 }));
      dispatch(setRoughness({ part: 'floor', value: 0.3 }));
      dispatch(setTexture({ part: 'walls', value: null }));
      dispatch(setTexture({ part: 'ceiling', value: null }));
      dispatch(setTexture({ part: 'floor', value: null }));
      dispatch(setTexture({ part: 'doors', value: null }));
      dispatch(setTexture({ part: 'frontWall', value: null }));
      dispatch(setDecorationStripes({ color: '#FFCA80', material: 'metal' }));
    }
  },
  {
    id: 'minimalist',
    label: 'Минимализм',
    apply: (dispatch) => {
      dispatch(setMaterial({ part: 'walls', color: '#F2F2F2' }));
      dispatch(setMaterial({ part: 'ceiling', color: '#FFFFFF' }));
      dispatch(setMaterial({ part: 'floor', color: '#333333' }));
      dispatch(setMaterial({ part: 'doors', color: '#E0E0E0' }));
      dispatch(setMaterial({ part: 'handrails', color: '#A9A9A9' }));
      dispatch(setMetalness({ part: 'walls', value: 0.1 }));
      dispatch(setMetalness({ part: 'ceiling', value: 0.0 }));
      dispatch(setMetalness({ part: 'doors', value: 0.3 }));
      dispatch(setMetalness({ part: 'floor', value: 0.2 }));
      dispatch(setRoughness({ part: 'walls', value: 0.7 }));
      dispatch(setRoughness({ part: 'ceiling', value: 0.8 }));
      dispatch(setRoughness({ part: 'doors', value: 0.4 }));
      dispatch(setRoughness({ part: 'floor', value: 0.5 }));
      dispatch(setTexture({ part: 'walls', value: null }));
      dispatch(setTexture({ part: 'ceiling', value: null }));
      dispatch(setTexture({ part: 'floor', value: null }));
      dispatch(setTexture({ part: 'doors', value: null }));
      dispatch(setTexture({ part: 'frontWall', value: null }));
      dispatch(setDecorationStripes({ color: '#000000', material: 'glossy' }));
    }
  },
  {
    id: 'luxury-blue',
    label: 'Синий люкс',
    apply: (dispatch) => {
      dispatch(setMaterial({ part: 'walls', color: '#1E2D48' }));
      dispatch(setMaterial({ part: 'ceiling', color: '#1E2D48' }));
      dispatch(setMaterial({ part: 'floor', color: '#0A0A0A' }));
      dispatch(setMaterial({ part: 'doors', color: '#2C3C56' }));
      dispatch(setMaterial({ part: 'handrails', color: '#4682B4' }));
      dispatch(setMetalness({ part: 'walls', value: 0.6 }));
      dispatch(setMetalness({ part: 'ceiling', value: 0.6 }));
      dispatch(setMetalness({ part: 'doors', value: 0.7 }));
      dispatch(setMetalness({ part: 'floor', value: 0.8 }));
      dispatch(setRoughness({ part: 'walls', value: 0.3 }));
      dispatch(setRoughness({ part: 'ceiling', value: 0.3 }));
      dispatch(setRoughness({ part: 'doors', value: 0.2 }));
      dispatch(setRoughness({ part: 'floor', value: 0.2 }));
      dispatch(setTexture({ part: 'walls', value: null }));
      dispatch(setTexture({ part: 'ceiling', value: null }));
      dispatch(setTexture({ part: 'floor', value: null }));
      dispatch(setTexture({ part: 'doors', value: null }));
      dispatch(setTexture({ part: 'frontWall', value: null }));
      dispatch(setDecorationStripes({ color: '#C0AA70', material: 'metal' }));
    }
  },
  // Пресеты с текстурами
  {
    id: 'wood-classic',
    label: 'Классическое дерево',
    apply: (dispatch) => {
      const woodTexture = "/textures/example/wood_0066_1k_HoQeAg";
      dispatch(setMaterial({ part: 'walls', color: '#B08C63' }));
      dispatch(setMaterial({ part: 'ceiling', color: '#EFE4D5' }));
      dispatch(setMaterial({ part: 'floor', color: '#5D3A1A' }));
      dispatch(setMaterial({ part: 'doors', color: '#8B6640' }));
      dispatch(setMaterial({ part: 'handrails', color: '#8B4513' }));
      dispatch(setMetalness({ part: 'walls', value: 0.1 }));
      dispatch(setMetalness({ part: 'ceiling', value: 0.1 }));
      dispatch(setMetalness({ part: 'doors', value: 0.2 }));
      dispatch(setMetalness({ part: 'floor', value: 0.2 }));
      dispatch(setRoughness({ part: 'walls', value: 0.7 }));
      dispatch(setRoughness({ part: 'ceiling', value: 0.6 }));
      dispatch(setRoughness({ part: 'doors', value: 0.5 }));
      dispatch(setRoughness({ part: 'floor', value: 0.5 }));
      dispatch(setTexture({ part: 'walls', value: woodTexture }));
      dispatch(setTexture({ part: 'ceiling', value: null }));
      dispatch(setTexture({ part: 'floor', value: woodTexture }));
      dispatch(setTexture({ part: 'doors', value: woodTexture }));
      dispatch(setTexture({ part: 'frontWall', value: woodTexture }));
      dispatch(setDecorationStripes({ color: '#4F3824', material: 'wood' }));
    }
  },
  {
    id: 'brushed-metal',
    label: 'Матовый металл',
    apply: (dispatch) => {
      const metalTexture = "/textures/example/metal_0016_1k_bN2ZC3";
      dispatch(setMaterial({ part: 'walls', color: '#B4B4B4' }));
      dispatch(setMaterial({ part: 'ceiling', color: '#CDCDCD' }));
      dispatch(setMaterial({ part: 'floor', color: '#303030' }));
      dispatch(setMaterial({ part: 'doors', color: '#8F8F8F' }));
      dispatch(setMaterial({ part: 'handrails', color: '#787878' }));
      dispatch(setMetalness({ part: 'walls', value: 0.7 }));
      dispatch(setMetalness({ part: 'ceiling', value: 0.7 }));
      dispatch(setMetalness({ part: 'doors', value: 0.8 }));
      dispatch(setMetalness({ part: 'floor', value: 0.9 }));
      dispatch(setRoughness({ part: 'walls', value: 0.4 }));
      dispatch(setRoughness({ part: 'ceiling', value: 0.4 }));
      dispatch(setRoughness({ part: 'doors', value: 0.3 }));
      dispatch(setRoughness({ part: 'floor', value: 0.2 }));
      dispatch(setTexture({ part: 'walls', value: metalTexture }));
      dispatch(setTexture({ part: 'ceiling', value: metalTexture }));
      dispatch(setTexture({ part: 'floor', value: metalTexture }));
      dispatch(setTexture({ part: 'doors', value: metalTexture }));
      dispatch(setTexture({ part: 'frontWall', value: metalTexture }));
      dispatch(setDecorationStripes({ color: '#2A2A2A', material: 'metal' }));
    }
  },
  {
    id: 'modern-metal',
    label: 'Современный металл',
    apply: (dispatch) => {
      const metalTexture = "/textures/example/metal_0019_1k_NrVP9t";
      dispatch(setMaterial({ part: 'walls', color: '#C0C0C0' }));
      dispatch(setMaterial({ part: 'ceiling', color: '#E5E5E5' }));
      dispatch(setMaterial({ part: 'floor', color: '#2C2C2C' }));
      dispatch(setMaterial({ part: 'doors', color: '#A0A0A0' }));
      dispatch(setMaterial({ part: 'handrails', color: '#B0B0B0' }));
      dispatch(setMetalness({ part: 'walls', value: 0.8 }));
      dispatch(setMetalness({ part: 'ceiling', value: 0.7 }));
      dispatch(setMetalness({ part: 'doors', value: 0.9 }));
      dispatch(setMetalness({ part: 'floor', value: 0.9 }));
      dispatch(setRoughness({ part: 'walls', value: 0.3 }));
      dispatch(setRoughness({ part: 'ceiling', value: 0.2 }));
      dispatch(setRoughness({ part: 'doors', value: 0.2 }));
      dispatch(setRoughness({ part: 'floor', value: 0.1 }));
      dispatch(setTexture({ part: 'walls', value: metalTexture }));
      dispatch(setTexture({ part: 'ceiling', value: null }));
      dispatch(setTexture({ part: 'floor', value: "/textures/example/metal_0044_1k_QzepB1" }));
      dispatch(setTexture({ part: 'doors', value: metalTexture }));
      dispatch(setTexture({ part: 'frontWall', value: metalTexture }));
      dispatch(setDecorationStripes({ color: '#1E90FF', material: 'glossy' }));
    }
  },
  {
    id: 'gold-texture',
    label: 'Золото с текстурой',
    apply: (dispatch) => {
      const metalTexture = "/textures/example/metal_0083_1k_r9ZJJl";
      dispatch(setMaterial({ part: 'walls', color: '#FFD700' }));
      dispatch(setMaterial({ part: 'ceiling', color: '#F5F5F5' }));
      dispatch(setMaterial({ part: 'floor', color: '#2D1B0E' }));
      dispatch(setMaterial({ part: 'doors', color: '#FFD700' }));
      dispatch(setMaterial({ part: 'handrails', color: '#FFA500' }));
      dispatch(setMetalness({ part: 'walls', value: 1.0 }));
      dispatch(setMetalness({ part: 'ceiling', value: 0.2 }));
      dispatch(setMetalness({ part: 'doors', value: 1.0 }));
      dispatch(setMetalness({ part: 'floor', value: 0.3 }));
      dispatch(setRoughness({ part: 'walls', value: 0.2 }));
      dispatch(setRoughness({ part: 'ceiling', value: 0.5 }));
      dispatch(setRoughness({ part: 'doors', value: 0.2 }));
      dispatch(setRoughness({ part: 'floor', value: 0.6 }));
      dispatch(setTexture({ part: 'walls', value: metalTexture }));
      dispatch(setTexture({ part: 'ceiling', value: null }));
      dispatch(setTexture({ part: 'floor', value: "/textures/example/wood_0066_1k_HoQeAg" }));
      dispatch(setTexture({ part: 'doors', value: metalTexture }));
      dispatch(setTexture({ part: 'frontWall', value: metalTexture }));
      dispatch(setDecorationStripes({ color: '#5C4033', material: 'wood' }));
    }
  },
  {
    id: 'elegant-dark',
    label: 'Элегантный тёмный',
    apply: (dispatch) => {
      const metalTexture = "/textures/example/metal_0071_1k_HD5XFx";
      dispatch(setMaterial({ part: 'walls', color: '#202020' }));
      dispatch(setMaterial({ part: 'ceiling', color: '#121212' }));
      dispatch(setMaterial({ part: 'floor', color: '#181818' }));
      dispatch(setMaterial({ part: 'doors', color: '#404040' }));
      dispatch(setMaterial({ part: 'handrails', color: '#333333' }));
      dispatch(setMetalness({ part: 'walls', value: 0.8 }));
      dispatch(setMetalness({ part: 'ceiling', value: 0.9 }));
      dispatch(setMetalness({ part: 'doors', value: 0.7 }));
      dispatch(setMetalness({ part: 'floor', value: 0.8 }));
      dispatch(setRoughness({ part: 'walls', value: 0.3 }));
      dispatch(setRoughness({ part: 'ceiling', value: 0.2 }));
      dispatch(setRoughness({ part: 'doors', value: 0.3 }));
      dispatch(setRoughness({ part: 'floor', value: 0.2 }));
      dispatch(setTexture({ part: 'walls', value: metalTexture }));
      dispatch(setTexture({ part: 'ceiling', value: metalTexture }));
      dispatch(setTexture({ part: 'floor', value: "/textures/example/metal_0082_1k_je0RXH" }));
      dispatch(setTexture({ part: 'doors', value: metalTexture }));
      dispatch(setTexture({ part: 'frontWall', value: metalTexture }));
      dispatch(setDecorationStripes({ color: '#C0C0C0', material: 'metal' }));
    }
  }
]; 
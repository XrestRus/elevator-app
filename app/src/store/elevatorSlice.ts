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
 * Интерфейс для материалов лифта
 */
export interface Materials {
  floor: string;
  ceiling: string;
  walls: string;
  doors: string;
}

/**
 * Интерфейс состояния лифта
 */
export interface ElevatorState {
  dimensions: Dimensions;
  doorsOpen: boolean;
  materials: Materials;
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
    doors: '#A9A9A9'
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
    setMaterial: (state, action: PayloadAction<{ part: keyof Materials, color: string }>) => {
      const { part, color } = action.payload;
      state.materials[part] = color;
    }
  }
});

// Экспорт actions
export const { setElevatorDimensions, toggleDoors, setMaterial } = elevatorSlice.actions;

// Экспорт reducer
export default elevatorSlice.reducer; 
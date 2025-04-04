import { configureStore } from '@reduxjs/toolkit';
import elevatorReducer, { ElevatorState } from './elevatorSlice';

/**
 * Тип состояния приложения
 */
export interface AppState {
  elevator: ElevatorState;
}

/**
 * Корневое хранилище Redux
 */
export const store = configureStore({
  reducer: {
    elevator: elevatorReducer,
  },
});

// Типы для RootState и AppDispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 
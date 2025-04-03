import React from 'react';
import { useObjectHover, HoverableObject } from '../../hooks/useObjectHover';
import { create } from 'zustand';
import { useFrame } from '@react-three/fiber';

// Создаем хранилище для данных о наведении объекта
interface HoverStore {
  hoveredObject: HoverableObject | null;
  mousePosition: { x: number; y: number } | null;
  setHoveredObject: (object: HoverableObject | null) => void;
  setMousePosition: (position: { x: number; y: number } | null) => void;
}

export const useHoverStore = create<HoverStore>((set) => ({
  hoveredObject: null,
  mousePosition: null,
  setHoveredObject: (object) => set({ hoveredObject: object }),
  setMousePosition: (position) => set({ mousePosition: position }),
}));

/**
 * Компонент для обработки наведения мыши на объекты в сцене и передачи данных во внешнее хранилище
 * Этот компонент должен быть добавлен как дочерний к Canvas
 */
const ObjectHoverHandler: React.FC = () => {
  // Используем наш хук для отслеживания наведения мыши на объекты
  const { hoveredObject, mousePosition } = useObjectHover();
  const { setHoveredObject, setMousePosition } = useHoverStore();
  
  // Используем useFrame для обновления хранилища на каждом кадре
  // Это позволяет избежать проблем с синхронизацией рендеринга
  useFrame(() => {
    setHoveredObject(hoveredObject);
    setMousePosition(mousePosition);
  });
  
  return null;
};

export default ObjectHoverHandler; 
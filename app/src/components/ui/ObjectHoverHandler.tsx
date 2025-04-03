import React from 'react';
import { useObjectHover, HoverableObject } from '../../hooks/useObjectHover';
import { create } from 'zustand';
import { useFrame, useThree } from '@react-three/fiber';

// Создаем хранилище для данных о наведении и выбранном объекте
interface HoverStore {
  hoveredObject: HoverableObject | null;
  mousePosition: { x: number; y: number } | null;
  selectedObject: HoverableObject | null;
  setHoveredObject: (object: HoverableObject | null) => void;
  setMousePosition: (position: { x: number; y: number } | null) => void;
  setSelectedObject: (object: HoverableObject | null) => void;
}

export const useHoverStore = create<HoverStore>((set) => ({
  hoveredObject: null,
  mousePosition: null,
  selectedObject: null,
  setHoveredObject: (object) => set({ hoveredObject: object }),
  setMousePosition: (position) => set({ mousePosition: position }),
  setSelectedObject: (object) => set({ selectedObject: object }),
}));

/**
 * Компонент для обработки наведения мыши на объекты в сцене и их выбора кликом
 * Этот компонент должен быть добавлен как дочерний к Canvas
 */
const ObjectHoverHandler: React.FC = () => {
  // Используем наш хук для отслеживания наведения мыши на объекты
  const { hoveredObject, mousePosition } = useObjectHover();
  const { setHoveredObject, setMousePosition, setSelectedObject } = useHoverStore();
  const { gl } = useThree();
  
  // Временные переменные для отслеживания двойного клика
  const lastClickTimeRef = React.useRef<number>(0);
  const clickCounterRef = React.useRef<number>(0);
  
  // Обработчик клика для выбора объекта
  const handleClick = () => {
    const currentTime = Date.now();
    // Проверяем время с последнего клика
    if (currentTime - lastClickTimeRef.current < 300) {
      // Двойной клик - увеличиваем счетчик
      clickCounterRef.current += 1;
      
      // Если счетчик достиг 2, это двойной клик
      if (clickCounterRef.current >= 2) {
        // Если навели на объект, выбираем его
        if (hoveredObject) {
          setSelectedObject(hoveredObject);
        }
        // Сбрасываем счетчик после двойного клика
        clickCounterRef.current = 0;
      }
    } else {
      // Одиночный клик - сбрасываем счетчик
      clickCounterRef.current = 1;
    }
    
    // Обновляем время последнего клика
    lastClickTimeRef.current = currentTime;
  };
  
  // Устанавливаем обработчик клика
  React.useEffect(() => {
    const canvas = gl.domElement;
    canvas.addEventListener('click', handleClick);
    
    return () => {
      canvas.removeEventListener('click', handleClick);
    };
  }, [gl, hoveredObject, setSelectedObject]);
  
  // Используем useFrame для обновления хранилища на каждом кадре
  // Это позволяет избежать проблем с синхронизацией рендеринга
  useFrame(() => {
    setHoveredObject(hoveredObject);
    setMousePosition(mousePosition);
  });
  
  return null;
};

export default ObjectHoverHandler; 
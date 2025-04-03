import { useRef, useState, useEffect } from 'react';
import * as THREE from 'three';
import { useThree, useFrame } from '@react-three/fiber';

/**
 * Тип данных для объекта, на который можно навести мышь
 */
export interface HoverableObject {
  uuid: string;
  name: string;
  type: string;
  description?: string;
  material?: string;
  dimensions?: {
    width?: number;
    height?: number;
    depth?: number;
  };
  position?: THREE.Vector3;
  additionalInfo?: Record<string, unknown>;
  userData?: {
    hoverable?: boolean;
    requiresDoubleClick?: boolean;
    [key: string]: unknown;
  };
}

/**
 * Хук для отслеживания наведения мыши на объекты в Three.js сцене и получения информации о них
 * 
 * Принцип работы:
 * 1. Отслеживает движение мыши в окне браузера
 * 2. Преобразует координаты мыши в нормализованные координаты Three.js (-1 до 1)
 * 3. Использует Three.js Raycaster для определения объектов под курсором
 * 4. Проверяет наличие метаданных (userData.hoverable) у пересеченных объектов
 * 5. Создает структуру HoverableObject для первого подходящего объекта
 * 6. Предоставляет:
 *    - hoveredObject: информацию о наведенном объекте (или null)
 *    - mousePosition: текущие координаты мыши для позиционирования тултипа
 * 
 * Интегрируется с компонентом MakeHoverable, который добавляет необходимые метаданные к объектам.
 * 
 * @returns {Object} Объект с информацией о наведении и позиции курсора
 */
export function useObjectHover() {
  const { camera, scene } = useThree();
  const [hoveredObject, setHoveredObject] = useState<HoverableObject | null>(null);
  const [mousePosition, setMousePosition] = useState<{ x: number; y: number } | null>(null);
  const raycaster = useRef(new THREE.Raycaster());
  const mouse = useRef(new THREE.Vector2());

  // Обработчик движения мыши
  const handleMouseMove = (event: MouseEvent) => {
    // Вычисляем нормализованные координаты мыши (-1 до 1)
    mouse.current.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
    
    // Сохраняем позицию мыши для отображения тултипа
    setMousePosition({ x: event.clientX, y: event.clientY });
  };

  // Обновляем раскастер и проверяем пересечения при каждом кадре
  useFrame(() => {
    if (mousePosition) {
      // Устанавливаем раскастер
      raycaster.current.setFromCamera(mouse.current, camera);
      
      // Проверяем пересечения
      const intersects = raycaster.current.intersectObjects(scene.children, true);
      
      if (intersects.length > 0) {
        // Получаем первый пересеченный объект
        const object = intersects[0].object;
        
        // Проверяем, есть ли у объекта пользовательские данные
        if (object.userData && object.userData.hoverable) {
          setHoveredObject({
            uuid: object.uuid,
            name: object.name || 'Неизвестный объект',
            type: object.type || 'Mesh',
            description: object.userData.description,
            material: object.userData.material,
            dimensions: object.userData.dimensions,
            position: object.position.clone(),
            additionalInfo: object.userData.additionalInfo,
            userData: object.userData
          });
        } else {
          setHoveredObject(null);
        }
      } else {
        setHoveredObject(null);
      }
    }
  });

  // Добавляем и удаляем слушатель событий
  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return { hoveredObject, mousePosition };
} 
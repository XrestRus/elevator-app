import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import { Object3D, Group } from 'three';
import { HoverableObject } from '../../hooks/useObjectHover';
import { useHoverStore } from './ObjectHoverHandler';
import '../../styles/Hoverable.css';

/**
 * Интерфейс для объекта, который можно сделать наводимым
 */
export interface MakeHoverableProps {
  children: React.ReactNode;
  name: string;
  type?: string;
  description?: string;
  material?: string;
  dimensions?: {
    width?: number;
    height?: number;
    depth?: number;
  };
  additionalInfo?: Record<string, unknown>;
  onSelect?: (object: HoverableObject) => void;
  requiresDoubleClick?: boolean;
}

/**
 * Компонент-обертка для добавления возможности наведения и взаимодействия с компонентами Three.js
 * 
 * Принцип отслеживания:
 * 1. Компонент оборачивает любой 3D объект, добавляя к нему метаданные в userData
 * 2. Все дочерние объекты также получают метаданные через traverse
 * 3. Объект становится доступен для:
 *    - Наведения (показывает информацию при наведении курсора)
 *    - Выбора (одинарный или двойной клик, в зависимости от requiresDoubleClick)
 * 4. Взаимодействие обрабатывается через систему событий Three.js и передается в глобальный стор useHoverStore
 * 5. При выборе объекта создается структура HoverableObject, которая содержит всю информацию об объекте
 * 
 * @param children - React компоненты Three.js, которые будут обернуты
 * @param name - Название объекта для отображения в интерфейсе
 * @param type - Тип объекта (например, "Элемент конструкции", "Панель управления")
 * @param description - Описание объекта
 * @param material - Информация о материале объекта
 * @param dimensions - Размеры объекта {width, height, depth}
 * @param additionalInfo - Дополнительная информация для отображения (цвет, текстура и т.д.)
 * @param onSelect - Функция обратного вызова при выборе объекта
 * @param requiresDoubleClick - Требуется ли двойной клик для выбора (по умолчанию false)
 */
const makeHoverable = forwardRef<Group, MakeHoverableProps>(
  ({ 
    children, 
    name, 
    type, 
    description, 
    material, 
    dimensions, 
    additionalInfo, 
    onSelect,
    requiresDoubleClick = false
  }, ref) => {
    const groupRef = useRef<Group>(null);
    const { setSelectedObject } = useHoverStore();
    
    // Пробрасываем ref наружу для возможного прямого доступа
    useImperativeHandle(ref, () => groupRef.current as Group);
    
    // При монтировании компонента добавляем к объектам userData с флагом hoverable
    React.useEffect(() => {
      if (groupRef.current) {
        const hoverableData = {
          hoverable: true,
          name,
          type,
          description,
          material,
          dimensions,
          additionalInfo,
          requiresDoubleClick  // Добавляем флаг, указывающий нужен ли двойной клик
        };
        
        // Добавляем данные к группе
        groupRef.current.userData = {
          ...groupRef.current.userData,
          ...hoverableData
        };
        
        // Проходим по всем дочерним объектам и добавляем им те же данные
        groupRef.current.traverse((object: Object3D) => {
          object.userData = {
            ...object.userData,
            ...hoverableData
          };
        });
        
        // Установка имени для группы и всех её дочерних объектов
        groupRef.current.name = name;
        groupRef.current.traverse((object: Object3D) => {
          object.name = name;
        });
      }
    }, [name, type, description, material, dimensions, additionalInfo, requiresDoubleClick]);
    
    // Обработчик клика для прямого выбора объекта
    const handleClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      
      if (groupRef.current) {
        const objectData: HoverableObject = {
          uuid: groupRef.current.uuid,
          name,
          type: type || 'Group',
          description,
          material,
          dimensions,
          position: groupRef.current.position.clone(),
          additionalInfo,
          userData: {
            hoverable: true,
            requiresDoubleClick
          }
        };
        
        setSelectedObject(objectData);
        
        if (onSelect) {
          onSelect(objectData);
        }
      }
    };
    
    return (
      <group ref={groupRef} onClick={handleClick}>
        {children}
      </group>
    );
  }
);

makeHoverable.displayName = 'MakeHoverable';

export default makeHoverable; 
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
}

/**
 * Компонент-обертка для добавления возможности наведения на компоненты Three.js
 */
const makeHoverable = forwardRef<Group, MakeHoverableProps>(
  ({ children, name, type, description, material, dimensions, additionalInfo, onSelect }, ref) => {
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
          additionalInfo
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
    }, [name, type, description, material, dimensions, additionalInfo]);
    
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
          additionalInfo
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
import * as THREE from 'three';

/**
 * @deprecated Используйте компонент MakeHoverable из components/ui/makeHoverable вместо этой утилиты
 * Утилита для добавления метаданных к объектам Three.js для отображения в тултипах
 */
export const ObjectInfoUtils = {
  /**
   * @deprecated Используйте компонент MakeHoverable из components/ui/makeHoverable вместо этого метода
   * Добавляет информацию к объекту для отображения при наведении мыши
   * @param object Объект Three.js
   * @param info Информация для добавления
   */
  makeHoverable(object: THREE.Object3D, info: {
    name?: string;
    description?: string;
    material?: string;
    dimensions?: {
      width?: number;
      height?: number;
      depth?: number;
    };
    additionalInfo?: Record<string, unknown>;
  }): THREE.Object3D {
    console.warn('Deprecated: используйте компонент MakeHoverable из components/ui/makeHoverable вместо этого метода');
    
    // Устанавливаем имя объекта, если оно предоставлено
    if (info.name) {
      object.name = info.name;
    }
    
    // Инициализируем userData, если он еще не существует
    if (!object.userData) {
      object.userData = {};
    }
    
    // Отмечаем объект как доступный для наведения
    object.userData.hoverable = true;
    
    // Добавляем все предоставленные данные
    if (info.description) object.userData.description = info.description;
    if (info.material) object.userData.material = info.material;
    if (info.dimensions) object.userData.dimensions = info.dimensions;
    if (info.additionalInfo) object.userData.additionalInfo = info.additionalInfo;
    
    // Делаем то же самое для всех дочерних объектов
    object.traverse((child) => {
      if (child !== object) {
        if (!child.userData) {
          child.userData = {};
        }
        
        child.userData.hoverable = true;
        
        if (info.description) child.userData.description = info.description;
        if (info.material) child.userData.material = info.material;
        if (info.dimensions) child.userData.dimensions = info.dimensions;
        if (info.additionalInfo) child.userData.additionalInfo = info.additionalInfo;
      }
    });
    
    return object;
  },
  
  /**
   * Добавляет информацию о размерах объекта на основе его геометрии
   * @param object Объект Three.js
   * @param meshName Имя мешей, для которых нужно рассчитать размеры
   */
  addDimensionsFromGeometry(object: THREE.Object3D, meshName?: string): THREE.Object3D {
    object.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        // Проверяем имя объекта, если оно указано
        if (meshName && child.name !== meshName) {
          return;
        }
        
        // Получаем ограничивающий объект для расчета размеров
        if (!child.geometry.boundingBox) {
          child.geometry.computeBoundingBox();
        }
        
        const box = child.geometry.boundingBox;
        
        if (box) {
          const dimensions = {
            width: box.max.x - box.min.x,
            height: box.max.y - box.min.y,
            depth: box.max.z - box.min.z
          };
          
          // Инициализируем userData, если он еще не существует
          if (!child.userData) {
            child.userData = {};
          }
          
          child.userData.dimensions = dimensions;
        }
      }
    });
    
    return object;
  }
};

/**
 * @deprecated Используйте компонент MakeHoverable из components/ui/makeHoverable вместо этой функции
 * Добавляет информацию к объекту для отображения при наведении мыши
 * @param object Объект Three.js
 * @param info Информация для добавления
 */
export function makeHoverable(object: THREE.Object3D, info: {
  name?: string;
  description?: string;
  material?: string;
  dimensions?: {
    width?: number;
    height?: number;
    depth?: number;
  };
  additionalInfo?: Record<string, unknown>;
}): THREE.Object3D {
  return ObjectInfoUtils.makeHoverable(object, info);
} 
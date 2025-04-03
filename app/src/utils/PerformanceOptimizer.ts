import * as THREE from 'three';

/**
 * Класс утилит для оптимизации производительности 3D рендеринга
 */
export class PerformanceOptimizer {
  
  /**
   * Проверяет, имеет ли устройство высокую производительность
   * @returns {boolean} true если устройство мощное
   */
  static isHighPerformanceDevice(): boolean {
    return window.navigator.hardwareConcurrency > 4;
  }
  
  /**
   * Оптимизирует текстуру в зависимости от производительности устройства
   * @param {THREE.Texture} texture - текстура для оптимизации
   * @param {boolean} isHighPerf - флаг высокой производительности
   */
  static optimizeTexture(texture: THREE.Texture, isHighPerf = false): void {
    if (!texture) return;
    
    if (!isHighPerf) {
      // Для слабых устройств упрощаем настройки текстур
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;
      texture.generateMipmaps = false; // Отключаем миппинг для экономии памяти
      texture.anisotropy = 1; // Минимальная анизотропная фильтрация
    } else {
      // Для мощных устройств используем более качественные настройки
      texture.minFilter = THREE.LinearMipmapLinearFilter;
      texture.magFilter = THREE.LinearFilter;
      texture.anisotropy = 4; // Повышаем качество текстур на мощных устройствах
    }
    
    // Добавляем оптимизированный метод dispose для освобождения памяти
    const originalDispose = texture.dispose;
    texture.dispose = function() {
      if (this.image instanceof HTMLImageElement) {
        this.image.onload = null;
      }
      // Вызываем стандартный dispose
      originalDispose.call(this);
    };
  }
  
  /**
   * Объединяет геометрии в одну для снижения количества вызовов отрисовки
   * @param {THREE.BufferGeometry[]} geometries - массив геометрий для объединения
   * @param {boolean} preserveGroups - сохранять ли группы материалов
   * @returns {THREE.BufferGeometry} объединенная геометрия
   */
  static mergeGeometries(
    geometries: THREE.BufferGeometry[], 
    preserveGroups = true
  ): THREE.BufferGeometry {
    const mergedGeometry = new THREE.BufferGeometry();
    
    // Определяем, какие атрибуты есть во всех геометриях
    const attributes: Record<string, boolean> = {};
    geometries.forEach(geometry => {
      Object.keys(geometry.attributes).forEach(name => {
        attributes[name] = true;
      });
    });
    
    // Считаем общее количество вершин
    let vertexCount = 0;
    geometries.forEach(geometry => {
      vertexCount += geometry.attributes.position?.count || 0;
    });
    
    // Создаем буферы для каждого атрибута
    const attributeBuffers: Record<string, Float32Array> = {};
    Object.keys(attributes).forEach(name => {
      const itemSize = geometries[0].attributes[name]?.itemSize || 3;
      attributeBuffers[name] = new Float32Array(vertexCount * itemSize);
    });
    
    // Заполняем буферы
    let offset = 0;
    geometries.forEach(geometry => {
      Object.keys(attributes).forEach(name => {
        const attribute = geometry.attributes[name];
        if (attribute) {
          const itemSize = attribute.itemSize;
          const array = attribute.array;
          attributeBuffers[name].set(array, offset * itemSize);
        }
      });
      offset += geometry.attributes.position?.count || 0;
    });
    
    // Создаем атрибуты из буферов
    Object.keys(attributeBuffers).forEach(name => {
      const itemSize = geometries[0].attributes[name]?.itemSize || 3;
      mergedGeometry.setAttribute(
        name,
        new THREE.BufferAttribute(attributeBuffers[name], itemSize)
      );
    });
    
    // Сохраняем группы материалов, если нужно
    if (preserveGroups) {
      let groupOffset = 0;
      geometries.forEach(geometry => {
        const count = geometry.attributes.position?.count || 0;
        if (geometry.groups && geometry.groups.length > 0) {
          geometry.groups.forEach(group => {
            mergedGeometry.addGroup(
              group.start + groupOffset,
              group.count,
              group.materialIndex
            );
          });
        } else if (count > 0) {
          mergedGeometry.addGroup(groupOffset, count, 0);
        }
        groupOffset += count;
      });
    }
    
    return mergedGeometry;
  }
  
  /**
   * Оптимизирует материал в зависимости от производительности устройства
   * @param {THREE.Material} material - материал для оптимизации
   * @param {boolean} isHighPerf - флаг высокой производительности
   */
  static optimizeMaterial(material: THREE.Material, isHighPerf = false): void {
    if (!material) return;
    
    // Определяем тип материала для безопасных проверок свойств
    const stdMaterial = material as THREE.MeshStandardMaterial;
    const basicMaterial = material as THREE.MeshBasicMaterial;
    
    // Общие оптимизации для всех материалов
    material.precision = isHighPerf ? 'highp' : 'mediump';
    
    // Специфичные оптимизации для стандартных материалов
    if (material instanceof THREE.MeshStandardMaterial) {
      if (!isHighPerf) {
        // Упрощаем PBR-расчеты для слабых устройств
        stdMaterial.aoMapIntensity = 0.5; // Снижаем интенсивность ambient occlusion
        
        // Отключаем расчеты, требующие много ресурсов
        if (stdMaterial.roughnessMap) {
          stdMaterial.roughness = 0.8; // Усредненное значение
          stdMaterial.roughnessMap = null;
        }
        
        if (stdMaterial.metalnessMap) {
          stdMaterial.metalness = 0.2; // Усредненное значение
          stdMaterial.metalnessMap = null;
        }
      }
    }
    
    // Оптимизируем текстуры материала для всех типов, поддерживающих map
    if (material instanceof THREE.MeshBasicMaterial || 
        material instanceof THREE.MeshStandardMaterial || 
        material instanceof THREE.MeshPhongMaterial || 
        material instanceof THREE.MeshLambertMaterial) {
      
      if (basicMaterial.map) {
        PerformanceOptimizer.optimizeTexture(basicMaterial.map, isHighPerf);
      }
    }
    
    // Специфические текстуры для PBR-материалов
    if (material instanceof THREE.MeshStandardMaterial) {
      if (stdMaterial.normalMap) {
        PerformanceOptimizer.optimizeTexture(stdMaterial.normalMap, isHighPerf);
      }
    }
    
    // Добавляем оптимизированный dispose для освобождения памяти
    const originalDispose = material.dispose;
    material.dispose = function() {
      // Освобождаем все текстуры материала для типов с поддержкой текстур
      if (material instanceof THREE.MeshBasicMaterial || 
          material instanceof THREE.MeshStandardMaterial || 
          material instanceof THREE.MeshPhongMaterial || 
          material instanceof THREE.MeshLambertMaterial) {
        
        if (basicMaterial.map) basicMaterial.map.dispose();
      }
      
      // Дополнительные текстуры для PBR-материалов
      if (material instanceof THREE.MeshStandardMaterial) {
        if (stdMaterial.normalMap) stdMaterial.normalMap.dispose();
        if (stdMaterial.roughnessMap) stdMaterial.roughnessMap.dispose();
        if (stdMaterial.metalnessMap) stdMaterial.metalnessMap.dispose();
        if (stdMaterial.aoMap) stdMaterial.aoMap.dispose();
      }
      
      // Вызываем стандартный dispose
      originalDispose.call(this);
    };
  }
  
  /**
   * Оптимизирует сцену для повышения производительности
   * @param {THREE.Scene} scene - сцена для оптимизации
   * @param {boolean} isHighPerf - флаг высокой производительности
   */
  static optimizeScene(scene: THREE.Scene, isHighPerf = false): void {
    // Оптимизируем все объекты сцены
    scene.traverse((object) => {
      // Оптимизируем только видимые объекты
      if (!object.visible) return;
      
      // Отключаем фрустумное отсечение для низкопроизводительных устройств
      // чтобы избежать перерасчетов
      object.frustumCulled = isHighPerf;
      
      // Оптимизируем меши
      if (object instanceof THREE.Mesh) {
        // Оптимизируем материал
        if (object.material) {
          if (Array.isArray(object.material)) {
            object.material.forEach(mat => 
              PerformanceOptimizer.optimizeMaterial(mat, isHighPerf)
            );
          } else {
            PerformanceOptimizer.optimizeMaterial(object.material, isHighPerf);
          }
        }
        
        // Если это статичный объект, делаем геометрию неизменяемой
        if (!object.userData.isAnimated) {
          object.geometry.setDrawRange(0, Infinity);
          
          // Используем типизированные атрибуты вместо any
          const geometry = object.geometry;
          
          if (geometry.attributes.position) {
            geometry.attributes.position.needsUpdate = false;
          }
          
          if (geometry.attributes.normal) {
            geometry.attributes.normal.needsUpdate = false;
          }
          
          if (geometry.attributes.uv) {
            geometry.attributes.uv.needsUpdate = false;
          }
        }
      }
      
      // Оптимизируем источники света
      if (object instanceof THREE.Light) {
        if (!isHighPerf) {
          // Отключаем тени на слабых устройствах
          object.castShadow = false;
        }
        
        // Ограничиваем дальность света
        if (object instanceof THREE.PointLight || 
            object instanceof THREE.SpotLight) {
          object.distance = Math.min(object.distance, 10);
          object.decay = 2; // Физически корректное затухание
        }
      }
    });
  }
}

export default PerformanceOptimizer; 
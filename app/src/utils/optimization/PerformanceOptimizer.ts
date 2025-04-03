import * as THREE from 'three';

/**
 * Класс для оценки производительности устройства и оптимизации 3D-рендеринга
 */
class PerformanceOptimizer {
  private static instance: PerformanceOptimizer;
  private benchmarkResults: { score: number; isHighPerformance: boolean };

  private constructor() {
    this.benchmarkResults = this.runBenchmark();
  }

  /**
   * Возвращает экземпляр оптимизатора (Singleton)
   */
  public static getInstance(): PerformanceOptimizer {
    if (!PerformanceOptimizer.instance) {
      PerformanceOptimizer.instance = new PerformanceOptimizer();
    }
    return PerformanceOptimizer.instance;
  }

  /**
   * Определяет, является ли устройство высокопроизводительным
   */
  public static isHighPerformanceDevice(): boolean {
    return PerformanceOptimizer.getInstance().benchmarkResults.isHighPerformance;
  }

  /**
   * Запускает бенчмарк для оценки производительности устройства
   */
  private runBenchmark(): { score: number; isHighPerformance: boolean } {
    let score = 0;

    // Проверка видеокарты и наличия аппаратного ускорения
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
    
    if (gl) {
      // Получение информации о GPU
      const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
      const renderer = debugInfo 
        ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) 
        : '';
      
      // Проверяем наличие мощной дискретной видеокарты
      if (renderer) {
        if (/(nvidia|rtx|gtx|radeon|amd|intel iris)/i.test(renderer)) {
          score += 30; // Мощная видеокарта
        } else if (/(intel)/i.test(renderer)) {
          score += 15; // Встроенная графика
        }
      }
    }

    // Проверка количества логических ядер процессора
    if (navigator.hardwareConcurrency) {
      if (navigator.hardwareConcurrency >= 8) {
        score += 30; // Много ядер
      } else if (navigator.hardwareConcurrency >= 4) {
        score += 15; // Среднее количество ядер
      } else {
        score += 5; // Мало ядер
      }
    }

    // Проверка памяти (если доступно)
    interface NavigatorWithMemory extends Navigator {
      deviceMemory?: number;
    }

    if ((navigator as NavigatorWithMemory).deviceMemory) {
      const memory = (navigator as NavigatorWithMemory).deviceMemory || 0;
      if (memory >= 8) {
        score += 20; // Много памяти
      } else if (memory >= 4) {
        score += 10; // Среднее количество памяти
      }
    } else {
      // Если API не доступно, добавляем средний балл
      score += 10;
    }

    // Проверка, является ли устройство мобильным
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
    
    if (isMobile) {
      score -= 20; // Штраф для мобильных устройств
    }

    // Окончательная оценка
    return {
      score,
      isHighPerformance: score >= 40 // Порог для высокопроизводительных устройств
    };
  }

  /**
   * Возвращает рекомендуемую сложность модели в зависимости от производительности
   */
  public getRecommendedComplexity(): 'high' | 'medium' | 'low' {
    const { score } = this.benchmarkResults;
    
    if (score >= 50) {
      return 'high';
    } else if (score >= 30) {
      return 'medium';
    } else {
      return 'low';
    }
  }

  /**
   * Возвращает рекомендуемое значение для размера текстур
   */
  public getRecommendedTextureSize(): number {
    const { score } = this.benchmarkResults;
    
    if (score >= 50) {
      return 2048; // Высокое разрешение текстур
    } else if (score >= 30) {
      return 1024; // Среднее разрешение текстур
    } else {
      return 512; // Низкое разрешение текстур
    }
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
      
      // Уменьшаем размер текстуры для слабых устройств
      if (texture.image && texture.image instanceof HTMLImageElement) {
        const maxSize = 512; // Максимальный размер текстуры на слабых устройствах
        if (texture.image.width > maxSize || texture.image.height > maxSize) {
          console.log(`Уменьшение размера текстуры с ${texture.image.width}x${texture.image.height} до макс. ${maxSize}`);
          texture.image.width = Math.min(texture.image.width, maxSize);
          texture.image.height = Math.min(texture.image.height, maxSize);
          texture.needsUpdate = true;
        }
      }
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
   * Оптимизирует материал в зависимости от производительности устройства
   * @param {THREE.Material} material - материал для оптимизации
   * @param {boolean} isHighPerf - флаг высокой производительности
   */
  static optimizeMaterial(material: THREE.Material, isHighPerf = false): void {
    if (!material) return;
    
    // Определяем тип материала для безопасных проверок свойств
    const stdMaterial = material as THREE.MeshStandardMaterial;
    
    // Общие оптимизации для всех материалов
    material.precision = isHighPerf ? 'highp' : 'mediump';
    
    // Оптимизация карт для всех типов материалов
    const maps = [
      'map', 'alphaMap', 'aoMap', 'bumpMap', 'displacementMap', 
      'emissiveMap', 'envMap', 'lightMap', 'metalnessMap', 
      'normalMap', 'roughnessMap', 'specularMap'
    ];
    
    maps.forEach(mapName => {
      // Используем типизированную индексацию для доступа к динамическим свойствам
      const materialWithMaps = material as unknown as Record<string, THREE.Texture | null | undefined>;
      const map = materialWithMaps[mapName];
      if (map && map instanceof THREE.Texture) {
        this.optimizeTexture(map, isHighPerf);
      }
    });
    
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
        
        // Отключаем расчет нормалей в вершинах
        stdMaterial.flatShading = true;
      }
    }
    
    // Отключаем расчет нормалей на низкопроизводительных устройствах для всех материалов
    if (!isHighPerf && 'normalScale' in material) {
      const materialWithNormalScale = material as THREE.MeshStandardMaterial;
      if (materialWithNormalScale.normalScale) {
        materialWithNormalScale.normalScale.set(0.5, 0.5);
      }
    }
    
    // Помечаем материал как требующий обновления
    material.needsUpdate = true;
  }
  
  /**
   * Объединяет несколько геометрий в одну для оптимизации рендеринга
   * @param {THREE.BufferGeometry[]} geometries - массив геометрий для объединения
   * @returns {THREE.BufferGeometry} объединенная геометрия
   */
  static mergeGeometries(geometries: THREE.BufferGeometry[]): THREE.BufferGeometry | null {
    if (!geometries.length) return null;
    
    // Простая реализация слияния без использования внешних зависимостей
    try {
      const positionArrays: Float32Array[] = [];
      const normalArrays: Float32Array[] = [];
      const uvArrays: Float32Array[] = [];
      
      let positionCount = 0;
      let hasNormals = true;
      let hasUVs = true;
      
      geometries.forEach(geometry => {
        const positionAttribute = geometry.attributes.position;
        if (!positionAttribute) return;
        
        positionArrays.push(positionAttribute.array as Float32Array);
        positionCount += positionAttribute.array.length;
        
        if (geometry.attributes.normal) {
          normalArrays.push(geometry.attributes.normal.array as Float32Array);
        } else {
          hasNormals = false;
        }
        
        if (geometry.attributes.uv) {
          uvArrays.push(geometry.attributes.uv.array as Float32Array);
        } else {
          hasUVs = false;
        }
      });
      
      const mergedPositions = new Float32Array(positionCount);
      let offset = 0;
      
      positionArrays.forEach(array => {
        mergedPositions.set(array, offset);
        offset += array.length;
      });
      
      const mergedGeometry = new THREE.BufferGeometry();
      mergedGeometry.setAttribute('position', new THREE.BufferAttribute(mergedPositions, 3));
      
      if (hasNormals) {
        const mergedNormals = new Float32Array(positionCount);
        offset = 0;
        normalArrays.forEach(array => {
          mergedNormals.set(array, offset);
          offset += array.length;
        });
        mergedGeometry.setAttribute('normal', new THREE.BufferAttribute(mergedNormals, 3));
      }
      
      if (hasUVs) {
        const mergedUVs = new Float32Array(positionCount / 3 * 2);
        offset = 0;
        uvArrays.forEach(array => {
          mergedUVs.set(array, offset);
          offset += array.length;
        });
        mergedGeometry.setAttribute('uv', new THREE.BufferAttribute(mergedUVs, 2));
      }
      
      return mergedGeometry;
    } catch (error) {
      console.error('Ошибка при объединении геометрий:', error);
      return geometries[0].clone();
    }
  }
  
  /**
   * Создает инстансную версию меша для оптимизации
   * @param {THREE.Mesh} originalMesh - оригинальный меш
   * @param {number} count - количество экземпляров
   * @param {Function} transformCallback - функция для трансформации каждого экземпляра
   * @returns {THREE.InstancedMesh} инстансный меш
   */
  static createInstancedMesh(
    originalMesh: THREE.Mesh, 
    count: number, 
    transformCallback: (index: number, matrix: THREE.Matrix4) => void
  ): THREE.InstancedMesh {
    const instancedMesh = new THREE.InstancedMesh(
      originalMesh.geometry,
      originalMesh.material,
      count
    );
    
    const matrix = new THREE.Matrix4();
    for (let i = 0; i < count; i++) {
      transformCallback(i, matrix);
      instancedMesh.setMatrixAt(i, matrix);
    }
    
    instancedMesh.instanceMatrix.needsUpdate = true;
    return instancedMesh;
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
    
    // Оптимизируем LOD (Level of Detail) объекты, если они есть
    scene.traverse((object) => {
      if (object instanceof THREE.LOD) {
        // Добавляем автоматическое управление LOD на основе производительности
        const levels = object.levels;
        if (levels.length > 1 && !isHighPerf) {
          // На слабых устройствах используем только самый низкоуровневый LOD
          // и удаляем остальные, используя прямое управление массивом levels
          while (levels.length > 1) {
            levels.shift(); // Удаляем уровни высокой детализации с начала массива
          }
          
          // Проверяем наличие object.levels и совпадает ли он с нашей локальной переменной
          // для обеспечения корректной работы
          if (object.levels !== levels) {
            object.levels = levels;
          }
        }
      }
    });
  }
  
  /**
   * Управляет производительностью на основе мониторинга FPS
   * @param {number} fps - текущий FPS
   * @param {THREE.WebGLRenderer} renderer - рендерер для оптимизации
   * @param {THREE.Scene} scene - сцена для оптимизации
   */
  static manageFPS(fps: number, renderer: THREE.WebGLRenderer, scene: THREE.Scene): void {
    // Пороговые значения для регулировки производительности
    const LOW_FPS = 30;
    const TARGET_FPS = 50;
    
    const isHighPerformance = this.isHighPerformanceDevice();
    
    if (fps < LOW_FPS) {
      // Агрессивно оптимизируем при низком FPS
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 0.8));
      renderer.shadowMap.enabled = false;
      this.optimizeScene(scene, false);
      
      console.log(`Низкий FPS (${fps.toFixed(1)}): применяем агрессивную оптимизацию`);
    } else if (fps < TARGET_FPS && fps >= LOW_FPS) {
      // Умеренно оптимизируем при среднем FPS
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.0));
      renderer.shadowMap.enabled = isHighPerformance;
      this.optimizeScene(scene, false);
      
      console.log(`Средний FPS (${fps.toFixed(1)}): применяем умеренную оптимизацию`);
    } else if (fps >= TARGET_FPS && isHighPerformance) {
      // Восстанавливаем качество при высоком FPS и мощном устройстве
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
      renderer.shadowMap.enabled = true;
      this.optimizeScene(scene, true);
      
      console.log(`Высокий FPS (${fps.toFixed(1)}): восстанавливаем качество`);
    }
  }
}

export default PerformanceOptimizer; 
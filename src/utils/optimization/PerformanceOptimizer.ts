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
}

export default PerformanceOptimizer; 
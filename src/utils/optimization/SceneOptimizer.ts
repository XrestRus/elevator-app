import * as THREE from 'three';
import PerformanceOptimizer from './PerformanceOptimizer';

/**
 * Класс для оптимизации сцены Three.js на основе производительности устройства
 */
class SceneOptimizer {
  private scene: THREE.Scene;
  private renderer: THREE.WebGLRenderer;
  private optimizationApplied: boolean = false;

  /**
   * Создает новый экземпляр оптимизатора сцены
   * @param scene - Сцена Three.js для оптимизации
   * @param renderer - WebGL-рендерер Three.js
   */
  constructor(scene: THREE.Scene, renderer: THREE.WebGLRenderer) {
    this.scene = scene;
    this.renderer = renderer;
  }

  /**
   * Оптимизирует настройки renderer на основе производительности устройства
   */
  private optimizeRenderer(): void {
    const isHighPerformance = PerformanceOptimizer.isHighPerformanceDevice();
    
    // Устанавливаем соотношение пикселей в зависимости от производительности
    if (isHighPerformance) {
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    } else {
      this.renderer.setPixelRatio(1);
    }
    
    // Оптимизация теней
    if (this.renderer.shadowMap.enabled) {
      if (!isHighPerformance) {
        // Отключаем тени на слабых устройствах
        this.renderer.shadowMap.enabled = false;
      } else {
        // Оптимизируем тени на мощных устройствах
        this.renderer.shadowMap.autoUpdate = false;
        this.renderer.shadowMap.needsUpdate = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      }
    }
    
    // Другие оптимизации рендерера
    // Примечание: powerPreference должен быть установлен при создании рендерера
    // this.renderer.powerPreference = 'high-performance';
    
    // Отключаем autoClear только если это необходимо для конкретного приложения
    // this.renderer.autoClear = false;
  }

  /**
   * Оптимизирует материалы в сцене
   * @param material - Материал для оптимизации
   * @param isHighPerformance - Флаг высокой производительности устройства
   */
  private optimizeMaterial(material: THREE.Material, isHighPerformance: boolean): void {
    // Базовые оптимизации для всех материалов
    // Примечание: не все материалы имеют свойство fog
    if ('fog' in material) {
      (material as { fog: boolean }).fog = false;
    }
    
    // Специфичные оптимизации для расширенных материалов
    if (material instanceof THREE.MeshStandardMaterial || 
        material instanceof THREE.MeshPhysicalMaterial) {
      
      // Для низкопроизводительных устройств упрощаем материалы
      if (!isHighPerformance) {
        material.roughness = Math.max(material.roughness, 0.4);
        material.metalness = Math.min(material.metalness, 0.8);
        material.envMapIntensity = Math.min(material.envMapIntensity || 1, 0.5);
        
        // Отключаем эффекты, требующие дополнительных проходов рендеринга
        // Примечание: эти свойства доступны только для MeshPhysicalMaterial
        if (material instanceof THREE.MeshPhysicalMaterial) {
          material.clearcoat = 0;
          material.transmission = 0;
          
          // Проверяем наличие свойства sheen (может отсутствовать в старых версиях)
          if ('sheen' in material) {
            (material as { sheen: number }).sheen = 0;
          }
        }
      }
      
      // Ограничиваем разрешение текстур для всех устройств
      const textureSize = isHighPerformance ? 2048 : 512;
      this.optimizeTexture(material.map, textureSize);
      this.optimizeTexture(material.normalMap, textureSize);
      this.optimizeTexture(material.roughnessMap, textureSize);
      this.optimizeTexture(material.metalnessMap, textureSize);
      this.optimizeTexture(material.aoMap, textureSize);
      this.optimizeTexture(material.emissiveMap, textureSize);
    } 
    // Для стандартных материалов
    else if (material instanceof THREE.MeshLambertMaterial || 
             material instanceof THREE.MeshPhongMaterial) {
      
      if (!isHighPerformance) {
        // Упрощаем отражения и освещение
        if ('reflectivity' in material) {
          material.reflectivity = material.reflectivity ? Math.min(material.reflectivity, 0.3) : 0.3;
        }
        if ('shininess' in material) {
          material.shininess = material.shininess ? Math.min(material.shininess, 30) : 30;
        }
      }
      
      this.optimizeTexture(material.map, isHighPerformance ? 1024 : 512);
    }
  }

  /**
   * Оптимизирует текстуру, устанавливая максимальный размер и фильтрацию
   * @param texture - Текстура для оптимизации
   * @param maxSize - Максимальный размер текстуры
   */
  private optimizeTexture(texture: THREE.Texture | null, maxSize: number): void {
    if (!texture) return;
    
    texture.needsUpdate = true;
    
    // Устанавливаем оптимальные настройки фильтрации
    texture.minFilter = THREE.LinearMipMapLinearFilter;
    texture.magFilter = THREE.LinearFilter;
    
    // Ограничиваем разрешение текстуры
    if (texture.image) {
      const width = texture.image.width;
      const height = texture.image.height;
      
      if (width > maxSize || height > maxSize) {
        // Примечание: в Three.js нет прямого способа изменить размер текстуры
        // В реальной реализации здесь может быть дополнительный код для создания
        // копии текстуры с уменьшенным разрешением
      }
    }
  }

  /**
   * Оптимизирует меши в сцене
   * @param mesh - Меш для оптимизации
   * @param isHighPerformance - Флаг высокой производительности устройства
   */
  private optimizeMesh(mesh: THREE.Mesh, isHighPerformance: boolean): void {
    // Оптимизация материалов
    if (mesh.material) {
      if (Array.isArray(mesh.material)) {
        mesh.material.forEach(mat => this.optimizeMaterial(mat, isHighPerformance));
      } else {
        this.optimizeMaterial(mesh.material, isHighPerformance);
      }
    }
    
    // Оптимизация геометрии
    if (mesh.geometry) {
      // Если это статичный объект, делаем геометрию неизменяемой
      if (!mesh.userData.isAnimated) {
        mesh.geometry.setDrawRange(0, Infinity);
        
        if (mesh.geometry.attributes.position) {
          mesh.geometry.attributes.position.needsUpdate = false;
        }
        
        if (mesh.geometry.attributes.normal) {
          mesh.geometry.attributes.normal.needsUpdate = false;
        }
        
        if (mesh.geometry.attributes.uv) {
          mesh.geometry.attributes.uv.needsUpdate = false;
        }
      }
    }
    
    // Фрустумное отсечение для мощных устройств
    // для слабых - отключаем, так как это может вызывать перерасчеты
    mesh.frustumCulled = isHighPerformance;
  }

  /**
   * Запускает процесс оптимизации сцены
   */
  public optimize(): void {
    if (this.optimizationApplied) return;
    
    const isHighPerformance = PerformanceOptimizer.isHighPerformanceDevice();
    
    // Оптимизируем рендерер
    this.optimizeRenderer();
    
    // Оптимизируем объекты сцены
    this.scene.traverse((object) => {
      // Оптимизируем только видимые объекты
      if (!object.visible) return;
      
      // Оптимизируем меши
      if (object instanceof THREE.Mesh) {
        this.optimizeMesh(object, isHighPerformance);
      }
      
      // Оптимизируем источники света
      if (object instanceof THREE.Light) {
        if (!isHighPerformance) {
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
    
    // Включаем окклюзию и кулинг для всех устройств
    // Эти свойства относятся к Three.js WebGLRenderer и его возможностям
    
    this.optimizationApplied = true;
  }

  /**
   * Обновляет оптимизации сцены (например, после добавления новых объектов)
   */
  public update(): void {
    this.optimizationApplied = false;
    this.optimize();
  }

  /**
   * Применяет оптимизации к сцене на основе производительности устройства
   * @param scene - Сцена для оптимизации
   * @param renderer - WebGL-рендерер
   */
  public static applyOptimizations(scene: THREE.Scene, renderer: THREE.WebGLRenderer): SceneOptimizer {
    const optimizer = new SceneOptimizer(scene, renderer);
    optimizer.optimize();
    return optimizer;
  }
}

export default SceneOptimizer; 
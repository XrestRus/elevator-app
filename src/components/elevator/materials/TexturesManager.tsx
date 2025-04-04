import { useMemo, useEffect } from 'react';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { loadPBRTextures, createTexturePaths, createPBRMaterial } from '../ElevatorMaterialsUtils';
import { MaterialsConfig, TexturesManagerResult, EmissionProps, TransparencyProps, RefractionProps, AnisotropyProps } from './types';

/**
 * Хук для управления текстурами лифта
 * Отвечает за загрузку и оптимизацию всех текстур, используемых в модели лифта
 */
export const useTexturesManager = (
  materials: MaterialsConfig, 
  isHighPerformance: boolean
): TexturesManagerResult => {
  // Кэширование путей к текстурам
  const wallTexturePath = materials.texture?.walls || "";
  const floorTexturePath = materials.texture?.floor || "";
  const ceilingTexturePath = materials.texture?.ceiling || "";
  const doorsTexturePath = materials.texture?.doors || "";
  const frontWallTexturePath = materials.texture?.frontWall || "";

  // Кэширование PBR текстур с помощью хука useTexture
  // Используем useMemo для загрузки только при изменении пути к текстуре
  const wallPBRPaths = useMemo(
    () => loadPBRTextures(wallTexturePath),
    [wallTexturePath]
  );
  const floorPBRPaths = useMemo(
    () => loadPBRTextures(floorTexturePath),
    [floorTexturePath]
  );
  const ceilingPBRPaths = useMemo(
    () => loadPBRTextures(ceilingTexturePath),
    [ceilingTexturePath]
  );
  const doorsPBRPaths = useMemo(
    () => loadPBRTextures(doorsTexturePath),
    [doorsTexturePath]
  );
  const frontWallPBRPaths = useMemo(
    () => loadPBRTextures(frontWallTexturePath),
    [frontWallTexturePath]
  );

  // Для предотвращения ошибок загрузки, используем заглушки для отсутствующих текстур
  // Создаем фиктивную текстуру размером 1x1 пиксель для использования в качестве заглушки
  const dummyTexturePath = "/textures/dummy.png"; // Путь к заглушке

  // Всегда включаем хотя бы одну текстуру (заглушку), чтобы хук useTexture всегда вызывался
  const wallPaths = useMemo(
    () => createTexturePaths(wallPBRPaths, dummyTexturePath),
    [wallPBRPaths]
  );

  const floorPaths = useMemo(
    () => createTexturePaths(floorPBRPaths, dummyTexturePath),
    [floorPBRPaths]
  );

  const ceilingPaths = useMemo(
    () => createTexturePaths(ceilingPBRPaths, dummyTexturePath),
    [ceilingPBRPaths]
  );

  const doorsPaths = useMemo(
    () => createTexturePaths(doorsPBRPaths, dummyTexturePath),
    [doorsPBRPaths]
  );

  const frontWallPaths = useMemo(
    () => createTexturePaths(frontWallPBRPaths, dummyTexturePath),
    [frontWallPBRPaths]
  );

  // Теперь useTexture всегда вызывается с каким-то путем
  const wallTextures = useTexture(wallPaths);
  const floorTextures = useTexture(floorPaths);
  const ceilingTextures = useTexture(ceilingPaths);
  const doorsTextures = useTexture(doorsPaths);
  const frontWallTextures = useTexture(frontWallPaths);
  
  // Оптимизация текстур в зависимости от производительности устройства
  useEffect(() => {
    // Применяем оптимизацию к загруженным текстурам
    const optimizeTexture = (texture: THREE.Texture | undefined) => {
      if (!texture) return;
      
      // Если устройство не мощное, используем менее качественные настройки текстур
      if (!isHighPerformance) {
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;
        texture.generateMipmaps = false; // Отключаем миппинг для экономии памяти
        texture.anisotropy = 1; // Минимальная анизотропная фильтрация
      } else {
        // Для мощных устройств используем более качественные настройки
        texture.anisotropy = 4; // Повышаем качество текстур на мощных устройствах
      }
      
      // Освобождаем память GPU, если текстура больше не используется
      texture.dispose = function() {
        if (this.image instanceof HTMLImageElement) {
          this.image.onload = null;
        }
        // Вызываем стандартный dispose
        THREE.Texture.prototype.dispose.call(this);
      };
    };
    
    // Оптимизируем все текстуры
    Object.values(wallTextures).forEach(optimizeTexture);
    Object.values(floorTextures).forEach(optimizeTexture);
    Object.values(ceilingTextures).forEach(optimizeTexture);
    Object.values(doorsTextures).forEach(optimizeTexture);
    Object.values(frontWallTextures).forEach(optimizeTexture);
    
  }, [wallTextures, floorTextures, ceilingTextures, doorsTextures, frontWallTextures, isHighPerformance]);

  // Обработка ошибок при загрузке текстур
  useEffect(() => {
    // Простая обработка ошибок загрузки текстур
    const handleGlobalError = (event: Event | ErrorEvent) => {
      const target = event.target as HTMLImageElement;
      if (target && target.src && !target.src.includes('dummy.png')) {
        console.error(`Ошибка загрузки текстуры:`, {
          url: target.src,
          error: event instanceof ErrorEvent ? event.message : 'Неизвестная ошибка'
        });
        
        // Предотвращаем всплытие ошибки до глобального обработчика и показ в консоли браузера
        event.stopPropagation();
        event.preventDefault();
      }
      
      return true; // Предотвращаем стандартную обработку ошибки
    };
    
    // Слушаем ошибки загрузки изображений
    window.addEventListener('error', handleGlobalError, true);
    
    return () => {
      window.removeEventListener('error', handleGlobalError, true);
    };
  }, []);

  // Создаем PBR материалы только если есть реальные текстуры (не заглушки)
  const wallPBRMaterial = useMemo(
    () => createPBRMaterial(
      wallTextures, 
      wallPBRPaths.textureType, 
      materials.walls, 
      materials.roughness.walls, 
      materials.metalness.walls,
      // Новые свойства материалов
      materials.emission.enabled ? {
        value: materials.emission.walls,
        color: materials.emission.color,
        enabled: materials.emission.enabled
      } as EmissionProps : undefined,
      materials.transparency.enabled ? {
        value: materials.transparency.walls,
        enabled: materials.transparency.enabled
      } as TransparencyProps : undefined,
      materials.refraction.enabled ? {
        value: materials.refraction.walls,
        enabled: materials.refraction.enabled
      } as RefractionProps : undefined,
      materials.anisotropy.enabled ? {
        value: materials.anisotropy.walls,
        direction: materials.anisotropy.direction,
        enabled: materials.anisotropy.enabled
      } as AnisotropyProps : undefined
    ),
    [
      wallTextures, 
      wallPBRPaths, 
      materials.walls, 
      materials.roughness.walls, 
      materials.metalness.walls,
      materials.emission.walls,
      materials.emission.color,
      materials.emission.enabled,
      materials.transparency.walls,
      materials.transparency.enabled,
      materials.refraction.walls,
      materials.refraction.enabled,
      materials.anisotropy.walls,
      materials.anisotropy.direction,
      materials.anisotropy.enabled
    ]
  );

  // Создаем PBR материал для пола с мемоизацией
  const floorPBRMaterial = useMemo(
    () => createPBRMaterial(
      floorTextures, 
      floorPBRPaths.textureType, 
      materials.floor, 
      materials.roughness.floor, 
      materials.metalness.floor,
      // Новые свойства материалов
      materials.emission.enabled ? {
        value: materials.emission.floor,
        color: materials.emission.color,
        enabled: materials.emission.enabled
      } as EmissionProps : undefined,
      materials.transparency.enabled ? {
        value: materials.transparency.floor,
        enabled: materials.transparency.enabled
      } as TransparencyProps : undefined,
      materials.refraction.enabled ? {
        value: materials.refraction.floor,
        enabled: materials.refraction.enabled
      } as RefractionProps : undefined,
      materials.anisotropy.enabled ? {
        value: materials.anisotropy.floor,
        direction: materials.anisotropy.direction,
        enabled: materials.anisotropy.enabled
      } as AnisotropyProps : undefined
    ),
    [
      floorTextures, 
      floorPBRPaths, 
      materials.floor, 
      materials.roughness.floor, 
      materials.metalness.floor,
      materials.emission.floor,
      materials.emission.color,
      materials.emission.enabled,
      materials.transparency.floor,
      materials.transparency.enabled,
      materials.refraction.floor,
      materials.refraction.enabled,
      materials.anisotropy.floor,
      materials.anisotropy.direction,
      materials.anisotropy.enabled
    ]
  );

  // Создаем PBR материал для потолка с мемоизацией
  const ceilingPBRMaterial = useMemo(
    () => createPBRMaterial(
      ceilingTextures, 
      ceilingPBRPaths.textureType, 
      materials.ceiling, 
      materials.roughness.ceiling, 
      materials.metalness.ceiling,
      // Новые свойства материалов
      materials.emission.enabled ? {
        value: materials.emission.ceiling,
        color: materials.emission.color,
        enabled: materials.emission.enabled
      } as EmissionProps : undefined,
      materials.transparency.enabled ? {
        value: materials.transparency.ceiling,
        enabled: materials.transparency.enabled
      } as TransparencyProps : undefined,
      materials.refraction.enabled ? {
        value: materials.refraction.ceiling,
        enabled: materials.refraction.enabled
      } as RefractionProps : undefined,
      materials.anisotropy.enabled ? {
        value: materials.anisotropy.ceiling,
        direction: materials.anisotropy.direction,
        enabled: materials.anisotropy.enabled
      } as AnisotropyProps : undefined
    ),
    [
      ceilingTextures, 
      ceilingPBRPaths, 
      materials.ceiling, 
      materials.roughness.ceiling, 
      materials.metalness.ceiling,
      materials.emission.ceiling,
      materials.emission.color,
      materials.emission.enabled,
      materials.transparency.ceiling,
      materials.transparency.enabled,
      materials.refraction.ceiling,
      materials.refraction.enabled,
      materials.anisotropy.ceiling,
      materials.anisotropy.direction,
      materials.anisotropy.enabled
    ]
  );

  // Создаем PBR материал для дверей с мемоизацией
  const doorsPBRMaterial = useMemo(
    () => createPBRMaterial(
      doorsTextures, 
      doorsPBRPaths.textureType, 
      materials.doors, 
      materials.roughness.doors, 
      materials.metalness.doors,
      // Новые свойства материалов
      materials.emission.enabled ? {
        value: materials.emission.doors,
        color: materials.emission.color,
        enabled: materials.emission.enabled
      } as EmissionProps : undefined,
      materials.transparency.enabled ? {
        value: materials.transparency.doors,
        enabled: materials.transparency.enabled
      } as TransparencyProps : undefined,
      materials.refraction.enabled ? {
        value: materials.refraction.doors,
        enabled: materials.refraction.enabled
      } as RefractionProps : undefined,
      materials.anisotropy.enabled ? {
        value: materials.anisotropy.doors,
        direction: materials.anisotropy.direction,
        enabled: materials.anisotropy.enabled
      } as AnisotropyProps : undefined
    ),
    [
      doorsTextures, 
      doorsPBRPaths, 
      materials.doors, 
      materials.roughness.doors, 
      materials.metalness.doors,
      materials.emission.doors,
      materials.emission.color,
      materials.emission.enabled,
      materials.transparency.doors,
      materials.transparency.enabled,
      materials.refraction.doors,
      materials.refraction.enabled,
      materials.anisotropy.doors,
      materials.anisotropy.direction,
      materials.anisotropy.enabled
    ]
  );

  // Создаем PBR материал для передней стены с мемоизацией
  const frontWallPBRMaterial = useMemo(
    () => createPBRMaterial(
      frontWallTextures, 
      frontWallPBRPaths.textureType, 
      materials.walls, 
      materials.roughness.walls, 
      materials.metalness.walls,
      // Новые свойства материалов
      materials.emission.enabled ? {
        value: materials.emission.walls,
        color: materials.emission.color,
        enabled: materials.emission.enabled
      } as EmissionProps : undefined,
      materials.transparency.enabled ? {
        value: materials.transparency.walls,
        enabled: materials.transparency.enabled
      } as TransparencyProps : undefined,
      materials.refraction.enabled ? {
        value: materials.refraction.walls,
        enabled: materials.refraction.enabled
      } as RefractionProps : undefined,
      materials.anisotropy.enabled ? {
        value: materials.anisotropy.walls,
        direction: materials.anisotropy.direction,
        enabled: materials.anisotropy.enabled
      } as AnisotropyProps : undefined
    ),
    [
      frontWallTextures, 
      frontWallPBRPaths, 
      materials.walls, 
      materials.roughness.walls, 
      materials.metalness.walls,
      materials.emission.walls,
      materials.emission.color,
      materials.emission.enabled,
      materials.transparency.walls,
      materials.transparency.enabled,
      materials.refraction.walls,
      materials.refraction.enabled,
      materials.anisotropy.walls,
      materials.anisotropy.direction,
      materials.anisotropy.enabled
    ]
  );

  return {
    wallTextures,
    floorTextures,
    ceilingTextures,
    doorsTextures,
    frontWallTextures,
    wallPBRMaterial,
    floorPBRMaterial,
    ceilingPBRMaterial,
    doorsPBRMaterial,
    frontWallPBRMaterial
  };
}; 
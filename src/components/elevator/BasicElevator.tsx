import React, { useMemo, useEffect } from "react";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import ElevatorPanel from "./ElevatorPanel.tsx";
import ElevatorWalls from "./ElevatorWalls.tsx";
import ElevatorFloor from "./ElevatorFloor.tsx";
import ElevatorCeiling from "./ElevatorCeiling.tsx";
import ElevatorDoors from "./ElevatorDoors.tsx";
import ElevatorMirror from "./ElevatorMirror.tsx";
import ElevatorHandrails from "./ElevatorHandrails.tsx";
import DecorationStripes from "./DecorationStripes.tsx";
import JointStripes from "./JointStripes";
import PerformanceOptimizer from "../../utils/optimization/PerformanceOptimizer";
import {
  createWallMaterialWithCustomRepeat,
  loadPBRTextures,
  createTexturePaths,
  createPBRMaterial,
} from "./ElevatorMaterialsUtils.tsx";
import CeilingLights from "./CeilingLights.tsx";

/**
 * Компонент, представляющий базовую геометрию лифта с анимированными дверьми и оптимизированным рендерингом
 */
const BasicElevator: React.FC = () => {
  const elevator = useSelector((state: RootState) => state.elevator);
  const { materials, dimensions, doorsOpen } = elevator;
  const lightsOn = elevator.lighting.enabled;
  // Проверяем производительность устройства для адаптивной оптимизации
  const isHighPerformance = useMemo(() => PerformanceOptimizer.isHighPerformanceDevice(), []);

  // Новый подход: двери занимают почти всю ширину лифта
  // Оставляем только небольшие боковые части для рамки
  const doorHeight = dimensions.height - 0.3; // Высота дверного проема

  // Статичные материалы с мемоизацией для стен, пола, потолка и дверей
  const basicWallMaterial = useMemo(
    () => {
      // Начинаем с стандартного материала
      const materialProps: THREE.MeshStandardMaterialParameters & { 
        anisotropy?: number; 
        anisotropyRotation?: number;
        transmission?: number;
        refractionRatio?: number;
        ior?: number;
        emissive?: THREE.Color;
        emissiveIntensity?: number;
      } = {
        color: materials.walls,
        metalness: materials.metalness.walls,
        roughness: materials.roughness.walls,
      };
      
      // Добавляем свойство эмиссии (свечения)
      if (materials.emission.enabled) {
        materialProps.emissive = new THREE.Color(materials.emission.color);
        materialProps.emissiveIntensity = materials.emission.walls;
      }
      
      // Добавляем свойство прозрачности
      if (materials.transparency.enabled && materials.transparency.walls > 0) {
        materialProps.transparent = true;
        materialProps.opacity = 1 - materials.transparency.walls;
        materialProps.depthWrite = materials.transparency.walls < 0.95;
      }
      
      // Создаем материал определенного типа в зависимости от включенных свойств
      if ((materials.refraction.enabled) || 
          (materials.anisotropy.enabled && materials.anisotropy.walls > 0)) {
        // Для преломления и анизотропии нужен MeshPhysicalMaterial
        const physicalMaterial = new THREE.MeshPhysicalMaterial(materialProps);
        
        // Применяем свойство преломления
        if (materials.refraction.enabled) {
          physicalMaterial.transmission = materials.transparency.enabled 
            ? materials.transparency.walls
            : 0.5;
          physicalMaterial.ior = materials.refraction.walls;
        }
        
        // Применяем свойство анизотропности
        if (materials.anisotropy.enabled && materials.anisotropy.walls > 0) {
          physicalMaterial.anisotropy = materials.anisotropy.walls;
          physicalMaterial.anisotropyRotation = materials.anisotropy.direction;
        }
        
        return physicalMaterial;
      } else {
        // Для остальных случаев достаточно MeshStandardMaterial
        return new THREE.MeshStandardMaterial(materialProps);
      }
    },
    [
      materials.walls, 
      materials.metalness.walls, 
      materials.roughness.walls,
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

  const basicFloorMaterial = useMemo(
    () => {
      // Начинаем с стандартного материала
      const materialProps: THREE.MeshStandardMaterialParameters & { 
        anisotropy?: number; 
        anisotropyRotation?: number;
        transmission?: number;
        refractionRatio?: number;
        ior?: number;
        emissive?: THREE.Color;
        emissiveIntensity?: number;
      } = {
        color: materials.floor,
        metalness: materials.metalness.floor,
        roughness: materials.roughness.floor,
      };
      
      // Добавляем свойство эмиссии (свечения)
      if (materials.emission.enabled) {
        materialProps.emissive = new THREE.Color(materials.emission.color);
        materialProps.emissiveIntensity = materials.emission.floor;
      }
      
      // Добавляем свойство прозрачности
      if (materials.transparency.enabled && materials.transparency.floor > 0) {
        materialProps.transparent = true;
        materialProps.opacity = 1 - materials.transparency.floor;
        materialProps.depthWrite = materials.transparency.floor < 0.95;
      }
      
      // Создаем материал определенного типа в зависимости от включенных свойств
      if ((materials.refraction.enabled) || 
          (materials.anisotropy.enabled && materials.anisotropy.floor > 0)) {
        // Для преломления и анизотропии нужен MeshPhysicalMaterial
        const physicalMaterial = new THREE.MeshPhysicalMaterial(materialProps);
        
        // Применяем свойство преломления
        if (materials.refraction.enabled) {
          physicalMaterial.transmission = materials.transparency.enabled 
            ? materials.transparency.floor
            : 0.5;
          physicalMaterial.ior = materials.refraction.floor;
        }
        
        // Применяем свойство анизотропности
        if (materials.anisotropy.enabled && materials.anisotropy.floor > 0) {
          physicalMaterial.anisotropy = materials.anisotropy.floor;
          physicalMaterial.anisotropyRotation = materials.anisotropy.direction;
        }
        
        return physicalMaterial;
      } else {
        // Для остальных случаев достаточно MeshStandardMaterial
        return new THREE.MeshStandardMaterial(materialProps);
      }
    },
    [
      materials.floor, 
      materials.metalness.floor, 
      materials.roughness.floor,
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

  const basicCeilingMaterial = useMemo(
    () => {
      // Начинаем с стандартного материала
      const materialProps: THREE.MeshStandardMaterialParameters & { 
        anisotropy?: number; 
        anisotropyRotation?: number;
        transmission?: number;
        refractionRatio?: number;
        ior?: number;
        emissive?: THREE.Color;
        emissiveIntensity?: number;
      } = {
        color: materials.ceiling,
        metalness: materials.metalness.ceiling,
        roughness: materials.roughness.ceiling,
      };
      
      // Добавляем свойство эмиссии (свечения)
      if (materials.emission.enabled) {
        materialProps.emissive = new THREE.Color(materials.emission.color);
        materialProps.emissiveIntensity = materials.emission.ceiling;
      }
      
      // Добавляем свойство прозрачности
      if (materials.transparency.enabled && materials.transparency.ceiling > 0) {
        materialProps.transparent = true;
        materialProps.opacity = 1 - materials.transparency.ceiling;
        materialProps.depthWrite = materials.transparency.ceiling < 0.95;
      }
      
      // Создаем материал определенного типа в зависимости от включенных свойств
      if ((materials.refraction.enabled) || 
          (materials.anisotropy.enabled && materials.anisotropy.ceiling > 0)) {
        // Для преломления и анизотропии нужен MeshPhysicalMaterial
        const physicalMaterial = new THREE.MeshPhysicalMaterial(materialProps);
        
        // Применяем свойство преломления
        if (materials.refraction.enabled) {
          physicalMaterial.transmission = materials.transparency.enabled 
            ? materials.transparency.ceiling
            : 0.5;
          physicalMaterial.ior = materials.refraction.ceiling;
        }
        
        // Применяем свойство анизотропности
        if (materials.anisotropy.enabled && materials.anisotropy.ceiling > 0) {
          physicalMaterial.anisotropy = materials.anisotropy.ceiling;
          physicalMaterial.anisotropyRotation = materials.anisotropy.direction;
        }
        
        return physicalMaterial;
      } else {
        // Для остальных случаев достаточно MeshStandardMaterial
        return new THREE.MeshStandardMaterial(materialProps);
      }
    },
    [
      materials.ceiling, 
      materials.metalness.ceiling, 
      materials.roughness.ceiling,
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

  const doorMaterial = useMemo(
    () => {
      // Начинаем с стандартного материала
      const materialProps: THREE.MeshStandardMaterialParameters & { 
        anisotropy?: number; 
        anisotropyRotation?: number;
        transmission?: number;
        refractionRatio?: number;
        ior?: number;
        emissive?: THREE.Color;
        emissiveIntensity?: number;
      } = {
        color: materials.doors,
        metalness: materials.metalness.doors,
        roughness: materials.roughness.doors,
      };
      
      // Добавляем свойство эмиссии (свечения)
      if (materials.emission.enabled) {
        materialProps.emissive = new THREE.Color(materials.emission.color);
        materialProps.emissiveIntensity = materials.emission.doors;
      }
      
      // Добавляем свойство прозрачности
      if (materials.transparency.enabled && materials.transparency.doors > 0) {
        materialProps.transparent = true;
        materialProps.opacity = 1 - materials.transparency.doors;
        materialProps.depthWrite = materials.transparency.doors < 0.95;
      }
      
      // Создаем материал определенного типа в зависимости от включенных свойств
      if ((materials.refraction.enabled) || 
          (materials.anisotropy.enabled && materials.anisotropy.doors > 0)) {
        // Для преломления и анизотропии нужен MeshPhysicalMaterial
        const physicalMaterial = new THREE.MeshPhysicalMaterial(materialProps);
        
        // Применяем свойство преломления
        if (materials.refraction.enabled) {
          physicalMaterial.transmission = materials.transparency.enabled 
            ? materials.transparency.doors
            : 0.5;
          physicalMaterial.ior = materials.refraction.doors;
        }
        
        // Применяем свойство анизотропности
        if (materials.anisotropy.enabled && materials.anisotropy.doors > 0) {
          physicalMaterial.anisotropy = materials.anisotropy.doors;
          physicalMaterial.anisotropyRotation = materials.anisotropy.direction;
        }
        
        return physicalMaterial;
      } else {
        // Для остальных случаев достаточно MeshStandardMaterial
        return new THREE.MeshStandardMaterial(materialProps);
      }
    },
    [
      materials.doors, 
      materials.metalness.doors, 
      materials.roughness.doors,
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
  const dummyTexturePath = "/textures/dummy.png"; // Путь к заглушке (можно заменить на реальный)

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
      } : undefined,
      materials.transparency.enabled ? {
        value: materials.transparency.walls,
        enabled: materials.transparency.enabled
      } : undefined,
      materials.refraction.enabled ? {
        value: materials.refraction.walls,
        enabled: materials.refraction.enabled
      } : undefined,
      materials.anisotropy.enabled ? {
        value: materials.anisotropy.walls,
        direction: materials.anisotropy.direction,
        enabled: materials.anisotropy.enabled
      } : undefined
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
      } : undefined,
      materials.transparency.enabled ? {
        value: materials.transparency.floor,
        enabled: materials.transparency.enabled
      } : undefined,
      materials.refraction.enabled ? {
        value: materials.refraction.floor,
        enabled: materials.refraction.enabled
      } : undefined,
      materials.anisotropy.enabled ? {
        value: materials.anisotropy.floor,
        direction: materials.anisotropy.direction,
        enabled: materials.anisotropy.enabled
      } : undefined
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
      } : undefined,
      materials.transparency.enabled ? {
        value: materials.transparency.ceiling,
        enabled: materials.transparency.enabled
      } : undefined,
      materials.refraction.enabled ? {
        value: materials.refraction.ceiling,
        enabled: materials.refraction.enabled
      } : undefined,
      materials.anisotropy.enabled ? {
        value: materials.anisotropy.ceiling,
        direction: materials.anisotropy.direction,
        enabled: materials.anisotropy.enabled
      } : undefined
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
      } : undefined,
      materials.transparency.enabled ? {
        value: materials.transparency.doors,
        enabled: materials.transparency.enabled
      } : undefined,
      materials.refraction.enabled ? {
        value: materials.refraction.doors,
        enabled: materials.refraction.enabled
      } : undefined,
      materials.anisotropy.enabled ? {
        value: materials.anisotropy.doors,
        direction: materials.anisotropy.direction,
        enabled: materials.anisotropy.enabled
      } : undefined
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
      } : undefined,
      materials.transparency.enabled ? {
        value: materials.transparency.walls,
        enabled: materials.transparency.enabled
      } : undefined,
      materials.refraction.enabled ? {
        value: materials.refraction.walls,
        enabled: materials.refraction.enabled
      } : undefined,
      materials.anisotropy.enabled ? {
        value: materials.anisotropy.walls,
        direction: materials.anisotropy.direction,
        enabled: materials.anisotropy.enabled
      } : undefined
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

  // Создаем материал для передней стены без текстуры (мемоизация)
  const frontWallMaterial = useMemo(
    () => {
      // Начинаем с стандартного материала
      const materialProps: THREE.MeshStandardMaterialParameters & { 
        anisotropy?: number; 
        anisotropyRotation?: number;
        transmission?: number;
        refractionRatio?: number;
        ior?: number;
        emissive?: THREE.Color;
        emissiveIntensity?: number;
      } = {
        color: materials.walls,
        metalness: materials.metalness.walls,
        roughness: materials.roughness.walls,
      };
      
      // Добавляем свойство эмиссии (свечения)
      if (materials.emission.enabled) {
        materialProps.emissive = new THREE.Color(materials.emission.color);
        materialProps.emissiveIntensity = materials.emission.walls;
      }
      
      // Добавляем свойство прозрачности
      if (materials.transparency.enabled && materials.transparency.walls > 0) {
        materialProps.transparent = true;
        materialProps.opacity = 1 - materials.transparency.walls;
        materialProps.depthWrite = materials.transparency.walls < 0.95;
      }
      
      // Создаем материал определенного типа в зависимости от включенных свойств
      if ((materials.refraction.enabled) || 
          (materials.anisotropy.enabled && materials.anisotropy.walls > 0)) {
        // Для преломления и анизотропии нужен MeshPhysicalMaterial
        const physicalMaterial = new THREE.MeshPhysicalMaterial(materialProps);
        
        // Применяем свойство преломления
        if (materials.refraction.enabled) {
          physicalMaterial.transmission = materials.transparency.enabled 
            ? materials.transparency.walls
            : 0.5;
          physicalMaterial.ior = materials.refraction.walls;
        }
        
        // Применяем свойство анизотропности
        if (materials.anisotropy.enabled && materials.anisotropy.walls > 0) {
          physicalMaterial.anisotropy = materials.anisotropy.walls;
          physicalMaterial.anisotropyRotation = materials.anisotropy.direction;
        }
        
        return physicalMaterial;
      } else {
        // Для остальных случаев достаточно MeshStandardMaterial
        return new THREE.MeshStandardMaterial(materialProps);
      }
    },
    [
      materials.walls, 
      materials.metalness.walls, 
      materials.roughness.walls,
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

  // Определяем, какой материал использовать: PBR или обычный
  const actualWallMaterial = wallPBRMaterial || basicWallMaterial;
  const actualFloorMaterial = floorPBRMaterial || basicFloorMaterial;
  const actualCeilingMaterial = ceilingPBRMaterial || basicCeilingMaterial;
  const actualDoorMaterial = doorsPBRMaterial || doorMaterial;
  const actualFrontWallMaterial = frontWallPBRMaterial || frontWallMaterial;

  // Материалы с разным повторением текстур для разных стен (мемоизация)
  const sideWallMaterial = useMemo(
    () => createWallMaterialWithCustomRepeat(actualWallMaterial, 1, 1),
    [actualWallMaterial]
  );

  const backWallMaterial = useMemo(
    () => createWallMaterialWithCustomRepeat(actualWallMaterial, 1, 1),
    [actualWallMaterial]
  );

  // Материал для поручней (автоматически использует цвет из настроек)
  const handrailMaterial = useMemo(
    () => {
      const color = new THREE.Color(materials.handrails);
      
      return new THREE.MeshPhysicalMaterial({
        color: color,
        metalness: 0.9,
        roughness: 0.1,
        envMapIntensity: 1.5,
        clearcoat: 0.3, // Добавляем легкое покрытие лаком для глянца
        clearcoatRoughness: 0.1, // Делаем покрытие гладким
      });
    },
    [materials.handrails] // Зависимость только от цвета поручней
  );

  // Материал для рамки вокруг дверей (металлический)
  const doorFrameMaterial = useMemo(
    () => {
      const color = new THREE.Color(materials.walls);
      // Делаем цвет немного светлее для контраста
      color.multiplyScalar(1.1);
      return new THREE.MeshStandardMaterial({
        color: color,
        metalness: 0.8,
        roughness: 0.2,
      });
    },
    [materials.walls]
  );

  // Материал для декоративных полос
  const decorationStripesMaterial = useMemo(() => {
    if (!elevator.decorationStripes?.enabled) return null;
    
    // Наследуем цвет стен, возможно с небольшим оттенком
    const baseColor = new THREE.Color(materials.walls);
    
    // Вместо добавления небольшого оттенка используем сам цвет полос напрямую
    let finalColor = baseColor;
    
    if (elevator.decorationStripes.color) {
      // Используем цвет полос как основной
      finalColor = new THREE.Color(elevator.decorationStripes.color);
      
      // Добавляем совсем небольшое влияние цвета стен только для металлических 
      // материалов, чтобы сохранить гармоничность
      if (elevator.decorationStripes.material === 'metal') {
        finalColor.lerp(baseColor, 0.15); // 15% влияния цвета стен
      }
    }
    
    return new THREE.MeshStandardMaterial({
      color: finalColor,
      metalness: elevator.decorationStripes.material === 'metal' ? 0.9 : 
                (elevator.decorationStripes.material === 'glossy' ? 0.7 : 0.1),
      roughness: elevator.decorationStripes.material === 'metal' ? 0.1 : 
                (elevator.decorationStripes.material === 'glossy' ? 0.05 : 0.8),
      emissive: elevator.decorationStripes.material === 'glossy' ? 
                finalColor : '#000000',
      emissiveIntensity: elevator.decorationStripes.material === 'glossy' ? 0.05 : 0
    });
  }, [
    elevator.decorationStripes?.enabled,
    elevator.decorationStripes?.color,
    elevator.decorationStripes?.material,
    materials.walls
  ]);

  // Материал для стыков между стенами
  const jointStripeMaterial = useMemo(() => {
    // Если стыки не включены, возвращаем null
    if (!elevator.joints?.enabled) return null;
    
    // Если полосы активированы, используем их цвет и материал для стыков
    if (elevator.decorationStripes?.enabled && decorationStripesMaterial) {
      return decorationStripesMaterial;
    }
    
    // Если указан цвет стыков, используем его
    if (elevator.joints?.color) {
      const jointColor = new THREE.Color(elevator.joints.color);
      
      return new THREE.MeshStandardMaterial({
        color: jointColor,
        metalness: elevator.joints.material === 'metal' ? 0.9 : 
                  (elevator.joints.material === 'glossy' ? 0.7 : 0.1),
        roughness: elevator.joints.material === 'metal' ? 0.1 : 
                  (elevator.joints.material === 'glossy' ? 0.05 : 0.8),
        emissive: elevator.joints.material === 'glossy' ? 
                  jointColor : '#000000',
        emissiveIntensity: elevator.joints.material === 'glossy' ? 0.05 : 0
      });
    }
    
    // Если цвет не указан, используем цвет стен, но делаем его гораздо темнее
    const color = new THREE.Color(materials.walls);
    color.multiplyScalar(0.5); // Делаем цвет ещё темнее (50% от исходного)
    
    return new THREE.MeshStandardMaterial({
      color: color,
      metalness: 0.9, // Увеличиваем металличность
      roughness: 0.1, // Уменьшаем шероховатость для более заметного блеска
    });
  }, [
    elevator.joints?.enabled,
    elevator.joints?.color,
    elevator.joints?.material,
    elevator.decorationStripes?.enabled,
    decorationStripesMaterial,
    materials.walls
  ]);
  
  return (
    <group>
      {/* Пол - с оптимизацией */}
      <ElevatorFloor 
        dimensions={dimensions} 
        floorMaterial={actualFloorMaterial}
      />
      
      {/* Потолок - с оптимизацией и зазором по краям */}
      <ElevatorCeiling 
        dimensions={dimensions} 
        ceilingMaterial={actualCeilingMaterial}
      />
      
      {/* Встроенные светильники - конфигурация 2x2 */}
      {elevator.visibility.lights && (
        <CeilingLights 
          color={elevator.lighting.color} 
          intensity={elevator.lighting.intensity} 
        />
      )}
      
      {/* Стены и дверные рамки - с оптимизацией */}
      <ElevatorWalls 
        dimensions={dimensions}
        backWallMaterial={backWallMaterial}
        sideWallMaterial={sideWallMaterial}
        frontWallMaterial={actualFrontWallMaterial}
        doorFrameMaterial={doorFrameMaterial}
      />
      
      {/* Зеркало - с оптимизацией */}
      <ElevatorMirror 
        dimensions={dimensions}
        materials={materials}
        mirrorConfig={{
          isMirror: materials.isMirror,
          mirror: materials.mirror,
        }}
        lightsOn={lightsOn}
      />

      {/* Панель управления на передней стене слева от дверей - с оптимизацией */}
      {elevator.visibility.controlPanel && (
        <ElevatorPanel 
          position={[-dimensions.width / 2.6, -0.2, dimensions.depth / 2.1]} 
          lightsOn={lightsOn}
          wallColor={materials.walls}
        />
      )}

      {/* Двери - с оптимизацией */}
      <ElevatorDoors
        doorsOpen={doorsOpen}
        doorHeight={doorHeight}
        dimensions={dimensions}
        doorMaterial={actualDoorMaterial}
        showLogo={elevator.doorLogo?.enabled}
        logoScale={elevator.doorLogo?.scale}
        logoOffsetY={elevator.doorLogo?.offsetY}
        logoOffsetX={elevator.doorLogo?.offsetX}
        logoColor={elevator.doorLogo?.color}
      />

      {/* Поручни - с оптимизацией */}
      <ElevatorHandrails
        dimensions={dimensions}
        handrailMaterial={handrailMaterial}
        isVisible={elevator.visibility.handrails}
        showLowerHandrails={true}
      />

      {/* Декоративные полосы на стенах - с оптимизацией */}
      <DecorationStripes
        dimensions={dimensions}
        decorationStripes={elevator.decorationStripes || {}}
        decorationStripesMaterial={decorationStripesMaterial}
        hasMirror={materials.isMirror.walls}
      />

      {/* Стыки между стенами - с оптимизацией */}
      <JointStripes
        dimensions={dimensions}
        jointStripeMaterial={jointStripeMaterial}
        jointOptions={elevator.joints}
      />
    </group>
  );
};

export default BasicElevator;

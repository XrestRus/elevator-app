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
import PerformanceOptimizer from "../../utils/PerformanceOptimizer";
import {
  createWallMaterialWithCustomRepeat,
  loadPBRTextures,
  createTexturePaths,
  createPBRMaterial,
} from "./ElevatorMaterialsUtils.tsx";

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
    () =>
      new THREE.MeshStandardMaterial({
        color: materials.walls,
        metalness: materials.metalness.walls,
        roughness: materials.roughness.walls,
      }),
    [materials.walls, materials.metalness.walls, materials.roughness.walls]
  );

  const basicFloorMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: materials.floor,
        metalness: materials.metalness.floor,
        roughness: materials.roughness.floor,
      }),
    [materials.floor, materials.metalness.floor, materials.roughness.floor]
  );

  const basicCeilingMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: materials.ceiling,
        metalness: materials.metalness.ceiling,
        roughness: materials.roughness.ceiling,
      }),
    [materials.ceiling, materials.metalness.ceiling, materials.roughness.ceiling]
  );

  const doorMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: materials.doors,
        metalness: materials.metalness.doors,
        roughness: materials.roughness.doors,
      }),
    [materials.doors, materials.metalness.doors, materials.roughness.doors]
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
      materials.metalness.walls
    ),
    [wallTextures, wallPBRPaths, materials.walls, materials.roughness.walls, materials.metalness.walls]
  );

  // Создаем PBR материал для пола с мемоизацией
  const floorPBRMaterial = useMemo(
    () => createPBRMaterial(
      floorTextures, 
      floorPBRPaths.textureType, 
      materials.floor, 
      materials.roughness.floor, 
      materials.metalness.floor
    ),
    [floorTextures, floorPBRPaths, materials.floor, materials.roughness.floor, materials.metalness.floor]
  );

  // Создаем PBR материал для потолка с мемоизацией
  const ceilingPBRMaterial = useMemo(
    () => createPBRMaterial(
      ceilingTextures, 
      ceilingPBRPaths.textureType, 
      materials.ceiling, 
      materials.roughness.ceiling, 
      materials.metalness.ceiling
    ),
    [ceilingTextures, ceilingPBRPaths, materials.ceiling, materials.roughness.ceiling, materials.metalness.ceiling]
  );

  // Создаем PBR материал для дверей с мемоизацией
  const doorsPBRMaterial = useMemo(
    () => createPBRMaterial(
      doorsTextures, 
      doorsPBRPaths.textureType, 
      materials.doors, 
      materials.roughness.doors, 
      materials.metalness.doors
    ),
    [doorsTextures, doorsPBRPaths, materials.doors, materials.roughness.doors, materials.metalness.doors]
  );

  // Создаем PBR материал для передней стены с мемоизацией
  const frontWallPBRMaterial = useMemo(
    () => createPBRMaterial(
      frontWallTextures, 
      frontWallPBRPaths.textureType, 
      materials.walls, 
      materials.roughness.walls, 
      materials.metalness.walls
    ),
    [frontWallTextures, frontWallPBRPaths, materials.walls, materials.roughness.walls, materials.metalness.walls]
  );

  // Создаем материал для стены с дверью без текстуры (мемоизация)
  const frontWallMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: materials.walls,
        metalness: materials.metalness.walls,
        roughness: materials.roughness.walls,
      }),
    [materials.walls, materials.metalness.walls, materials.roughness.walls]
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

  // Материал для поручней (наследует цвет стен)
  const handrailMaterial = useMemo(
    () => {
      const color = new THREE.Color(materials.walls);
      // Делаем цвет немного темнее
      color.multiplyScalar(0.9);
      return new THREE.MeshStandardMaterial({
        color: color,
        metalness: 0.6,
        roughness: 0.3,
        envMapIntensity: 1.0,
      });
    },
    [materials.walls]
  );

  // Материал для рамки вокруг дверей (металлический)
  const doorFrameMaterial = useMemo(
    () => {
      const color = new THREE.Color(materials.walls);
      // Делаем цвет немного темнее для контраста
      color.multiplyScalar(0.7);
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
      
      {/* Потолок - с оптимизацией */}
      <ElevatorCeiling 
        dimensions={dimensions} 
        ceilingMaterial={actualCeilingMaterial}
      />
      
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
      />

      {/* Поручни - с оптимизацией */}
      <ElevatorHandrails
        dimensions={dimensions}
        handrailMaterial={handrailMaterial}
        isVisible={elevator.visibility.handrails}
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

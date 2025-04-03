import React, { useMemo } from "react";
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
import {
  createWallMaterialWithCustomRepeat,
  loadPBRTextures,
  createTexturePaths,
  createPBRMaterial,
} from "./ElevatorMaterialsUtils.tsx";

/**
 * Компонент, представляющий базовую геометрию лифта с анимированными дверьми
 */
const BasicElevator: React.FC = () => {
  const elevator = useSelector((state: RootState) => state.elevator);
  const { materials, dimensions, doorsOpen } = elevator;
  const lightsOn = elevator.lighting.enabled;

  // Новый подход: двери занимают почти всю ширину лифта
  // Оставляем только небольшие боковые части для рамки
  const doorHeight = dimensions.height - 0.3; // Высота дверного проема

  // Базовые материалы (без текстур)
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
    [
      materials.ceiling,
      materials.metalness.ceiling,
      materials.roughness.ceiling,
    ]
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

  // Теперь useTexture всегда вызывается с каким-то путем
  const wallTextures = useTexture(wallPaths);
  const floorTextures = useTexture(floorPaths);
  const ceilingTextures = useTexture(ceilingPaths);

  // Создаем PBR материалы только если есть реальные текстуры (не заглушки)
  const wallPBRMaterial = useMemo(
    () => createPBRMaterial(wallTextures, wallPBRPaths.textureType),
    [wallTextures, wallPBRPaths]
  );

  // Создаем PBR материал для пола с мемоизацией
  const floorPBRMaterial = useMemo(
    () => createPBRMaterial(floorTextures, floorPBRPaths.textureType),
    [floorTextures, floorPBRPaths]
  );

  // Создаем PBR материал для потолка с мемоизацией
  const ceilingPBRMaterial = useMemo(
    () => createPBRMaterial(ceilingTextures, ceilingPBRPaths.textureType),
    [ceilingTextures, ceilingPBRPaths]
  );

  // Определяем, какой материал использовать: PBR или обычный
  const actualWallMaterial = wallPBRMaterial || basicWallMaterial;
  const actualFloorMaterial = floorPBRMaterial || basicFloorMaterial;
  const actualCeilingMaterial = ceilingPBRMaterial || basicCeilingMaterial;

  // Материалы с разным повторением текстур для разных стен (мемоизация)
  const sideWallMaterial = useMemo(
    () => createWallMaterialWithCustomRepeat(actualWallMaterial, 1, 1),
    [actualWallMaterial]
  );

  const backWallMaterial = useMemo(
    () => createWallMaterialWithCustomRepeat(actualWallMaterial, 1, 1),
    [actualWallMaterial]
  );

  // Создаем материал для стены с дверью без текстуры (мемоизация)
  const frontWallMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: materials.walls,
        metalness: 0.2,
        roughness: 0.3,
      }),
    [materials.walls]
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

  return (
    <group>
      {/* Пол */}
      <ElevatorFloor 
        dimensions={dimensions} 
        floorMaterial={actualFloorMaterial} 
      />

      {/* Потолок */}
      <ElevatorCeiling 
        dimensions={dimensions} 
        ceilingMaterial={actualCeilingMaterial} 
      />

      {/* Стены и дверные рамки */}
      <ElevatorWalls 
        dimensions={dimensions}
        backWallMaterial={backWallMaterial}
        sideWallMaterial={sideWallMaterial}
        frontWallMaterial={frontWallMaterial}
        doorFrameMaterial={doorFrameMaterial}
      />

      {/* Зеркало */}
      <ElevatorMirror
        dimensions={dimensions}
        materials={materials}
        mirrorConfig={{
          isMirror: materials.isMirror,
          mirror: materials.mirror,
        }}
        lightsOn={lightsOn}
      />

      {/* Панель управления на передней стене слева от дверей */}
      {elevator.visibility.controlPanel && (
        <ElevatorPanel 
          position={[-dimensions.width / 2.6, -0.2, dimensions.depth / 2.1]} 
          lightsOn={lightsOn}
          wallColor={materials.walls}
        />
      )}

      {/* Двери */}
      <ElevatorDoors
        doorsOpen={doorsOpen}
        doorHeight={doorHeight}
        dimensions={dimensions}
        doorMaterial={doorMaterial}
        decorationStripes={elevator.decorationStripes}
        decorationStripesMaterial={decorationStripesMaterial}
      />

      {/* Поручни */}
      <ElevatorHandrails
        dimensions={dimensions}
        handrailMaterial={handrailMaterial}
        isVisible={elevator.visibility.handrails}
      />

      {/* Декоративные полосы на стенах */}
      <DecorationStripes
        dimensions={dimensions}
        decorationStripes={elevator.decorationStripes || {}}
        decorationStripesMaterial={decorationStripesMaterial}
        hasMirror={materials.isMirror.walls}
      />
    </group>
  );
};

export default BasicElevator;

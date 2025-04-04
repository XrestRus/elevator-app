import React, { useMemo } from "react";
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
import CeilingLights from "./CeilingLights.tsx";
import { useMaterialsManager } from "./materials/MaterialsManager";
import { useTexturesManager } from "./materials/TexturesManager";
import { createWallMaterialWithCustomRepeat } from "./ElevatorMaterialsUtils";
import PerformanceOptimizer from "../../utils/optimization/PerformanceOptimizer";

/**
 * Компонент, представляющий базовую геометрию лифта с анимированными дверьми и оптимизированным рендерингом
 */
const BasicElevator: React.FC = () => {
  const elevator = useSelector((state: RootState) => state.elevator);
  const { materials, dimensions, doorsOpen } = elevator;
  const lightsOn = elevator.lighting.enabled;

  // Проверяем производительность устройства для адаптивной оптимизации
  const isHighPerformance = useMemo(
    () => PerformanceOptimizer.isHighPerformanceDevice(),
    []
  );

  // Константы для дверей
  const doorHeight = dimensions.height - 0.3; // Высота дверного проема

  // Загрузка и управление текстурами
  const {
    wallPBRMaterial,
    floorPBRMaterial,
    ceilingPBRMaterial,
    doorsPBRMaterial,
    frontWallPBRMaterial,
  } = useTexturesManager(materials, isHighPerformance);

  // Использование менеджера базовых материалов
  const {
    actualFloorMaterial: baseFloorMaterial,
    actualCeilingMaterial: baseCeilingMaterial,
    actualDoorMaterial: baseDoorMaterial,
    actualFrontWallMaterial: baseFrontWallMaterial,
    sideWallMaterial: baseSideWallMaterial,
    backWallMaterial: baseBackWallMaterial,
    handrailMaterial,
    decorationStripesMaterial,
    jointStripeMaterial,
  } = useMaterialsManager(materials, elevator);

  // Определяем, какой материал использовать: PBR или обычный
  const actualFloorMaterial = floorPBRMaterial || baseFloorMaterial;
  const actualCeilingMaterial = ceilingPBRMaterial || baseCeilingMaterial;
  const actualDoorMaterial = doorsPBRMaterial || baseDoorMaterial;
  const actualFrontWallMaterial = frontWallPBRMaterial || baseFrontWallMaterial;

  // Применяем текстуры к стенам, если есть PBR материалы
  const sideWallMaterial = wallPBRMaterial
    ? createWallMaterialWithCustomRepeat(wallPBRMaterial, 1, 1)
    : baseSideWallMaterial;

  const backWallMaterial = wallPBRMaterial
    ? createWallMaterialWithCustomRepeat(wallPBRMaterial, 1, 1)
    : baseBackWallMaterial;

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
        wallsColor={materials.walls}
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
          panelColor={materials.controlPanel}
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

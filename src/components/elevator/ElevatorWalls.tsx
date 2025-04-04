import React from "react";
import { Box } from "@react-three/drei";
import * as THREE from "three";
import MakeHoverable from "../ui/makeHoverable";
import colorUtils from "../../utils/colorUtils";

/**
 * Свойства компонента стен лифта
 */
interface ElevatorWallsProps {
  dimensions: {
    width: number;
    height: number;
    depth: number;
  };
  backWallMaterial: THREE.Material;
  sideWallMaterial: THREE.Material;
  frontWallMaterial: THREE.Material;
  doorFrameMaterial: THREE.Material;
}

/**
 * Компонент для отображения стен лифта и дверной рамки
 */
const ElevatorWalls: React.FC<ElevatorWallsProps> = ({
  dimensions,
  backWallMaterial,
  sideWallMaterial,
  doorFrameMaterial,
}) => {
  // Получаем цвета материалов для отображения в тултипе
  const getBackWallColor = () => colorUtils.getMaterialColor(backWallMaterial);
  const getSideWallColor = () => colorUtils.getMaterialColor(sideWallMaterial);
  const getDoorFrameColor = () => colorUtils.getMaterialColor(doorFrameMaterial);

  // Создаем компоненты стен с поддержкой наведения
  const BackWall = (
    <Box
      position={[0, 0, -dimensions.depth / 2]}
      args={[dimensions.width, dimensions.height, 0.05]}
      castShadow
      receiveShadow
    >
      <primitive object={backWallMaterial} attach="material" />
    </Box>
  );
  
  const LeftWall = (
    <Box
      position={[-dimensions.width / 2, 0, 0]}
      args={[0.05, dimensions.height, dimensions.depth]}
      castShadow
      receiveShadow
    >
      <primitive object={sideWallMaterial} attach="material" />
    </Box>
  );
  
  const RightWall = (
    <Box
      position={[dimensions.width / 2, 0, 0]}
      args={[0.05, dimensions.height, dimensions.depth]}
      castShadow
      receiveShadow
    >
      <primitive object={sideWallMaterial} attach="material" />
    </Box>
  );
  
  const TopFrame = (
    <Box
      position={[0, dimensions.height / 2 - 0.15, dimensions.depth / 2]}
      args={[dimensions.width - 0.2, 0.3, 0.07]}
      castShadow
    >
      <primitive object={doorFrameMaterial} attach="material" />
    </Box>
  );
  
  const LeftFrame = (
    <Box
      position={[-dimensions.width / 2 + 0.2, 0, dimensions.depth / 2]}
      args={[0.4, dimensions.height, 0.07]}
      castShadow
    >
      <primitive object={doorFrameMaterial} attach="material" />
    </Box>
  );
  
  const RightFrame = (
    <Box
      position={[dimensions.width / 2 - 0.2, 0, dimensions.depth / 2]}
      args={[0.4, dimensions.height, 0.07]}
      castShadow
    >
      <primitive object={doorFrameMaterial} attach="material" />
    </Box>
  );

  return (
    <>
      {/* Задняя стена */}
      <MakeHoverable
        name="Задняя стена"
        type="Элемент конструкции"
        description="Задняя стена лифта"
        material="Стандартный материал стен"
        dimensions={{
          width: dimensions.width,
          height: dimensions.height,
          depth: 0.05
        }}
        additionalInfo={{
          color: getBackWallColor(),
          texture: "Матовая поверхность"
        }}
        requiresDoubleClick={false}
      >
        {BackWall}
      </MakeHoverable>

      {/* Левая стена */}
      <MakeHoverable
        name="Левая стена"
        type="Элемент конструкции"
        description="Боковая стена лифта"
        material="Стандартный материал стен"
        dimensions={{
          width: 0.05,
          height: dimensions.height,
          depth: dimensions.depth
        }}
        additionalInfo={{
          color: getSideWallColor(),
          texture: "Матовая поверхность"
        }}
        requiresDoubleClick={false}
      >
        {LeftWall}
      </MakeHoverable>

      {/* Правая стена */}
      <MakeHoverable
        name="Правая стена"
        type="Элемент конструкции"
        description="Боковая стена лифта"
        material="Стандартный материал стен"
        dimensions={{
          width: 0.05,
          height: dimensions.height,
          depth: dimensions.depth
        }}
        additionalInfo={{
          color: getSideWallColor(),
          texture: "Матовая поверхность"
        }}
        requiresDoubleClick={false}
      >
        {RightWall}
      </MakeHoverable>

      {/* Верхняя перемычка над дверью */}
      <MakeHoverable
        name="Верхняя перемычка"
        type="Элемент конструкции"
        description="Верхняя часть дверного проема"
        material="Материал дверной рамки"
        dimensions={{
          width: dimensions.width - 0.2,
          height: 0.3,
          depth: 0.07
        }}
        additionalInfo={{
          color: getDoorFrameColor(),
          texture: "Металлическая поверхность"
        }}
        requiresDoubleClick={false}
      >
        {TopFrame}
      </MakeHoverable>

      {/* Левая боковая панель передней стены */}
      <MakeHoverable
        name="Левая панель передней стены"
        type="Элемент конструкции"
        description="Боковая часть дверного проема"
        material="Материал дверной рамки"
        dimensions={{
          width: 0.4,
          height: dimensions.height,
          depth: 0.07
        }}
        additionalInfo={{
          color: getDoorFrameColor(),
          texture: "Металлическая поверхность"
        }}
        requiresDoubleClick={false}
      >
        {LeftFrame}
      </MakeHoverable>

      {/* Правая боковая панель передней стены */}
      <MakeHoverable
        name="Правая панель передней стены"
        type="Элемент конструкции"
        description="Боковая часть дверного проема"
        material="Материал дверной рамки"
        dimensions={{
          width: 0.4,
          height: dimensions.height,
          depth: 0.07
        }}
        additionalInfo={{
          color: getDoorFrameColor(),
          texture: "Металлическая поверхность"
        }}
        requiresDoubleClick={false}
      >
        {RightFrame}
      </MakeHoverable>
    </>
  );
};

export default ElevatorWalls; 
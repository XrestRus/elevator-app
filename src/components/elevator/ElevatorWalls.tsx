import React from "react";
import { Box } from "@react-three/drei";
import * as THREE from "three";

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
}

/**
 * Компонент для отображения стен лифта и дверной рамки
 */
const ElevatorWalls: React.FC<ElevatorWallsProps> = ({
  dimensions,
  backWallMaterial,
  sideWallMaterial,
  frontWallMaterial,
}) => {
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
      args={[dimensions.width - 0.8, 0.3, 0.07]}
      castShadow
    >
      <primitive object={frontWallMaterial} attach="material" />
    </Box>
  );

  const LeftFrame = (
    <Box
      position={[-dimensions.width / 2 + 0.2, 0, dimensions.depth / 2]}
      args={[0.4, dimensions.height, 0.07]}
      castShadow
    >
      <primitive object={frontWallMaterial} attach="material" />
    </Box>
  );

  const RightFrame = (
    <Box
      position={[dimensions.width / 2 - 0.2, 0, dimensions.depth / 2]}
      args={[0.4, dimensions.height, 0.07]}
      castShadow
    >
      <primitive object={frontWallMaterial} attach="material" />
    </Box>
  );

  return (
    <>
      {/* Задняя стена */}
      {BackWall}
      {/* Левая стена */}
      {LeftWall}
      {/* Правая стена */}
      {RightWall}
      {/* Верхняя перемычка над дверью */}
      {TopFrame}
      {/* Левая боковая панель передней стены */}
      {LeftFrame}
      {/* Правая боковая панель передней стены */}
      {RightFrame}
    </>
  );
};

export default ElevatorWalls;

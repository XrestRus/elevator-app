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
  doorFrameMaterial: THREE.Material;
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
  return (
    <>
      {/* Задняя стена */}
      <Box
        position={[0, 0, -dimensions.depth / 2]}
        args={[dimensions.width, dimensions.height, 0.05]}
        castShadow
        receiveShadow
      >
        <primitive object={backWallMaterial} attach="material" />
      </Box>

      {/* Левая стена */}
      <Box
        position={[-dimensions.width / 2, 0, 0]}
        args={[0.05, dimensions.height, dimensions.depth]}
        castShadow
        receiveShadow
      >
        <primitive object={sideWallMaterial} attach="material" />
      </Box>

      {/* Правая стена */}
      <Box
        position={[dimensions.width / 2, 0, 0]}
        args={[0.05, dimensions.height, dimensions.depth]}
        castShadow
        receiveShadow
      >
        <primitive object={sideWallMaterial} attach="material" />
      </Box>

      {/* Верхняя перемычка над дверью */}
      <Box
        position={[0, dimensions.height / 2 - 0.15, dimensions.depth / 2]}
        args={[dimensions.width - 0.2, 0.3, 0.07]}
        castShadow
      >
        <primitive object={frontWallMaterial} attach="material" />
      </Box>

      {/* Левая боковая панель передней стены */}
      <Box
        position={[-dimensions.width / 2 + 0.2, 0, dimensions.depth / 2]}
        args={[0.4, dimensions.height, 0.07]}
        castShadow
      >
        <primitive object={frontWallMaterial} attach="material" />
      </Box>

      {/* Правая боковая панель передней стены */}
      <Box
        position={[dimensions.width / 2 - 0.2, 0, dimensions.depth / 2]}
        args={[0.4, dimensions.height, 0.07]}
        castShadow
      >
        <primitive object={frontWallMaterial} attach="material" />
      </Box>
    </>
  );
};

export default ElevatorWalls; 
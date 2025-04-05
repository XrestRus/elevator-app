import React from "react";
import { Box } from "@react-three/drei";
import * as THREE from "three";

/**
 * Свойства компонента пола лифта
 */
interface ElevatorFloorProps {
  dimensions: {
    width: number;
    height: number;
    depth: number;
  };
  floorMaterial: THREE.Material;
}

/**
 * Компонент для отображения пола лифта
 */
const ElevatorFloor: React.FC<ElevatorFloorProps> = ({
  dimensions,
  floorMaterial,
}) => {
  // Компонент пола
  const Floor = (
    <Box
      position={[0, -dimensions.height / 2, 0]}
      args={[dimensions.width, 0.05, dimensions.depth]}
      receiveShadow
    >
      <primitive object={floorMaterial} attach="material" />
    </Box>
  );
  
  return (
    Floor
  );
};

export default ElevatorFloor; 
import React from "react";
import { Box } from "@react-three/drei";
import * as THREE from "three";

/**
 * Свойства компонента потолка лифта
 */
interface ElevatorCeilingProps {
  dimensions: {
    width: number;
    height: number;
    depth: number;
  };
  ceilingMaterial: THREE.Material;
}

/**
 * Компонент для отображения потолка лифта
 */
const ElevatorCeiling: React.FC<ElevatorCeilingProps> = ({
  dimensions,
  ceilingMaterial,
}) => {
  return (
    <Box
      position={[0, dimensions.height / 2, 0]}
      args={[dimensions.width, 0.05, dimensions.depth]}
      receiveShadow
    >
      <primitive object={ceilingMaterial} attach="material" />
    </Box>
  );
};

export default ElevatorCeiling; 
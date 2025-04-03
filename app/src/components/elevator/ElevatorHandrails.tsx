import React from "react";
import { Box } from "@react-three/drei";
import * as THREE from "three";

/**
 * Свойства компонента поручней лифта
 */
interface ElevatorHandrailsProps {
  dimensions: {
    width: number;
    depth: number;
  };
  handrailMaterial: THREE.Material;
  isVisible: boolean;
}

/**
 * Компонент для отображения поручней в лифте
 */
const ElevatorHandrails: React.FC<ElevatorHandrailsProps> = ({
  dimensions,
  handrailMaterial,
  isVisible,
}) => {
  if (!isVisible) {
    return null;
  }

  return (
    <>
      {/* Поручень на левой стене */}
      <group position={[-dimensions.width / 2 + 0.03, -0.1, 0]}>
        {/* Основная часть поручня */}
        <Box
          position={[0, 0, 0]}
          args={[0.03, 0.08, dimensions.depth * 0.6]}
          castShadow
        >
          <primitive object={handrailMaterial} attach="material" />
        </Box>
        {/* Крепления к стене (верхнее и нижнее) */}
        <Box
          position={[-0.015, 0, dimensions.depth * 0.25]}
          args={[0.03, 0.03, 0.03]}
          castShadow
        >
          <primitive object={handrailMaterial} attach="material" />
        </Box>
        <Box
          position={[-0.015, 0, -dimensions.depth * 0.25]}
          args={[0.03, 0.03, 0.03]}
          castShadow
        >
          <primitive object={handrailMaterial} attach="material" />
        </Box>
      </group>

      {/* Поручень на правой стене */}
      <group position={[dimensions.width / 2 - 0.03, -0.1, 0]}>
        {/* Основная часть поручня */}
        <Box
          position={[0, 0, 0]}
          args={[0.03, 0.08, dimensions.depth * 0.6]}
          castShadow
        >
          <primitive object={handrailMaterial} attach="material" />
        </Box>
        {/* Крепления к стене (верхнее и нижнее) */}
        <Box
          position={[0.015, 0, dimensions.depth * 0.25]}
          args={[0.03, 0.03, 0.03]}
          castShadow
        >
          <primitive object={handrailMaterial} attach="material" />
        </Box>
        <Box
          position={[0.015, 0, -dimensions.depth * 0.25]}
          args={[0.03, 0.03, 0.03]}
          castShadow
        >
          <primitive object={handrailMaterial} attach="material" />
        </Box>
      </group>
    </>
  );
};

export default ElevatorHandrails; 
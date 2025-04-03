import React, { useRef, useEffect } from "react";
import { Box } from "@react-three/drei";
import * as THREE from "three";
import { makeHoverable } from "../../utils/objectInfo";

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
  // Ссылка на элемент пола
  const floorRef = useRef<THREE.Mesh>(null);
  
  // Добавляем информацию для наведения мыши
  useEffect(() => {
    if (floorRef.current) {
      makeHoverable(floorRef.current, {
        name: "Пол лифта",
        description: "Поверхность пола лифта",
        material: "Материал пола",
        dimensions: {
          width: dimensions.width,
          height: 0.05,
          depth: dimensions.depth
        }
      });
    }
  }, [dimensions]);
  
  return (
    <Box
      ref={floorRef}
      position={[0, -dimensions.height / 2, 0]}
      args={[dimensions.width, 0.05, dimensions.depth]}
      receiveShadow
    >
      <primitive object={floorMaterial} attach="material" />
    </Box>
  );
};

export default ElevatorFloor; 
import React, { useRef, useEffect } from "react";
import { Box } from "@react-three/drei";
import * as THREE from "three";
import { makeHoverable } from "../../utils/objectInfo";

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
  // Ссылка на элемент потолка
  const ceilingRef = useRef<THREE.Mesh>(null);
  
  // Добавляем информацию для наведения мыши
  useEffect(() => {
    if (ceilingRef.current) {
      makeHoverable(ceilingRef.current, {
        name: "Потолок лифта",
        description: "Верхняя поверхность лифта, на которой расположены светильники",
        material: "Материал потолка",
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
      ref={ceilingRef}
      position={[0, dimensions.height / 2, 0]}
      args={[dimensions.width, 0.05, dimensions.depth]}
      receiveShadow
    >
      <primitive object={ceilingMaterial} attach="material" />
    </Box>
  );
};

export default ElevatorCeiling; 
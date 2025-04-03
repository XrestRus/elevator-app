import React from "react";
import { Box } from "@react-three/drei";
import * as THREE from "three";
import MakeHoverable from "../ui/makeHoverable";
import colorUtils from "../../utils/colorUtils";

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
  // Получаем цвет материала пола для отображения в тултипе
  const getFloorColor = () => colorUtils.getMaterialColor(floorMaterial);
  
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
    <MakeHoverable
      name="Пол лифта"
      type="Элемент конструкции"
      description="Поверхность пола лифта"
      material="Материал пола"
      dimensions={{
        width: dimensions.width,
        height: 0.05,
        depth: dimensions.depth
      }}
      additionalInfo={{
        color: getFloorColor(),
        texture: "Структурная поверхность"
      }}
      requiresDoubleClick={false}
    >
      {Floor}
    </MakeHoverable>
  );
};

export default ElevatorFloor; 
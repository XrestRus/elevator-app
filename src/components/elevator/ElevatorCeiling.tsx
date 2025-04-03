import React from "react";
import { Box } from "@react-three/drei";
import * as THREE from "three";
import MakeHoverable from "../ui/makeHoverable";
import colorUtils from "../../utils/colorUtils";

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
  // Получаем цвет материала потолка для отображения в тултипе
  const getCeilingColor = () => colorUtils.getMaterialColor(ceilingMaterial);
  
  // Компонент потолка
  const Ceiling = (
    <Box
      position={[0, dimensions.height / 2, 0]}
      args={[dimensions.width, 0.05, dimensions.depth]}
      receiveShadow
    >
      <primitive object={ceilingMaterial} attach="material" />
    </Box>
  );
  
  return (
    <MakeHoverable
      name="Потолок лифта"
      type="Элемент конструкции"
      description="Верхняя поверхность лифта, на которой расположены светильники"
      material="Материал потолка"
      dimensions={{
        width: dimensions.width,
        height: 0.05,
        depth: dimensions.depth
      }}
      additionalInfo={{
        color: getCeilingColor(),
        texture: "Матовая поверхность со встроенным освещением"
      }}
      requiresDoubleClick={false}
    >
      {Ceiling}
    </MakeHoverable>
  );
};

export default ElevatorCeiling; 
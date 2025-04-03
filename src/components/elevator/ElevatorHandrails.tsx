import React from "react";
import { Box } from "@react-three/drei";
import * as THREE from "three";
import MakeHoverable from "../ui/makeHoverable";
import colorUtils from "../../utils/colorUtils";

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
  
  // Получаем цвет материала поручней для отображения в тултипе
  const getHandrailColor = () => {
    return colorUtils.getMaterialColor(handrailMaterial);
  };
  
  // Создаем обертки для левого и правого поручней
  const leftHandrail = (
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
  );
  
  const rightHandrail = (
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
  );

  return (
    <>
      {/* Левый поручень с возможностью наведения */}
      <MakeHoverable
        name="Левый поручень"
        type="Элемент безопасности"
        description="Поручень для обеспечения устойчивости пассажиров"
        material="Нержавеющая сталь"
        dimensions={{
          width: 0.03,
          height: 0.08,
          depth: dimensions.depth * 0.6
        }}
        additionalInfo={{
          color: getHandrailColor(),
          texture: "Глянцевая поверхность",
          "Расположение": "Левая стена"
        }}
        requiresDoubleClick={false}
      >
        {leftHandrail}
      </MakeHoverable>
      
      {/* Правый поручень с возможностью наведения */}
      <MakeHoverable
        name="Правый поручень"
        type="Элемент безопасности"
        description="Поручень для обеспечения устойчивости пассажиров"
        material="Нержавеющая сталь"
        dimensions={{
          width: 0.03,
          height: 0.08,
          depth: dimensions.depth * 0.6
        }}
        additionalInfo={{
          color: getHandrailColor(),
          texture: "Глянцевая поверхность",
          "Расположение": "Правая стена"
        }}
        requiresDoubleClick={false}
      >
        {rightHandrail}
      </MakeHoverable>
    </>
  );
};

export default ElevatorHandrails; 
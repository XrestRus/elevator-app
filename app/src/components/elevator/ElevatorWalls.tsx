import React, { useRef, useEffect } from "react";
import { Box } from "@react-three/drei";
import * as THREE from "three";
import { makeHoverable } from "../../utils/objectInfo";

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
  // Создаем ссылки на объекты для добавления информации при наведении
  const backWallRef = useRef<THREE.Mesh>(null);
  const leftWallRef = useRef<THREE.Mesh>(null);
  const rightWallRef = useRef<THREE.Mesh>(null);
  const topFrameRef = useRef<THREE.Mesh>(null);
  const leftFrameRef = useRef<THREE.Mesh>(null);
  const rightFrameRef = useRef<THREE.Mesh>(null);
  
  // Добавляем информацию для наведения мыши
  useEffect(() => {
    // Задняя стена
    if (backWallRef.current) {
      makeHoverable(backWallRef.current, {
        name: "Задняя стена",
        description: "Задняя стена лифта",
        material: "Стандартный материал стен",
        dimensions: {
          width: dimensions.width,
          height: dimensions.height,
          depth: 0.05
        }
      });
    }
    
    // Левая стена
    if (leftWallRef.current) {
      makeHoverable(leftWallRef.current, {
        name: "Левая стена",
        description: "Боковая стена лифта",
        material: "Стандартный материал стен",
        dimensions: {
          width: 0.05,
          height: dimensions.height,
          depth: dimensions.depth
        }
      });
    }
    
    // Правая стена
    if (rightWallRef.current) {
      makeHoverable(rightWallRef.current, {
        name: "Правая стена",
        description: "Боковая стена лифта",
        material: "Стандартный материал стен",
        dimensions: {
          width: 0.05,
          height: dimensions.height,
          depth: dimensions.depth
        }
      });
    }
    
    // Верхняя перемычка
    if (topFrameRef.current) {
      makeHoverable(topFrameRef.current, {
        name: "Верхняя перемычка",
        description: "Верхняя часть дверного проема",
        material: "Материал передней стены",
        dimensions: {
          width: dimensions.width - 0.2,
          height: 0.3,
          depth: 0.07
        }
      });
    }
    
    // Левая панель передней стены
    if (leftFrameRef.current) {
      makeHoverable(leftFrameRef.current, {
        name: "Левая панель передней стены",
        description: "Боковая часть дверного проема",
        material: "Материал передней стены",
        dimensions: {
          width: 0.4,
          height: dimensions.height,
          depth: 0.07
        }
      });
    }
    
    // Правая панель передней стены
    if (rightFrameRef.current) {
      makeHoverable(rightFrameRef.current, {
        name: "Правая панель передней стены",
        description: "Боковая часть дверного проема",
        material: "Материал передней стены",
        dimensions: {
          width: 0.4,
          height: dimensions.height,
          depth: 0.07
        }
      });
    }
  }, [dimensions]);

  return (
    <>
      {/* Задняя стена */}
      <Box
        ref={backWallRef}
        position={[0, 0, -dimensions.depth / 2]}
        args={[dimensions.width, dimensions.height, 0.05]}
        castShadow
        receiveShadow
      >
        <primitive object={backWallMaterial} attach="material" />
      </Box>

      {/* Левая стена */}
      <Box
        ref={leftWallRef}
        position={[-dimensions.width / 2, 0, 0]}
        args={[0.05, dimensions.height, dimensions.depth]}
        castShadow
        receiveShadow
      >
        <primitive object={sideWallMaterial} attach="material" />
      </Box>

      {/* Правая стена */}
      <Box
        ref={rightWallRef}
        position={[dimensions.width / 2, 0, 0]}
        args={[0.05, dimensions.height, dimensions.depth]}
        castShadow
        receiveShadow
      >
        <primitive object={sideWallMaterial} attach="material" />
      </Box>

      {/* Верхняя перемычка над дверью */}
      <Box
        ref={topFrameRef}
        position={[0, dimensions.height / 2 - 0.15, dimensions.depth / 2]}
        args={[dimensions.width - 0.2, 0.3, 0.07]}
        castShadow
      >
        <primitive object={frontWallMaterial} attach="material" />
      </Box>

      {/* Левая боковая панель передней стены */}
      <Box
        ref={leftFrameRef}
        position={[-dimensions.width / 2 + 0.2, 0, dimensions.depth / 2]}
        args={[0.4, dimensions.height, 0.07]}
        castShadow
      >
        <primitive object={frontWallMaterial} attach="material" />
      </Box>

      {/* Правая боковая панель передней стены */}
      <Box
        ref={rightFrameRef}
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
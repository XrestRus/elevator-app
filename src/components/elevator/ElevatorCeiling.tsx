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
  wallsColor?: string; // Добавляем опциональный параметр цвета стен
}

/**
 * Компонент для отображения потолка лифта с зазором по бокам для эффекта 3D
 */
const ElevatorCeiling: React.FC<ElevatorCeilingProps> = ({
  dimensions,
  ceilingMaterial,
  wallsColor = "#CCCCCC", // Значение по умолчанию для цвета стен
}) => {
  // Рассчитываем размеры потолка с зазором по бокам
  const gapSize = 0.06; // Размер зазора по краям (6 см)
  const ceilingWidth = dimensions.width - gapSize * 2;
  const ceilingDepth = dimensions.depth - gapSize * 2;
  const ceilingThickness = 0.08; // Увеличиваем толщину потолка для более выраженного эффекта
  
  // Создаем материал для верхнего потолка (полностью закрывающий шахту)
  const topCeilingMaterial = new THREE.MeshStandardMaterial({
    color: "#F0F0F0", // Чуть светлее основного потолка
    roughness: 0.3,
    metalness: 0.1,
  });
  
  // Создаем материал для полос по краям, используя цвет стен
  const trimMaterial = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(wallsColor),
    metalness: 0.9,
    roughness: 0.1,
    envMapIntensity: 1.5,
    clearcoat: 0.3, // Добавляем легкое покрытие лаком для глянца
    clearcoatRoughness: 0.1, // Делаем покрытие гладким
  });
  
  // Размер полосы (4 см)
  const trimSize = 0.04;
  
  // Компонент потолка
  const Ceiling = (
    <>
      {/* Основной подвесной потолок */}
      <Box
        position={[0, dimensions.height / 2 - ceilingThickness / 2, 0]}
        args={[ceilingWidth, ceilingThickness, ceilingDepth]}
        receiveShadow
      >
        <primitive object={ceilingMaterial} attach="material" />
      </Box>
      
      {/* Полоса спереди */}
      <Box
        position={[0, dimensions.height / 2 - ceilingThickness, 0 + ceilingDepth/2 - trimSize/2]}
        args={[ceilingWidth, 0.01, trimSize]}
        receiveShadow
      >
        <primitive object={trimMaterial} attach="material" />
      </Box>
      
      {/* Полоса сзади */}
      <Box
        position={[0, dimensions.height / 2 - ceilingThickness, 0 - ceilingDepth/2 + trimSize/2]}
        args={[ceilingWidth, 0.01, trimSize]}
        receiveShadow
      >
        <primitive object={trimMaterial} attach="material" />
      </Box>
      
      {/* Полоса слева */}
      <Box
        position={[0 - ceilingWidth/2 + trimSize/2, dimensions.height / 2 - ceilingThickness, 0]}
        args={[trimSize, 0.01, ceilingDepth - trimSize*2]}
        receiveShadow
      >
        <primitive object={trimMaterial} attach="material" />
      </Box>
      
      {/* Полоса справа */}
      <Box
        position={[0 + ceilingWidth/2 - trimSize/2, dimensions.height / 2 - ceilingThickness, 0]}
        args={[trimSize, 0.01, ceilingDepth - trimSize*2]}
        receiveShadow
      >
        <primitive object={trimMaterial} attach="material" />
      </Box>
      
      {/* Закрывающий верхний потолок */}
      <Box
        position={[0, dimensions.height / 2 + 0.02, 0]}
        args={[dimensions.width, 0.04, dimensions.depth]}
        receiveShadow
        castShadow
      >
        <primitive object={topCeilingMaterial} attach="material" />
      </Box>
      
      {/* Тень от закрывающего верхнего потолка */}
      <mesh 
        position={[0, dimensions.height / 2 - ceilingThickness + 0.001, 0]} 
        rotation={[Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[ceilingWidth * 1.05, ceilingDepth * 1.05]} />
        <meshBasicMaterial 
          color="black" 
          transparent={true} 
          opacity={0.03} 
          depthWrite={false}
        />
      </mesh>
    </>
  );
  
  return (
    Ceiling
  );
};

export default ElevatorCeiling; 
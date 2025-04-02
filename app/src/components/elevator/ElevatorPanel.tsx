import React, { useMemo } from "react";
import { Box, Cylinder } from "@react-three/drei";
import * as THREE from "three";

/**
 * Компонент панели управления лифтом с кнопками, индикаторами и экраном
 */
interface ElevatorPanelProps {
  position: [number, number, number];
  lightsOn: boolean;
  wallColor: string;
}

const ElevatorPanel: React.FC<ElevatorPanelProps> = ({ position, lightsOn, wallColor }) => {
  // Создаем цвет панели чуть темнее цвета стен
  const panelColor = useMemo(() => {
    const color = new THREE.Color(wallColor);
    // Делаем цвет немного темнее
    color.multiplyScalar(0.9);
    return color;
  }, [wallColor]);

  // Материал для панели (наследует цвет стен но слегка темнее)
  const panelMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: panelColor,
        metalness: 0.6,
        roughness: 0.3,
      }),
    [panelColor]
  );

  // Материал для экрана
  const displayMaterial = useMemo(
    () => 
      new THREE.MeshStandardMaterial({
        color: "#000000",
        emissive: "#004488",
        emissiveIntensity: lightsOn ? 0.5 : 0.0,
      }),
    [lightsOn]
  );

  // Материал для кнопок
  const buttonMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#333333",
        metalness: 0.5,
        roughness: 0.3,
        emissive: "#222222",
        emissiveIntensity: 0.2,
      }),
    []
  );

  // Материал для обводки кнопок
  const buttonRimMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#555555",
        metalness: 0.7,
        roughness: 0.2,
      }),
    []
  );

  // Позиции кнопок в соответствии с изображением
  // На изображении двухстрочное расположение
  const buttonPositions = useMemo(() => {
    const positions: [number, number][] = [];
    
    // Первый столбец (12, 11, 10, 9, ..., 1)
    for (let i = 0; i < 12; i++) {
      positions.push([-0.05, 0.25 - i * 0.04]);
    }
    
    // Второй столбец (24, 23, 22, ..., 13)
    for (let i = 0; i < 12; i++) {
      positions.push([0.05, 0.25 - i * 0.04]);
    }
    
    return positions;
  }, []);

  return (
    <group position={new THREE.Vector3(...position)} rotation={[0, 3.2, 0]}>
      {/* Основа панели - теперь плоская и уже по ширине */}
      <Box args={[0.25, 0.75, 0.0001]} castShadow>
        <primitive object={panelMaterial} attach="material" />
      </Box>

      {/* Экран с информацией о текущем этаже (вверху панели) */}
      <Box position={[0, 0.32, 0.016]} args={[0.2, 0.03, 0.001]} castShadow>
        <primitive object={displayMaterial} attach="material" />
      </Box>

      {/* Кнопки этажей - используем циклы для создания рядов кнопок */}
      {buttonPositions.map((pos, index) => (
        <group key={`button-group-${index}`}>
          {/* Кнопка этажа - плоский цилиндр */}
          <Cylinder
            position={[pos[0], pos[1], 0.02]}
            rotation={[Math.PI / 2, 0, 0]}
            args={[0.018, 0.018, 0.005, 16]}
            castShadow
          >
            <primitive object={buttonMaterial} attach="material" />
          </Cylinder>
          
          {/* Обводка кнопки */}
          <Cylinder
            position={[pos[0], pos[1], 0.019]}
            rotation={[Math.PI / 2, 0, 0]}
            args={[0.021, 0.021, 0.001, 16]}
            castShadow
          >
            <primitive object={buttonRimMaterial} attach="material" />
          </Cylinder>
        </group>
      ))}

      {/* Кнопки открытия/закрытия дверей (внизу панели) */}
      <group position={[0, -0.25, 0]}>
        {/* Кнопка открытия дверей */}
        <Cylinder
          position={[-0.05, 0, 0.02]}
          rotation={[Math.PI / 2, 0, 0]}
          args={[0.018, 0.018, 0.005, 16]}
          castShadow
        >
          <primitive object={buttonMaterial} attach="material" />
        </Cylinder>
        
        {/* Обводка кнопки открытия дверей */}
        <Cylinder
          position={[-0.05, 0, 0.019]}
          rotation={[Math.PI / 2, 0, 0]}
          args={[0.021, 0.021, 0.001, 16]}
          castShadow
        >
          <primitive object={buttonRimMaterial} attach="material" />
        </Cylinder>

        {/* Кнопка закрытия дверей */}
        <Cylinder
          position={[0.05, 0, 0.02]}
          rotation={[Math.PI / 2, 0, 0]}
          args={[0.018, 0.018, 0.005, 16]}
          castShadow
        >
          <primitive object={buttonMaterial} attach="material" />
        </Cylinder>
        
        {/* Обводка кнопки закрытия дверей */}
        <Cylinder
          position={[0.05, 0, 0.019]}
          rotation={[Math.PI / 2, 0, 0]}
          args={[0.021, 0.021, 0.001, 16]}
          castShadow
        >
          <primitive object={buttonRimMaterial} attach="material" />
        </Cylinder>
      </group>
    </group>
  );
};

export default ElevatorPanel; 
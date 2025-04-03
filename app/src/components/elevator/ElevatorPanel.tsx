import React, { useMemo } from "react";
import { Box, Cylinder, Html } from "@react-three/drei";
import * as THREE from "three";
import { CSSProperties } from 'react';

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

  // Создаем цвет кнопок чуть светлее цвета стен
  const buttonColor = useMemo(() => {
    const color = new THREE.Color(wallColor);
    // Делаем цвет немного светлее
    color.multiplyScalar(1.1);
    return color;
  }, [wallColor]);

  // Материал для панели (наследует цвет стен но слегка темнее)
  const panelMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: panelColor,
        metalness: 0.6,
        roughness: 0.3,
        emissive: lightsOn ? panelColor : "#000000",
        emissiveIntensity: lightsOn ? 0.05 : 0,
      }),
    [panelColor, lightsOn]
  );

  // Материал для экрана
  const displayMaterial = useMemo(
    () => 
      new THREE.MeshStandardMaterial({
        color: panelColor,
        emissive: lightsOn ? panelColor : "#000000",
        emissiveIntensity: lightsOn ? 0.5 : 0.0,
      }),
    [panelColor, lightsOn]
  );

  // Материал для кнопок (наследует цвет стен но слегка светлее)
  const buttonMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: buttonColor,
        metalness: 0.8,
        roughness: 0.2,
        emissive: buttonColor,
        emissiveIntensity: 0.1,
      }),
    [buttonColor]
  );

  // Материал для обводки кнопок (еще светлее основного цвета кнопок)
  const buttonRimMaterial = useMemo(
    () => {
      const rimColor = new THREE.Color(buttonColor);
      rimColor.multiplyScalar(1.3); // Делаем обводку ещё светлее для лучшего контраста
      return new THREE.MeshStandardMaterial({
        color: rimColor,
        metalness: 0.9,
        roughness: 0.1,
        emissive: lightsOn ? rimColor : "#000000",
        emissiveIntensity: lightsOn ? 0.1 : 0,
      });
    },
    [buttonColor, lightsOn]
  );

  // Позиции кнопок в соответствии с изображением
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

  // Стили для текста кнопок
  const textStyle: CSSProperties = {
    color: lightsOn ? '#ffffff' : '#aaaaaa',
    fontSize: '8px',
    fontFamily: 'Arial',
    userSelect: 'none' as const,
    textAlign: 'center' as const,
    pointerEvents: 'none' as const,
    transform: 'translate(-50%, -50%)',
    fontWeight: '600',
  };

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
      {buttonPositions.map((pos, index) => {
        // Вычисляем номер этажа (начиная с верхнего)
        const floorNumber = 24 - index;
        return (
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

            {/* Номер этажа */}
            <Html
              position={[pos[0], pos[1], 0.023]}
              center
              style={textStyle}
            >
              {floorNumber}
            </Html>
          </group>
        );
      })}

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

        {/* Символ открытия дверей */}
        <Html
          position={[-0.05, 0, 0.023]}
          center
          style={textStyle}
        >
          ◄►
        </Html>

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

        {/* Символ закрытия дверей */}
        <Html
          position={[0.05, 0, 0.023]}
          center
          style={textStyle}
        >
          ►◄
        </Html>
      </group>
    </group>
  );
};

export default ElevatorPanel; 
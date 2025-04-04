import React, { useMemo } from "react";
import { Cylinder, Html, RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import { CSSProperties } from 'react';
import MakeHoverable from "../ui/makeHoverable";
import colorUtils from "../../utils/colorUtils";

/**
 * Компонент панели управления лифтом с кнопками, индикаторами и экраном
 */
interface ElevatorPanelProps {
  position: [number, number, number];
  lightsOn: boolean;
  wallColor: string;
}

const ElevatorPanel: React.FC<ElevatorPanelProps> = ({ position, lightsOn, wallColor }) => {
  // Создаем цвет панели чуть светлее цвета стен для контраста
  const panelColor = useMemo(() => {
    return colorUtils.lightenColor(wallColor, 1.05);
  }, [wallColor]);

  // Создаем цвет рамки панели темнее цвета панели
  const panelBorderColor = useMemo(() => {
    return colorUtils.darkenColor(panelColor, 0.8);
  }, [panelColor]);

  // Создаем цвет кнопок чуть светлее цвета стен
  const buttonColor = useMemo(() => {
    return colorUtils.lightenColor(wallColor, 1.1);
  }, [wallColor]);

  // Материал для основной панели (светлый)
  const panelMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: panelColor,
        metalness: 0.3,
        roughness: 0.4,
        emissive: lightsOn ? panelColor : "#000000",
        emissiveIntensity: lightsOn ? 0.05 : 0,
      }),
    [panelColor, lightsOn]
  );

  // Материал для рамки/углубления панели (темнее)
  const panelBorderMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: panelBorderColor,
        metalness: 0.5,
        roughness: 0.3,
        emissive: lightsOn ? panelBorderColor : "#000000",
        emissiveIntensity: lightsOn ? 0.02 : 0,
      }),
    [panelBorderColor, lightsOn]
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
        color: panelColor,
        metalness: 0.8,
        roughness: 0.2,
        emissive: panelColor,
        emissiveIntensity: lightsOn ? 0.5 : 0.0,
      }),
    [panelColor, lightsOn]
  );

  // Материал для обводки кнопок (еще светлее основного цвета кнопок)
  const buttonRimMaterial = useMemo(
    () => {
      const rimColor = colorUtils.lightenColor(buttonColor, 1.3); // Делаем обводку ещё светлее для лучшего контраста
      return new THREE.MeshStandardMaterial({
        color: rimColor,
        metalness: 0.9,
        roughness: 0.1,
        emissive: lightsOn ? rimColor : "#000000",
        emissiveIntensity: lightsOn ? 0.34 : 0,
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

  // Получаем цветовую информацию для тултипа
  const colorInfoString = useMemo(() => {
    return colorUtils.colorToRGBString(panelColor);
  }, [panelColor]);

  const panelContent = (
    <group position={new THREE.Vector3(...position)} rotation={[0, 3.2, 0]}>
      {/* Внешняя рамка с углублением */}
      <RoundedBox args={[0.28, 0.78, 0.015]} radius={0.02} smoothness={4} castShadow>
        <primitive object={panelBorderMaterial} attach="material" />
      </RoundedBox>

      {/* Основа панели - утопленная внутрь с мягкими скругленными краями */}
      <RoundedBox position={[0, 0, 0.005]} args={[0.26, 0.76, 0.01]} radius={0.015} smoothness={4} castShadow>
        <primitive object={panelMaterial} attach="material" />
      </RoundedBox>

      {/* Экран с информацией о текущем этаже (вверху панели) - имеет небольшое углубление */}
      <group position={[0, 0.32, 0]}>
        {/* Углубление для экрана */}
        <RoundedBox position={[0, 0, 0.006]} args={[0.22, 0.05, 0.003]} radius={0.01} smoothness={4}>
          <primitive object={panelBorderMaterial} attach="material" />
        </RoundedBox>
        
        {/* Сам экран */}
        <RoundedBox position={[0, 0, 0.009]} args={[0.2, 0.03, 0.001]} radius={0.005} smoothness={4}>
          <primitive object={displayMaterial} attach="material" />
        </RoundedBox>
      </group>

      {/* Кнопки этажей - используем циклы для создания рядов кнопок */}
      {buttonPositions.map((pos, index) => {
        // Вычисляем номер этажа (начиная с верхнего)
        const floorNumber = 24 - index;
        return (
          <group key={`button-group-${index}`}>
            {/* Углубление для кнопки */}
            <Cylinder
              position={[pos[0], pos[1], 0.01]}
              rotation={[Math.PI / 2, 0, 0]}
              args={[0.022, 0.022, 0.003, 16]}
              castShadow
            >
              <primitive object={panelBorderMaterial} attach="material" />
            </Cylinder>
            
            {/* Кнопка этажа - плоский цилиндр */}
            <Cylinder
              position={[pos[0], pos[1], 0.013]}
              rotation={[Math.PI / 2, 0, 0]}
              args={[0.018, 0.018, 0.005, 16]}
              castShadow
            >
              <primitive object={buttonMaterial} attach="material" />
            </Cylinder>
            
            {/* Обводка кнопки */}
            <Cylinder
              position={[pos[0], pos[1], 0.012]}
              rotation={[Math.PI / 2, 0, 0]}
              args={[0.021, 0.021, 0.001, 16]}
              castShadow
            >
              <primitive object={buttonRimMaterial} attach="material" />
            </Cylinder>

            {/* Номер этажа */}
            <Html
              position={[pos[0], pos[1], 0.016]}
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
        {/* Углубление для кнопки открытия дверей */}
        <Cylinder
          position={[-0.05, 0, 0.01]}
          rotation={[Math.PI / 2, 0, 0]}
          args={[0.022, 0.022, 0.003, 16]}
          castShadow
        >
          <primitive object={panelBorderMaterial} attach="material" />
        </Cylinder>
        
        {/* Кнопка открытия дверей */}
        <Cylinder
          position={[-0.05, 0, 0.013]}
          rotation={[Math.PI / 2, 0, 0]}
          args={[0.018, 0.018, 0.005, 16]}
          castShadow
        >
          <primitive object={buttonMaterial} attach="material" />
        </Cylinder>
        
        {/* Обводка кнопки открытия дверей */}
        <Cylinder
          position={[-0.05, 0, 0.012]}
          rotation={[Math.PI / 2, 0, 0]}
          args={[0.021, 0.021, 0.001, 16]}
          castShadow
        >
          <primitive object={buttonRimMaterial} attach="material" />
        </Cylinder>

        {/* Символ открытия дверей */}
        <Html
          position={[-0.05, 0, 0.016]}
          center
          style={textStyle}
        >
          ◄►
        </Html>

        {/* Углубление для кнопки закрытия дверей */}
        <Cylinder
          position={[0.05, 0, 0.01]}
          rotation={[Math.PI / 2, 0, 0]}
          args={[0.022, 0.022, 0.003, 16]}
          castShadow
        >
          <primitive object={panelBorderMaterial} attach="material" />
        </Cylinder>
        
        {/* Кнопка закрытия дверей */}
        <Cylinder
          position={[0.05, 0, 0.013]}
          rotation={[Math.PI / 2, 0, 0]}
          args={[0.018, 0.018, 0.005, 16]}
          castShadow
        >
          <primitive object={buttonMaterial} attach="material" />
        </Cylinder>
        
        {/* Обводка кнопки закрытия дверей */}
        <Cylinder
          position={[0.05, 0, 0.012]}
          rotation={[Math.PI / 2, 0, 0]}
          args={[0.021, 0.021, 0.001, 16]}
          castShadow
        >
          <primitive object={buttonRimMaterial} attach="material" />
        </Cylinder>

        {/* Символ закрытия дверей */}
        <Html
          position={[0.05, 0, 0.016]}
          center
          style={textStyle}
        >
          ►◄
        </Html>
      </group>
    </group>
  );

  // Оборачиваем панель в компонент makeHoverable
  return (
    <MakeHoverable
      name="Панель управления лифтом"
      type="Элемент управления"
      description="Панель с кнопками для управления лифтом"
      material="Металл, пластик"
      dimensions={{
        width: 0.28,
        height: 0.78,
        depth: 0.015
      }}
      additionalInfo={{
        color: colorInfoString,
        texture: "Металлик с матовым покрытием",
        "Количество кнопок": buttonPositions.length + 2,
        "Тип освещения": lightsOn ? "Включено" : "Выключено"
      }}
      requiresDoubleClick={false}
    >
      {panelContent}
    </MakeHoverable>
  );
};

export default ElevatorPanel; 
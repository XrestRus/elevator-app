import React, { useMemo } from "react";
import { Cylinder, RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import colorUtils from "../../utils/colorUtils";
import { ElevatorPanelProps } from "./smartPanel/ElevatorPanel";
import { createNumberTexture } from "./smartPanel/utilsElevatorPanel";

/**
 * Компонент панели управления лифтом с кнопками и экраном
 */
const ElevatorPanel: React.FC<ElevatorPanelProps> = ({
  position,
  lightsOn,
  panelColor,
}) => {
  // Создаем материал основы панели с использованием собственного цвета панели
  const panelMaterial = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(panelColor),
        metalness: 0.9,
        roughness: 0.1,
        envMapIntensity: 1.5,
        clearcoat: 0.3, // Добавляем легкое покрытие лаком для глянца
        clearcoatRoughness: 0.1, // Делаем покрытие гладким
      }),
    [panelColor]
  );

  // Создаем материал для внутренней части панели (слегка светлее основного цвета)
  const panelInnerMaterial = useMemo(() => {
    const innerColor = colorUtils.lightenColor(panelColor, 1.2);
    return new THREE.MeshStandardMaterial({
      color: innerColor,
      metalness: 0.5,
      roughness: 0.2,
      emissive: lightsOn ? innerColor : "#000000",
      emissiveIntensity: lightsOn ? 0.08 : 0,
    });
  }, [panelColor, lightsOn]);

  // Создаем цвет кнопок еще светлее цвета стен
  const buttonColor = useMemo(() => {
    return colorUtils.lightenColor(panelColor, 1.35);
  }, [panelColor]);

  // Материал для рамки/углубления панели (темнее)
  const panelBorderMaterial = useMemo(() => {
    const borderColor = colorUtils.darkenColor(panelColor, 0.8);
    return new THREE.MeshStandardMaterial({
      color: borderColor,
      metalness: 0.5,
      roughness: 0.3,
      emissive: lightsOn ? borderColor : "#000000",
      emissiveIntensity: lightsOn ? 0.02 : 0,
    });
  }, [panelColor, lightsOn]);

  // Материал для экрана
  const displayMaterial = useMemo(() => {
    const displayColor = colorUtils.lightenColor(panelColor, 1.3); // Делаем обводку ещё светлее для лучшего контраста
    return new THREE.MeshStandardMaterial({
      color: displayColor,
      emissive: lightsOn ? displayColor : "#000000",
      emissiveIntensity: lightsOn ? 0.5 : 0.0,
    });
  }, [panelColor, lightsOn]);

  // Материал для обводки кнопок (еще светлее основного цвета кнопок)
  const buttonRimMaterial = useMemo(() => {
    const rimColor = colorUtils.lightenColor(buttonColor, 1.3); // Делаем обводку ещё светлее для лучшего контраста
    return new THREE.MeshStandardMaterial({
      color: rimColor,
      metalness: 0.9,
      roughness: 0.1,
      emissive: lightsOn ? rimColor : "#000000",
      emissiveIntensity: lightsOn ? 0.34 : 0,
    });
  }, [buttonColor, lightsOn]);

  // Позиции кнопок в соответствии с изображением
  const buttonPositions = useMemo(() => {
    const positions: [number, number][] = [];

    // Первый столбец (12, 11, 10, 9, ..., 1)
    for (let i = 0; i < 12; i++) {
      positions.push([-0.06, 0.32 - i * 0.06]);
    }

    // Второй столбец (24, 23, 22, ..., 13)
    for (let i = 0; i < 12; i++) {
      positions.push([0.06, 0.32 - i * 0.06]);
    }

    return positions;
  }, []);

  // Создаем текстуры с числами для этажей
  const floorTextures = useMemo(() => {
    const textures: THREE.Texture[] = [];
    for (let i = 1; i <= 24; i++) {
      textures.push(createNumberTexture(i.toString()));
    }
    return textures;
  }, []);

  // Создаем текстуры для кнопок открытия/закрытия дверей
  const openDoorsTexture = useMemo(() => createNumberTexture("◄►"), []);
  const closeDoorsTexture = useMemo(() => createNumberTexture("►◄"), []);

  const panelContent = (
    <group position={new THREE.Vector3(...position)} rotation={[0, 3.2, 0]}>
      {/* Внешняя рамка с углублением */}
      <RoundedBox
        args={[0.32, 1, 0.015]}
        radius={0.02}
        smoothness={4}
        castShadow
      >
        <primitive object={panelMaterial} attach="material" />
      </RoundedBox>

      {/* Основа панели - утопленная внутрь с мягкими скругленными краями */}
      <RoundedBox
        position={[0, 0, 0.005]}
        args={[0.3, 0.98, 0.01]}
        radius={0.015}
        smoothness={4}
        castShadow
      >
        <primitive object={panelInnerMaterial} attach="material" />
      </RoundedBox>

      {/* Экран с информацией о текущем этаже (вверху панели) - имеет небольшое углубление */}
      <group position={[0, 0.4, 0]}>
        {/* Углубление для экрана */}
        <RoundedBox
          position={[0, 0, 0.006]}
          args={[0.22, 0.05, 0.003]}
          radius={0.01}
          smoothness={4}
        >
          <primitive object={panelBorderMaterial} attach="material" />
        </RoundedBox>

        {/* Сам экран */}
        <RoundedBox
          position={[0, 0, 0.01]}
          args={[0.2, 0.03, 0.001]}
          radius={0.009}
          smoothness={4}
        >
          <primitive object={displayMaterial} attach="material" />
        </RoundedBox>
      </group>

      {/* Кнопки этажей - используем циклы для создания рядов кнопок */}
      {buttonPositions.map((pos, index) => {
        // Вычисляем номер этажа (начиная с верхнего)
        const floorNumber = 24 - index;

        // Создаем материал кнопки с нанесенным числом
        const buttonWithNumberMaterial = new THREE.MeshStandardMaterial({
          color: "black",
          metalness: 0.8,
          roughness: 0.2,
          emissive: "black",
          emissiveIntensity: lightsOn ? 0.5 : 0.0,
          map: floorTextures[floorNumber - 1],
          transparent: true,
          alphaTest: 0.1,
        });

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
            {/* ai не менять rotation */}
            <Cylinder
              position={[pos[0], pos[1], 0.013]}
              rotation={[Math.PI / 2, 1.5, 0]}
              args={[0.018, 0.018, 0.005, 16]}
              castShadow
            >
              <primitive object={buttonWithNumberMaterial} attach="material" />
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
          </group>
        );
      })}

      {/* Кнопки открытия/закрытия дверей (внизу панели) */}
      <group position={[0, -0.42, 0]}>
        {/* Создаем материалы для кнопок дверей с соответствующими символами */}
        {(() => {
          const openButtonMaterial = new THREE.MeshStandardMaterial({
            color: buttonColor,
            metalness: 0.9,
            roughness: 0.1,
            emissive: "black",
            emissiveIntensity: lightsOn ? 0.5 : 0.0,
            map: openDoorsTexture,
            transparent: true,
            alphaTest: 0.1,
          });

          const closeButtonMaterial = new THREE.MeshStandardMaterial({
            color: buttonColor,
            metalness: 0.9,
            roughness: 0.1,
            emissive: "black",
            emissiveIntensity: lightsOn ? 0.5 : 0.0,
            map: closeDoorsTexture,
            transparent: true,
            alphaTest: 0.1,
          });

          return (
            <>
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
                rotation={[Math.PI / 2, 1.5, 0]}
                args={[0.018, 0.018, 0.005, 16]}
                castShadow
              >
                <primitive object={openButtonMaterial} attach="material" />
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
                rotation={[Math.PI / 2, 1.5, 0]}
                args={[0.018, 0.018, 0.005, 16]}
                castShadow
              >
                <primitive object={closeButtonMaterial} attach="material" />
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
            </>
          );
        })()}
      </group>
    </group>
  );

  return <>{panelContent}</>;
};

export default ElevatorPanel;

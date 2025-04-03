import React, { useRef, useEffect } from "react";
import { useSpring, animated } from "@react-spring/three";
import * as THREE from "three";
import { makeHoverable } from "../../utils/objectInfo";

/**
 * Свойства компонента дверей лифта
 */
interface ElevatorDoorsProps {
  doorsOpen: boolean;
  doorHeight: number;
  dimensions: {
    width: number;
    height: number;
    depth: number;
  };
  doorMaterial: THREE.Material;
}

/**
 * Компонент для отображения дверей лифта с анимацией открытия/закрытия
 */
const ElevatorDoors: React.FC<ElevatorDoorsProps> = ({
  doorsOpen,
  doorHeight,
  dimensions,
  doorMaterial,
}) => {
  // Ссылки на элементы дверей
  const leftDoorRef = useRef<THREE.Mesh>(null);
  const rightDoorRef = useRef<THREE.Mesh>(null);
  
  // Оптимизированные настройки анимации для более плавного открытия/закрытия
  const animConfig = {
    mass: 1, // Увеличиваем массу для более естественного движения
    tension: 120, // Увеличиваем натяжение для более быстрого начала движения
    friction: 16, // Увеличиваем трение для более плавной остановки
    clamp: false, // Разрешаем небольшое перебегание
    immediate: false, // Никогда не пропускаем анимацию
  };

  // Референс для отслеживания предыдущего состояния
  const prevOpenState = useRef(doorsOpen);
  
  // Анимация для левой двери с оптимизированными параметрами
  const leftDoorSpring = useSpring({
    position: doorsOpen
      ? [-dimensions.width / 2, -0.15, dimensions.depth / 2]
      : [-dimensions.width / 4.45, -0.15, dimensions.depth / 2],
    config: animConfig,
    // Обратный вызов для обновления рендера до окончания анимации
    onRest: () => {
      prevOpenState.current = doorsOpen;
    }
  });

  // Анимация для правой двери с оптимизированными параметрами
  const rightDoorSpring = useSpring({
    position: doorsOpen
      ? [dimensions.width / 2, -0.15, dimensions.depth / 2]
      : [dimensions.width / 4.45, -0.15, dimensions.depth / 2],
    config: animConfig,
  });
  
  // Ширина дверей
  const doorWidth = dimensions.width / 2.23;
  
  // Добавляем информацию для наведения мыши
  useEffect(() => {
    // Левая дверь
    if (leftDoorRef.current) {
      makeHoverable(leftDoorRef.current, {
        name: "Левая дверь",
        description: `Левая створка двери лифта (${doorsOpen ? "открыта" : "закрыта"})`,
        material: "Материал дверей",
        dimensions: {
          width: doorWidth,
          height: doorHeight,
          depth: 0.05
        },
        additionalInfo: {
          состояние: doorsOpen ? "Открыта" : "Закрыта"
        }
      });
    }
    
    // Правая дверь
    if (rightDoorRef.current) {
      makeHoverable(rightDoorRef.current, {
        name: "Правая дверь",
        description: `Правая створка двери лифта (${doorsOpen ? "открыта" : "закрыта"})`,
        material: "Материал дверей",
        dimensions: {
          width: doorWidth,
          height: doorHeight,
          depth: 0.05
        },
        additionalInfo: {
          состояние: doorsOpen ? "Открыта" : "Закрыта"
        }
      });
    }
  }, [dimensions, doorHeight, doorWidth, doorsOpen]);
  
  return (
    <>
      {/* Левая дверь */}
      <animated.group {...leftDoorSpring}>
        <mesh ref={leftDoorRef} castShadow receiveShadow>
          <boxGeometry args={[doorWidth, doorHeight, 0.05]} />
          <primitive object={doorMaterial} attach="material" />
        </mesh>
      </animated.group>

      {/* Правая дверь */}
      <animated.group {...rightDoorSpring}>
        <mesh ref={rightDoorRef} castShadow receiveShadow>
          <boxGeometry args={[doorWidth, doorHeight, 0.05]} />
          <primitive object={doorMaterial} attach="material" />
        </mesh>
      </animated.group>
    </>
  );
};

export default ElevatorDoors; 
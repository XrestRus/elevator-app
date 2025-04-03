import React, { useRef } from "react";
import { useSpring, animated } from "@react-spring/three";
import * as THREE from "three";
import MakeHoverable from "../ui/makeHoverable";
import colorUtils from "../../utils/colorUtils";

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
  // Оптимизированные настройки анимации для более плавного открытия/закрытия
  const animConfig = {
    mass: 0.6, // Увеличиваем массу для более естественного движения
    tension: 120, // Увеличиваем натяжение для более быстрого начала движения
    friction: 18, // Увеличиваем трение для более плавной остановки
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
  
  // Получаем цвет материала дверей для отображения в тултипе
  const getDoorColor = () => colorUtils.getMaterialColor(doorMaterial);
  
  // Общие свойства для дверей
  const doorHoverProps = {
    material: "Материал дверей",
    dimensions: {
      width: doorWidth,
      height: doorHeight,
      depth: 0.05
    },
    additionalInfo: {
      color: getDoorColor(),
      texture: "Металлическая поверхность",
      "Состояние": doorsOpen ? "Открыта" : "Закрыта"
    },
    requiresDoubleClick: false
  };
  
  return (
    <>
      {/* Левая дверь */}
      <animated.group {...leftDoorSpring}>
        <MakeHoverable
          name="Левая дверь"
          type="Элемент конструкции"
          description={`Левая створка двери лифта (${doorsOpen ? "открыта" : "закрыта"})`}
          {...doorHoverProps}
        >
          <mesh castShadow receiveShadow>
            <boxGeometry args={[doorWidth, doorHeight, 0.05]} />
            <primitive object={doorMaterial} attach="material" />
          </mesh>
        </MakeHoverable>
      </animated.group>

      {/* Правая дверь */}
      <animated.group {...rightDoorSpring}>
        <MakeHoverable
          name="Правая дверь"
          type="Элемент конструкции"
          description={`Правая створка двери лифта (${doorsOpen ? "открыта" : "закрыта"})`}
          {...doorHoverProps}
        >
          <mesh castShadow receiveShadow>
            <boxGeometry args={[doorWidth, doorHeight, 0.05]} />
            <primitive object={doorMaterial} attach="material" />
          </mesh>
        </MakeHoverable>
      </animated.group>
    </>
  );
};

export default ElevatorDoors; 
import React from "react";
import { useSpring, animated } from "@react-spring/three";
import * as THREE from "three";

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
  decorationStripes?: {
    enabled?: boolean;
    showOnDoors?: boolean;
    width?: number;
    count?: number;
    orientation?: string;
    offset?: number;
    material?: string;
  };
  decorationStripesMaterial: THREE.Material | null;
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
  // Анимация для левой двери
  const leftDoorSpring = useSpring({
    position: doorsOpen
      ? [-dimensions.width / 2, -0.15, dimensions.depth / 2]
      : [-dimensions.width / 4.45, -0.15, dimensions.depth / 2],
    config: { mass: 0.1, tension: 100, friction: 14 },
  });

  // Анимация для правой двери
  const rightDoorSpring = useSpring({
    position: doorsOpen
      ? [dimensions.width / 2, -0.15, dimensions.depth / 2]
      : [dimensions.width / 4.45, -0.15, dimensions.depth / 2],
    config: { mass: 0.1, tension: 100, friction: 14 },
  });

  return (
    <>
      {/* Левая дверь - с скорректированной шириной */}
      <animated.group {...leftDoorSpring}>
        <mesh castShadow>
          <boxGeometry args={[dimensions.width / 2.23, doorHeight, 0.05]} />
          <primitive object={doorMaterial} attach="material" />
        </mesh>
      </animated.group>

      {/* Правая дверь - с скорректированной шириной */}
      <animated.group {...rightDoorSpring}>
        <mesh castShadow>
          <boxGeometry args={[dimensions.width / 2.23, doorHeight, 0.05]} />
          <primitive object={doorMaterial} attach="material" />
        </mesh>
      </animated.group>
    </>
  );
};

export default ElevatorDoors; 
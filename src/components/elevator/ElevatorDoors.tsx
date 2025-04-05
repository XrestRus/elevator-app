import React, { useRef, useMemo } from "react";
import { useSpring, animated } from "@react-spring/three";
import * as THREE from "three";
import { useTexture } from "@react-three/drei";

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
  showLogo?: boolean; // Флаг для отображения логотипа
  logoScale?: number; // Масштаб логотипа
  logoOffsetY?: number; // Смещение логотипа по вертикали
  logoOffsetX?: number; // Смещение логотипа по горизонтали
  logoColor?: string; // Цвет логотипа
}

/**
 * Компонент для отображения дверей лифта с анимацией открытия/закрытия
 */
const ElevatorDoors: React.FC<ElevatorDoorsProps> = ({
  doorsOpen,
  doorHeight,
  dimensions,
  doorMaterial,
  showLogo = false,
  logoScale = 1,
  logoOffsetY = 0,
  logoOffsetX = 0,
  logoColor = "#253D98",
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
      ? [-dimensions.width / 2, -0.15, dimensions.depth / 1.9]
      : [-dimensions.width / 4.45, -0.15, dimensions.depth / 1.9],
    config: animConfig,
    // Обратный вызов для обновления рендера до окончания анимации
    onRest: () => {
      prevOpenState.current = doorsOpen;
    },
  });

  // Анимация для правой двери с оптимизированными параметрами
  const rightDoorSpring = useSpring({
    position: doorsOpen
      ? [dimensions.width / 2, -0.15, dimensions.depth / 1.9]
      : [dimensions.width / 4.45, -0.15, dimensions.depth / 1.9],
    config: animConfig,
  });

  // Ширина дверей
  const doorWidth = dimensions.width / 2.23;

  // Загружаем текстуру логотипа, если он включен
  const logoTexture = useMemo(() => {
    return showLogo ? "./textures/logo1i_upscaled.png" : "./textures/dummy.png";
  }, [showLogo]);

  // Используем хук для загрузки текстуры - всегда вызываем, но используем только при showLogo=true
  const logoMap = useTexture(logoTexture);

  // Создаем материал для логотипа
  const logoMaterial = useMemo(() => {
    if (!showLogo) return null;

    // Создаем стандартный материал с односторонним отображением
    const material = new THREE.MeshStandardMaterial({
      transparent: true,
      side: THREE.FrontSide,
      map: logoMap,
      // Применяем указанный цвет для логотипа
      color: new THREE.Color(logoColor),
      emissive: new THREE.Color(logoColor),
      emissiveMap: logoMap,
      emissiveIntensity: 0.2,
      alphaTest: 0.1,
    });

    return material;
  }, [logoMap, showLogo, logoColor]);

  // Создаем геометрию для логотипа с явной настройкой нормалей
  const logoGeometry = useMemo(() => {
    // Создаем плоскость с правильными нормалями, направленными вперед
    const geometry = new THREE.BufferGeometry();

    // Вершины квадрата (x, y, z)
    const vertices = new Float32Array([
      -0.5,
      -0.5,
      0, // левый нижний
      0.5,
      -0.5,
      0, // правый нижний
      0.5,
      0.5,
      0, // правый верхний
      -0.5,
      0.5,
      0, // левый верхний
    ]);

    // Индексы для треугольников
    const indices = new Uint16Array([
      0,
      1,
      2, // первый треугольник
      0,
      2,
      3, // второй треугольник
    ]);

    // UV-координаты для текстуры
    const uvs = new Float32Array([
      0,
      0, // левый нижний
      1,
      0, // правый нижний
      1,
      1, // правый верхний
      0,
      1, // левый верхний
    ]);

    // Нормали, направленные в сторону камеры (к Z+)
    const normals = new Float32Array([
      0,
      0,
      1, // для всех вершин нормаль направлена вперед
      0,
      0,
      1,
      0,
      0,
      1,
      0,
      0,
      1,
    ]);

    // Устанавливаем атрибуты геометрии
    geometry.setIndex(new THREE.BufferAttribute(indices, 1));
    geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));
    geometry.setAttribute("normal", new THREE.BufferAttribute(normals, 3));
    geometry.setAttribute("uv", new THREE.BufferAttribute(uvs, 2));

    return geometry;
  }, []);

  // Размер логотипа для отображения на каждой створке
  const logoFinalScale = logoScale * 0.5; // Уменьшаем размер т.к. логотип на каждой створке

  return (
    <>
      {/* Левая дверь */}
      <animated.group {...leftDoorSpring}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[doorWidth, doorHeight, 0.05]} />
          <primitive object={doorMaterial} attach="material" />
        </mesh>

        {/* Логотип на левой створке */}
        {showLogo && logoMaterial && (
          <group
            position={[logoOffsetX, (logoOffsetY * doorHeight) / 2, -0.04]}
          >
            <mesh
              scale={[logoFinalScale, logoFinalScale, 1]}
              rotation={[0, -91, 0]}
              renderOrder={1}
              geometry={logoGeometry}
              material={logoMaterial}
            />
          </group>
        )}
      </animated.group>

      {/* Правая дверь */}
      <animated.group {...rightDoorSpring}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[doorWidth, doorHeight, 0.05]} />
          <primitive object={doorMaterial} attach="material" />
        </mesh>

        {/* Логотип на правой створке */}
        {showLogo && logoMaterial && (
          <group
            position={[-logoOffsetX, (logoOffsetY * doorHeight) / 2, -0.04]}
          >
            <mesh
              scale={[logoFinalScale, logoFinalScale, 1]}
              rotation={[0, -91, 0]}
              renderOrder={1}
              geometry={logoGeometry}
              material={logoMaterial}
            />
          </group>
        )}
      </animated.group>
    </>
  );
};

export default ElevatorDoors;

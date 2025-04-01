import React from 'react';
import { Box } from '@react-three/drei';
import { useSpring, animated } from '@react-spring/three';
import * as THREE from 'three';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store/store';
import type { ElevatorState } from '../../store/elevatorSlice';

/**
 * Компонент, представляющий базовую геометрию лифта с анимированными дверьми
 */
const BasicElevator: React.FC = () => {
  // Получаем состояние из Redux
  const { dimensions, doorsOpen, materials } = useSelector((state: RootState) => state.elevator as ElevatorState);
  
  // Анимация для левой двери
  const leftDoorSpring = useSpring({
    position: doorsOpen 
      ? [-dimensions.width/4 - 0.5, -0.15, dimensions.depth/2] 
      : [-dimensions.width/4 + 0.025, -0.15, dimensions.depth/2], // Сдвигаем вправо на половину зазора
    config: { mass: 1, tension: 120, friction: 14 }
  });
  
  // Анимация для правой двери
  const rightDoorSpring = useSpring({
    position: doorsOpen 
      ? [dimensions.width/4 + 0.5, -0.15, dimensions.depth/2] 
      : [dimensions.width/4 - 0.025, -0.15, dimensions.depth/2], // Сдвигаем влево на половину зазора
    config: { mass: 1, tension: 120, friction: 14 }
  });
  
  // Материалы поверхностей
  const floorMaterial = new THREE.MeshStandardMaterial({ 
    color: materials.floor, 
    roughness: 0.7,
    metalness: 0.1
  });
  
  const ceilingMaterial = new THREE.MeshStandardMaterial({ 
    color: materials.ceiling, 
    roughness: 0.2,
    metalness: 0.1
  });
  
  const wallMaterial = new THREE.MeshStandardMaterial({ 
    color: materials.walls, 
    roughness: 0.4,
    metalness: 0.1
  });
  
  const doorMaterial = new THREE.MeshStandardMaterial({ 
    color: materials.doors, 
    roughness: 0.3,
    metalness: 0.3
  });
  
  // Параметры двери
  const doorWidth = dimensions.width - 0.4; // Ширина дверного проёма 
  const doorHeight = dimensions.height - 0.3; // Уменьшаем высоту двери для отступа сверху
  
  return (
    <group>
      {/* Пол */}
      <Box 
        position={[0, -dimensions.height/2, 0]} 
        args={[dimensions.width, 0.1, dimensions.depth]}
        receiveShadow
      >
        <primitive object={floorMaterial} attach="material" />
      </Box>
      
      {/* Потолок */}
      <Box 
        position={[0, dimensions.height/2, 0]} 
        args={[dimensions.width, 0.1, dimensions.depth]}
        receiveShadow
      >
        <primitive object={ceilingMaterial} attach="material" />
      </Box>
      
      {/* Задняя стена */}
      <Box 
        position={[0, 0, -dimensions.depth/2]} 
        args={[dimensions.width, dimensions.height, 0.05]}
        castShadow
        receiveShadow
      >
        <primitive object={wallMaterial} attach="material" />
      </Box>
      
      {/* Левая стена */}
      <Box 
        position={[-dimensions.width/2, 0, 0]} 
        args={[0.05, dimensions.height, dimensions.depth]}
        castShadow
        receiveShadow
      >
        <primitive object={wallMaterial} attach="material" />
      </Box>
      
      {/* Правая стена */}
      <Box 
        position={[dimensions.width/2, 0, 0]} 
        args={[0.05, dimensions.height, dimensions.depth]}
        castShadow
        receiveShadow
      >
        <primitive object={wallMaterial} attach="material" />
      </Box>
      
      {/* ДВЕРНОЙ ПРОЁМ - элементы рамки вместо сплошной стены */}
      
      {/* Верхняя перемычка над дверью */}
      <Box 
        position={[0, dimensions.height/2 - 0.15, dimensions.depth/2]} 
        args={[dimensions.width, 0.3, 0.07]} // Верхний отступ 0.3
        castShadow
      >
        <primitive object={wallMaterial} attach="material" />
      </Box>
      
      {/* Убираем нижнюю перемычку (порог) */}
      
      {/* Левая боковая часть дверной рамки */}
      <Box 
        position={[-dimensions.width/2 + 0.2, -0.15, dimensions.depth/2]} // Смещаем вниз на 0.15
        args={[dimensions.width - doorWidth, doorHeight, 0.07]}
        castShadow
      >
        <primitive object={wallMaterial} attach="material" />
      </Box>
      
      {/* Правая боковая часть дверной рамки */}
      <Box 
        position={[dimensions.width/2 - 0.2, -0.15, dimensions.depth/2]} // Смещаем вниз на 0.15
        args={[dimensions.width - doorWidth, doorHeight, 0.07]}
        castShadow
      >
        <primitive object={wallMaterial} attach="material" />
      </Box>
      
      {/* Левая дверь (анимированная) */}
      <animated.mesh 
        {...leftDoorSpring} 
        castShadow
      >
        <boxGeometry args={[dimensions.width/2 - 0.05 + 0.025, doorHeight, 0.05]} /> // Немного увеличиваем ширину
        <primitive object={doorMaterial} attach="material" />
      </animated.mesh>
      
      {/* Правая дверь (анимированная) */}
      <animated.mesh 
        {...rightDoorSpring} 
        castShadow
      >
        <boxGeometry args={[dimensions.width/2 - 0.05 + 0.025, doorHeight, 0.05]} /> // Немного увеличиваем ширину
        <primitive object={doorMaterial} attach="material" />
      </animated.mesh>
    </group>
  );
};

export default BasicElevator; 
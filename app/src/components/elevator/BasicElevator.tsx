import React from 'react';
import { Box, MeshReflectorMaterial } from '@react-three/drei';
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
  
  // Определяем размеры двери
  const doorWidth = dimensions.width - 0.4;
  const doorHeight = dimensions.height - 0.3;
  
  // Анимация для левой двери
  const leftDoorSpring = useSpring({
    position: doorsOpen 
      ? [-dimensions.width/4 - 0.5, -0.15, dimensions.depth/2] 
      : [-dimensions.width/4 + 0.025, -0.15, dimensions.depth/2],
    config: { mass: 1, tension: 120, friction: 14 }
  });
  
  // Анимация для правой двери
  const rightDoorSpring = useSpring({
    position: doorsOpen 
      ? [dimensions.width/4 + 0.5, -0.15, dimensions.depth/2] 
      : [dimensions.width/4 - 0.025, -0.15, dimensions.depth/2],
    config: { mass: 1, tension: 120, friction: 14 }
  });
  
  // Стандартные материалы для не-зеркальных поверхностей
  const floorMaterial = new THREE.MeshStandardMaterial({ 
    color: materials.floor, 
    roughness: materials.roughness.floor,
    metalness: materials.metalness.floor
  });
  
  const ceilingMaterial = new THREE.MeshStandardMaterial({ 
    color: materials.ceiling, 
    roughness: materials.roughness.ceiling,
    metalness: materials.metalness.ceiling
  });
  
  const wallMaterial = new THREE.MeshStandardMaterial({ 
    color: materials.walls, 
    roughness: materials.roughness.walls,
    metalness: materials.metalness.walls
  });
  
  const doorMaterial = new THREE.MeshStandardMaterial({ 
    color: materials.doors, 
    roughness: materials.roughness.doors,
    metalness: materials.metalness.doors
  });
  
  // Создаем текстуры если они указаны
  const createTexture = (texturePath: string | null) => {
    if (!texturePath) return null;
    return new THREE.TextureLoader().load(texturePath);
  };
  
  // Загружаем текстуры
  const wallTexture = createTexture(materials.texture?.walls);
  const floorTexture = createTexture(materials.texture?.floor);
  const ceilingTexture = createTexture(materials.texture?.ceiling);
  
  if (wallTexture) {
    wallMaterial.map = wallTexture;
  }
  
  if (floorTexture) {
    floorMaterial.map = floorTexture;
  }
  
  if (ceilingTexture) {
    ceilingMaterial.map = ceilingTexture;
  }
  
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
      
      {/* Потолок - всегда обычный материал */}
      <Box 
        position={[0, dimensions.height/2, 0]} 
        args={[dimensions.width, 0.1, dimensions.depth]}
        receiveShadow
      >
        <primitive object={ceilingMaterial} attach="material" />
      </Box>
      
      {/* Задняя стена - единственная зеркальная стена */}
      <Box 
        position={[0, 0, -dimensions.depth/2]} 
        args={[dimensions.width, dimensions.height, 0.05]}
        castShadow
        receiveShadow
      >
        {materials.isMirror.walls ? (
          <MeshReflectorMaterial
            color={materials.walls}
            blur={[100, 50]}  // Уменьшил размытие для четкости
            resolution={1024} // Увеличил разрешение
            mixBlur={0.05}    // Меньше размытия
            mixStrength={1.5} // Усилил интенсивность отражения
            metalness={0.9}
            roughness={0.05}  // Уменьшил шероховатость для более четкого отражения
            mirror={1.0}      // Максимальное отражение (100%)
          />
        ) : (
          <primitive object={wallMaterial} attach="material" />
        )}
      </Box>
      
      {/* Левая стена - всегда обычный материал */}
      <Box 
        position={[-dimensions.width/2, 0, 0]} 
        args={[0.05, dimensions.height, dimensions.depth]}
        castShadow
        receiveShadow
      >
        <primitive object={wallMaterial} attach="material" />
      </Box>
      
      {/* Правая стена - всегда обычный материал */}
      <Box 
        position={[dimensions.width/2, 0, 0]} 
        args={[0.05, dimensions.height, dimensions.depth]}
        castShadow
        receiveShadow
      >
        <primitive object={wallMaterial} attach="material" />
      </Box>
      
      {/* Верхняя перемычка над дверью */}
      <Box 
        position={[0, dimensions.height/2 - 0.15, dimensions.depth/2]} 
        args={[dimensions.width, 0.3, 0.07]}
        castShadow
      >
        <primitive object={wallMaterial} attach="material" />
      </Box>
      
      {/* Левая боковая часть дверной рамки */}
      <Box 
        position={[-dimensions.width/2 + 0.2, -0.15, dimensions.depth/2]} 
        args={[dimensions.width - doorWidth, doorHeight, 0.07]}
        castShadow
      >
        <primitive object={wallMaterial} attach="material" />
      </Box>
      
      {/* Правая боковая часть дверной рамки */}
      <Box 
        position={[dimensions.width/2 - 0.2, -0.15, dimensions.depth/2]} 
        args={[dimensions.width - doorWidth, doorHeight, 0.07]}
        castShadow
      >
        <primitive object={wallMaterial} attach="material" />
      </Box>
      
      {/* Левая дверь - всегда обычный материал */}
      <animated.mesh {...leftDoorSpring} castShadow>
        <boxGeometry args={[dimensions.width/2 - 0.05 + 0.025, doorHeight, 0.05]} />
        <primitive object={doorMaterial} attach="material" />
      </animated.mesh>
      
      {/* Правая дверь - всегда обычный материал */}
      <animated.mesh {...rightDoorSpring} castShadow>
        <boxGeometry args={[dimensions.width/2 - 0.05 + 0.025, doorHeight, 0.05]} />
        <primitive object={doorMaterial} attach="material" />
      </animated.mesh>
    </group>
  );
};

export default BasicElevator; 
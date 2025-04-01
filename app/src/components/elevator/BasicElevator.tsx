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
    console.log(`Попытка загрузки текстуры: ${texturePath}`);
    const texture = new THREE.TextureLoader().load(
      texturePath,
      (texture) => {
        console.log(`Текстура успешно загружена: ${texturePath}`);
        // Настройка текстуры после загрузки
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(2, 2); // Повторение текстуры
        texture.needsUpdate = true;
      },
      (progress) => {
        console.log(`Загрузка текстуры ${texturePath}: ${(progress.loaded / progress.total * 100)}%`);
      },
      (error) => {
        console.error(`Ошибка загрузки текстуры ${texturePath}:`, error);
      }
    );
    
    // Настройка базовых параметров текстуры
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(2, 2);
    
    // Стараемся предотвратить черные текстуры
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.generateMipmaps = true;
    texture.needsUpdate = true;
    
    return texture;
  };
  
  // Создаем PBR-материал из набора текстур
  const createPBRMaterial = (baseTexturePath: string | null) => {
    if (!baseTexturePath || !baseTexturePath.includes('example')) {
      return null; // Возвращаем null для не-PBR текстур
    }
    
    console.log(`Создаю PBR-материал из директории: ${baseTexturePath}`);
    
    // Определяем тип текстуры из пути
    const textureType = baseTexturePath.includes('wood') ? 'wood' 
      : baseTexturePath.includes('marble') ? 'marble'
      : baseTexturePath.includes('metal') ? 'metal'
      : baseTexturePath.includes('fabric') ? 'fabrics'
      : null;
      
    if (!textureType) {
      console.error(`Неизвестный тип текстуры: ${baseTexturePath}`);
      return null;
    }
    
    // Получаем ID текстуры из пути
    const regexResult = baseTexturePath.match(/(\w+)_(\d+)_(\w+)_(\w+)/);
    if (!regexResult) {
      console.error(`Не удалось извлечь ID текстуры из пути: ${baseTexturePath}`);
      return null;
    }
    
    const texturePrefix = `${textureType}_${regexResult[2]}`;
    
    // Формируем пути к файлам текстур
    const colorMapPath = `${baseTexturePath}/${texturePrefix}_color_1k.jpg`;
    const normalMapPath = `${baseTexturePath}/${texturePrefix}_normal_directx_1k.png`;
    const roughnessMapPath = `${baseTexturePath}/${texturePrefix}_roughness_1k.jpg`;
    const aoMapPath = `${baseTexturePath}/${texturePrefix}_ao_1k.jpg`;
    
    // Дополнительно проверяем, есть ли карта металличности (только для металла)
    const metalnessMapPath = textureType === 'metal' 
      ? `${baseTexturePath}/${texturePrefix}_metallic_1k.jpg`
      : null;
    
    // Создаем загрузчик текстур
    const textureLoader = new THREE.TextureLoader();
    
    // Загружаем все карты
    const colorMap = textureLoader.load(colorMapPath, 
      texture => {
        console.log(`Базовая текстура загружена: ${colorMapPath}`);
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(2, 2);
      },
      undefined,
      error => console.error(`Ошибка загрузки базовой текстуры: ${colorMapPath}`, error)
    );
    
    const normalMap = textureLoader.load(normalMapPath,
      texture => {
        console.log(`Карта нормалей загружена: ${normalMapPath}`);
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(2, 2);
      },
      undefined,
      error => console.error(`Ошибка загрузки карты нормалей: ${normalMapPath}`, error)
    );
    
    const roughnessMap = textureLoader.load(roughnessMapPath,
      texture => {
        console.log(`Карта шероховатости загружена: ${roughnessMapPath}`);
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(2, 2);
      },
      undefined,
      error => console.error(`Ошибка загрузки карты шероховатости: ${roughnessMapPath}`, error)
    );
    
    const aoMap = textureLoader.load(aoMapPath,
      texture => {
        console.log(`Карта окклюзии загружена: ${aoMapPath}`);
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(2, 2);
      },
      undefined,
      error => console.error(`Ошибка загрузки карты окклюзии: ${aoMapPath}`, error)
    );
    
    // Загружаем карту металличности, если она существует
    let metalnessMap = null;
    if (metalnessMapPath) {
      metalnessMap = textureLoader.load(metalnessMapPath,
        texture => {
          console.log(`Карта металличности загружена: ${metalnessMapPath}`);
          texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
          texture.repeat.set(2, 2);
        },
        undefined,
        error => console.error(`Ошибка загрузки карты металличности: ${metalnessMapPath}`, error)
      );
    }
    
    // Настраиваем свойства материала в зависимости от типа текстуры
    const materialProps: {
      map: THREE.Texture;
      normalMap: THREE.Texture;
      roughnessMap: THREE.Texture;
      aoMap: THREE.Texture;
      envMapIntensity: number;
      roughness: number;
      metalness?: number;
      metalnessMap?: THREE.Texture | null;
    } = {
      map: colorMap,
      normalMap: normalMap,
      roughnessMap: roughnessMap,
      aoMap: aoMap,
      envMapIntensity: 1.0,
      roughness: 1.0, // Будет модифицировано картой шероховатости
    };
    
    // Для металла добавляем карту металличности
    if (textureType === 'metal' && metalnessMap) {
      materialProps.metalnessMap = metalnessMap;
      materialProps.metalness = 1.0; // Будет модифицировано картой металличности
    } else {
      // Для не-металлических материалов устанавливаем фиксированное значение металличности
      materialProps.metalness = textureType === 'metal' ? 0.8 : 0.0;
    }
    
    // Создаем PBR-материал
    const material = new THREE.MeshStandardMaterial(materialProps);
    
    return material;
  };
  
  // Загружаем текстуры
  const wallTexture = createTexture(materials.texture?.walls);
  const floorTexture = createTexture(materials.texture?.floor);
  const ceilingTexture = createTexture(materials.texture?.ceiling);
  
  // Создаем PBR-материалы, если указаны директории с PBR-текстурами
  const wallPBRMaterial = createPBRMaterial(materials.texture?.walls);
  const floorPBRMaterial = createPBRMaterial(materials.texture?.floor);
  const ceilingPBRMaterial = createPBRMaterial(materials.texture?.ceiling);
  
  // Определяем, какой материал использовать: PBR или обычный
  const actualWallMaterial = wallPBRMaterial || wallMaterial;
  const actualFloorMaterial = floorPBRMaterial || floorMaterial;
  const actualCeilingMaterial = ceilingPBRMaterial || ceilingMaterial;
  
  // Применяем обычные текстуры, если не используем PBR
  if (wallTexture && !wallPBRMaterial) {
    console.log('Применяю обычную текстуру стен:', materials.texture?.walls);
    wallMaterial.map = wallTexture;
  }
  
  if (floorTexture && !floorPBRMaterial) {
    console.log('Применяю обычную текстуру пола:', materials.texture?.floor);
    floorMaterial.map = floorTexture;
  }
  
  if (ceilingTexture && !ceilingPBRMaterial) {
    console.log('Применяю обычную текстуру потолка:', materials.texture?.ceiling);
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
        <primitive object={actualFloorMaterial} attach="material" />
      </Box>
      
      {/* Потолок - всегда обычный материал */}
      <Box 
        position={[0, dimensions.height/2, 0]} 
        args={[dimensions.width, 0.1, dimensions.depth]}
        receiveShadow
      >
        <primitive object={actualCeilingMaterial} attach="material" />
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
          <primitive object={actualWallMaterial} attach="material" />
        )}
      </Box>
      
      {/* Левая стена - всегда обычный материал */}
      <Box 
        position={[-dimensions.width/2, 0, 0]} 
        args={[0.05, dimensions.height, dimensions.depth]}
        castShadow
        receiveShadow
      >
        <primitive object={actualWallMaterial} attach="material" />
      </Box>
      
      {/* Правая стена - всегда обычный материал */}
      <Box 
        position={[dimensions.width/2, 0, 0]} 
        args={[0.05, dimensions.height, dimensions.depth]}
        castShadow
        receiveShadow
      >
        <primitive object={actualWallMaterial} attach="material" />
      </Box>
      
      {/* Верхняя перемычка над дверью */}
      <Box 
        position={[0, dimensions.height/2 - 0.15, dimensions.depth/2]} 
        args={[dimensions.width, 0.3, 0.07]}
        castShadow
      >
        <primitive object={actualWallMaterial} attach="material" />
      </Box>
      
      {/* Левая боковая часть дверной рамки */}
      <Box 
        position={[-dimensions.width/2 + 0.2, -0.15, dimensions.depth/2]} 
        args={[dimensions.width - doorWidth, doorHeight, 0.07]}
        castShadow
      >
        <primitive object={actualWallMaterial} attach="material" />
      </Box>
      
      {/* Правая боковая часть дверной рамки */}
      <Box 
        position={[dimensions.width/2 - 0.2, -0.15, dimensions.depth/2]} 
        args={[dimensions.width - doorWidth, doorHeight, 0.07]}
        castShadow
      >
        <primitive object={actualWallMaterial} attach="material" />
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
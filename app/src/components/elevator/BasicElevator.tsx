import React, { useMemo } from 'react';
import { Box, MeshReflectorMaterial, useTexture } from '@react-three/drei';
import { useSpring, animated } from '@react-spring/three';
import * as THREE from 'three';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store/store';

/**
 * Компонент, представляющий базовую геометрию лифта с анимированными дверьми
 */
const BasicElevator: React.FC = () => {
  const elevator = useSelector((state: RootState) => state.elevator);
  const { materials, dimensions, doorsOpen } = elevator;
  
  // Новый подход: двери занимают почти всю ширину лифта
  // Оставляем только небольшие боковые части для рамки
  const doorFrameWidth = 0.2; // Ширина боковых частей рамки
  const doorHeight = dimensions.height - 0.3; // Высота дверного проема

  // Создаем функцию для клонирования материалов с разным повторением текстур
  const createWallMaterialWithCustomRepeat = (baseMaterial: THREE.Material, repeatX: number, repeatY: number) => {
    // Клонируем исходный материал
    const newMaterial = (baseMaterial as THREE.MeshStandardMaterial).clone();
    
    // Если материал имеет текстуры, настраиваем их повторение
    if (newMaterial.map) {
      newMaterial.map = newMaterial.map.clone();
      newMaterial.map.repeat.set(repeatX, repeatY);
      newMaterial.map.needsUpdate = true;
    }
    
    if (newMaterial.normalMap) {
      newMaterial.normalMap = newMaterial.normalMap.clone();
      newMaterial.normalMap.repeat.set(repeatX, repeatY);
      newMaterial.normalMap.needsUpdate = true;
    }
    
    if (newMaterial.roughnessMap) {
      newMaterial.roughnessMap = newMaterial.roughnessMap.clone();
      newMaterial.roughnessMap.repeat.set(repeatX, repeatY);
      newMaterial.roughnessMap.needsUpdate = true;
    }
    
    if (newMaterial.aoMap) {
      newMaterial.aoMap = newMaterial.aoMap.clone();
      newMaterial.aoMap.repeat.set(repeatX, repeatY);
      newMaterial.aoMap.needsUpdate = true;
    }
    
    if (newMaterial.metalnessMap) {
      newMaterial.metalnessMap = newMaterial.metalnessMap.clone();
      newMaterial.metalnessMap.repeat.set(repeatX, repeatY);
      newMaterial.metalnessMap.needsUpdate = true;
    }
    
    return newMaterial;
  };

  // Анимация для левой двери
  const leftDoorSpring = useSpring({
    position: doorsOpen 
      ? [-dimensions.width/2 - 0.3, -0.15, dimensions.depth/2] // Позиция открытия
      : [-dimensions.width/4, -0.15, dimensions.depth/2], // Смещена влево от центра
    config: { mass: 1, tension: 120, friction: 14 }
  });
  
  // Анимация для правой двери
  const rightDoorSpring = useSpring({
    position: doorsOpen 
      ? [dimensions.width/2 + 0.3, -0.15, dimensions.depth/2] // Позиция открытия
      : [dimensions.width/4, -0.15, dimensions.depth/2], // Смещена вправо от центра
    config: { mass: 1, tension: 120, friction: 14 }
  });
  
  // Базовые материалы (без текстур)
  const basicWallMaterial = useMemo(() => new THREE.MeshStandardMaterial({ color: materials.walls }), [materials.walls]);
  const basicFloorMaterial = useMemo(() => new THREE.MeshStandardMaterial({ color: materials.floor }), [materials.floor]);
  const basicCeilingMaterial = useMemo(() => new THREE.MeshStandardMaterial({ color: materials.ceiling }), [materials.ceiling]);
  const doorMaterial = useMemo(() => new THREE.MeshStandardMaterial({ color: materials.doors }), [materials.doors]);

  // Кэширование путей к текстурам
  const wallTexturePath = materials.texture?.walls || '';
  const floorTexturePath = materials.texture?.floor || '';
  const ceilingTexturePath = materials.texture?.ceiling || '';
  
  // Кэширование PBR текстур с помощью хука useTexture
  // Используем useMemo для загрузки только при изменении пути к текстуре
  const loadPBRTextures = (baseTexturePath: string | null) => {
    if (!baseTexturePath || !baseTexturePath.includes('example')) {
      return {
        colorMapPath: null,
        normalMapPath: null,
        roughnessMapPath: null,
        aoMapPath: null,
        metalnessMapPath: null,
        textureType: null
      };
    }
    
    // Исправляем путь, чтобы он правильно начинался с /public
    const fixedBasePath = baseTexturePath.startsWith('/') ? baseTexturePath : `/${baseTexturePath}`;
    
    // Определяем тип текстуры из пути
    const textureType = fixedBasePath.includes('wood') ? 'wood' 
      : fixedBasePath.includes('marble') ? 'marble'
      : fixedBasePath.includes('metal') ? 'metal'
      : fixedBasePath.includes('fabric') ? 'fabrics'
      : null;
      
    if (!textureType) {
      console.error(`Неизвестный тип текстуры: ${fixedBasePath}`);
      return {
        colorMapPath: null,
        normalMapPath: null,
        roughnessMapPath: null,
        aoMapPath: null,
        metalnessMapPath: null,
        textureType: null
      };
    }
    
    // Получаем ID текстуры из пути
    const regexResult = fixedBasePath.match(/(\w+)_(\d+)_(\w+)_(\w+)/);
    if (!regexResult) {
      console.error(`Не удалось извлечь ID текстуры из пути: ${fixedBasePath}`);
      return {
        colorMapPath: null,
        normalMapPath: null,
        roughnessMapPath: null,
        aoMapPath: null,
        metalnessMapPath: null,
        textureType: null
      };
    }
    
    const texturePrefix = `${textureType}_${regexResult[2]}`;
    
    // Формируем пути к файлам текстур
    const colorMapPath = `${fixedBasePath}/${texturePrefix}_color_1k.jpg`;
    const normalMapPath = `${fixedBasePath}/${texturePrefix}_normal_directx_1k.png`;
    const roughnessMapPath = `${fixedBasePath}/${texturePrefix}_roughness_1k.jpg`;
    const aoMapPath = `${fixedBasePath}/${texturePrefix}_ao_1k.jpg`;
    const metalnessMapPath = textureType === 'metal' 
      ? `${fixedBasePath}/${texturePrefix}_metallic_1k.jpg`
      : null;
    
    return {
      colorMapPath,
      normalMapPath,
      roughnessMapPath,
      aoMapPath,
      metalnessMapPath,
      textureType
    };
  };
  
  // Загружаем текстуры с помощью useTexture (кэширование)
  const wallPBRPaths = useMemo(() => loadPBRTextures(wallTexturePath), [wallTexturePath]);
  const floorPBRPaths = useMemo(() => loadPBRTextures(floorTexturePath), [floorTexturePath]);
  const ceilingPBRPaths = useMemo(() => loadPBRTextures(ceilingTexturePath), [ceilingTexturePath]);
  
  // Для предотвращения ошибок загрузки, используем заглушки для отсутствующих текстур
  // Создаем фиктивную текстуру размером 1x1 пиксель для использования в качестве заглушки
  const dummyTexturePath = '/textures/dummy.png'; // Путь к заглушке (можно заменить на реальный)
  
  // Всегда включаем хотя бы одну текстуру (заглушку), чтобы хук useTexture всегда вызывался
  const wallPaths = useMemo(() => ({
    map: wallPBRPaths.colorMapPath || dummyTexturePath,
    ...(wallPBRPaths.normalMapPath && { normalMap: wallPBRPaths.normalMapPath }),
    ...(wallPBRPaths.roughnessMapPath && { roughnessMap: wallPBRPaths.roughnessMapPath }),
    ...(wallPBRPaths.aoMapPath && { aoMap: wallPBRPaths.aoMapPath }),
    ...(wallPBRPaths.metalnessMapPath && { metalnessMap: wallPBRPaths.metalnessMapPath }),
  }), [wallPBRPaths]);
  
  const floorPaths = useMemo(() => ({
    map: floorPBRPaths.colorMapPath || dummyTexturePath,
    ...(floorPBRPaths.normalMapPath && { normalMap: floorPBRPaths.normalMapPath }),
    ...(floorPBRPaths.roughnessMapPath && { roughnessMap: floorPBRPaths.roughnessMapPath }),
    ...(floorPBRPaths.aoMapPath && { aoMap: floorPBRPaths.aoMapPath }),
    ...(floorPBRPaths.metalnessMapPath && { metalnessMap: floorPBRPaths.metalnessMapPath }),
  }), [floorPBRPaths]);
  
  const ceilingPaths = useMemo(() => ({
    map: ceilingPBRPaths.colorMapPath || dummyTexturePath,
    ...(ceilingPBRPaths.normalMapPath && { normalMap: ceilingPBRPaths.normalMapPath }),
    ...(ceilingPBRPaths.roughnessMapPath && { roughnessMap: ceilingPBRPaths.roughnessMapPath }),
    ...(ceilingPBRPaths.aoMapPath && { aoMap: ceilingPBRPaths.aoMapPath }),
    ...(ceilingPBRPaths.metalnessMapPath && { metalnessMap: ceilingPBRPaths.metalnessMapPath }),
  }), [ceilingPBRPaths]);
  
  // Теперь useTexture всегда вызывается с каким-то путем
  const wallTextures = useTexture(wallPaths);
  const floorTextures = useTexture(floorPaths);
  const ceilingTextures = useTexture(ceilingPaths);
  
  // Создаем PBR материалы только если есть реальные текстуры (не заглушки)
  const wallPBRMaterial = useMemo(() => {
    if (!wallPBRPaths.textureType) return null;
    
    // Настраиваем базовые параметры текстур
    Object.values(wallTextures).forEach(texture => {
      if (!(texture instanceof THREE.Texture)) return;
      texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
      if (texture === wallTextures.map) {
        texture.colorSpace = THREE.SRGBColorSpace;
      }
      texture.needsUpdate = true;
    });
    
    // Настраиваем свойства материала в зависимости от типа текстуры
    const material = new THREE.MeshStandardMaterial({
      ...wallTextures,
      envMapIntensity: 1.0,
      roughness: 1.0, // Будет модифицировано картой шероховатости
      metalness: wallPBRPaths.textureType === 'metal' ? 0.8 : 0.0
    });
    
    return material;
  }, [wallTextures, wallPBRPaths]);
  
  // Создаем PBR материал для пола с мемоизацией
  const floorPBRMaterial = useMemo(() => {
    if (!floorPBRPaths.textureType) return null;
    
    // Настраиваем базовые параметры текстур
    Object.values(floorTextures).forEach(texture => {
      if (!(texture instanceof THREE.Texture)) return;
      texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
      if (texture === floorTextures.map) {
        texture.colorSpace = THREE.SRGBColorSpace;
      }
      texture.needsUpdate = true;
    });
    
    // Настраиваем свойства материала в зависимости от типа текстуры
    const material = new THREE.MeshStandardMaterial({
      ...floorTextures,
      envMapIntensity: 1.0,
      roughness: 1.0, // Будет модифицировано картой шероховатости
      metalness: floorPBRPaths.textureType === 'metal' ? 0.8 : 0.0
    });
    
    return material;
  }, [floorTextures, floorPBRPaths]);
  
  // Создаем PBR материал для потолка с мемоизацией
  const ceilingPBRMaterial = useMemo(() => {
    if (!ceilingPBRPaths.textureType) return null;
    
    // Настраиваем базовые параметры текстур
    Object.values(ceilingTextures).forEach(texture => {
      if (!(texture instanceof THREE.Texture)) return;
      texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
      if (texture === ceilingTextures.map) {
        texture.colorSpace = THREE.SRGBColorSpace;
      }
      texture.needsUpdate = true;
    });
    
    // Настраиваем свойства материала в зависимости от типа текстуры
    const material = new THREE.MeshStandardMaterial({
      ...ceilingTextures,
      envMapIntensity: 1.0,
      roughness: 1.0, // Будет модифицировано картой шероховатости
      metalness: ceilingPBRPaths.textureType === 'metal' ? 0.8 : 0.0
    });
    
    return material;
  }, [ceilingTextures, ceilingPBRPaths]);
  
  // Определяем, какой материал использовать: PBR или обычный
  const actualWallMaterial = wallPBRMaterial || basicWallMaterial;
  const actualFloorMaterial = floorPBRMaterial || basicFloorMaterial;
  const actualCeilingMaterial = ceilingPBRMaterial || basicCeilingMaterial;
  
  // Материалы с разным повторением текстур для разных стен (мемоизация)
  const sideWallMaterial = useMemo(() => 
    createWallMaterialWithCustomRepeat(actualWallMaterial, 1, 1),
    [actualWallMaterial]
  );
  
  const backWallMaterial = useMemo(() => 
    createWallMaterialWithCustomRepeat(actualWallMaterial, 1, 1),
    [actualWallMaterial]
  );
  
  // Создаем материал для стены с дверью без текстуры (мемоизация)
  const frontWallMaterial = useMemo(() => 
    new THREE.MeshStandardMaterial({
      color: materials.walls,
      metalness: 0.2,
      roughness: 0.3
    }),
    [materials.walls]
  );

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
          <primitive object={backWallMaterial} attach="material" />
        )}
      </Box>
      
      {/* Левая стена - всегда обычный материал */}
      <Box 
        position={[-dimensions.width/2, 0, 0]} 
        args={[0.05, dimensions.height, dimensions.depth]}
        castShadow
        receiveShadow
      >
        <primitive object={sideWallMaterial} attach="material" />
      </Box>
      
      {/* Правая стена - всегда обычный материал */}
      <Box 
        position={[dimensions.width/2, 0, 0]} 
        args={[0.05, dimensions.height, dimensions.depth]}
        castShadow
        receiveShadow
      >
        <primitive object={sideWallMaterial} attach="material" />
      </Box>
      
      {/* Верхняя перемычка над дверью */}
      <Box 
        position={[0, dimensions.height/2 - 0.15, dimensions.depth/2]} 
        args={[dimensions.width, 0.3, 0.07]}
        castShadow
      >
        <primitive object={frontWallMaterial} attach="material" />
      </Box>
      
      {/* Левая боковая часть дверной рамки - только тонкая полоса */}
      <Box 
        position={[-dimensions.width/2 + doorFrameWidth/2, -0.15, dimensions.depth/2]} 
        args={[doorFrameWidth, doorHeight, 0.07]}
        castShadow
      >
        <primitive object={frontWallMaterial} attach="material" />
      </Box>
      
      {/* Правая боковая часть дверной рамки - только тонкая полоса */}
      <Box 
        position={[dimensions.width/2 - doorFrameWidth/2, -0.15, dimensions.depth/2]} 
        args={[doorFrameWidth, doorHeight, 0.07]}
        castShadow
      >
        <primitive object={frontWallMaterial} attach="material" />
      </Box>
      
      {/* Левая дверь - с небольшим запасом по ширине */}
      <animated.mesh {...leftDoorSpring} castShadow>
        <boxGeometry args={[dimensions.width/2 + 0.05, doorHeight, 0.05]} />
        <primitive object={doorMaterial} attach="material" />
      </animated.mesh>
      
      {/* Правая дверь - с небольшим запасом по ширине */}
      <animated.mesh {...rightDoorSpring} castShadow>
        <boxGeometry args={[dimensions.width/2 + 0.05, doorHeight, 0.05]} />
        <primitive object={doorMaterial} attach="material" />
      </animated.mesh>
    </group>
  );
};

export default BasicElevator; 
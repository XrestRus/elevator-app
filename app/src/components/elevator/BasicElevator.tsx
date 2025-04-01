import React from 'react';
import { Box, MeshReflectorMaterial } from '@react-three/drei';
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
  const wallMaterial = new THREE.MeshStandardMaterial({ color: materials.walls });
  const floorMaterial = new THREE.MeshStandardMaterial({ color: materials.floor });
  const ceilingMaterial = new THREE.MeshStandardMaterial({ color: materials.ceiling });
  const doorMaterial = new THREE.MeshStandardMaterial({ color: materials.doors });
  
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
        // Отключаем повторение текстуры, чтобы избежать растягивания
        texture.repeat.set(1, 1);
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
    // Отключаем повторение текстуры, чтобы избежать растягивания
    texture.repeat.set(1, 1);
    
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
    
    // Исправляем путь, чтобы он правильно начинался с /public
    // Для Vite и React в режиме разработки, пути могут быть относительными от корня public
    // Но для загрузчика текстур нужен полный URL
    const fixedBasePath = baseTexturePath.startsWith('/') ? baseTexturePath : `/${baseTexturePath}`;
    
    // Определяем тип текстуры из пути
    const textureType = fixedBasePath.includes('wood') ? 'wood' 
      : fixedBasePath.includes('marble') ? 'marble'
      : fixedBasePath.includes('metal') ? 'metal'
      : fixedBasePath.includes('fabric') ? 'fabrics'
      : null;
      
    if (!textureType) {
      console.error(`Неизвестный тип текстуры: ${fixedBasePath}`);
      return null;
    }
    
    // Получаем ID текстуры из пути
    const regexResult = fixedBasePath.match(/(\w+)_(\d+)_(\w+)_(\w+)/);
    if (!regexResult) {
      console.error(`Не удалось извлечь ID текстуры из пути: ${fixedBasePath}`);
      return null;
    }
    
    const texturePrefix = `${textureType}_${regexResult[2]}`;
    
    // Формируем пути к файлам текстур
    const colorMapPath = `${fixedBasePath}/${texturePrefix}_color_1k.jpg`;
    const normalMapPath = `${fixedBasePath}/${texturePrefix}_normal_directx_1k.png`;
    const roughnessMapPath = `${fixedBasePath}/${texturePrefix}_roughness_1k.jpg`;
    const aoMapPath = `${fixedBasePath}/${texturePrefix}_ao_1k.jpg`;
    
    // Дополнительно проверяем, есть ли карта металличности (только для металла)
    const metalnessMapPath = textureType === 'metal' 
      ? `${fixedBasePath}/${texturePrefix}_metallic_1k.jpg`
      : null;
    
    console.log(`Пути к текстурам:`);
    console.log(`- Базовый цвет: ${colorMapPath}`);
    console.log(`- Нормали: ${normalMapPath}`);
    console.log(`- Шероховатость: ${roughnessMapPath}`);
    console.log(`- Окклюзия: ${aoMapPath}`);
    if (metalnessMapPath) {
      console.log(`- Металличность: ${metalnessMapPath}`);
    }
    
    // Настройки масштабирования текстур в зависимости от типа материала и поверхности
    const getTextureScale = (surface: 'walls' | 'floor' | 'ceiling') => {
      switch(textureType) {
        case 'wood':
          return surface === 'floor' ? 2 : // Для пола делаем доски помельче
                 surface === 'walls' ? 0.8 : // Для стен доски покрупнее
                 0.9; // Для потолка средний размер
        case 'marble':
          return surface === 'floor' ? 1.5 : // Для пола плиты помельче
                 surface === 'walls' ? 0.5 : // Для стен крупные плиты
                 0.8; // Для потолка средний размер
        case 'metal':
          return surface === 'floor' ? 2 : // Для пола мелкие элементы
                 surface === 'walls' ? 0.7 : // Для стен средние
                 1; // Для потолка стандартный размер
        case 'fabrics':
          return surface === 'floor' ? 3 : // Для пола много повторений (как ковер)
                 surface === 'walls' ? 0.6 : // Для стен крупная фактура
                 1; // Для потолка стандартный размер
        default:
          return 1; // По умолчанию без масштабирования
      }
    };
    
    // Определяем поверхность из пути текстуры
    let surface: 'walls' | 'floor' | 'ceiling' = 'walls'; // По умолчанию стены
    
    if (baseTexturePath) {
      // Определим для какой части лифта применяется текстура
      // исходя из того, где эта текстура используется в коде
      if (materials.texture.floor === baseTexturePath) {
        surface = 'floor';
      } else if (materials.texture.ceiling === baseTexturePath) {
        surface = 'ceiling';
      } else if (materials.texture.walls === baseTexturePath) {
        surface = 'walls';
      }
      
      console.log(`Определена поверхность для текстуры ${baseTexturePath}: ${surface}`);
    }
    
    // Определяем масштаб для текущей текстуры
    const scale = getTextureScale(surface);
    
    // Создаем загрузчик текстур
    const textureLoader = new THREE.TextureLoader();
    
    // Загружаем все карты с дополнительными проверками и обработкой ошибок
    let colorMap: THREE.Texture;
    try {
      colorMap = textureLoader.load(
        colorMapPath, 
        texture => {
          console.log(`Базовая текстура загружена: ${colorMapPath}`);
          texture.colorSpace = THREE.SRGBColorSpace;
          texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
          // Настраиваем масштаб в зависимости от типа и поверхности
          texture.repeat.set(scale, scale);
        },
        undefined,
        error => {
          console.error(`Ошибка загрузки базовой текстуры: ${colorMapPath}`, error);
          // Создаем временную текстуру для предотвращения ошибок рендеринга
          const canvas = document.createElement('canvas');
          canvas.width = canvas.height = 4;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.fillStyle = '#888888';
            ctx.fillRect(0, 0, 4, 4);
          }
          return new THREE.CanvasTexture(canvas);
        }
      );
    } catch (error) {
      console.error(`Критическая ошибка при загрузке текстуры: ${colorMapPath}`, error);
      // В случае ошибки создаем временную текстуру
      const canvas = document.createElement('canvas');
      canvas.width = canvas.height = 4;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#888888';
        ctx.fillRect(0, 0, 4, 4);
      }
      colorMap = new THREE.CanvasTexture(canvas);
    }
    
    // Аналогично для остальных текстур, создаем запасные текстуры для предотвращения ошибок
    let normalMap: THREE.Texture;
    try {
      normalMap = textureLoader.load(
        normalMapPath,
        texture => {
          console.log(`Карта нормалей загружена: ${normalMapPath}`);
          texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
          texture.repeat.set(scale, scale);
        },
        undefined,
        error => {
          console.error(`Ошибка загрузки карты нормалей: ${normalMapPath}`, error);
          // Создаем временную текстуру нормалей (по умолчанию плоская поверхность)
          const canvas = document.createElement('canvas');
          canvas.width = canvas.height = 4;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.fillStyle = '#8080ff'; // Стандартная карта нормалей смотрящая вверх (синий цвет)
            ctx.fillRect(0, 0, 4, 4);
          }
          return new THREE.CanvasTexture(canvas);
        }
      );
    } catch (error) {
      console.error(`Критическая ошибка при загрузке текстуры: ${normalMapPath}`, error);
      const canvas = document.createElement('canvas');
      canvas.width = canvas.height = 4;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#8080ff';
        ctx.fillRect(0, 0, 4, 4);
      }
      normalMap = new THREE.CanvasTexture(canvas);
    }
    
    // Создаём запасные текстуры для других карт аналогичным образом
    let roughnessMap: THREE.Texture;
    try {
      roughnessMap = textureLoader.load(
        roughnessMapPath,
        texture => {
          console.log(`Карта шероховатости загружена: ${roughnessMapPath}`);
          texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
          texture.repeat.set(scale, scale);
        },
        undefined,
        error => {
          console.error(`Ошибка загрузки карты шероховатости: ${roughnessMapPath}`, error);
          // Создаем временную текстуру шероховатости (средняя шероховатость)
          const canvas = document.createElement('canvas');
          canvas.width = canvas.height = 4;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.fillStyle = '#808080'; // Средняя шероховатость (50%)
            ctx.fillRect(0, 0, 4, 4);
          }
          return new THREE.CanvasTexture(canvas);
        }
      );
    } catch (error) {
      console.error(`Критическая ошибка при загрузке текстуры: ${roughnessMapPath}`, error);
      const canvas = document.createElement('canvas');
      canvas.width = canvas.height = 4;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#808080';
        ctx.fillRect(0, 0, 4, 4);
      }
      roughnessMap = new THREE.CanvasTexture(canvas);
    }
    
    let aoMap: THREE.Texture;
    try {
      aoMap = textureLoader.load(
        aoMapPath,
        texture => {
          console.log(`Карта окклюзии загружена: ${aoMapPath}`);
          texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
          texture.repeat.set(scale, scale);
        },
        undefined,
        error => {
          console.error(`Ошибка загрузки карты окклюзии: ${aoMapPath}`, error);
          // Создаем временную текстуру окклюзии (белая - без окклюзии)
          const canvas = document.createElement('canvas');
          canvas.width = canvas.height = 4;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.fillStyle = '#ffffff'; // Белый - без окклюзии
            ctx.fillRect(0, 0, 4, 4);
          }
          return new THREE.CanvasTexture(canvas);
        }
      );
    } catch (error) {
      console.error(`Критическая ошибка при загрузке текстуры: ${aoMapPath}`, error);
      const canvas = document.createElement('canvas');
      canvas.width = canvas.height = 4;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, 4, 4);
      }
      aoMap = new THREE.CanvasTexture(canvas);
    }
    
    // Загружаем карту металличности, если она существует
    let metalnessMap: THREE.Texture | null = null;
    if (metalnessMapPath) {
      try {
        metalnessMap = textureLoader.load(
          metalnessMapPath,
          texture => {
            console.log(`Карта металличности загружена: ${metalnessMapPath}`);
            texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
            texture.repeat.set(scale, scale);
          },
          undefined,
          error => {
            console.error(`Ошибка загрузки карты металличности: ${metalnessMapPath}`, error);
            // Создаем временную текстуру металличности (черная - неметаллическая)
            const canvas = document.createElement('canvas');
            canvas.width = canvas.height = 4;
            const ctx = canvas.getContext('2d');
            if (ctx) {
              ctx.fillStyle = textureType === 'metal' ? '#ffffff' : '#000000';
              ctx.fillRect(0, 0, 4, 4);
            }
            return new THREE.CanvasTexture(canvas);
          }
        );
      } catch (error) {
        console.error(`Критическая ошибка при загрузке текстуры: ${metalnessMapPath}`, error);
        const canvas = document.createElement('canvas');
        canvas.width = canvas.height = 4;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.fillStyle = textureType === 'metal' ? '#ffffff' : '#000000';
          ctx.fillRect(0, 0, 4, 4);
        }
        metalnessMap = new THREE.CanvasTexture(canvas);
      }
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
  
  // Материалы с разным повторением текстур для разных стен
  const sideWallMaterial = createWallMaterialWithCustomRepeat(actualWallMaterial, 1, 1); // Для боковых стен используем нормальное повторение
  const backWallMaterial = createWallMaterialWithCustomRepeat(actualWallMaterial, 1, 1); // Для задней стены - стандартное повторение

  // Создаем материал для стены с дверью без текстуры
  const frontWallMaterial = new THREE.MeshStandardMaterial({
    color: materials.walls,
    metalness: 0.2,
    roughness: 0.3
  });
  
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
import React, { useMemo } from "react";
import {
  Box,
  MeshReflectorMaterial,
  useTexture,
} from "@react-three/drei";
import { useSpring, animated } from "@react-spring/three";
import * as THREE from "three";
import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import ElevatorPanel from "./ElevatorPanel";

/**
 * Компонент, представляющий базовую геометрию лифта с анимированными дверьми
 */
const BasicElevator: React.FC = () => {
  const elevator = useSelector((state: RootState) => state.elevator);
  const { materials, dimensions, doorsOpen } = elevator;
  const lightsOn = elevator.lighting.enabled;

  // Новый подход: двери занимают почти всю ширину лифта
  // Оставляем только небольшие боковые части для рамки
  const doorHeight = dimensions.height - 0.3; // Высота дверного проема

  // Создаем функцию для клонирования материалов с разным повторением текстур
  const createWallMaterialWithCustomRepeat = (
    baseMaterial: THREE.Material,
    repeatX: number,
    repeatY: number
  ) => {
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
      ? [-dimensions.width / 2 - 0.3, -0.15, dimensions.depth / 2] 
      : [-dimensions.width / 4 + 0.05, -0.15, dimensions.depth / 2],
    config: { mass: 1, tension: 120, friction: 14 },
  });

  // Анимация для правой двери
  const rightDoorSpring = useSpring({
    position: doorsOpen
      ? [dimensions.width / 2 + 0.3, -0.15, dimensions.depth / 2]
      : [dimensions.width / 4 - 0.05, -0.15, dimensions.depth / 2],
    config: { mass: 1, tension: 120, friction: 14 },
  });

  // Базовые материалы (без текстур)
  const basicWallMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: materials.walls,
        metalness: materials.metalness.walls,
        roughness: materials.roughness.walls,
      }),
    [materials.walls, materials.metalness.walls, materials.roughness.walls]
  );

  const basicFloorMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: materials.floor,
        metalness: materials.metalness.floor,
        roughness: materials.roughness.floor,
      }),
    [materials.floor, materials.metalness.floor, materials.roughness.floor]
  );

  const basicCeilingMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: materials.ceiling,
        metalness: materials.metalness.ceiling,
        roughness: materials.roughness.ceiling,
      }),
    [
      materials.ceiling,
      materials.metalness.ceiling,
      materials.roughness.ceiling,
    ]
  );

  const doorMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: materials.doors,
        metalness: materials.metalness.doors,
        roughness: materials.roughness.doors,
      }),
    [materials.doors, materials.metalness.doors, materials.roughness.doors]
  );

  // Кэширование путей к текстурам
  const wallTexturePath = materials.texture?.walls || "";
  const floorTexturePath = materials.texture?.floor || "";
  const ceilingTexturePath = materials.texture?.ceiling || "";

  // Кэширование PBR текстур с помощью хука useTexture
  // Используем useMemo для загрузки только при изменении пути к текстуре
  const loadPBRTextures = (baseTexturePath: string | null) => {
    if (!baseTexturePath || !baseTexturePath.includes("example")) {
      return {
        colorMapPath: null,
        normalMapPath: null,
        roughnessMapPath: null,
        aoMapPath: null,
        metalnessMapPath: null,
        textureType: null,
      };
    }

    // Исправляем путь, чтобы он правильно начинался с /public
    const fixedBasePath = baseTexturePath.startsWith("/")
      ? baseTexturePath
      : `/${baseTexturePath}`;

    // Определяем тип текстуры из пути
    const textureType = fixedBasePath.includes("wood")
      ? "wood"
      : fixedBasePath.includes("marble")
      ? "marble"
      : fixedBasePath.includes("metal")
      ? "metal"
      : fixedBasePath.includes("fabric")
      ? "fabrics"
      : null;

    if (!textureType) {
      console.error(`Неизвестный тип текстуры: ${fixedBasePath}`);
      return {
        colorMapPath: null,
        normalMapPath: null,
        roughnessMapPath: null,
        aoMapPath: null,
        metalnessMapPath: null,
        textureType: null,
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
        textureType: null,
      };
    }

    const texturePrefix = `${textureType}_${regexResult[2]}`;

    // Формируем пути к файлам текстур
    const colorMapPath = `${fixedBasePath}/${texturePrefix}_color_1k.jpg`;
    const normalMapPath = `${fixedBasePath}/${texturePrefix}_normal_directx_1k.png`;
    const roughnessMapPath = `${fixedBasePath}/${texturePrefix}_roughness_1k.jpg`;
    const aoMapPath = `${fixedBasePath}/${texturePrefix}_ao_1k.jpg`;
    const metalnessMapPath =
      textureType === "metal"
        ? `${fixedBasePath}/${texturePrefix}_metallic_1k.jpg`
        : null;

    return {
      colorMapPath,
      normalMapPath,
      roughnessMapPath,
      aoMapPath,
      metalnessMapPath,
      textureType,
    };
  };

  // Загружаем текстуры с помощью useTexture (кэширование)
  const wallPBRPaths = useMemo(
    () => loadPBRTextures(wallTexturePath),
    [wallTexturePath]
  );
  const floorPBRPaths = useMemo(
    () => loadPBRTextures(floorTexturePath),
    [floorTexturePath]
  );
  const ceilingPBRPaths = useMemo(
    () => loadPBRTextures(ceilingTexturePath),
    [ceilingTexturePath]
  );

  // Для предотвращения ошибок загрузки, используем заглушки для отсутствующих текстур
  // Создаем фиктивную текстуру размером 1x1 пиксель для использования в качестве заглушки
  const dummyTexturePath = "/textures/dummy.png"; // Путь к заглушке (можно заменить на реальный)

  // Всегда включаем хотя бы одну текстуру (заглушку), чтобы хук useTexture всегда вызывался
  const wallPaths = useMemo(
    () => ({
      map: wallPBRPaths.colorMapPath || dummyTexturePath,
      ...(wallPBRPaths.normalMapPath && {
        normalMap: wallPBRPaths.normalMapPath,
      }),
      ...(wallPBRPaths.roughnessMapPath && {
        roughnessMap: wallPBRPaths.roughnessMapPath,
      }),
      ...(wallPBRPaths.aoMapPath && { aoMap: wallPBRPaths.aoMapPath }),
      ...(wallPBRPaths.metalnessMapPath && {
        metalnessMap: wallPBRPaths.metalnessMapPath,
      }),
    }),
    [wallPBRPaths]
  );

  const floorPaths = useMemo(
    () => ({
      map: floorPBRPaths.colorMapPath || dummyTexturePath,
      ...(floorPBRPaths.normalMapPath && {
        normalMap: floorPBRPaths.normalMapPath,
      }),
      ...(floorPBRPaths.roughnessMapPath && {
        roughnessMap: floorPBRPaths.roughnessMapPath,
      }),
      ...(floorPBRPaths.aoMapPath && { aoMap: floorPBRPaths.aoMapPath }),
      ...(floorPBRPaths.metalnessMapPath && {
        metalnessMap: floorPBRPaths.metalnessMapPath,
      }),
    }),
    [floorPBRPaths]
  );

  const ceilingPaths = useMemo(
    () => ({
      map: ceilingPBRPaths.colorMapPath || dummyTexturePath,
      ...(ceilingPBRPaths.normalMapPath && {
        normalMap: ceilingPBRPaths.normalMapPath,
      }),
      ...(ceilingPBRPaths.roughnessMapPath && {
        roughnessMap: ceilingPBRPaths.roughnessMapPath,
      }),
      ...(ceilingPBRPaths.aoMapPath && { aoMap: ceilingPBRPaths.aoMapPath }),
      ...(ceilingPBRPaths.metalnessMapPath && {
        metalnessMap: ceilingPBRPaths.metalnessMapPath,
      }),
    }),
    [ceilingPBRPaths]
  );

  // Теперь useTexture всегда вызывается с каким-то путем
  const wallTextures = useTexture(wallPaths);
  const floorTextures = useTexture(floorPaths);
  const ceilingTextures = useTexture(ceilingPaths);

  // Создаем PBR материалы только если есть реальные текстуры (не заглушки)
  const wallPBRMaterial = useMemo(() => {
    if (!wallPBRPaths.textureType) return null;

    // Настраиваем базовые параметры текстур
    Object.values(wallTextures).forEach((texture) => {
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
      metalness: wallPBRPaths.textureType === "metal" ? 0.8 : 0.0,
    });

    return material;
  }, [wallTextures, wallPBRPaths]);

  // Создаем PBR материал для пола с мемоизацией
  const floorPBRMaterial = useMemo(() => {
    if (!floorPBRPaths.textureType) return null;

    // Настраиваем базовые параметры текстур
    Object.values(floorTextures).forEach((texture) => {
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
      metalness: floorPBRPaths.textureType === "metal" ? 0.8 : 0.0,
    });

    return material;
  }, [floorTextures, floorPBRPaths]);

  // Создаем PBR материал для потолка с мемоизацией
  const ceilingPBRMaterial = useMemo(() => {
    if (!ceilingPBRPaths.textureType) return null;

    // Настраиваем базовые параметры текстур
    Object.values(ceilingTextures).forEach((texture) => {
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
      metalness: ceilingPBRPaths.textureType === "metal" ? 0.8 : 0.0,
    });

    return material;
  }, [ceilingTextures, ceilingPBRPaths]);

  // Определяем, какой материал использовать: PBR или обычный
  const actualWallMaterial = wallPBRMaterial || basicWallMaterial;
  const actualFloorMaterial = floorPBRMaterial || basicFloorMaterial;
  const actualCeilingMaterial = ceilingPBRMaterial || basicCeilingMaterial;

  // Материалы с разным повторением текстур для разных стен (мемоизация)
  const sideWallMaterial = useMemo(
    () => createWallMaterialWithCustomRepeat(actualWallMaterial, 1, 1),
    [actualWallMaterial]
  );

  const backWallMaterial = useMemo(
    () => createWallMaterialWithCustomRepeat(actualWallMaterial, 1, 1),
    [actualWallMaterial]
  );

  // Создаем материал для стены с дверью без текстуры (мемоизация)
  const frontWallMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: materials.walls,
        metalness: 0.2,
        roughness: 0.3,
      }),
    [materials.walls]
  );

  // Материал для поручней (наследует цвет стен)
  const handrailMaterial = useMemo(
    () => {
      const color = new THREE.Color(materials.walls);
      // Делаем цвет немного темнее
      color.multiplyScalar(0.9);
      return new THREE.MeshStandardMaterial({
        color: color,
        metalness: 0.6,
        roughness: 0.3,
        envMapIntensity: 1.0,
      });
    },
    [materials.walls]
  );

  // Материал для стыка дверей
  const doorSeamMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#000000", // Черный цвет для максимального контраста
        metalness: 0.3,
        roughness: 0.7,
        emissive: "#000000",
        emissiveIntensity: 0.2,
      }),
    [lightsOn]
  );

  // Материал для внешних полосок дверей (более заметный)
  const doorOuterSeamMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#111111", // Темный цвет, но немного светлее основного стыка
        metalness: 0.4,
        roughness: 0.6,
        emissive: "#111111",
        emissiveIntensity: 0.3, // Чуть больше свечения для лучшей видимости
      }),
    [lightsOn]
  );

  // Материал для рамки вокруг дверей (металлический)
  const doorFrameMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#555555",
        metalness: 0.8,
        roughness: 0.2,
      }),
    []
  );

  return (
    <group>
      {/* Пол */}
      <Box
        position={[0, -dimensions.height / 2, 0]}
        args={[dimensions.width, 0.05, dimensions.depth]}
        receiveShadow
      >
        <primitive object={actualFloorMaterial} attach="material" />
      </Box>

      {/* Потолок */}
      <Box
        position={[0, dimensions.height / 2, 0]}
        args={[dimensions.width, 0.05, dimensions.depth]}
        receiveShadow
      >
        <primitive object={actualCeilingMaterial} attach="material" />
      </Box>

      {/* Задняя стена - единственная зеркальная стена */}
      <Box
        position={[0, 0, -dimensions.depth / 2]}
        args={[dimensions.width, dimensions.height, 0.05]}
        castShadow
        receiveShadow
      >
        <primitive object={backWallMaterial} attach="material" />
      </Box>

      {/* Зеркало на задней стене - отображается только если зеркало включено */}
      {materials.isMirror.walls && (
        <>
          {/* Для типа "full" (сплошное зеркало) */}
          {materials.mirror.type === "full" && (
            <Box
              position={[
                0,
                materials.mirror.position,
                -dimensions.depth / 2 + 0.03,
              ]}
              args={[materials.mirror.width, materials.mirror.height, 0.01]}
              castShadow
            >
              <MeshReflectorMaterial
                color={"#ffffff"}
                blur={[50, 25]} // Меньшее размытие для более четкого отражения
                resolution={2048} // Увеличил разрешение для качества
                mixBlur={0.0} // Минимальное смешивание размытия
                mixStrength={1.0} // Усилил интенсивность отражения
                metalness={0.5} // Максимальная металличность
                roughness={0.05} // Минимальная шероховатость для зеркального отражения
                mirror={1.0} // Максимальное отражение
                emissiveIntensity={lightsOn ? 0.2 : 0.0} // Интенсивность свечения
              />
            </Box>
          )}

          {/* Для типа "double" (два зеркала в ряд) */}
          {materials.mirror.type === "double" && (
            <>
              <Box
                position={[
                  -materials.mirror.width / 4,
                  materials.mirror.position,
                  -dimensions.depth / 2 + 0.03,
                ]}
                args={[
                  materials.mirror.width / 2 - 0.05,
                  materials.mirror.height,
                  0.01,
                ]}
                castShadow
              >
                <MeshReflectorMaterial
                  color={"#ffffff"}
                  blur={[50, 25]} // Меньшее размытие для более четкого отражения
                  resolution={2048} // Увеличил разрешение для качества
                  mixBlur={0.0} // Минимальное смешивание размытия
                  mixStrength={1.0} // Усилил интенсивность отражения
                  metalness={0.5} // Максимальная металличность
                  roughness={0.05} // Минимальная шероховатость для зеркального отражения
                  mirror={1.0} // Максимальное отражение
                  emissiveIntensity={lightsOn ? 0.2 : 0.0} // Интенсивность свечения
                />
              </Box>

              <Box
                position={[
                  materials.mirror.width / 4,
                  materials.mirror.position,
                  -dimensions.depth / 2 + 0.03,
                ]}
                args={[
                  materials.mirror.width / 2 - 0.05,
                  materials.mirror.height,
                  0.01,
                ]}
                castShadow
              >
                <MeshReflectorMaterial
                  color={"#ffffff"}
                  blur={[50, 25]} // Меньшее размытие для более четкого отражения
                  resolution={2048} // Увеличил разрешение для качества
                  mixBlur={0.0} // Минимальное смешивание размытия
                  mixStrength={1.0} // Усилил интенсивность отражения
                  metalness={0.5} // Максимальная металличность
                  roughness={0.05} // Минимальная шероховатость для зеркального отражения
                  mirror={1.0} // Максимальное отражение
                  emissiveIntensity={lightsOn ? 0.2 : 0.0} // Интенсивность свечения
                />
              </Box>
            </>
          )}

          {/* Для типа "triple" (три зеркала в ряд) */}
          {materials.mirror.type === "triple" && (
            <>
              <Box
                position={[
                  -materials.mirror.width / 3,
                  materials.mirror.position,
                  -dimensions.depth / 2 + 0.03,
                ]}
                args={[
                  materials.mirror.width / 3 - 0.05,
                  materials.mirror.height,
                  0.01,
                ]}
                castShadow
              >
                <MeshReflectorMaterial
                  color={"#ffffff"}
                  blur={[50, 25]} // Меньшее размытие для более четкого отражения
                  resolution={2048} // Увеличил разрешение для качества
                  mixBlur={0.0} // Минимальное смешивание размытия
                  mixStrength={1.0} // Усилил интенсивность отражения
                  metalness={0.5} // Максимальная металличность
                  roughness={0.05} // Минимальная шероховатость для зеркального отражения
                  mirror={1.0} // Максимальное отражение
                  emissiveIntensity={lightsOn ? 0.2 : 0.0} // Интенсивность свечения
                />
              </Box>

              <Box
                position={[
                  0,
                  materials.mirror.position,
                  -dimensions.depth / 2 + 0.03,
                ]}
                args={[
                  materials.mirror.width / 3 - 0.05,
                  materials.mirror.height,
                  0.01,
                ]}
                castShadow
              >
                <MeshReflectorMaterial
                  color={"#ffffff"}
                  blur={[50, 25]} // Меньшее размытие для более четкого отражения
                  resolution={2048} // Увеличил разрешение для качества
                  mixBlur={0.0} // Минимальное смешивание размытия
                  mixStrength={1.0} // Усилил интенсивность отражения
                  metalness={0.5} // Максимальная металличность
                  roughness={0.05} // Минимальная шероховатость для зеркального отражения
                  mirror={1.0} // Максимальное отражение
                  emissiveIntensity={lightsOn ? 0.2 : 0.0} // Интенсивность свечения
                />
              </Box>

              <Box
                position={[
                  materials.mirror.width / 3,
                  materials.mirror.position,
                  -dimensions.depth / 2 + 0.03,
                ]}
                args={[
                  materials.mirror.width / 3 - 0.05,
                  materials.mirror.height,
                  0.01,
                ]}
                castShadow
              >
                <MeshReflectorMaterial
                  color={"#ffffff"}
                  blur={[50, 25]} // Меньшее размытие для более четкого отражения
                  resolution={2048} // Увеличил разрешение для качества
                  mixBlur={0.0} // Минимальное смешивание размытия
                  mixStrength={1.0} // Усилил интенсивность отражения
                  metalness={0.5} // Максимальная металличность
                  roughness={0.05} // Минимальная шероховатость для зеркального отражения
                  mirror={1.0} // Максимальное отражение
                  emissiveIntensity={lightsOn ? 0.2 : 0.0} // Интенсивность свечения
                />
              </Box>
            </>
          )}

          {/* Рамка зеркала */}
          <Box
            position={[
              0,
              materials.mirror.position,
              -dimensions.depth / 2 + 0.02,
            ]}
            args={[
              materials.mirror.width + 0.05,
              materials.mirror.height + 0.05,
              0.005,
            ]}
            castShadow
          >
            <meshStandardMaterial
              color={materials.walls}
              metalness={0.9}
              roughness={0.1}
              emissive={materials.walls}
              emissiveIntensity={lightsOn ? 0.1 : 0.0}
            />
          </Box>
        </>
      )}

      {/* Левая стена - всегда обычный материал */}
      <Box
        position={[-dimensions.width / 2, 0, 0]}
        args={[0.05, dimensions.height, dimensions.depth]}
        castShadow
        receiveShadow
      >
        <primitive object={sideWallMaterial} attach="material" />
      </Box>

      {/* Поручень на левой стене - показываем в зависимости от настроек */}
      {elevator.visibility.handrails && (
        <group position={[-dimensions.width / 2 + 0.03, -0.1, 0]}>
          {/* Основная часть поручня */}
          <Box
            position={[0, 0, 0]}
            args={[0.03, 0.08, dimensions.depth * 0.6]}
            castShadow
          >
            <primitive object={handrailMaterial} attach="material" />
          </Box>
          {/* Крепления к стене (верхнее и нижнее) */}
          <Box
            position={[-0.015, 0, dimensions.depth * 0.25]}
            args={[0.03, 0.03, 0.03]}
            castShadow
          >
            <primitive object={handrailMaterial} attach="material" />
          </Box>
          <Box
            position={[-0.015, 0, -dimensions.depth * 0.25]}
            args={[0.03, 0.03, 0.03]}
            castShadow
          >
            <primitive object={handrailMaterial} attach="material" />
          </Box>
        </group>
      )}

      {/* Правая стена - всегда обычный материал */}
      <Box
        position={[dimensions.width / 2, 0, 0]}
        args={[0.05, dimensions.height, dimensions.depth]}
        castShadow
        receiveShadow
      >
        <primitive object={sideWallMaterial} attach="material" />
      </Box>

      {/* Поручень на правой стене - показываем в зависимости от настроек */}
      {elevator.visibility.handrails && (
        <group position={[dimensions.width / 2 - 0.03, -0.1, 0]}>
          {/* Основная часть поручня */}
          <Box
            position={[0, 0, 0]}
            args={[0.03, 0.08, dimensions.depth * 0.6]}
            castShadow
          >
            <primitive object={handrailMaterial} attach="material" />
          </Box>
          {/* Крепления к стене (верхнее и нижнее) */}
          <Box
            position={[0.015, 0, dimensions.depth * 0.25]}
            args={[0.03, 0.03, 0.03]}
            castShadow
          >
            <primitive object={handrailMaterial} attach="material" />
          </Box>
          <Box
            position={[0.015, 0, -dimensions.depth * 0.25]}
            args={[0.03, 0.03, 0.03]}
            castShadow
          >
            <primitive object={handrailMaterial} attach="material" />
          </Box>
        </group>
      )}

      {/* Верхняя перемычка над дверью */}
      <Box
        position={[0, dimensions.height / 2 - 0.15, dimensions.depth / 2]}
        args={[dimensions.width - 0.2, 0.3, 0.07]}
        castShadow
      >
        <primitive object={frontWallMaterial} attach="material" />
      </Box>

      {/* Рамка для дверей (верхняя часть) */}
      <Box
        position={[0, dimensions.height / 2 - 0.3, dimensions.depth / 2 + 0.04]}
        args={[dimensions.width - 0.3, 0.04, 0.02]}
        castShadow
      >
        <primitive object={doorFrameMaterial} attach="material" />
      </Box>

      {/* Рамка для дверей (нижняя часть) */}
      <Box
        position={[0, -dimensions.height / 2 + 0.1, dimensions.depth / 2 + 0.04]}
        args={[dimensions.width - 0.3, 0.02, 0.02]}
        castShadow
      >
        <primitive object={doorFrameMaterial} attach="material" />
      </Box>

      {/* Рамка для дверей (левая часть) */}
      <Box
        position={[-dimensions.width / 2 + 0.25, 0, dimensions.depth / 2 + 0.04]}
        args={[0.02, dimensions.height - 0.4, 0.02]}
        castShadow
      >
        <primitive object={doorFrameMaterial} attach="material" />
      </Box>

      {/* Рамка для дверей (правая часть) */}
      <Box
        position={[dimensions.width / 2 - 0.25, 0, dimensions.depth / 2 + 0.04]}
        args={[0.02, dimensions.height - 0.4, 0.02]}
        castShadow
      >
        <primitive object={doorFrameMaterial} attach="material" />
      </Box>

      {/* Левая боковая панель передней стены */}
      <Box
        position={[-dimensions.width / 2 + 0.2, 0, dimensions.depth / 2]}
        args={[0.4, dimensions.height, 0.07]}
        castShadow
      >
        <primitive object={frontWallMaterial} attach="material" />
      </Box>

      {/* Панель управления на передней стене слева от дверей */}
      {elevator.visibility.controlPanel && (
        <ElevatorPanel 
          position={[-dimensions.width / 2.6, -0.2, dimensions.depth / 2.1]} 
          lightsOn={lightsOn}
          wallColor={materials.walls}
        />
      )}

      {/* Правая боковая панель передней стены */}
      <Box
        position={[dimensions.width / 2 - 0.2, 0, dimensions.depth / 2]}
        args={[0.4, dimensions.height, 0.07]}
        castShadow
      >
        <primitive object={frontWallMaterial} attach="material" />
      </Box>

      {/* Левая дверь - с скорректированной шириной */}
      <animated.group {...leftDoorSpring}>
        <mesh castShadow>
          <boxGeometry args={[dimensions.width / 2 + 0.1, doorHeight, 0.05]} />
          <primitive object={doorMaterial} attach="material" />
        </mesh>

        {/* Центральная вертикальная линия на левой створке */}
        <mesh
          position={[dimensions.width / 4 - 0.03, 0, 0.04]}
          castShadow
        >
          <boxGeometry args={[0.015, doorHeight, 0.1]} />
          <primitive object={doorSeamMaterial} attach="material" />
        </mesh>

        {/* Внешняя полоска на левой створке (со стороны зрителя) */}
        <mesh
          position={[-dimensions.width / 4 + 0.03, 0, 0.04]}
          castShadow
        >
          <boxGeometry args={[0.015, doorHeight, 0.1]} />
          <primitive object={doorOuterSeamMaterial} attach="material" />
        </mesh>
        
        {/* Горизонтальная линия в центре левой двери */}
        <mesh
          position={[0, 0, 0.04]}
          castShadow
        >
          <boxGeometry args={[dimensions.width / 2 + 0.1, 0.02, 0.1]} />
          <primitive object={doorSeamMaterial} attach="material" />
        </mesh>
      </animated.group>

      {/* Правая дверь - с скорректированной шириной */}
      <animated.group {...rightDoorSpring}>
        <mesh castShadow>
          <boxGeometry args={[dimensions.width / 2 + 0.1, doorHeight, 0.05]} />
          <primitive object={doorMaterial} attach="material" />
        </mesh>

        {/* Центральная вертикальная линия на правой створке */}
        <mesh
          position={[-dimensions.width / 4 + 0.03, 0, 0.04]}
          castShadow
        >
          <boxGeometry args={[0.015, doorHeight, 0.1]} />
          <primitive object={doorSeamMaterial} attach="material" />
        </mesh>

        {/* Внешняя полоска на правой створке (со стороны зрителя) */}
        <mesh
          position={[dimensions.width / 4 - 0.03, 0, 0.04]}
          castShadow
        >
          <boxGeometry args={[0.015, doorHeight, 0.1]} />
          <primitive object={doorOuterSeamMaterial} attach="material" />
        </mesh>
        
        {/* Горизонтальная линия в центре правой двери */}
        <mesh
          position={[0, 0, 0.04]}
          castShadow
        >
          <boxGeometry args={[dimensions.width / 2 + 0.1, 0.02, 0.1]} />
          <primitive object={doorSeamMaterial} attach="material" />
        </mesh>
      </animated.group>
    </group>
  );
};

export default BasicElevator;

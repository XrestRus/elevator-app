import * as THREE from "three";

/**
 * Функции и утилиты для работы с материалами лифта
 */

/**
 * Создает материал для стены с настраиваемым повторением текстур
 * @param baseMaterial Базовый материал
 * @param repeatX Горизонтальное повторение текстуры
 * @param repeatY Вертикальное повторение текстуры
 * @returns Новый материал с настроенными параметрами
 */
export const createWallMaterialWithCustomRepeat = (
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

/**
 * Загружает и подготавливает PBR текстуры
 * @param baseTexturePath Базовый путь к текстуре
 * @returns Объект с путями к картам текстур
 */
export const loadPBRTextures = (baseTexturePath: string | null) => {
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

/**
 * Формирует пути к текстурам для использования с хуком useTexture
 * @param pbrPaths Объект с путями PBR текстур
 * @param dummyTexturePath Путь к заглушке
 * @returns Объект с путями к текстурам
 */
export const createTexturePaths = (
  pbrPaths: ReturnType<typeof loadPBRTextures>,
  dummyTexturePath: string = "/textures/dummy.png"
) => {
  return {
    map: pbrPaths.colorMapPath || dummyTexturePath,
    ...(pbrPaths.normalMapPath && {
      normalMap: pbrPaths.normalMapPath,
    }),
    ...(pbrPaths.roughnessMapPath && {
      roughnessMap: pbrPaths.roughnessMapPath,
    }),
    ...(pbrPaths.aoMapPath && { aoMap: pbrPaths.aoMapPath }),
    ...(pbrPaths.metalnessMapPath && {
      metalnessMap: pbrPaths.metalnessMapPath,
    }),
  };
};

/**
 * Настраивает загруженные текстуры для правильного отображения
 * @param textures Объект с текстурами
 * @param textureType Тип текстуры
 * @returns Новый материал с настроенными текстурами
 */
export const createPBRMaterial = (
  textures: Record<string, THREE.Texture>,
  textureType: string | null
) => {
  if (!textureType) return null;

  // Настраиваем базовые параметры текстур
  Object.values(textures).forEach((texture) => {
    if (!(texture instanceof THREE.Texture)) return;
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    if (texture === textures.map) {
      texture.colorSpace = THREE.SRGBColorSpace;
    }
    texture.needsUpdate = true;
  });

  // Настраиваем свойства материала в зависимости от типа текстуры
  return new THREE.MeshStandardMaterial({
    ...textures,
    envMapIntensity: 1.0,
    roughness: 1.0, // Будет модифицировано картой шероховатости
    metalness: textureType === "metal" ? 0.8 : 0.0,
  });
}; 
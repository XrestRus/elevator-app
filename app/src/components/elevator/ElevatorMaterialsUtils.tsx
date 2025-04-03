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

  // Проверка и логирование пути
  console.log(`Загружаем текстуры из ${baseTexturePath}`);

  // Исправляем путь, чтобы он правильно начинался с /public
  const fixedBasePath = baseTexturePath.startsWith("/")
    ? baseTexturePath
    : `/${baseTexturePath}`;

  /**
   * Определяем тип текстуры из пути
   * Поддерживаемые типы:
   * - wood (дерево)
   * - metal (металл)
   * - fabric (ткань)
   */
  let textureType = null;
  if (fixedBasePath.includes("wood")) {
    textureType = "wood";
  } else if (fixedBasePath.includes("metal")) {
    textureType = "metal";
  } else if (fixedBasePath.includes("fabric")) {
    textureType = "fabrics";
  }

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

  // Формируем пути к файлам текстур в стандартизированном формате
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
  dummyTexturePath: string = "/textures/example/wood_0066_1k_HoQeAg/wood_0066_color_1k.jpg"
) => {
  // Формируем объект с путями к текстурам
  const result: Record<string, string> = {
    map: pbrPaths.colorMapPath || dummyTexturePath,
  };
  
  // Добавляем путь к карте нормалей
  if (pbrPaths.normalMapPath) {
    result.normalMap = pbrPaths.normalMapPath;
  }
  
  // Добавляем остальные карты
  if (pbrPaths.roughnessMapPath) {
    result.roughnessMap = pbrPaths.roughnessMapPath;
  }
  
  if (pbrPaths.aoMapPath) {
    result.aoMap = pbrPaths.aoMapPath;
  }
  
  if (pbrPaths.metalnessMapPath) {
    result.metalnessMap = pbrPaths.metalnessMapPath;
  }
  
  return result;
};

/**
 * Настраивает загруженные текстуры для правильного отображения
 * @param textures Объект с текстурами
 * @param textureType Тип текстуры
 * @param color Цвет материала для окрашивания текстуры
 * @returns Новый материал с настроенными текстурами
 */
export const createPBRMaterial = (
  textures: Record<string, THREE.Texture>,
  textureType: string | null,
  color?: string | THREE.Color
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
  const materialProperties: THREE.MeshStandardMaterialParameters = {
    ...textures,
    envMapIntensity: 1.0,
  };
  
  // Если предоставлен цвет, применяем его к текстуре
  if (color) {
    materialProperties.color = new THREE.Color(color);
    console.log(`Применяем цвет ${color} к текстуре типа ${textureType}`);
  } else {
    console.log(`Внимание: цвет не предоставлен для текстуры типа ${textureType}, используется цвет по умолчанию`);
  }
  
  // Настраиваем свойства материала в зависимости от типа текстуры
  if (textureType === "metal") {
    materialProperties.roughness = 0.5; // Базовая шероховатость для металла
    materialProperties.metalness = 0.9; // Более высокая металличность для металла
  } else if (textureType === "wood") {
    materialProperties.roughness = 0.7; // Повышенная шероховатость для дерева
    materialProperties.metalness = 0.0; // Нет металличности для дерева
  } else {
    materialProperties.roughness = 1.0;
    materialProperties.metalness = 0.0;
  }
  
  return new THREE.MeshStandardMaterial(materialProperties);
}; 
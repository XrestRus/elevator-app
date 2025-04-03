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

  // Формируем пути к файлам текстур
  const colorMapPath = `${fixedBasePath}/${texturePrefix}_color_1k.jpg`;
  
  // Проверяем, является ли это проблемной текстурой metal_0049
  let normalMapPath = null;
  if (textureType === "metal" && regexResult[2] === "0049") {
    // Используем точное имя файла, которое мы обнаружили в директории
    normalMapPath = `${fixedBasePath}/metal_0049_normal_direct_1k.png`;
  } else {
    // Для остальных текстур используем стандартное именование
    normalMapPath = `${fixedBasePath}/${texturePrefix}_normal_directx_1k.png`;
  }
  
  // Альтернативные пути к карте нормалей, если стандартный файл отсутствует
  const normalMapAlternatives = [
    `${fixedBasePath}/${texturePrefix}_normal_direct_1k.png`,
    `${fixedBasePath}/${texturePrefix}_normal_1k.png`,
    `${fixedBasePath}/${texturePrefix}_normal_gl_1k.png`,
    `${fixedBasePath}/${texturePrefix}_normal_opengl_1k.png`
  ];
  
  const roughnessMapPath = `${fixedBasePath}/${texturePrefix}_roughness_1k.jpg`;
  const aoMapPath = `${fixedBasePath}/${texturePrefix}_ao_1k.jpg`;
  const metalnessMapPath =
    textureType === "metal"
      ? `${fixedBasePath}/${texturePrefix}_metallic_1k.jpg`
      : null;

  return {
    colorMapPath,
    normalMapPath,
    normalMapAlternatives,  // Добавляем альтернативные пути
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
  // Выбираем основной путь к карте нормалей или первую альтернативу
  let normalMapPathToUse = pbrPaths.normalMapPath;
  if (pbrPaths.normalMapAlternatives && pbrPaths.normalMapAlternatives.length > 0) {
    // Если основной путь не существует, пробуем альтернативы
    if (!pbrPaths.normalMapPath) {
      normalMapPathToUse = pbrPaths.normalMapAlternatives[0];
    }
  }
  
  return {
    map: pbrPaths.colorMapPath || dummyTexturePath,
    ...(normalMapPathToUse && {
      normalMap: normalMapPathToUse,
    }),
    // Если основной путь не работает, добавляем все альтернативы как запасные
    // Three.js автоматически попробует загрузить первую успешную текстуру
    ...(pbrPaths.normalMapAlternatives && pbrPaths.normalMapAlternatives.length > 0 && !normalMapPathToUse && {
      normalMap: pbrPaths.normalMapAlternatives[0], // Используем первую альтернативу
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
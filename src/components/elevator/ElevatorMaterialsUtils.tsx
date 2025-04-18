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
  const fixedBasePath = baseTexturePath;

  /**
   * Определяем тип текстуры из пути
   * Поддерживаемые типы:
   * - wood (дерево)
   * - metal (металл)
   * - fabric (ткань)
   * - ground (поверхность)
   * - tiles (плитка)
   */
  let textureType = null;
  if (fixedBasePath.includes("wood")) {
    textureType = "wood";
  } else if (fixedBasePath.includes("metal")) {
    textureType = "metal";
  } else if (fixedBasePath.includes("fabric")) {
    textureType = "fabrics";
  } else if (fixedBasePath.includes("ground")) {
    textureType = "ground";
  } else if (fixedBasePath.includes("tiles")) {
    textureType = "tiles";
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
  
  // Выбираем путь к карте нормалей - предпочитаем OpenGL формат для новых текстур
  let normalMapPath;
  if (textureType === "ground" || textureType === "tiles") {
    normalMapPath = `${fixedBasePath}/${texturePrefix}_normal_opengl_1k.png`;
  } else {
    normalMapPath = `${fixedBasePath}/${texturePrefix}_normal_directx_1k.png`;
  }
  
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
  dummyTexturePath: string = "./textures/example/wood_0066_1k_HoQeAg/wood_0066_color_1k.jpg"
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
 * @param customRoughness Пользовательское значение шероховатости (0-1)
 * @param customMetalness Пользовательское значение металличности (0-1)
 * @param customEmission Настройки эмиссии (свечения) материала
 * @param customTransparency Настройки прозрачности материала
 * @param customRefraction Настройки преломления материала
 * @param customAnisotropy Настройки анизотропности материала
 * @returns Новый материал с настроенными текстурами
 */
export const createPBRMaterial = (
  textures: Record<string, THREE.Texture>,
  textureType: string | null,
  color?: string | THREE.Color,
  customRoughness?: number,
  customMetalness?: number,
  customEmission?: { value: number, color: string, enabled: boolean },
  customTransparency?: { value: number, enabled: boolean },
  customRefraction?: { value: number, enabled: boolean },
  customAnisotropy?: { value: number, direction: number, enabled: boolean }
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
  const materialProperties: THREE.MeshStandardMaterialParameters & { 
    anisotropy?: number; 
    anisotropyRotation?: number;
    transmission?: number;
    refractionRatio?: number;
    ior?: number; // Индекс преломления
    emissive?: THREE.Color;
    emissiveIntensity?: number;
  } = {
    ...textures,
    envMapIntensity: 1.0,
  };
  
  // Если предоставлен цвет, применяем его к текстуре
  if (color) {
    materialProperties.color = new THREE.Color(color);
  }
  
  // Определяем базовые значения metalness и roughness в зависимости от типа материала
  let defaultRoughness = 0.5;
  let defaultMetalness = 0.0;
  
  if (textureType === "metal") {
    defaultRoughness = 0.5;
    defaultMetalness = 0.9;
  } else if (textureType === "wood") {
    defaultRoughness = 0.7;
    defaultMetalness = 0.0;
  } else {
    defaultRoughness = 1.0;
    defaultMetalness = 0.0;
  }
  
  // Устанавливаем шероховатость - приоритет у пользовательских настроек
  materialProperties.roughness = typeof customRoughness === 'number' 
    ? customRoughness 
    : defaultRoughness;
    
  // Устанавливаем металличность - приоритет у пользовательских настроек
  materialProperties.metalness = typeof customMetalness === 'number' 
    ? customMetalness 
    : defaultMetalness;
  
  // Если заданы пользовательские значения и есть карты текстур, отключаем карты
  // для обеспечения точного соответствия пользовательским настройкам
  if (typeof customRoughness === 'number' && materialProperties.roughnessMap) {
    delete materialProperties.roughnessMap; // Убираем карту, чтобы использовать только числовое значение
  }
  
  if (typeof customMetalness === 'number' && materialProperties.metalnessMap) {
    delete materialProperties.metalnessMap; // Убираем карту, чтобы использовать только числовое значение
  }
  
  // Применяем свойство эмиссии (свечения)
  if (customEmission && customEmission.enabled) {
    materialProperties.emissive = new THREE.Color(customEmission.color);
    materialProperties.emissiveIntensity = customEmission.value;
    
    // Отключаем карту эмиссии, если она есть
    if ('emissiveMap' in materialProperties) {
      delete materialProperties.emissiveMap;
    }
  }
  
  // Применяем свойство прозрачности
  if (customTransparency && customTransparency.enabled) {
    // Если значение прозрачности больше 0, настраиваем материал для прозрачности
    if (customTransparency.value > 0) {
      materialProperties.transparent = true;
      materialProperties.opacity = 1 - customTransparency.value; // Инвертируем, так как opacity=1 это непрозрачный
      
      // Настраиваем порядок рендеринга для правильного отображения прозрачности
      materialProperties.depthWrite = customTransparency.value < 0.95;
    }
  }
  
  // Применяем свойство преломления
  if (customRefraction && customRefraction.enabled) {
    // Используем transmission для эффекта преломления (поддерживается в MeshPhysicalMaterial)
    materialProperties.transmission = customTransparency?.enabled 
      ? customTransparency.value  // Если включена прозрачность, используем ее значение
      : 0.5;                      // Иначе используем среднее значение
      
    materialProperties.ior = customRefraction.value; // Индекс преломления материала
    
    // Обратите внимание, что для полноценного преломления нужно использовать MeshPhysicalMaterial вместо MeshStandardMaterial
  }
  
  // Применяем свойство анизотропности
  if (customAnisotropy && customAnisotropy.enabled && customAnisotropy.value > 0) {
    materialProperties.anisotropy = customAnisotropy.value;
    materialProperties.anisotropyRotation = customAnisotropy.direction;
    
    // Обратите внимание, что для полноценной анизотропии нужно использовать MeshPhysicalMaterial вместо MeshStandardMaterial
  }
  
  // Возвращаем материал с нужным типом в зависимости от включенных свойств
  if ((customRefraction && customRefraction.enabled) || 
      (customAnisotropy && customAnisotropy.enabled && customAnisotropy.value > 0)) {
    // Для преломления и анизотропии нужен MeshPhysicalMaterial
    return new THREE.MeshPhysicalMaterial(materialProperties);
  } else {
    // Для остальных случаев достаточно MeshStandardMaterial
    return new THREE.MeshStandardMaterial(materialProperties);
  }
}; 
import React, { useMemo, useEffect } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import { Plane, Instance, Instances } from "@react-three/drei";
import * as THREE from "three";
import PerformanceOptimizer from "../../utils/optimization/PerformanceOptimizer";
import MakeHoverable from "../ui/makeHoverable";
import colorUtils from "../../utils/colorUtils";

/**
 * Тип светильника для потолка лифта
 */
export enum LightType {
  SPOTLIGHT = 'spotlight', // Точечный встроенный светильник
  PLAFOND = 'plafond'     // Светильник-плафон
}

/**
 * Конфигурация параметров светильника для потолка лифта
 */
export interface LightConfig {
  color: string;
  intensity: number;
  enabled: boolean;
  count: number;
  diffusion: number;
  position: [number, number, number];
  type: LightType;
}

/**
 * Размеры светильника в зависимости от их количества и типа
 */
interface LightSize {
  housingRadius: number;
  glassRadius: number;
  glowSize: number;
  height?: number;
}

/**
 * Создает оптимизированную текстуру для светового пятна
 */
const createSpotTexture = (
  color: string,
  diffusion: number,
  highPerformance: boolean
): THREE.CanvasTexture => {
  const textureSize = highPerformance ? 512 : 256;

  const canvas = document.createElement("canvas");
  canvas.width = textureSize;
  canvas.height = textureSize;
  const context = canvas.getContext("2d");
  
  if (context) {
    const center = textureSize / 2;
    const gradient = context.createRadialGradient(
      center,
      center,
      0,
      center,
      center,
      center
    );

    // Преобразуем hex-цвет в RGB формат для использования в градиенте
    const hexToRgb = (hex: string) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result
        ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16),
          }
        : { r: 255, g: 255, b: 255 };
    };

    const rgb = hexToRgb(color);

    // Корректируем градиент в зависимости от параметра рассеивания
    // Чем выше диффузия, тем более мягкий градиент
    const diffusionOffset = diffusion * 0.3; // Увеличиваем влияние диффузии

    gradient.addColorStop(0, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 1.0)`);
    const opacity1 = Math.max(0, Math.min(1, 0.9 - diffusion * 0.4));
    gradient.addColorStop(Math.min(1, 0.1 + diffusionOffset), `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity1})`);
    const opacity2 = Math.max(0, Math.min(1, 0.7 - diffusion * 0.3));
    gradient.addColorStop(Math.min(1, 0.3 + diffusionOffset), `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity2})`);
    const opacity3 = Math.max(0, Math.min(1, 0.5 - diffusion * 0.2));
    gradient.addColorStop(Math.min(1, 0.5 + diffusionOffset), `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity3})`);
    const opacity4 = Math.max(0, Math.min(1, 0.3 - diffusion * 0.1));
    gradient.addColorStop(Math.min(1, 0.7 + diffusionOffset), `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity4})`);
    gradient.addColorStop(0.9, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.1)`);
    gradient.addColorStop(1.0, "rgba(255, 255, 255, 0)");

    context.fillStyle = gradient;
    context.fillRect(0, 0, textureSize, textureSize);

    // Добавляем небольшой внутренний ореол
    const innerGlow = context.createRadialGradient(
      center,
      center,
      center * 0.1,
      center,
      center,
      center * 0.3
    );

    innerGlow.addColorStop(0, `rgba(255, 255, 255, 0.6)`);
    innerGlow.addColorStop(1, `rgba(255, 255, 255, 0)`);

    context.globalCompositeOperation = "lighter";
    context.fillStyle = innerGlow;
    context.fillRect(0, 0, textureSize, textureSize);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;

  // Оптимизация фильтрации текстур
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = false;

  return texture;
};

/**
 * Создает оптимизированную текстуру для ореола на потолке
 */
const createCeilingGlowTexture = (
  color: string,
  diffusion: number = 0.5,
  highPerformance: boolean
): THREE.CanvasTexture => {
  const textureSize = highPerformance ? 256 : 128;

  const canvas = document.createElement("canvas");
  canvas.width = textureSize;
  canvas.height = textureSize;
  const context = canvas.getContext("2d");
  
  if (context) {
    const center = textureSize / 2;
    const gradient = context.createRadialGradient(
      center,
      center,
      0,
      center,
      center,
      center
    );

    // Преобразуем hex-цвет в RGB формат
    const hexToRgb = (hex: string) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result
        ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16),
          }
        : { r: 255, g: 255, b: 255 };
    };

    const rgb = hexToRgb(color);

    // Создаем мягкий ореол вокруг источника света с учетом рассеивания
    const diffusionFactor = diffusion * 0.2; // Фактор влияния рассеивания
    gradient.addColorStop(0, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${0.6 - diffusionFactor})`);
    gradient.addColorStop(0.3, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${0.3 - diffusionFactor})`);
    gradient.addColorStop(Math.min(1, 0.6 + diffusionFactor), `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.1)`);
    gradient.addColorStop(1.0, "rgba(255, 255, 255, 0)");

    context.fillStyle = gradient;
    context.fillRect(0, 0, textureSize, textureSize);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;

  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = false;

  return texture;
};

/**
 * Оптимизирует текстуру в зависимости от мощности устройства
 */
const optimizeTexture = (texture: THREE.Texture | undefined, highPerformance: boolean) => {
  if (!texture) return;
  
  if (!highPerformance) {
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.generateMipmaps = false;
    texture.anisotropy = 1;
  } else {
    texture.anisotropy = 4;
  }
  
  texture.dispose = function() {
    if (this.image instanceof HTMLImageElement) {
      this.image.onload = null;
    }
    THREE.Texture.prototype.dispose.call(this);
  };
};

/**
 * Получает размеры светильников в зависимости от их количества и типа
 */
const getLightSize = (lightCount: number, type: LightType = LightType.SPOTLIGHT): LightSize => {
  // Базовые размеры для различных вариантов точечных светильников
  if (type === LightType.SPOTLIGHT) {
    if (lightCount === 1) {
      return {
        housingRadius: 0.08,
        glassRadius: 0.07,
        glowSize: 0.5,
      };
    } else if (lightCount === 2) {
      return {
        housingRadius: 0.065,
        glassRadius: 0.06,
        glowSize: 0.4,
      };
    } else {
      return {
        housingRadius: 0.055,
        glassRadius: 0.05,
        glowSize: 0.3,
      };
    }
  }
  // Размеры для плафонов
  else if (type === LightType.PLAFOND) {
    if (lightCount === 1) {
      return {
        housingRadius: 0.2,
        glassRadius: 0.18,
        glowSize: 0.7,
        height: 0.05
      };
    } else if (lightCount === 2) {
      return {
        housingRadius: 0.15,
        glassRadius: 0.13,
        glowSize: 0.5,
        height: 0.04
      };
    } else {
      return {
        housingRadius: 0.1,
        glassRadius: 0.09,
        glowSize: 0.4,
        height: 0.03
      };
    }
  }
  
  // Возвращаем стандартные размеры по умолчанию
  return {
    housingRadius: 0.055,
    glassRadius: 0.05,
    glowSize: 0.3,
  };
};

/**
 * Компонент для отображения плафона
 */
const PlafondLight: React.FC<{
  position: [number, number, number];
  config: LightConfig;
  lightSize: LightSize;
  glassMaterial: THREE.Material;
  ceilingGlowMaterial: THREE.Material;
  index: number;
  dimensions: { width: number; height: number; depth: number };
  highPerformance: boolean;
}> = ({
  position,
  config,
  lightSize,
  glassMaterial,
  ceilingGlowMaterial,
  index,
  dimensions,
  highPerformance
}) => {
  // Высота плафона
  const height = lightSize.height || 0.04;
  
  // Геометрия для плафона (полусфера)
  const glassGeometry = useMemo(
    () => new THREE.SphereGeometry(
      lightSize.glassRadius, 
      highPerformance ? 24 : 12, 
      highPerformance ? 16 : 8, 
      0, 
      Math.PI * 2, 
      0, 
      Math.PI / 2
    ),
    [lightSize.glassRadius, highPerformance]
  );
  
  // Геометрия для обода плафона
  const housingGeometry = useMemo(
    () => new THREE.TorusGeometry(
      lightSize.housingRadius,
      0.01,
      highPerformance ? 16 : 8,
      highPerformance ? 32 : 16
    ),
    [lightSize.housingRadius, highPerformance]
  );
  
  // Рассчитываем интенсивность светильника с учетом рассеивания
  const getLightIntensity = () => {
    // Для рассеянного света снижаем интенсивность при увеличении диффузии
    const diffusionFactor = 1 - config.diffusion * 0.2;
    if (!config.enabled) return 0;
    
    const intensityMultiplier = 4 / (config.count || 1);
    return config.intensity * 0.8 * diffusionFactor * intensityMultiplier;
  };
  
  // Создаем материал для обода плафона
  const housingMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: "#444444", // Тёмный металлический цвет для обода
      roughness: 0.3,
      metalness: 0.8,
    });
  }, []);

  return (
    <MakeHoverable
      name={`Плафон ${index + 1}`}
      type="Светотехника"
      description="Потолочный плафон лифта"
      material="Металл, матовое стекло"
      dimensions={{
        width: lightSize.housingRadius * 2,
        height: height,
        depth: lightSize.housingRadius * 2
      }}
      additionalInfo={{
        color: colorUtils.colorToRGBString(config.color),
        texture: "Матовое стекло, металлический обод",
        "Интенсивность": getLightIntensity().toFixed(1),
        "Рассеивание": (config.diffusion * 100).toFixed(0) + "%",
        "Состояние": config.enabled ? "Включен" : "Выключен",
        "Тип": "Плафон потолочный"
      }}
      requiresDoubleClick={false}
    >
      <group position={position}>
        {/* Обод плафона */}
        <mesh 
          position={[0, 0, 0]} 
          rotation={[Math.PI/2, 0, 0]}
          geometry={housingGeometry}
          material={housingMaterial}
        />
        
        {/* Стеклянный плафон */}
        <mesh
          position={[0, -height/2, 0]}
          rotation={[Math.PI, 0, 0]}
          geometry={glassGeometry}
          material={glassMaterial}
          castShadow={highPerformance}
        />

        {/* Ореол света на потолке */}
        {config.enabled && (
          <Plane
            args={[lightSize.glowSize, lightSize.glowSize]}
            position={[0, -0.002, 0]}
            rotation={[-Math.PI / 2, 0, 0]}
            material={ceilingGlowMaterial}
          />
        )}

        {/* Источник света */}
        <pointLight
          position={[0, -height/3, 0]}
          intensity={getLightIntensity()}
          color={config.color}
          castShadow={highPerformance}
          distance={dimensions.height * 1.5}
          decay={1.5}
          shadow-mapSize-width={highPerformance ? 1024 : 512}
          shadow-mapSize-height={highPerformance ? 1024 : 512}
        />
      </group>
    </MakeHoverable>
  );
};

/**
 * Компонент для отображения одного точечного светильника
 */
const SpotLight: React.FC<{
  position: [number, number, number];
  config: LightConfig;
  lightSize: LightSize;
  glassMaterial: THREE.Material;
  ceilingGlowMaterial: THREE.Material;
  index: number;
  dimensions: { width: number; height: number; depth: number };
  highPerformance: boolean;
}> = ({
  position,
  config,
  lightSize,
  glassMaterial,
  ceilingGlowMaterial,
  index,
  dimensions,
  highPerformance
}) => {
  const glassGeometry = useMemo(
    () => new THREE.CylinderGeometry(
      lightSize.glassRadius, 
      lightSize.glassRadius, 
      0.004, 
      highPerformance ? 16 : 8
    ),
    [lightSize.glassRadius, highPerformance]
  );

  // Рассчитываем интенсивность светильника с учетом рассеивания
  const getLightIntensity = () => {
    // Для направленного света снижаем интенсивность при увеличении диффузии
    const diffusionFactor = 1 - config.diffusion * 0.3;
    if (!config.enabled) return 0;
    
    const intensityMultiplier = 4 / (config.count || 1);
    return config.intensity * 0.7 * diffusionFactor * intensityMultiplier;
  };

  // Параметры света в зависимости от рассеивания
  const penumbraValue = Math.min(1, 0.7 + config.diffusion * 0.3);
  const angleValue = Math.PI * (0.3 + config.diffusion * 0.2);

  return (
    <MakeHoverable
      name={`Светильник ${index + 1}`}
      type="Светотехника"
      description="Встроенный потолочный светильник лифта"
      material="Металл, матовый рассеиватель"
      dimensions={{
        width: lightSize.housingRadius * 2,
        height: 0.015,
        depth: lightSize.housingRadius * 2
      }}
      additionalInfo={{
        color: colorUtils.colorToRGBString(config.color),
        texture: "Матовый металл с рассеивателем",
        "Интенсивность": getLightIntensity().toFixed(1),
        "Рассеивание": (config.diffusion * 100).toFixed(0) + "%",
        "Состояние": config.enabled ? "Включен" : "Выключен",
        "Тип": "Встроенный LED-светильник"
      }}
      requiresDoubleClick={false}
    >
      <group position={position}>
        {/* Стеклянный плафон */}
        <mesh
          position={[0, -0.002, 0]}
          geometry={glassGeometry}
          material={glassMaterial}
          castShadow={highPerformance}
        />

        {/* Ореол света на потолке */}
        {config.enabled && (
          <Plane
            args={[lightSize.glowSize, lightSize.glowSize]}
            position={[0, -0.002, 0]}
            rotation={[-Math.PI / 2, 0, 0]}
            material={ceilingGlowMaterial}
          />
        )}

        {/* Источник света */}
        <spotLight
          position={[0, 0.01, 0]}
          angle={angleValue}
          penumbra={penumbraValue}
          intensity={getLightIntensity()}
          color={config.color}
          castShadow={highPerformance}
          distance={dimensions.height * 1.5}
          shadow-mapSize-width={highPerformance ? 2048 : 512}
          shadow-mapSize-height={highPerformance ? 2048 : 512}
        />
      </group>
    </MakeHoverable>
  );
};

/**
 * Компонент для отображения точечных встроенных светильников на потолке лифта с оптимизацией
 */
const CeilingLights: React.FC<{
  color?: string;
  intensity?: number;
  type?: LightType;
}> = ({ color = "#ffffff", intensity = 5, type = LightType.SPOTLIGHT }) => {
  // Получаем состояние из Redux
  const { dimensions } = useSelector((state: RootState) => state.elevator);
  const lightsOn = useSelector(
    (state: RootState) => state.elevator.lighting.enabled ?? true
  );
  const wallColor = useSelector(
    (state: RootState) => state.elevator.materials.walls
  );
  const diffusion = useSelector(
    (state: RootState) => state.elevator.lighting.diffusion ?? 0.5
  );
  const lightCount = useSelector(
    (state: RootState) => state.elevator.lighting.count ?? 4
  );
  const lightType = useSelector(
    // Если в Redux нет типа, используем параметр из пропсов
    (state: RootState) => 
      state.elevator.lighting.type ? 
      (state.elevator.lighting.type as LightType) : 
      type
  );
  
  const highPerformance = useMemo(
    () => PerformanceOptimizer.isHighPerformanceDevice(),
    []
  );

  // Создаем цвет корпуса светильника на основе цвета стен
  const frameLightColor = useMemo(() => {
    const color = new THREE.Color(wallColor);
    color.multiplyScalar(0.8);
    return color;
  }, [wallColor]);

  // Создаем конфигурацию светильника
  const lightConfig: LightConfig = useMemo(() => ({
    color,
    intensity,
    enabled: lightsOn,
    count: lightCount,
    diffusion,
    position: [0, 0, 0],
    type: lightType
  }), [color, intensity, lightsOn, lightCount, diffusion, lightType]);

  // Расположение светильников на потолке
  const positions = useMemo(() => {
    const posArray: [number, number, number][] = [];
    
    const gapSize = 0.06;
    const ceilingWidth = dimensions.width - gapSize * 2;
    const ceilingDepth = dimensions.depth - gapSize * 2;
    
    const offsetX = ceilingWidth * 0.28;
    const offsetZ = ceilingDepth * 0.28;
    
    if (lightCount === 1) {
      posArray.push([0, 0, 0]);
    } else if (lightCount === 2) {
      posArray.push(
        [0, 0, -offsetZ],
        [0, 0, offsetZ]
      );
    } else {
      posArray.push(
        [-offsetX, 0, -offsetZ],
        [offsetX, 0, -offsetZ],
        [-offsetX, 0, offsetZ],
        [offsetX, 0, offsetZ]
      );
    }

    return posArray;
  }, [dimensions.width, dimensions.depth, lightCount]);

  // Создаем текстуры с оптимизацией
  const spotTexture = useMemo(
    () => createSpotTexture(color, diffusion, highPerformance),
    [color, diffusion, highPerformance]
  );

  const ceilingGlowTexture = useMemo(
    () => createCeilingGlowTexture(color, diffusion, highPerformance),
    [color, diffusion, highPerformance]
  );

  // Материалы для светильника с учетом типа и рассеивания
  const glassMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: lightsOn ? color : "#e0e0e0",
      transparent: true,
      opacity: lightType === LightType.PLAFOND ? 0.7 : 0.9,
      emissive: lightsOn ? color : "#333333",
      emissiveIntensity: lightsOn ? (lightType === LightType.PLAFOND ? 0.7 : 0.9) : 0,
      roughness: lightType === LightType.PLAFOND ? 0.4 : 0.2,
    });
  }, [lightsOn, color, lightType]);

  const ceilingGlowMaterial = useMemo(() => {
    // Корректируем прозрачность материала в зависимости от рассеивания
    const diffusionOpacity = Math.max(0.2, 0.6 - diffusion * 0.3);
    
    return new THREE.MeshBasicMaterial({
      color: color,
      transparent: true,
      opacity: diffusionOpacity,
      map: ceilingGlowTexture,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.DoubleSide,
    });
  }, [color, ceilingGlowTexture, diffusion]);

  // Оптимизация текстур
  useEffect(() => {
    optimizeTexture(spotTexture, highPerformance);
    optimizeTexture(ceilingGlowTexture, highPerformance);
  }, [spotTexture, ceilingGlowTexture, highPerformance]);

  // Получаем высоту потолка с учетом его толщины
  const ceilingThickness = 0.08;
  const ceilingPosition = dimensions.height / 2 - ceilingThickness;

  // Получаем размеры светильников
  const lightSize = useMemo(() => getLightSize(lightCount, lightType), [lightCount, lightType]);

  // Отладочная информация
  useEffect(() => {
    console.log(`Light Type: ${lightType}, Diffusion: ${diffusion}`);
  }, [lightType, diffusion]);

  return (
    <group position={[0, ceilingPosition, 0]}>
      {/* Корпусы светильников через инстансинг (только для точечных светильников) */}
      {lightType === LightType.SPOTLIGHT && (
        <Instances range={positions.length} limit={10}>
          <cylinderGeometry 
            args={[
              lightSize.housingRadius, 
              lightSize.housingRadius, 
              0.005, 
              highPerformance ? 16 : 8
            ]} 
          />
          <meshStandardMaterial color={frameLightColor} />

          {positions.map((pos, index) => (
            <group key={index}>
              <Instance position={pos} />
            </group>
          ))}
        </Instances>
      )}

      {/* Отдельные светильники */}
      {positions.map((pos, index) => (
        lightType === LightType.SPOTLIGHT ? (
          <SpotLight
            key={`light-${index}`}
            position={pos}
            config={{...lightConfig, position: pos}}
            lightSize={lightSize}
            glassMaterial={glassMaterial}
            ceilingGlowMaterial={ceilingGlowMaterial}
            index={index}
            dimensions={dimensions}
            highPerformance={highPerformance}
          />
        ) : (
          <PlafondLight
            key={`plafond-${index}`}
            position={pos}
            config={{...lightConfig, position: pos}}
            lightSize={lightSize}
            glassMaterial={glassMaterial}
            ceilingGlowMaterial={ceilingGlowMaterial}
            index={index}
            dimensions={dimensions}
            highPerformance={highPerformance}
          />
        )
      ))}
    </group>
  );
};

export default CeilingLights;

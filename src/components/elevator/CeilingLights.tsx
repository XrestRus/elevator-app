import React, { useMemo, useEffect } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import { Plane, Instance, Instances } from "@react-three/drei";
import * as THREE from "three";
import PerformanceOptimizer from "../../utils/optimization/PerformanceOptimizer";
import MakeHoverable from "../ui/makeHoverable";
import colorUtils from "../../utils/colorUtils";

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
}

/**
 * Размеры светильника в зависимости от их количества
 */
interface LightSize {
  housingRadius: number;
  glassRadius: number;
  glowSize: number;
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
    const diffusionOffset = diffusion * 0.2;
    
    gradient.addColorStop(0, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 1.0)`);
    const opacity1 = 0.9 - diffusion * 0.3;
    gradient.addColorStop(0.1 + diffusionOffset, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity1})`);
    const opacity2 = 0.7 - diffusion * 0.2;
    gradient.addColorStop(0.2 + diffusionOffset, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity2})`);
    const opacity3 = 0.5 - diffusion * 0.1;
    gradient.addColorStop(0.4 + diffusionOffset, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity3})`);
    gradient.addColorStop(0.6 + diffusionOffset, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.3)`);
    gradient.addColorStop(0.8 - diffusionOffset, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.1)`);
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

    // Создаем мягкий ореол вокруг источника света
    gradient.addColorStop(0, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.5)`);
    gradient.addColorStop(0.3, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.2)`);
    gradient.addColorStop(0.6, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.05)`);
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
 * Получает размеры светильников в зависимости от их количества
 */
const getLightSize = (lightCount: number): LightSize => {
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
};

/**
 * Компонент для отображения одного светильника
 */
const SingleLight: React.FC<{
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

  // Рассчитываем интенсивность светильника
  const getLightIntensity = () => {
    const diffusionFactor = 1;
    if (!config.enabled) return 0;
    
    const intensityMultiplier = 4 / (config.count || 1);
    return config.intensity * 0.7 * diffusionFactor * intensityMultiplier;
  };

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
          angle={1}
          penumbra={0.8}
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
}> = ({ color = "#ffffff", intensity = 5 }) => {
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
    position: [0, 0, 0]
  }), [color, intensity, lightsOn, lightCount, diffusion]);

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
    () => createCeilingGlowTexture(color, highPerformance),
    [color, highPerformance]
  );

  // Материалы для светильника
  const glassMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: lightsOn ? color : "#e0e0e0",
      transparent: true,
      opacity: 0.9,
      emissive: lightsOn ? color : "#333333",
      emissiveIntensity: lightsOn ? 0.9 : 0,
    });
  }, [lightsOn, color]);

  const ceilingGlowMaterial = useMemo(() => {
    return new THREE.MeshBasicMaterial({
      color: color,
      transparent: true,
      opacity: 0.6,
      map: ceilingGlowTexture,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.DoubleSide,
    });
  }, [color, ceilingGlowTexture]);

  // Оптимизация текстур
  useEffect(() => {
    optimizeTexture(spotTexture, highPerformance);
    optimizeTexture(ceilingGlowTexture, highPerformance);
  }, [spotTexture, ceilingGlowTexture, highPerformance]);

  // Получаем высоту потолка с учетом его толщины
  const ceilingThickness = 0.08;
  const ceilingPosition = dimensions.height / 2 - ceilingThickness;

  // Получаем размеры светильников
  const lightSize = useMemo(() => getLightSize(lightCount), [lightCount]);

  return (
    <group position={[0, ceilingPosition, 0]}>
      {/* Корпусы светильников через инстансинг */}
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

      {/* Отдельные светильники */}
      {positions.map((pos, index) => (
        <SingleLight
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
      ))}
    </group>
  );
};

export default CeilingLights;

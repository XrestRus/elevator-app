import React, { useMemo, useEffect } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import { Plane, Instance, Instances } from "@react-three/drei";
import * as THREE from "three";
import PerformanceOptimizer from "../../utils/optimization/PerformanceOptimizer";
import MakeHoverable from "../ui/makeHoverable";
import colorUtils from "../../utils/colorUtils";

/**
 * Компонент для отображения точечных светильников на потолке лифта с оптимизацией
 */
const CeilingLights: React.FC<{
  count?: number;
  color?: string;
  intensity?: number;
}> = ({ count = 5, color = "#ffffff", intensity = 5 }) => {
  // Получаем состояние света из Redux
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
  const highPerformance = useMemo(
    () => PerformanceOptimizer.isHighPerformanceDevice(),
    []
  );

  // Создаем цвет корпуса светильника на основе цвета стен
  const frameLightColor = useMemo(() => {
    const color = new THREE.Color(wallColor);
    color.multiplyScalar(0.8); // Делаем цвет немного темнее стен
    return color;
  }, [wallColor]);

  // Расположение светильников на потолке - мемоизируем для предотвращения повторных вычислений
  const positions = useMemo(() => {
    const posArray: [number, number, number][] = [];

    // Создание массива позиций светильников (равномерно распределенных)
    if (count === 5) {
      // Центральный светильник
      posArray.push([0, 0, 0]);

      // Четыре светильника по углам
      const offsetX = dimensions.width * 0.35;
      const offsetZ = dimensions.depth * 0.35;
      posArray.push(
        [-offsetX, 0, -offsetZ],
        [offsetX, 0, -offsetZ],
        [-offsetX, 0, offsetZ],
        [offsetX, 0, offsetZ]
      );
    } else if (count === 4) {
      const offsetX = dimensions.width * 0.3;
      const offsetZ = dimensions.depth * 0.3;
      posArray.push(
        [-offsetX, 0, -offsetZ],
        [offsetX, 0, -offsetZ],
        [-offsetX, 0, offsetZ],
        [offsetX, 0, offsetZ]
      );
    } else if (count === 2) {
      const offsetZ = dimensions.depth * 0.3;
      posArray.push([0, 0, -offsetZ], [0, 0, offsetZ]);
    } else {
      posArray.push([0, 0, 0]);
    }

    return posArray;
  }, [count, dimensions.width, dimensions.depth]);

  // Рассчитываем размер и интенсивность светового пятна
  const getSpotSize = (index: number) => {
    // Базовый размер светового пятна с учетом рассеивания
    const baseSize = dimensions.height * 0.4;
    // Добавляем центральному светильнику размер, если их 5
    const centerMultiplier = (count === 5 && index === 0) ? 1.75 : 1;
    // Для рассеянного света увеличиваем размер пятна
    const diffusionMultiplier = 1 + diffusion; // Увеличиваем размер при большем рассеивании
    
    return baseSize * centerMultiplier * diffusionMultiplier;
  };

  const getLightIntensity = (index: number) => {
    // Базовая интенсивность с корректировкой на рассеивание
    // При большем рассеивании снижаем воспринимаемую интенсивность
    const diffusionFactor = 1 - diffusion * 0.4; // Уменьшаем фактор не более чем на 40%
    
    // Для выключенных светильников - 0
    if (!lightsOn) return 0;
    
    // Центральный светильник ярче
    const centerBoost = (count === 5 && index === 0) ? 1.1 : 0.7;
    
    return intensity * centerBoost * diffusionFactor;
  };

  // Создаем текстуру для светового пятна с оптимизацией
  const spotTexture = useMemo(() => {
    // Определяем размер текстуры в зависимости от производительности устройства
    const textureSize = highPerformance ? 512 : 256;

    const canvas = document.createElement("canvas");
    canvas.width = textureSize;
    canvas.height = textureSize;
    const context = canvas.getContext("2d");
    if (context) {
      // Создаем градиент от центра к краям с более реалистичным затуханием
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
      // Чем выше рассеивание, тем менее выражен центр и более плавные переходы
      const diffusionOffset = diffusion * 0.2; // Сдвиг для границ градиента
      
      gradient.addColorStop(0, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 1.0)`); // Яркий центр
      gradient.addColorStop(0.1 + diffusionOffset, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${0.9 - diffusion * 0.3})`);
      gradient.addColorStop(0.2 + diffusionOffset, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${0.7 - diffusion * 0.2})`);
      gradient.addColorStop(0.4 + diffusionOffset, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${0.5 - diffusion * 0.1})`);
      gradient.addColorStop(0.6 + diffusionOffset, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.3)`);
      gradient.addColorStop(0.8 - diffusionOffset, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.1)`);
      gradient.addColorStop(1.0, "rgba(255, 255, 255, 0)"); // Полное затухание на краях

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
    texture.generateMipmaps = false; // Отключаем миппинг для экономии памяти

    return texture;
  }, [color, highPerformance, diffusion]); // Добавляем зависимость от diffusion, angle не влияет на текстуру, только на размер

  // Новая текстура для ореола на потолке
  const ceilingGlowTexture = useMemo(() => {
    // Определяем размер текстуры в зависимости от производительности устройства
    const textureSize = highPerformance ? 256 : 128;

    const canvas = document.createElement("canvas");
    canvas.width = textureSize;
    canvas.height = textureSize;
    const context = canvas.getContext("2d");
    if (context) {
      // Создаем градиент для ореола на потолке
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
      gradient.addColorStop(0, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.6)`);
      gradient.addColorStop(0.3, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.3)`);
      gradient.addColorStop(0.6, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.1)`);
      gradient.addColorStop(1.0, "rgba(255, 255, 255, 0)");

      context.fillStyle = gradient;
      context.fillRect(0, 0, textureSize, textureSize);
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;

    // Оптимизация фильтрации текстур
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.generateMipmaps = false;

    return texture;
  }, [color, highPerformance]);

  // Геометрия для плафона светильника - создаем один раз
  const glassGeometry = useMemo(
    () =>
      new THREE.CylinderGeometry(0.07, 0.07, 0.005, highPerformance ? 16 : 8),
    [highPerformance]
  );

  // Материалы для плафона светильника - оптимизируем с помощью мемоизации
  const glassMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: lightsOn ? color : "#e0e0e0",
      transparent: true,
      opacity: 0.9,
      emissive: lightsOn ? color : "#333333",
      emissiveIntensity: lightsOn ? 1 : 0,
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

  // Преобразуем цвет в строковый формат для тултипа
  const getColorString = (colorValue: string | THREE.Color) => {
    return colorUtils.colorToRGBString(colorValue);
  };

  // Оптимизация текстур в зависимости от цвета и рассеивания
  useEffect(() => {
    // Применяем оптимизацию к загруженным текстурам
    const optimizeTexture = (texture: THREE.Texture | undefined) => {
      if (!texture) return;
      
      // Если устройство не мощное, используем менее качественные настройки текстур
      if (!highPerformance) {
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;
        texture.generateMipmaps = false; // Отключаем миппинг для экономии памяти
        texture.anisotropy = 1; // Минимальная анизотропная фильтрация
      } else {
        // Для мощных устройств используем более качественные настройки
        texture.anisotropy = 4; // Повышаем качество текстур на мощных устройствах
      }
      
      // Освобождаем память GPU, если текстура больше не используется
      texture.dispose = function() {
        if (this.image instanceof HTMLImageElement) {
          this.image.onload = null;
        }
        // Вызываем стандартный dispose
        THREE.Texture.prototype.dispose.call(this);
      };
    };
    
    // Оптимизируем текстуры
    optimizeTexture(spotTexture);
    optimizeTexture(ceilingGlowTexture);
    
  }, [spotTexture, ceilingGlowTexture, highPerformance]);

  // Также параметризуем радиус светового пятна в зависимости от размера лифта
  const lightSpotRenderer = (index: number) => {
    if (!lightsOn) return null;
    
    // Радиус светового пятна зависит от рассеивания
    const spotSize = getSpotSize(index);
    
    // Фиксированное положение светового пятна на полу
    const spotPositionY = -(dimensions.height * 0.5);
    
    // Для большего рассеивания увеличиваем размер вторичного ореола
    const secondarySize = spotSize * (1 + diffusion * 0.6);
    
    return (
      <group key={`spotLight_${index}`}>
        {/* Основное световое пятно */}
        <Plane
          scale={[spotSize, spotSize, 1]}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, spotPositionY, 0]}
        >
          <meshBasicMaterial
            map={spotTexture}
            color={color}
            transparent={true}
            opacity={getLightIntensity(index) * 0.1}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            side={THREE.DoubleSide}
          />
        </Plane>
        
        {/* Вторичный ореол - более широкий и слабый, для рассеянного света */}
        {diffusion > 0.3 && (
          <Plane
            scale={[secondarySize, secondarySize, 1]}
            rotation={[-Math.PI / 2, 0, 0]}
            position={[0, spotPositionY + 0.01, 0]}
          >
            <meshBasicMaterial
              map={spotTexture}
              color={color}
              transparent={true}
              opacity={getLightIntensity(index) * 0.05 * diffusion}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
              side={THREE.DoubleSide}
            />
          </Plane>
        )}
      </group>
    );
  };

  return (
    <group position={[0, dimensions.height / 2 - 0.05, 0]}>
      {/* Используем инстансинг для оптимизации рендеринга однотипных мешей */}
      <Instances range={positions.length} limit={10}>
        <cylinderGeometry args={[0.0, 0.076, 0.01, highPerformance ? 16 : 8]} />
        <meshStandardMaterial color={frameLightColor} />

        {positions.map((pos, index) => (
          <group key={index}>
            <Instance position={pos} />
          </group>
        ))}
      </Instances>

      {/* Оптимизированная отрисовка плафонов и света */}
      {positions.map((pos, index) => (
        <MakeHoverable
          key={`light-${index}`}
          name={count === 5 && index === 0 ? "Центральный светильник" : `Светильник ${index + 1}`}
          type="Светотехника"
          description={count === 5 && index === 0 
            ? "Основной потолочный светильник лифта"
            : "Вспомогательный потолочный светильник лифта"}
          material="Металл, матовый рассеиватель"
          dimensions={{
            width: 0.1,
            height: 0.03,
            depth: 0.1
          }}
          additionalInfo={{
            color: getColorString(color),
            texture: "Матовый металл с рассеивателем",
            "Интенсивность": getLightIntensity(index).toFixed(1),
            "Состояние": lightsOn ? "Включен" : "Выключен",
            "Тип": "Встроенный LED-светильник"
          }}
          requiresDoubleClick={false}
        >
          <group position={pos}>
            {/* Стеклянный плафон */}
            <mesh
              position={[0, -0.01, 0]}
              geometry={glassGeometry}
              material={glassMaterial}
            />

            {/* Ореол света на потолке */}
            {lightsOn && (
              <Plane
                args={[0.4, 0.4]}
                position={[0, 0.01, 0]}
                rotation={[-Math.PI / 2, 0, 0]}
                material={ceilingGlowMaterial}
              />
            )}

            {/* Сам источник света - с оптимизированными параметрами */}
            <spotLight
              position={[0, -0.02, 0]}
              angle={Math.PI / 3}
              penumbra={0.8} // Увеличено для более мягких краев теней
              intensity={getLightIntensity(index)}
              color={color}
              castShadow={highPerformance}
              decay={2}
              distance={dimensions.height * 1.5}
              shadow-mapSize-width={highPerformance ? 2048 : 512}
              shadow-mapSize-height={highPerformance ? 2048 : 512}
              shadow-bias={-0.001}
              shadow-normalBias={0.05}
              shadow-focus={0.7}
              shadow-radius={8}
              shadow-blurSamples={highPerformance ? 16 : 4}
            />

            {/* Световое пятно на полу - только если свет включен */}
            {lightsOn && (
              <group position={[0, -dimensions.height + 0.05, 0]}>
                {lightSpotRenderer(index)}
              </group>
            )}
          </group>
        </MakeHoverable>
      ))}
    </group>
  );
};

export default CeilingLights;

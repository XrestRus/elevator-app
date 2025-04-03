import React, { useMemo } from "react";
import { Box } from "@react-three/drei";
import * as THREE from "three";

/**
 * Свойства компонента декоративных полос
 */
interface DecorationStripesProps {
  dimensions: {
    width: number;
    height: number;
    depth: number;
  };
  decorationStripes: {
    enabled?: boolean;
    skipMirrorWall?: boolean;
    width?: number;
    count?: number;
    orientation?: string;
    position?: string;
    spacing?: number;
    offset?: number;
    qualityFactor?: number; // Фактор качества для оптимизации
  };
  decorationStripesMaterial: THREE.Material | null;
  hasMirror: boolean;
}

/**
 * Компонент для отображения декоративных полос в лифте с оптимизацией производительности
 */
const DecorationStripes: React.FC<DecorationStripesProps> = ({
  dimensions,
  decorationStripes,
  decorationStripesMaterial,
  hasMirror,
}) => {
  // Получаем коэффициент качества из параметров, по умолчанию 1 (высокое качество)
  const qualityFactor = decorationStripes.qualityFactor ?? 1;

  // Ширина полосы в метрах
  const stripeWidth = (decorationStripes.width || 5) / 100;
  // Количество полос (уменьшаем при низком качестве)
  const baseStripeCount = decorationStripes.count || 1;
  const stripeCount = qualityFactor < 0.5 ? Math.min(baseStripeCount, 1) : baseStripeCount;
  // Расстояние между полосами в метрах - используется в расчетах позиций
  const spacingMeters = (decorationStripes.spacing || 3) / 100;
  // Ориентация полос
  const isHorizontal = (decorationStripes.orientation || "horizontal") === "horizontal";
  // Пропускать ли заднюю стену с зеркалом
  const skipMirrorWall = decorationStripes.skipMirrorWall ?? true;
  // Смещение от центра в метрах
  const offsetMeters = (decorationStripes.offset || 0) / 100;

  // При очень низком качестве показываем только основные полосы и убираем с боковых стен
  const shouldRenderSideWalls = qualityFactor >= 0.3;

  // Мемоизируем позиции полос
  const positions = useMemo(() => {
    const pos: number[] = [];

    switch (decorationStripes.position) {
      case "top": {
        // Верхние полосы
        if (isHorizontal) {
          // Для горизонтальных полос - позиции по высоте
          for (let i = 0; i < stripeCount; i++) {
            pos.push(dimensions.height / 3 + i * (stripeWidth + spacingMeters));
          }
        } else {
          // Для вертикальных полос - позиции от верхней точки
          for (let i = 0; i < stripeCount; i++) {
            pos.push(i * (stripeWidth + spacingMeters) - (stripeCount - 1) * (stripeWidth + spacingMeters) / 2);
          }
        }
        break;
      }
      case "bottom": {
        // Нижние полосы
        if (isHorizontal) {
          // Для горизонтальных полос - позиции по высоте
          for (let i = 0; i < stripeCount; i++) {
            pos.push(-dimensions.height / 3 - i * (stripeWidth + spacingMeters));
          }
        } else {
          // Для вертикальных полос - позиции от нижней точки
          for (let i = 0; i < stripeCount; i++) {
            pos.push(i * (stripeWidth + spacingMeters) - (stripeCount - 1) * (stripeWidth + spacingMeters) / 2);
          }
        }
        break;
      }
      case "all": {
        // Полосы во всю высоту/ширину, равномерно распределенные
        if (isHorizontal) {
          // Для горизонтальных полос - позиции по высоте
          const step = dimensions.height / (stripeCount + 1);
          for (let i = 0; i < stripeCount; i++) {
            pos.push(-dimensions.height / 2 + (i + 1) * step);
          }
        } else {
          // Для вертикальных полос - равномерно распределяем по ширине/глубине
          const step = (dimensions.width - 0.1) / (stripeCount + 1);
          for (let i = 0; i < stripeCount; i++) {
            pos.push(-dimensions.width / 2 + 0.05 + (i + 1) * step);
          }
        }
        break;
      }
      default: { // 'middle'
        // По умолчанию полосы в центре
        if (isHorizontal) {
          // Для горизонтальных полос - позиции по высоте
          const middleOffset = (stripeCount - 1) * (stripeWidth + spacingMeters) / 2;
          for (let i = 0; i < stripeCount; i++) {
            pos.push(- middleOffset + i * (stripeWidth + spacingMeters));
          }
        } else {
          // Для вертикальных полос - позиции по ширине от центра
          const middleOffset = (stripeCount - 1) * (stripeWidth + spacingMeters) / 2;
          for (let i = 0; i < stripeCount; i++) {
            pos.push(- middleOffset + i * (stripeWidth + spacingMeters));
          }
        }
        break;
      }
    }
    return pos;
  }, [decorationStripes.position, isHorizontal, stripeCount, stripeWidth, spacingMeters, dimensions]);

  // Мемоизируем позиции полос для боковых стен
  const sideWallPositions = useMemo(() => {
    const sidePos: number[] = [];

    if (!isHorizontal) {
      if (decorationStripes.position === "all") {
        // Распределяем полосы равномерно по глубине боковых стен
        const step = dimensions.depth / (stripeCount + 1);
        for (let i = 0; i < stripeCount; i++) {
          sidePos.push(-dimensions.depth / 2 + (i + 1) * step);
        }
      } else {
        // Используем то же расстояние между полосами, что и для задней стены
        const sideWallMiddleOffset = (stripeCount - 1) * (stripeWidth + spacingMeters) / 2;
        for (let i = 0; i < stripeCount; i++) {
          sidePos.push(- sideWallMiddleOffset + i * (stripeWidth + spacingMeters));
        }
      }
    }
    return sidePos;
  }, [isHorizontal, stripeCount, stripeWidth, spacingMeters, dimensions, decorationStripes.position]);
  
  // Мемоизируем все элементы для оптимизации
  const stripeElements = useMemo(() => {
    // Если материал не определен или полосы отключены, возвращаем пустой массив
    if (!decorationStripes.enabled || !decorationStripesMaterial) {
      return [];
    }
    
    const elements: React.ReactElement[] = [];
    
    // Задняя стена - показываем полосы только если нет зеркала или не выбран пропуск стены с зеркалом
    if (!hasMirror || !skipMirrorWall) {
      if (isHorizontal) {
        // Горизонтальные полосы на задней стене
        positions.forEach((pos, index) => {
          elements.push(
            <Box
              key={`back-wall-stripe-${index}`}
              position={[offsetMeters, pos, -dimensions.depth / 2 + 0.025]}
              args={[dimensions.width - 0.06, stripeWidth, 0.005]}
              castShadow={false}
            >
              <primitive object={decorationStripesMaterial} attach="material" />
            </Box>
          );
        });
      } else {
        // Вертикальные полосы на задней стене
        positions.forEach((pos, index) => {
          elements.push(
            <Box
              key={`back-wall-stripe-${index}`}
              position={[pos + offsetMeters, 0, -dimensions.depth / 2 + 0.025]}
              args={[stripeWidth, dimensions.height - 0.06, 0.005]}
              castShadow={false}
            >
              <primitive object={decorationStripesMaterial} attach="material" />
            </Box>
          );
        });
      }
    }
    
    // Боковые стены - рендерим только при достаточном качестве
    if (shouldRenderSideWalls) {
      // Левая стена
      if (isHorizontal) {
        // Горизонтальные полосы на левой стене
        positions.forEach((pos, index) => {
          elements.push(
            <Box
              key={`left-wall-stripe-${index}`}
              position={[-dimensions.width / 2 + 0.025, pos, offsetMeters]}
              args={[0.005, stripeWidth, dimensions.depth - 0.06]}
              castShadow={false}
            >
              <primitive object={decorationStripesMaterial} attach="material" />
            </Box>
          );
        });
      } else {
        // Вертикальные полосы на левой стене
        sideWallPositions.forEach((zPos, index) => {
          elements.push(
            <Box
              key={`left-wall-stripe-${index}`}
              position={[-dimensions.width / 2 + 0.025, offsetMeters, zPos + offsetMeters]}
              args={[0.005, dimensions.height - 0.06, stripeWidth]}
              castShadow={false}
            >
              <primitive object={decorationStripesMaterial} attach="material" />
            </Box>
          );
        });
      }
      
      // Правая стена
      if (isHorizontal) {
        // Горизонтальные полосы на правой стене
        positions.forEach((pos, index) => {
          elements.push(
            <Box
              key={`right-wall-stripe-${index}`}
              position={[dimensions.width / 2 - 0.025, pos, offsetMeters]}
              args={[0.005, stripeWidth, dimensions.depth - 0.06]}
              castShadow={false}
            >
              <primitive object={decorationStripesMaterial} attach="material" />
            </Box>
          );
        });
      } else {
        // Вертикальные полосы на правой стене
        sideWallPositions.forEach((zPos, index) => {
          elements.push(
            <Box
              key={`right-wall-stripe-${index}`}
              position={[dimensions.width / 2 - 0.025, offsetMeters, zPos + offsetMeters]}
              args={[0.005, dimensions.height - 0.06, stripeWidth]}
              castShadow={false}
            >
              <primitive object={decorationStripesMaterial} attach="material" />
            </Box>
          );
        });
      }
    }
    
    return elements;
  }, [
    positions, 
    sideWallPositions, 
    hasMirror, 
    skipMirrorWall, 
    isHorizontal, 
    dimensions, 
    offsetMeters, 
    stripeWidth, 
    decorationStripesMaterial,
    shouldRenderSideWalls,
    decorationStripes.enabled
  ]);

  // Если материал не определен или полосы отключены, возвращаем null
  if (!decorationStripes.enabled || !decorationStripesMaterial) {
    return null;
  }

  return <>{stripeElements}</>;
};

export default DecorationStripes; 
import React from "react";
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
  };
  decorationStripesMaterial: THREE.Material | null;
  hasMirror: boolean;
}

/**
 * Компонент для отображения декоративных полос в лифте
 */
const DecorationStripes: React.FC<DecorationStripesProps> = ({
  dimensions,
  decorationStripes,
  decorationStripesMaterial,
  hasMirror,
}) => {
  if (!decorationStripes.enabled || !decorationStripesMaterial) {
    return null;
  }

  // Ширина полосы в метрах
  const stripeWidth = (decorationStripes.width || 5) / 100;
  // Количество полос
  const stripeCount = decorationStripes.count || 1;
  // Расстояние между полосами в метрах - используется в расчетах позиций
  const spacingMeters = (decorationStripes.spacing || 3) / 100;
  // Ориентация полос
  const isHorizontal = (decorationStripes.orientation || "horizontal") === "horizontal";
  // Пропускать ли заднюю стену с зеркалом
  const skipMirrorWall = decorationStripes.skipMirrorWall ?? true;
  // Смещение от центра в метрах
  const offsetMeters = (decorationStripes.offset || 0) / 100;

  // Получаем позиции полос в зависимости от настройки position
  const positions: number[] = [];

  switch (decorationStripes.position) {
    case "top": {
      // Верхние полосы
      if (isHorizontal) {
        // Для горизонтальных полос - позиции по высоте
        for (let i = 0; i < stripeCount; i++) {
          positions.push(dimensions.height / 3 + i * (stripeWidth + spacingMeters));
        }
      } else {
        // Для вертикальных полос - позиции от верхней точки
        for (let i = 0; i < stripeCount; i++) {
          positions.push(i * (stripeWidth + spacingMeters) - (stripeCount - 1) * (stripeWidth + spacingMeters) / 2);
        }
      }
      break;
    }
    case "bottom": {
      // Нижние полосы
      if (isHorizontal) {
        // Для горизонтальных полос - позиции по высоте
        for (let i = 0; i < stripeCount; i++) {
          positions.push(-dimensions.height / 3 - i * (stripeWidth + spacingMeters));
        }
      } else {
        // Для вертикальных полос - позиции от нижней точки
        for (let i = 0; i < stripeCount; i++) {
          positions.push(i * (stripeWidth + spacingMeters) - (stripeCount - 1) * (stripeWidth + spacingMeters) / 2);
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
          positions.push(-dimensions.height / 2 + (i + 1) * step);
        }
      } else {
        // Для вертикальных полос - равномерно распределяем по ширине/глубине
        const step = (dimensions.width - 0.1) / (stripeCount + 1);
        for (let i = 0; i < stripeCount; i++) {
          positions.push(-dimensions.width / 2 + 0.05 + (i + 1) * step);
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
          positions.push(- middleOffset + i * (stripeWidth + spacingMeters));
        }
      } else {
        // Для вертикальных полос - позиции по ширине от центра
        const middleOffset = (stripeCount - 1) * (stripeWidth + spacingMeters) / 2;
        for (let i = 0; i < stripeCount; i++) {
          positions.push(- middleOffset + i * (stripeWidth + spacingMeters));
        }
      }
      break;
    }
  }

  // Создаем дополнительные позиции для боковых стен при вертикальной ориентации
  const sideWallPositions: number[] = [];
  if (!isHorizontal) {
    if (decorationStripes.position === "all") {
      // Распределяем полосы равномерно по глубине боковых стен
      const step = dimensions.depth / (stripeCount + 1);
      for (let i = 0; i < stripeCount; i++) {
        sideWallPositions.push(-dimensions.depth / 2 + (i + 1) * step);
      }
    } else {
      // Используем то же расстояние между полосами, что и для задней стены
      const sideWallMiddleOffset = (stripeCount - 1) * (stripeWidth + spacingMeters) / 2;
      for (let i = 0; i < stripeCount; i++) {
        sideWallPositions.push(- sideWallMiddleOffset + i * (stripeWidth + spacingMeters));
      }
    }
  }

  return (
    <>
      {/* Задняя стена - показываем полосы только если нет зеркала или не выбран пропуск стены с зеркалом */}
      {(!hasMirror || !skipMirrorWall) && (
        isHorizontal ? (
          // Горизонтальные полосы на задней стене
          positions.map((pos, index) => (
            <Box
              key={`back-wall-stripe-${index}`}
              position={[offsetMeters, pos, -dimensions.depth / 2 + 0.025]}
              args={[dimensions.width - 0.06, stripeWidth, 0.005]}
              castShadow
            >
              <primitive object={decorationStripesMaterial} attach="material" />
            </Box>
          ))
        ) : (
          // Вертикальные полосы на задней стене
          positions.map((pos, index) => (
            <Box
              key={`back-wall-stripe-${index}`}
              position={[pos + offsetMeters, 0, -dimensions.depth / 2 + 0.025]}
              args={[stripeWidth, dimensions.height - 0.06, 0.005]}
              castShadow
            >
              <primitive object={decorationStripesMaterial} attach="material" />
            </Box>
          ))
        )
      )}
      
      {/* Левая стена */}
      {isHorizontal ? (
        // Горизонтальные полосы на левой стене
        positions.map((pos, index) => (
          <Box
            key={`left-wall-stripe-${index}`}
            position={[-dimensions.width / 2 + 0.025, pos, offsetMeters]}
            args={[0.005, stripeWidth, dimensions.depth - 0.06]}
            castShadow
          >
            <primitive object={decorationStripesMaterial} attach="material" />
          </Box>
        ))
      ) : (
        // Вертикальные полосы на левой стене
        sideWallPositions.map((zPos, index) => (
          <Box
            key={`left-wall-stripe-${index}`}
            position={[-dimensions.width / 2 + 0.025, offsetMeters, zPos + offsetMeters]}
            args={[0.005, dimensions.height - 0.06, stripeWidth]}
            castShadow
          >
            <primitive object={decorationStripesMaterial} attach="material" />
          </Box>
        ))
      )}
      
      {/* Правая стена */}
      {isHorizontal ? (
        // Горизонтальные полосы на правой стене
        positions.map((pos, index) => (
          <Box
            key={`right-wall-stripe-${index}`}
            position={[dimensions.width / 2 - 0.025, pos, offsetMeters]}
            args={[0.005, stripeWidth, dimensions.depth - 0.06]}
            castShadow
          >
            <primitive object={decorationStripesMaterial} attach="material" />
          </Box>
        ))
      ) : (
        // Вертикальные полосы на правой стене
        sideWallPositions.map((zPos, index) => (
          <Box
            key={`right-wall-stripe-${index}`}
            position={[dimensions.width / 2 - 0.025, offsetMeters, zPos + offsetMeters]}
            args={[0.005, dimensions.height - 0.06, stripeWidth]}
            castShadow
          >
            <primitive object={decorationStripesMaterial} attach="material" />
          </Box>
        ))
      )}
    </>
  );
};

export default DecorationStripes; 
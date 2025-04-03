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
    spacing?: number;
    offset?: number;
    qualityFactor?: number; // Фактор качества для оптимизации
  };
  decorationStripesMaterial: THREE.Material | null;
  hasMirror: boolean;
}

/**
 * Тип для описания стены лифта
 */
interface WallConfig {
  name: string;                // Название стены для формирования ключей
  position: [number, number, number]; // Базовая позиция для полосы [x, y, z]
  args: [number, number, number];     // Размеры полосы при горизонтальной ориентации
  argsVertical: [number, number, number]; // Размеры при вертикальной ориентации
  positions: number[];         // Массив позиций полос для данной стены
  skip?: boolean;              // Флаг для пропуска рендеринга
  axis: 'x' | 'y' | 'z';       // Ось, вдоль которой размещаются полосы
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

  /**
   * Рассчитывает массив позиций полос на основе заданного положения
   */
  const calculatePositions = useMemo(() => {
    // Функция для расчета позиций полос с центрированием
    const calculatePositionsWithCentering = (): number[] => {
      const pos: number[] = [];
      
      if (stripeCount === 1) {
        // Если только одна полоса, размещаем ее по центру
        pos.push(0);
      } else {
        // Для нескольких полос - центрируем блок
        // Рассчитываем общую ширину блока полос
        const totalWidth = stripeWidth * stripeCount + spacingMeters * (stripeCount - 1);
        
        // Проверяем, поместятся ли полосы в доступном пространстве
        let availableSpace;
        if (isHorizontal) {
          availableSpace = dimensions.height - 0.1; // отступ от краев
        } else {
          availableSpace = dimensions.width - 0.1;
        }
        
        if (totalWidth <= availableSpace) {
          // Если полосы помещаются, центрируем группу
          const startPos = -totalWidth / 2 + stripeWidth / 2;
          for (let i = 0; i < stripeCount; i++) {
            pos.push(startPos + i * (stripeWidth + spacingMeters));
          }
        } else {
          // Если не помещаются - распределяем равномерно
          const step = availableSpace / (stripeCount + 1);
          const offset = isHorizontal ? dimensions.height : dimensions.width;
          
          for (let i = 0; i < stripeCount; i++) {
            pos.push(-offset / 2 + 0.05 + (i + 1) * step);
          }
        }
      }
      
      return pos;
    };
    
    return calculatePositionsWithCentering;
  }, [dimensions, isHorizontal, stripeCount, stripeWidth, spacingMeters]);

  // Мемоизируем позиции полос для основных стен
  const mainPositions = useMemo(() => {
    return calculatePositions();
  }, [calculatePositions]);

  // Вычисление позиций для боковых стен
  const sideWallPositions = useMemo(() => {
    if (isHorizontal) {
      // Для горизонтальных полос используем те же позиции
      return mainPositions;
    } else {
      // Для вертикальных полос рассчитываем с учетом глубины
      const pos: number[] = [];
      
      if (stripeCount === 1) {
        // Одна полоса всегда по центру
        pos.push(0);
      } else {
        // Рассчитываем, поместятся ли полосы с нужным расстоянием
        const totalDepth = stripeWidth * stripeCount + spacingMeters * (stripeCount - 1);
        const availableDepth = dimensions.depth - 0.1; // небольшой отступ от края
        
        if (totalDepth <= availableDepth) {
          // Если полосы помещаются, то центрируем группу
          const startPos = -totalDepth / 2 + stripeWidth / 2;
          for (let i = 0; i < stripeCount; i++) {
            pos.push(startPos + i * (stripeWidth + spacingMeters));
          }
        } else {
          // Если полосы не помещаются, то распределяем равномерно
          const step = dimensions.depth / (stripeCount + 1);
          for (let i = 0; i < stripeCount; i++) {
            pos.push(-dimensions.depth / 2 + 0.05 + (i + 1) * step);
          }
        }
      }
      
      return pos;
    }
  }, [dimensions.depth, isHorizontal, mainPositions, spacingMeters, stripeCount, stripeWidth]);

  // Конфигурация всех стен лифта
  const wallConfigs = useMemo((): WallConfig[] => {
    const configs: WallConfig[] = [];
    
    // Задняя стена
    configs.push({
      name: "back-wall",
      position: [offsetMeters, 0, -dimensions.depth / 2 + 0.025],
      args: [dimensions.width - 0.06, stripeWidth, 0.005],
      argsVertical: [stripeWidth, dimensions.height - 0.06, 0.005],
      positions: mainPositions,
      skip: hasMirror && skipMirrorWall,
      axis: isHorizontal ? 'y' : 'x'
    });
    
    // Левая стена (отображаем только при достаточном качестве)
    if (shouldRenderSideWalls) {
      configs.push({
        name: "left-wall",
        position: [-dimensions.width / 2 + 0.025, offsetMeters, 0],
        args: [0.005, stripeWidth, dimensions.depth - 0.06],
        argsVertical: [0.005, dimensions.height - 0.06, stripeWidth],
        positions: isHorizontal ? mainPositions : sideWallPositions,
        axis: isHorizontal ? 'y' : 'z'
      });
      
      // Правая стена
      configs.push({
        name: "right-wall",
        position: [dimensions.width / 2 - 0.025, offsetMeters, 0],
        args: [0.005, stripeWidth, dimensions.depth - 0.06],
        argsVertical: [0.005, dimensions.height - 0.06, stripeWidth],
        positions: isHorizontal ? mainPositions : sideWallPositions,
        axis: isHorizontal ? 'y' : 'z'
      });
    }
    
    return configs;
  }, [dimensions, hasMirror, isHorizontal, mainPositions, offsetMeters, shouldRenderSideWalls, sideWallPositions, skipMirrorWall, stripeWidth]);

  // Мемоизируем все элементы для оптимизации
  const stripeElements = useMemo(() => {
    // Если материал не определен или полосы отключены, возвращаем пустой массив
    if (!decorationStripes.enabled || !decorationStripesMaterial) {
      return [];
    }
    
    const elements: React.ReactElement[] = [];
    
    // Рендерим полосы для всех стен
    wallConfigs.forEach(wall => {
      if (wall.skip) return;
      
      wall.positions.forEach((pos, index) => {
        // Определяем позицию полосы в зависимости от оси
        const position: [number, number, number] = [...wall.position];
        
        // Устанавливаем позицию по соответствующей оси
        switch (wall.axis) {
          case 'x':
            position[0] = pos + (wall.axis === 'x' ? offsetMeters : 0);
            break;
          case 'y':
            position[1] = pos;
            break;
          case 'z':
            position[2] = pos + (wall.axis === 'z' ? offsetMeters : 0);
            break;
        }
        
        // Применяем соответствующие размеры в зависимости от ориентации
        const args = isHorizontal ? wall.args : wall.argsVertical;
        
        elements.push(
          <Box
            key={`${wall.name}-stripe-${index}`}
            position={position}
            args={args}
            castShadow={false}
          >
            <primitive object={decorationStripesMaterial} attach="material" />
          </Box>
        );
      });
    });
    
    return elements;
  }, [decorationStripes.enabled, decorationStripesMaterial, isHorizontal, offsetMeters, wallConfigs]);

  // Если материал не определен или полосы отключены, возвращаем null
  if (!decorationStripes.enabled || !decorationStripesMaterial) {
    return null;
  }

  return <>{stripeElements}</>;
};

export default DecorationStripes; 
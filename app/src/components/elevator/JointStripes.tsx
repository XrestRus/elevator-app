import React, { useMemo } from "react";
import { Box } from "@react-three/drei";
import * as THREE from "three";
import { JointOptions } from "../../store/elevatorSlice";

/**
 * Свойства компонента стыков между стенами
 */
interface JointStripesProps {
  dimensions: {
    width: number;
    height: number;
    depth: number;
  };
  jointStripeMaterial: THREE.Material | null;
  jointOptions?: JointOptions;
}

/**
 * Компонент для отображения стыков между стенами лифта с оптимизацией производительности
 */
const JointStripes: React.FC<JointStripesProps> = ({
  dimensions,
  jointStripeMaterial,
  jointOptions
}) => {
  // Мемоизируем все объекты стыков для оптимизации
  const jointElements = useMemo(() => {
    // Если материал не определен или стыки отключены, возвращаем пустой массив
    if (!jointStripeMaterial || !jointOptions?.enabled) {
      return [];
    }
    
    // Получаем коэффициент качества из параметров, по умолчанию 1 (высокое качество)
    const qualityFactor = jointOptions.qualityFactor ?? 1;
    
    // Если установлен низкий уровень качества и выбрано более 10 стыков,
    // уменьшаем количество отображаемых стыков для повышения производительности
    const shouldRenderAllJoints = qualityFactor > 0.5;

    // Толщина стыка - из настроек, преобразованная из мм в метры
    const jointWidth = (jointOptions.width || 4) / 100;
    
    // Выступ стыков - из настроек, преобразованный из мм в метры
    // Уменьшаем выступ для низкого качества
    const protrusion = ((jointOptions.protrusion || 3) / 1000) * qualityFactor;
    
    // Добавляем выступ на передний край стыков для лучшей видимости
    const frontOffset = 0.002 * qualityFactor; // Базовый выступ 2 мм + настраиваемый выступ
    
    const elements: React.ReactElement[] = [];

    // Упрощенный рендеринг только основных стыков для низкого качества
    if (shouldRenderAllJoints) {
      // Вертикальные стыки между стенами
      
      // Стык между задней стеной и левой боковой
      elements.push(
        <Box
          key="joint-back-left"
          position={[-dimensions.width / 2 + jointWidth / 2, 0, -dimensions.depth / 2 + jointWidth / 2]}
          args={[jointWidth + protrusion, dimensions.height, jointWidth + protrusion]}
          castShadow={false}
        >
          <primitive object={jointStripeMaterial} attach="material" />
        </Box>
      );

      // Стык между задней стеной и правой боковой
      elements.push(
        <Box
          key="joint-back-right"
          position={[dimensions.width / 2 - jointWidth / 2, 0, -dimensions.depth / 2 + jointWidth / 2]}
          args={[jointWidth + protrusion, dimensions.height, jointWidth + protrusion]}
          castShadow={false}
        >
          <primitive object={jointStripeMaterial} attach="material" />
        </Box>
      );

      // Стык между левой боковой и передней стенками
      elements.push(
        <Box
          key="joint-front-left"
          position={[-dimensions.width / 2 + jointWidth / 2, 0, dimensions.depth / 2 - jointWidth / 2 + frontOffset]}
          args={[jointWidth + protrusion, dimensions.height, jointWidth + protrusion]}
          castShadow={false}
        >
          <primitive object={jointStripeMaterial} attach="material" />
        </Box>
      );

      // Стык между правой боковой и передней стенками
      elements.push(
        <Box
          key="joint-front-right"
          position={[dimensions.width / 2 - jointWidth / 2, 0, dimensions.depth / 2 - jointWidth / 2 + frontOffset]}
          args={[jointWidth + protrusion, dimensions.height, jointWidth + protrusion]}
          castShadow={false}
        >
          <primitive object={jointStripeMaterial} attach="material" />
        </Box>
      );

      // Горизонтальные стыки между стенами и полом/потолком
      
      // Стык между левой стеной и полом
      elements.push(
        <Box
          key="joint-left-floor"
          position={[-dimensions.width / 2 + jointWidth / 2, -dimensions.height / 2 + jointWidth / 2, 0]}
          args={[jointWidth + protrusion, jointWidth + protrusion, dimensions.depth + 0.01]}
          castShadow={false}
        >
          <primitive object={jointStripeMaterial} attach="material" />
        </Box>
      );

      // Стык между правой стеной и полом
      elements.push(
        <Box
          key="joint-right-floor"
          position={[dimensions.width / 2 - jointWidth / 2, -dimensions.height / 2 + jointWidth / 2, 0]}
          args={[jointWidth + protrusion, jointWidth + protrusion, dimensions.depth + 0.01]}
          castShadow={false}
        >
          <primitive object={jointStripeMaterial} attach="material" />
        </Box>
      );

      // Стык между задней стеной и полом
      elements.push(
        <Box
          key="joint-back-floor"
          position={[0, -dimensions.height / 2 + jointWidth / 2, -dimensions.depth / 2 + jointWidth / 2]}
          args={[dimensions.width + protrusion, jointWidth + protrusion, jointWidth + protrusion]}
          castShadow={false}
        >
          <primitive object={jointStripeMaterial} attach="material" />
        </Box>
      );

      // Стык между передней стеной и полом (исключая пространство для дверей)
      // Левая часть стыка передней стены
      elements.push(
        <Box
          key="joint-front-floor-left"
          position={[-dimensions.width / 4 - 0.1, -dimensions.height / 2 + jointWidth / 2, dimensions.depth / 2 - jointWidth / 2]}
          args={[dimensions.width / 2 - 0.2, jointWidth + protrusion, jointWidth + protrusion]}
          castShadow={false}
        >
          <primitive object={jointStripeMaterial} attach="material" />
        </Box>
      );
      
      // Правая часть стыка передней стены
      elements.push(
        <Box
          key="joint-front-floor-right"
          position={[dimensions.width / 4 + 0.1, -dimensions.height / 2 + jointWidth / 2, dimensions.depth / 2 - jointWidth / 2]}
          args={[dimensions.width / 2 - 0.2, jointWidth + protrusion, jointWidth + protrusion]}
          castShadow={false}
        >
          <primitive object={jointStripeMaterial} attach="material" />
        </Box>
      );

      // Стык между левой стеной и потолком
      elements.push(
        <Box
          key="joint-left-ceiling"
          position={[-dimensions.width / 2 + jointWidth / 2, dimensions.height / 2 - jointWidth / 2, 0]}
          args={[jointWidth + protrusion, jointWidth + protrusion, dimensions.depth + 0.01]}
          castShadow={false}
        >
          <primitive object={jointStripeMaterial} attach="material" />
        </Box>
      );

      // Стык между правой стеной и потолком
      elements.push(
        <Box
          key="joint-right-ceiling"
          position={[dimensions.width / 2 - jointWidth / 2, dimensions.height / 2 - jointWidth / 2, 0]}
          args={[jointWidth + protrusion, jointWidth + protrusion, dimensions.depth + 0.01]}
          castShadow={false}
        >
          <primitive object={jointStripeMaterial} attach="material" />
        </Box>
      );

      // Стык между задней стеной и потолком
      elements.push(
        <Box
          key="joint-back-ceiling"
          position={[0, dimensions.height / 2 - jointWidth / 2, -dimensions.depth / 2 + jointWidth / 2]}
          args={[dimensions.width + protrusion, jointWidth + protrusion, jointWidth + protrusion]}
          castShadow={false}
        >
          <primitive object={jointStripeMaterial} attach="material" />
        </Box>
      );

      // Стык между передней стеной и потолком (исключая пространство для дверей)
      // Левая часть стыка передней стены
      elements.push(
        <Box
          key="joint-front-ceiling-left"
          position={[-dimensions.width / 4 - 0.1, dimensions.height / 2 - jointWidth / 2, dimensions.depth / 2 - jointWidth / 2]}
          args={[dimensions.width / 2 - 0.2, jointWidth + protrusion, jointWidth + protrusion]}
          castShadow={false}
        >
          <primitive object={jointStripeMaterial} attach="material" />
        </Box>
      );
      
      // Правая часть стыка передней стены
      elements.push(
        <Box
          key="joint-front-ceiling-right"
          position={[dimensions.width / 4 + 0.1, dimensions.height / 2 - jointWidth / 2, dimensions.depth / 2 - jointWidth / 2]}
          args={[dimensions.width / 2 - 0.2, jointWidth + protrusion, jointWidth + protrusion]}
          castShadow={false}
        >
          <primitive object={jointStripeMaterial} attach="material" />
        </Box>
      );
      
      // Вертикальные стыки по краям дверного проема
      // Левый
      elements.push(
        <Box
          key="joint-door-left"
          position={[-0.65, 0, dimensions.depth / 2 - jointWidth / 2 + frontOffset]}
          args={[jointWidth + protrusion, dimensions.height, jointWidth + protrusion]}
          castShadow={false}
        >
          <primitive object={jointStripeMaterial} attach="material" />
        </Box>
      );

      // Правый
      elements.push(
        <Box
          key="joint-door-right"
          position={[0.65, 0, dimensions.depth / 2 - jointWidth / 2 + frontOffset]}
          args={[jointWidth + protrusion, dimensions.height, jointWidth + protrusion]}
          castShadow={false}
        >
          <primitive object={jointStripeMaterial} attach="material" />
        </Box>
      );
    } else {
      // В режиме низкого качества показываем только минимум стыков
      // Вертикальные стыки в углах
      elements.push(
        <Box
          key="joint-back-left-simple"
          position={[-dimensions.width / 2 + jointWidth / 2, 0, -dimensions.depth / 2 + jointWidth / 2]}
          args={[jointWidth + protrusion, dimensions.height, jointWidth + protrusion]}
          castShadow={false}
        >
          <primitive object={jointStripeMaterial} attach="material" />
        </Box>
      );

      elements.push(
        <Box
          key="joint-back-right-simple"
          position={[dimensions.width / 2 - jointWidth / 2, 0, -dimensions.depth / 2 + jointWidth / 2]}
          args={[jointWidth + protrusion, dimensions.height, jointWidth + protrusion]}
          castShadow={false}
        >
          <primitive object={jointStripeMaterial} attach="material" />
        </Box>
      );
      
      // Стыки по краям дверного проема - основные элементы дизайна
      elements.push(
        <Box
          key="joint-door-left-simple"
          position={[-0.65, 0, dimensions.depth / 2 - jointWidth / 2 + frontOffset]}
          args={[jointWidth + protrusion, dimensions.height, jointWidth + protrusion]}
          castShadow={false}
        >
          <primitive object={jointStripeMaterial} attach="material" />
        </Box>
      );

      elements.push(
        <Box
          key="joint-door-right-simple"
          position={[0.65, 0, dimensions.depth / 2 - jointWidth / 2 + frontOffset]}
          args={[jointWidth + protrusion, dimensions.height, jointWidth + protrusion]}
          castShadow={false}
        >
          <primitive object={jointStripeMaterial} attach="material" />
        </Box>
      );
      
      // Стыки между боковыми стенами и передней стеной
      elements.push(
        <Box
          key="joint-front-left-simple"
          position={[-dimensions.width / 2 + jointWidth / 2, 0, dimensions.depth / 2 - jointWidth / 2 + frontOffset]}
          args={[jointWidth + protrusion, dimensions.height, jointWidth + protrusion]}
          castShadow={false}
        >
          <primitive object={jointStripeMaterial} attach="material" />
        </Box>
      );

      elements.push(
        <Box
          key="joint-front-right-simple"
          position={[dimensions.width / 2 - jointWidth / 2, 0, dimensions.depth / 2 - jointWidth / 2 + frontOffset]}
          args={[jointWidth + protrusion, dimensions.height, jointWidth + protrusion]}
          castShadow={false}
        >
          <primitive object={jointStripeMaterial} attach="material" />
        </Box>
      );
    }

    return elements;
  }, [dimensions, jointStripeMaterial, jointOptions]);

  // Если материал не определен или стыки отключены, возвращаем null
  if (!jointStripeMaterial || !jointOptions?.enabled) {
    return null;
  }

  // Используем фрагмент для группировки стыков
  return <>{jointElements}</>;
};

export default JointStripes; 
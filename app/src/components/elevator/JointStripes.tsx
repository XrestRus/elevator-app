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
  jointOptions,
}) => {
  // Мемоизируем все объекты стыков для оптимизации
  const jointElements = useMemo(() => {
    // Если материал не определен или стыки отключены, возвращаем пустой массив
    if (!jointStripeMaterial || !jointOptions?.enabled) {
      return [];
    }

    // Получаем коэффициент качества из параметров, по умолчанию 1 (высокое качество)
    const qualityFactor = jointOptions.qualityFactor ?? 1;

    // Толщина стыка - из настроек, преобразованная из мм в метры
    const jointWidth = (jointOptions.width || 4) / 100;

    // Выступ стыков - из настроек, преобразованный из мм в метры
    // Уменьшаем выступ для низкого качества
    const protrusion = ((jointOptions.protrusion || 3) / 1000) * qualityFactor;

    const elements: React.ReactElement[] = [];

    // Вертикальные стыки между стенами
    // Стык между задней стеной и левой боковой
    elements.push(
      <Box
        key="joint-back-left"
        position={[
          -dimensions.width / 2 + jointWidth / 2,
          0,
          -dimensions.depth / 2 + jointWidth / 2,
        ]}
        args={[
          jointWidth + protrusion,
          dimensions.height,
          jointWidth + protrusion,
        ]}
        castShadow={false}
      >
        <primitive object={jointStripeMaterial} attach="material" />
      </Box>
    );

    // Стык между задней стеной и правой боковой
    elements.push(
      <Box
        key="joint-back-right"
        position={[
          dimensions.width / 2 - jointWidth / 2,
          0,
          -dimensions.depth / 2 + jointWidth / 2,
        ]}
        args={[
          jointWidth + protrusion,
          dimensions.height,
          jointWidth + protrusion,
        ]}
        castShadow={false}
      >
        <primitive object={jointStripeMaterial} attach="material" />
      </Box>
    );

    // Стык между левой боковой и передней стенками
    elements.push(
      <Box
        key="joint-front-left"
        position={[
          -dimensions.width / 2 + jointWidth / 2,
          0,
          dimensions.depth / 2 - (jointWidth * 1),
        ]}
        args={[
          jointWidth + protrusion,
          dimensions.height,
          jointWidth + protrusion,
        ]}
        castShadow={false}
      >
        <primitive object={jointStripeMaterial} attach="material" />
      </Box>
    );

    // Стык между правой боковой и передней стенками
    elements.push(
      <Box
        key="joint-front-right"
        position={[
          dimensions.width / 2 - jointWidth / 2,
          0,
          dimensions.depth / 2 - (jointWidth * 1),
        ]}
        args={[
          jointWidth + protrusion,
          dimensions.height,
          jointWidth + protrusion,
        ]}
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
        position={[
          -dimensions.width / 2 + jointWidth / 2,
          -dimensions.height / 2 + jointWidth / 2,
          0,
        ]}
        args={[
          jointWidth + protrusion,
          jointWidth + protrusion,
          dimensions.depth + 0.01,
        ]}
        castShadow={false}
      >
        <primitive object={jointStripeMaterial} attach="material" />
      </Box>
    );

    // Стык между правой стеной и полом
    elements.push(
      <Box
        key="joint-right-floor"
        position={[
          dimensions.width / 2 - jointWidth / 2,
          -dimensions.height / 2 + jointWidth / 2,
          0,
        ]}
        args={[
          jointWidth + protrusion,
          jointWidth + protrusion,
          dimensions.depth + 0.01,
        ]}
        castShadow={false}
      >
        <primitive object={jointStripeMaterial} attach="material" />
      </Box>
    );

    // Стык между задней стеной и полом
    elements.push(
      <Box
        key="joint-back-floor"
        position={[
          0,
          -dimensions.height / 2 + jointWidth / 2,
          -dimensions.depth / 2 + jointWidth / 2,
        ]}
        args={[
          dimensions.width + protrusion,
          jointWidth + protrusion,
          jointWidth + protrusion,
        ]}
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
        position={[
          -dimensions.width / 5,
          -dimensions.height / 2 + jointWidth / 2,
          dimensions.depth / 2.02 - jointWidth / 2,
        ]}
        args={[
          dimensions.width / 2.5,
          jointWidth + protrusion,
          jointWidth + protrusion,
        ]}
        castShadow={false}
      >
        <primitive object={jointStripeMaterial} attach="material" />
      </Box>
    );

    // Правая часть стыка передней стены
    elements.push(
      <Box
        key="joint-front-floor-right"
        position={[
          dimensions.width / 5,
          -dimensions.height / 2 + jointWidth / 2,
          dimensions.depth / 2.02 - jointWidth / 2,
        ]}
        args={[
          dimensions.width / 2.5,
          jointWidth + protrusion,
          jointWidth + protrusion,
        ]}
        castShadow={false}
      >
        <primitive object={jointStripeMaterial} attach="material" />
      </Box>
    );

    // Стык между левой стеной и потолком
    elements.push(
      <Box
        key="joint-left-ceiling"
        position={[
          -dimensions.width / 2 + jointWidth / 2,
          dimensions.height / 2 - jointWidth / 2,
          0,
        ]}
        args={[
          jointWidth + protrusion,
          jointWidth + protrusion,
          dimensions.depth + 0.01,
        ]}
        castShadow={false}
      >
        <primitive object={jointStripeMaterial} attach="material" />
      </Box>
    );

    // Стык между правой стеной и потолком
    elements.push(
      <Box
        key="joint-right-ceiling"
        position={[
          dimensions.width / 2 - jointWidth / 2,
          dimensions.height / 2 - jointWidth / 2,
          0,
        ]}
        args={[
          jointWidth + protrusion,
          jointWidth + protrusion,
          dimensions.depth + 0.01,
        ]}
        castShadow={false}
      >
        <primitive object={jointStripeMaterial} attach="material" />
      </Box>
    );

    // Стык между задней стеной и потолком
    elements.push(
      <Box
        key="joint-back-ceiling"
        position={[
          0,
          dimensions.height / 2 - jointWidth / 2,
          -dimensions.depth / 2 + jointWidth / 2,
        ]}
        args={[
          dimensions.width + protrusion,
          jointWidth + protrusion,
          jointWidth + protrusion,
        ]}
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
        position={[
          -dimensions.width / 6,
          dimensions.height / 2 - jointWidth / 2,
          dimensions.depth / 2.02 - jointWidth / 2,
        ]}
        args={[
          dimensions.width / 1.5,
          jointWidth + protrusion,
          jointWidth + protrusion,
        ]}
        castShadow={false}
      >
        <primitive object={jointStripeMaterial} attach="material" />
      </Box>
    );

    // Правая часть стыка передней стены
    elements.push(
      <Box
        key="joint-front-ceiling-right"
        position={[
          dimensions.width / 6,
          dimensions.height / 2 - jointWidth / 2,
          dimensions.depth / 2.02 - jointWidth / 2,
        ]}
        args={[
          dimensions.width / 1.5,
          jointWidth + protrusion,
          jointWidth + protrusion,
        ]}
        castShadow={false}
      >
        <primitive object={jointStripeMaterial} attach="material" />
      </Box>
    );

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

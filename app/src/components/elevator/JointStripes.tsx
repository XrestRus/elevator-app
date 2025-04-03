import React from "react";
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
 * Компонент для отображения стыков между стенами лифта
 */
const JointStripes: React.FC<JointStripesProps> = ({
  dimensions,
  jointStripeMaterial,
  jointOptions
}) => {
  if (!jointStripeMaterial || !jointOptions?.enabled) {
    return null;
  }

  // Толщина стыка - из настроек, преобразованная из мм в метры
  const jointWidth = (jointOptions.width || 4) / 100;
  
  // Выступ стыков - из настроек, преобразованный из мм в метры
  const protrusion = (jointOptions.protrusion || 3) / 1000;
  
  // Добавляем выступ на передний край стыков для лучшей видимости
  const frontOffset = 0.002; // Базовый выступ 2 мм + настраиваемый выступ

  return (
    <>
      {/* Вертикальные стыки между стенами */}
      
      {/* Стык между задней стеной и левой боковой */}
      <Box
        position={[-dimensions.width / 2 + jointWidth / 2, 0, -dimensions.depth / 2 + jointWidth / 2]}
        args={[jointWidth + protrusion, dimensions.height, jointWidth + protrusion]}
        castShadow
      >
        <primitive object={jointStripeMaterial} attach="material" />
      </Box>

      {/* Стык между задней стеной и правой боковой */}
      <Box
        position={[dimensions.width / 2 - jointWidth / 2, 0, -dimensions.depth / 2 + jointWidth / 2]}
        args={[jointWidth + protrusion, dimensions.height, jointWidth + protrusion]}
        castShadow
      >
        <primitive object={jointStripeMaterial} attach="material" />
      </Box>

      {/* Стык между левой боковой и передней стенками */}
      <Box
        position={[-dimensions.width / 2 + jointWidth / 2, 0, dimensions.depth / 2 - jointWidth / 2 + frontOffset]}
        args={[jointWidth + protrusion, dimensions.height, jointWidth + protrusion]}
        castShadow
      >
        <primitive object={jointStripeMaterial} attach="material" />
      </Box>

      {/* Стык между правой боковой и передней стенками */}
      <Box
        position={[dimensions.width / 2 - jointWidth / 2, 0, dimensions.depth / 2 - jointWidth / 2 + frontOffset]}
        args={[jointWidth + protrusion, dimensions.height, jointWidth + protrusion]}
        castShadow
      >
        <primitive object={jointStripeMaterial} attach="material" />
      </Box>

      {/* Горизонтальные стыки между стенами и полом/потолком */}
      
      {/* Стык между левой стеной и полом */}
      <Box
        position={[-dimensions.width / 2 + jointWidth / 2, -dimensions.height / 2 + jointWidth / 2, 0]}
        args={[jointWidth + protrusion, jointWidth + protrusion, dimensions.depth + 0.01]}
        castShadow
      >
        <primitive object={jointStripeMaterial} attach="material" />
      </Box>

      {/* Стык между правой стеной и полом */}
      <Box
        position={[dimensions.width / 2 - jointWidth / 2, -dimensions.height / 2 + jointWidth / 2, 0]}
        args={[jointWidth + protrusion, jointWidth + protrusion, dimensions.depth + 0.01]}
        castShadow
      >
        <primitive object={jointStripeMaterial} attach="material" />
      </Box>

      {/* Стык между задней стеной и полом */}
      <Box
        position={[0, -dimensions.height / 2 + jointWidth / 2, -dimensions.depth / 2 + jointWidth / 2]}
        args={[dimensions.width + protrusion, jointWidth + protrusion, jointWidth + protrusion]}
        castShadow
      >
        <primitive object={jointStripeMaterial} attach="material" />
      </Box>

      {/* Стык между передней стеной и полом (исключая пространство для дверей) */}
      {/* Левая часть стыка передней стены */}
      <Box
        position={[-dimensions.width / 4 - 0.1, -dimensions.height / 2 + jointWidth / 2, dimensions.depth / 2 - jointWidth / 2]}
        args={[dimensions.width / 2 - 0.2, jointWidth + protrusion, jointWidth + protrusion]}
        castShadow
      >
        <primitive object={jointStripeMaterial} attach="material" />
      </Box>
      
      {/* Правая часть стыка передней стены */}
      <Box
        position={[dimensions.width / 4 + 0.1, -dimensions.height / 2 + jointWidth / 2, dimensions.depth / 2 - jointWidth / 2]}
        args={[dimensions.width / 2 - 0.2, jointWidth + protrusion, jointWidth + protrusion]}
        castShadow
      >
        <primitive object={jointStripeMaterial} attach="material" />
      </Box>
      
      {/* Стык под дверями (центральная часть) */}
      <Box
        position={[0, -dimensions.height / 2 + jointWidth / 2, dimensions.depth / 2 - jointWidth / 2 + frontOffset]}
        args={[0.4, jointWidth + protrusion, jointWidth + protrusion]}
        castShadow
      >
        <primitive object={jointStripeMaterial} attach="material" />
      </Box>

      {/* Стык между левой стеной и потолком */}
      <Box
        position={[-dimensions.width / 2 + jointWidth / 2, dimensions.height / 2 - jointWidth / 2, 0]}
        args={[jointWidth + protrusion, jointWidth + protrusion, dimensions.depth + 0.01]}
        castShadow
      >
        <primitive object={jointStripeMaterial} attach="material" />
      </Box>

      {/* Стык между правой стеной и потолком */}
      <Box
        position={[dimensions.width / 2 - jointWidth / 2, dimensions.height / 2 - jointWidth / 2, 0]}
        args={[jointWidth + protrusion, jointWidth + protrusion, dimensions.depth + 0.01]}
        castShadow
      >
        <primitive object={jointStripeMaterial} attach="material" />
      </Box>

      {/* Стык между задней стеной и потолком */}
      <Box
        position={[0, dimensions.height / 2 - jointWidth / 2, -dimensions.depth / 2 + jointWidth / 2]}
        args={[dimensions.width + protrusion, jointWidth + protrusion, jointWidth + protrusion]}
        castShadow
      >
        <primitive object={jointStripeMaterial} attach="material" />
      </Box>

      {/* Стык между передней стеной и потолком (исключая пространство для дверей) */}
      {/* Левая часть стыка передней стены */}
      <Box
        position={[-dimensions.width / 4 - 0.1, dimensions.height / 2 - jointWidth / 2, dimensions.depth / 2 - jointWidth / 2]}
        args={[dimensions.width / 2 - 0.2, jointWidth + protrusion, jointWidth + protrusion]}
        castShadow
      >
        <primitive object={jointStripeMaterial} attach="material" />
      </Box>
      
      {/* Правая часть стыка передней стены */}
      <Box
        position={[dimensions.width / 4 + 0.1, dimensions.height / 2 - jointWidth / 2, dimensions.depth / 2 - jointWidth / 2]}
        args={[dimensions.width / 2 - 0.2, jointWidth + protrusion, jointWidth + protrusion]}
        castShadow
      >
        <primitive object={jointStripeMaterial} attach="material" />
      </Box>
      
      {/* Стык над дверями (центральная часть) */}
      <Box
        position={[0, dimensions.height / 2 - jointWidth / 2, dimensions.depth / 2 - jointWidth / 2 + frontOffset]}
        args={[0.4, jointWidth + protrusion, jointWidth + protrusion]}
        castShadow
      >
        <primitive object={jointStripeMaterial} attach="material" />
      </Box>
      
      {/* Вертикальные стыки по краям дверного проема */}
      {/* Левый */}
      <Box
        position={[-0.65, 0, dimensions.depth / 2 - jointWidth / 2 + frontOffset]}
        args={[jointWidth + protrusion, dimensions.height, jointWidth + protrusion]}
        castShadow
      >
        <primitive object={jointStripeMaterial} attach="material" />
      </Box>
      
      {/* Правый */}
      <Box
        position={[0.65, 0, dimensions.depth / 2 - jointWidth / 2 + frontOffset]}
        args={[jointWidth + protrusion, dimensions.height, jointWidth + protrusion]}
        castShadow
      >
        <primitive object={jointStripeMaterial} attach="material" />
      </Box>
    </>
  );
};

export default JointStripes; 
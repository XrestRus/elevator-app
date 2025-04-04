import React from "react";
import { Box } from "@react-three/drei";
import * as THREE from "three";
import MakeHoverable from "../ui/makeHoverable";
import colorUtils from "../../utils/colorUtils";

/**
 * Свойства компонента потолка лифта
 */
interface ElevatorCeilingProps {
  dimensions: {
    width: number;
    height: number;
    depth: number;
  };
  ceilingMaterial: THREE.Material;
}

/**
 * Компонент для отображения потолка лифта с зазором по бокам для эффекта 3D
 */
const ElevatorCeiling: React.FC<ElevatorCeilingProps> = ({
  dimensions,
  ceilingMaterial,
}) => {
  // Получаем цвет материала потолка для отображения в тултипе
  const getCeilingColor = () => colorUtils.getMaterialColor(ceilingMaterial);
  
  // Рассчитываем размеры потолка с зазором по бокам
  const gapSize = 0.06; // Размер зазора по краям (6 см)
  const ceilingWidth = dimensions.width - gapSize * 2;
  const ceilingDepth = dimensions.depth - gapSize * 2;
  const ceilingThickness = 0.08; // Увеличиваем толщину потолка для более выраженного эффекта
  
  // Создаем материал для верхнего потолка (полностью закрывающий шахту)
  const topCeilingMaterial = new THREE.MeshStandardMaterial({
    color: "#F0F0F0", // Чуть светлее основного потолка
    roughness: 0.3,
    metalness: 0.1,
  });
  
  // Создаем материал для черных боковых элементов
  const blackSideMaterial = new THREE.MeshStandardMaterial({
    color: "#7b7b7b", 
  });
  
  // Компонент потолка
  const Ceiling = (
    <>
      {/* Основной подвесной потолок */}
      <Box
        position={[0, dimensions.height / 2 - ceilingThickness / 2, 0]}
        args={[ceilingWidth, ceilingThickness, ceilingDepth]}
        receiveShadow
      >
        <primitive object={ceilingMaterial} attach="material" />
      </Box>
      
      {/* Закрывающий верхний потолок */}
      <Box
        position={[0, dimensions.height / 2 + 0.02, 0]}
        args={[dimensions.width, 0.04, dimensions.depth]}
        receiveShadow
      >
        <primitive object={topCeilingMaterial} attach="material" />
      </Box>
      
      {/* Черная вглубленная область по правой стороне */}
      <Box
        position={[dimensions.width/2 - gapSize/2, dimensions.height/2 - 0.01, 0]}
        args={[gapSize, dimensions.height * 0.05, dimensions.depth]}
        receiveShadow
      >
        <primitive object={blackSideMaterial} attach="material" />
      </Box>
      
      {/* Черная вглубленная область по левой стороне */}
      <Box
        position={[-dimensions.width/2 + gapSize/2, dimensions.height/2 - 0.01, 0]}
        args={[gapSize, dimensions.height * 0.05, dimensions.depth]}
        receiveShadow
      >
        <primitive object={blackSideMaterial} attach="material" />
      </Box>
      
      {/* Черная вглубленная область по передней стороне */}
      <Box
        position={[0, dimensions.height/2 - 0.01, dimensions.depth/2 - gapSize/2]}
        args={[dimensions.width, dimensions.height * 0.05, gapSize]}
        receiveShadow
      >
        <primitive object={blackSideMaterial} attach="material" />
      </Box>
      
      {/* Черная вглубленная область по задней стороне */}
      <Box
        position={[0, dimensions.height/2 - 0.01, -dimensions.depth/2 + gapSize/2]}
        args={[dimensions.width, dimensions.height * 0.05, gapSize]}
        receiveShadow
      >
        <primitive object={blackSideMaterial} attach="material" />
      </Box>
      
      {/* Темные вставки в углах - фронт-правый */}
      <Box
        position={[dimensions.width/2 - gapSize/2, dimensions.height/2 - 0.01, dimensions.depth/2 - gapSize/2]}
        args={[gapSize, dimensions.height * 0.05, gapSize]}
        receiveShadow
      >
        <primitive object={blackSideMaterial} attach="material" />
      </Box>
      
      {/* Темные вставки в углах - фронт-левый */}
      <Box
        position={[-dimensions.width/2 + gapSize/2, dimensions.height/2 - 0.01, dimensions.depth/2 - gapSize/2]}
        args={[gapSize, dimensions.height * 0.05, gapSize]}
        receiveShadow
      >
        <primitive object={blackSideMaterial} attach="material" />
      </Box>
      
      {/* Темные вставки в углах - тыл-правый */}
      <Box
        position={[dimensions.width/2 - gapSize/2, dimensions.height/2 - 0.01, -dimensions.depth/2 + gapSize/2]}
        args={[gapSize, dimensions.height * 0.05, gapSize]}
        receiveShadow
      >
        <primitive object={blackSideMaterial} attach="material" />
      </Box>
      
      {/* Темные вставки в углах - тыл-левый */}
      <Box
        position={[-dimensions.width/2 + gapSize/2, dimensions.height/2 - 0.01, -dimensions.depth/2 + gapSize/2]}
        args={[gapSize, dimensions.height * 0.05, gapSize]}
        receiveShadow
      >
        <primitive object={blackSideMaterial} attach="material" />
      </Box>
    </>
  );
  
  return (
    <MakeHoverable
      name="Потолок лифта"
      type="Элемент конструкции"
      description="Верхняя поверхность лифта, на которой расположены светильники"
      material="Материал потолка"
      dimensions={{
        width: ceilingWidth,
        height: ceilingThickness,
        depth: ceilingDepth
      }}
      additionalInfo={{
        color: getCeilingColor(),
        texture: "Матовая поверхность со встроенным освещением",
        "Особенность": "Подвесной потолок с зазором по периметру"
      }}
      requiresDoubleClick={false}
    >
      {Ceiling}
    </MakeHoverable>
  );
};

export default ElevatorCeiling; 
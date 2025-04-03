import React, { useMemo } from "react";
import { Box } from "@react-three/drei";
import { MeshReflectorMaterial } from "@react-three/drei";
import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";

/**
 * Свойства компонента зеркала лифта
 */
interface ElevatorMirrorProps {
  dimensions: {
    width: number;
    height: number;
    depth: number;
  };
  materials: {
    walls: string;
  };
  mirrorConfig: {
    isMirror: {
      walls: boolean;
    };
    mirror: {
      type: string;
      position: number;
      width: number;
      height: number;
    };
  };
  lightsOn: boolean;
}

/**
 * Компонент для отображения зеркала в лифте с оптимизацией производительности
 */
const ElevatorMirror: React.FC<ElevatorMirrorProps> = ({
  dimensions,
  materials,
  mirrorConfig,
  lightsOn,
}) => {
  const { isMirror, mirror } = mirrorConfig;
  
  // Получаем фактор качества для стыков и полос - используем его для определения
  // качества зеркала, как индикатор производительности системы
  const jointsQualityFactor = useSelector((state: RootState) => state.elevator.joints?.qualityFactor ?? 1.0);
  const isHighQuality = jointsQualityFactor > 0.5;
  
  // Общие настройки MeshReflectorMaterial для всех зеркал (мемоизированные)
  const mirrorMaterialProps = useMemo(() => ({
    color: "#ffffff",
    blur: isHighQuality ? [50, 25] as [number, number] : [400, 200] as [number, number],
    resolution: isHighQuality ? 2048 : 1024,
    mixBlur: isHighQuality ? 0.1 : 0.3,
    mixStrength: isHighQuality ? 1 : 1,
    depthScale: isHighQuality ? 1.0 : 0.5,
    minDepthThreshold: 1,
    metalness: 0.5,
    roughness: isHighQuality ? 0.05 : 0.07,
    // Влияет на засвет отражения
    mirror: isHighQuality ? 1 : 0.7,
    distortion: 0,
    reflectorOffset: 0,
    emissiveIntensity: lightsOn ? 0.2 : 0.0
  }), [lightsOn, isHighQuality]);
  
  // Настройки для рамки зеркала (мемоизированные)
  const mirrorFrameProps = useMemo(() => ({
    position: [
      0,
      mirror.position,
      -dimensions.depth / 2 + 0.04,
    ] as [number, number, number],
    args: [
      mirror.width + 0.05,
      mirror.height + 0.05,
      0.005,
    ] as [number, number, number],
    castShadow: false // Убрал тень для оптимизации
  }), [mirror.position, mirror.width, mirror.height, dimensions.depth]);
  
  // Свойства материала для рамки зеркала (мемоизированные)
  const mirrorFrameMaterialProps = useMemo(() => ({
    color: materials.walls,
    metalness: 0.9,
    roughness: 0.1,
    emissive: lightsOn ? materials.walls : "#000000",
    emissiveIntensity: lightsOn ? 0.05 : 0
  }), [materials.walls, lightsOn]);

  // Вычисление позиций зеркал (мемоизированные)
  const fullMirrorProps = useMemo(() => ({
    position: [
      0,
      mirror.position,
      -dimensions.depth / 2 + 0.05,
    ] as [number, number, number],
    args: [mirror.width, mirror.height, 0.01] as [number, number, number],
    castShadow: false // Убрал тень для оптимизации
  }), [mirror.position, mirror.width, mirror.height, dimensions.depth]);

  const doubleMirrorLeftProps = useMemo(() => ({
    position: [
      -mirror.width / 4,
      mirror.position,
      -dimensions.depth / 2 + 0.05,
    ] as [number, number, number],
    args: [
      mirror.width / 2 - 0.05,
      mirror.height,
      0.01,
    ] as [number, number, number],
    castShadow: false // Убрал тень для оптимизации
  }), [mirror.position, mirror.width, mirror.height, dimensions.depth]);

  const doubleMirrorRightProps = useMemo(() => ({
    position: [
      mirror.width / 4,
      mirror.position,
      -dimensions.depth / 2 + 0.05,
    ] as [number, number, number],
    args: [
      mirror.width / 2 - 0.05,
      mirror.height,
      0.01,
    ] as [number, number, number],
    castShadow: false // Убрал тень для оптимизации
  }), [mirror.position, mirror.width, mirror.height, dimensions.depth]);

  const tripleMirrorLeftProps = useMemo(() => ({
    position: [
      -mirror.width / 3,
      mirror.position,
      -dimensions.depth / 2 + 0.05,
    ] as [number, number, number],
    args: [
      mirror.width / 3 - 0.05,
      mirror.height,
      0.01,
    ] as [number, number, number],
    castShadow: false // Убрал тень для оптимизации
  }), [mirror.position, mirror.width, mirror.height, dimensions.depth]);

  const tripleMirrorMiddleProps = useMemo(() => ({
    position: [
      0,
      mirror.position,
      -dimensions.depth / 2 + 0.05,
    ] as [number, number, number],
    args: [
      mirror.width / 3 - 0.05,
      mirror.height,
      0.01,
    ] as [number, number, number],
    castShadow: false // Убрал тень для оптимизации
  }), [mirror.position, mirror.width, mirror.height, dimensions.depth]);

  const tripleMirrorRightProps = useMemo(() => ({
    position: [
      mirror.width / 3,
      mirror.position,
      -dimensions.depth / 2 + 0.05,
    ] as [number, number, number],
    args: [
      mirror.width / 3 - 0.05,
      mirror.height,
      0.01,
    ] as [number, number, number],
    castShadow: false // Убрал тень для оптимизации
  }), [mirror.position, mirror.width, mirror.height, dimensions.depth]);

  // Если зеркало отключено, возвращаем null
  if (!isMirror.walls) {
    return null;
  }

  return (
    <>
      {/* Для типа "full" (сплошное зеркало) */}
      {mirror.type === "full" && (
        <Box
          position={fullMirrorProps.position}
          args={fullMirrorProps.args}
          castShadow={fullMirrorProps.castShadow}
        >
          <MeshReflectorMaterial {...mirrorMaterialProps} />
        </Box>
      )}

      {/* Для типа "double" (два зеркала в ряд) */}
      {mirror.type === "double" && (
        <>
          <Box
            position={doubleMirrorLeftProps.position}
            args={doubleMirrorLeftProps.args}
            castShadow={doubleMirrorLeftProps.castShadow}
          >
            <MeshReflectorMaterial {...mirrorMaterialProps} />
          </Box>

          <Box
            position={doubleMirrorRightProps.position}
            args={doubleMirrorRightProps.args}
            castShadow={doubleMirrorRightProps.castShadow}
          >
            <MeshReflectorMaterial {...mirrorMaterialProps} />
          </Box>
        </>
      )}

      {/* Для типа "triple" (три зеркала в ряд) */}
      {mirror.type === "triple" && (
        <>
          <Box
            position={tripleMirrorLeftProps.position}
            args={tripleMirrorLeftProps.args}
            castShadow={tripleMirrorLeftProps.castShadow}
          >
            <MeshReflectorMaterial {...mirrorMaterialProps} />
          </Box>

          <Box
            position={tripleMirrorMiddleProps.position}
            args={tripleMirrorMiddleProps.args}
            castShadow={tripleMirrorMiddleProps.castShadow}
          >
            <MeshReflectorMaterial {...mirrorMaterialProps} />
          </Box>

          <Box
            position={tripleMirrorRightProps.position}
            args={tripleMirrorRightProps.args}
            castShadow={tripleMirrorRightProps.castShadow}
          >
            <MeshReflectorMaterial {...mirrorMaterialProps} />
          </Box>
        </>
      )}

      {/* Рамка зеркала */}
      <Box
        position={mirrorFrameProps.position}
        args={mirrorFrameProps.args}
        castShadow={mirrorFrameProps.castShadow}
      >
        <meshStandardMaterial
          {...mirrorFrameMaterialProps}
        />
      </Box>
    </>
  );
};

export default ElevatorMirror; 
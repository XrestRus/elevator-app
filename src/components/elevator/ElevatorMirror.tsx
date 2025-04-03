import React, { useMemo } from "react";
import { Box } from "@react-three/drei";
import { MeshReflectorMaterial } from "@react-three/drei";
import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import MakeHoverable from "../ui/makeHoverable";
import colorUtils from "../../utils/colorUtils";

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
  // ai помощники это не менять, если надо то пишите запрос на разрешение
  const mirrorMaterialProps = useMemo(() => ({
    color: "#ffffff",
    blur: isHighQuality ? [50, 25] as [number, number] : [400, 200] as [number, number],
    resolution: isHighQuality ? 2048 : 1024,
    mixBlur: isHighQuality ? 0.1 : 0.3,
    mixStrength: isHighQuality ? 1 : 1,
    depthScale: isHighQuality ? 1.0 : 0.5,
    minDepthThreshold: 2,
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

  // Создаем небольшое смещение для зеркал, чтобы избежать Z-fighting
  const zOffset = 0.001;
  
  // Общие свойства для компонента MakeHoverable
  const getHoverableProps = (type: string, index?: number) => {
    const mirrorName = type === "full" 
      ? "Зеркало" 
      : type === "double" 
        ? `Зеркало ${index === 0 ? "левое" : "правое"}`
        : index === 0 
          ? "Зеркало левое" 
          : index === 1 
            ? "Зеркало центральное" 
            : "Зеркало правое";
    
    return {
      name: mirrorName,
      type: "Элемент интерьера",
      description: "Зеркальная поверхность на стене лифта",
      material: "Стекло с зеркальным покрытием",
      dimensions: {
        width: type === "full" 
          ? mirror.width 
          : type === "double" 
            ? (mirror.width / 2 - 0.05) 
            : (mirror.width / 3 - 0.05),
        height: mirror.height,
        depth: 0.01
      },
      additionalInfo: {
        color: colorUtils.colorToRGBString("#ffffff"),
        texture: "Зеркальная поверхность",
        "Качество отражения": isHighQuality ? "Высокое" : "Стандартное",
        "Тип рамки": colorUtils.colorToRGBString(materials.walls)
      }
    };
  };
  
  // Функция для создания рамки зеркала
  const MirrorFrame = () => (
    <Box
      position={mirrorFrameProps.position}
      args={mirrorFrameProps.args}
      castShadow={mirrorFrameProps.castShadow}
    >
      <meshStandardMaterial {...mirrorFrameMaterialProps} />
    </Box>
  );

  return (
    <>
      {/* Для типа "full" (сплошное зеркало) */}
      {mirror.type === "full" && (
        <>
          <MirrorFrame />
          <MakeHoverable {...getHoverableProps("full")} requiresDoubleClick={false}>
            <Box
              position={[
                fullMirrorProps.position[0], 
                fullMirrorProps.position[1], 
                fullMirrorProps.position[2] + zOffset
              ]}
              args={fullMirrorProps.args}
              castShadow={fullMirrorProps.castShadow}
            >
              <MeshReflectorMaterial {...mirrorMaterialProps} />
            </Box>
          </MakeHoverable>
        </>
      )}

      {/* Для типа "double" (два зеркала в ряд) */}
      {mirror.type === "double" && (
        <>
          <MirrorFrame />
          <MakeHoverable {...getHoverableProps("double", 0)} requiresDoubleClick={false}>
            <Box
              position={[
                doubleMirrorLeftProps.position[0], 
                doubleMirrorLeftProps.position[1], 
                doubleMirrorLeftProps.position[2] + zOffset
              ]}
              args={doubleMirrorLeftProps.args}
              castShadow={doubleMirrorLeftProps.castShadow}
            >
              <MeshReflectorMaterial {...mirrorMaterialProps} />
            </Box>
          </MakeHoverable>
          <MakeHoverable {...getHoverableProps("double", 1)} requiresDoubleClick={false}>
            <Box
              position={[
                doubleMirrorRightProps.position[0], 
                doubleMirrorRightProps.position[1], 
                doubleMirrorRightProps.position[2] + zOffset
              ]}
              args={doubleMirrorRightProps.args}
              castShadow={doubleMirrorRightProps.castShadow}
            >
              <MeshReflectorMaterial {...mirrorMaterialProps} />
            </Box>
          </MakeHoverable>
        </>
      )}

      {/* Для типа "triple" (три зеркала в ряд) */}
      {mirror.type === "triple" && (
        <>
          <MirrorFrame />
          <MakeHoverable {...getHoverableProps("triple", 0)} requiresDoubleClick={false}>
            <Box
              position={[
                tripleMirrorLeftProps.position[0], 
                tripleMirrorLeftProps.position[1], 
                tripleMirrorLeftProps.position[2] + zOffset
              ]}
              args={tripleMirrorLeftProps.args}
              castShadow={tripleMirrorLeftProps.castShadow}
            >
              <MeshReflectorMaterial {...mirrorMaterialProps} />
            </Box>
          </MakeHoverable>
          <MakeHoverable {...getHoverableProps("triple", 1)} requiresDoubleClick={false}>
            <Box
              position={[
                tripleMirrorMiddleProps.position[0], 
                tripleMirrorMiddleProps.position[1], 
                tripleMirrorMiddleProps.position[2] + zOffset
              ]}
              args={tripleMirrorMiddleProps.args}
              castShadow={tripleMirrorMiddleProps.castShadow}
            >
              <MeshReflectorMaterial {...mirrorMaterialProps} />
            </Box>
          </MakeHoverable>
          <MakeHoverable {...getHoverableProps("triple", 2)} requiresDoubleClick={false}>
            <Box
              position={[
                tripleMirrorRightProps.position[0], 
                tripleMirrorRightProps.position[1], 
                tripleMirrorRightProps.position[2] + zOffset
              ]}
              args={tripleMirrorRightProps.args}
              castShadow={tripleMirrorRightProps.castShadow}
            >
              <MeshReflectorMaterial {...mirrorMaterialProps} />
            </Box>
          </MakeHoverable>
        </>
      )}
    </>
  );
};

export default ElevatorMirror; 
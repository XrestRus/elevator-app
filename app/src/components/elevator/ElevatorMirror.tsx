import React from "react";
import { Box } from "@react-three/drei";
import { MeshReflectorMaterial } from "@react-three/drei";

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
 * Компонент для отображения зеркала в лифте
 */
const ElevatorMirror: React.FC<ElevatorMirrorProps> = ({
  dimensions,
  materials,
  mirrorConfig,
  lightsOn,
}) => {
  const { isMirror, mirror } = mirrorConfig;

  if (!isMirror.walls) {
    return null;
  }

  return (
    <>
      {/* Для типа "full" (сплошное зеркало) */}
      {mirror.type === "full" && (
        <Box
          position={[
            0,
            mirror.position,
            -dimensions.depth / 2 + 0.05, // Увеличил отступ зеркала от стены
          ]}
          args={[mirror.width, mirror.height, 0.01]}
          castShadow
        >
          <MeshReflectorMaterial
            color={"#ffffff"}
            blur={[50, 25]} // Меньшее размытие для более четкого отражения
            resolution={2048} // Увеличил разрешение для качества
            mixBlur={0.0} // Минимальное смешивание размытия
            mixStrength={1.0} // Усилил интенсивность отражения
            metalness={0.5} // Максимальная металличность
            roughness={0.05} // Минимальная шероховатость для зеркального отражения
            mirror={1.0} // Максимальное отражение
            emissiveIntensity={lightsOn ? 0.2 : 0.0} // Интенсивность свечения
          />
        </Box>
      )}

      {/* Для типа "double" (два зеркала в ряд) */}
      {mirror.type === "double" && (
        <>
          <Box
            position={[
              -mirror.width / 4,
              mirror.position,
              -dimensions.depth / 2 + 0.05, // Увеличил отступ зеркала от стены
            ]}
            args={[
              mirror.width / 2 - 0.05,
              mirror.height,
              0.01,
            ]}
            castShadow
          >
            <MeshReflectorMaterial
              color={"#ffffff"}
              blur={[50, 25]}
              resolution={2048}
              mixBlur={0.0}
              mixStrength={1.0}
              metalness={0.5}
              roughness={0.05}
              mirror={1.0}
              emissiveIntensity={lightsOn ? 0.2 : 0.0}
            />
          </Box>

          <Box
            position={[
              mirror.width / 4,
              mirror.position,
              -dimensions.depth / 2 + 0.05, // Увеличил отступ зеркала от стены
            ]}
            args={[
              mirror.width / 2 - 0.05,
              mirror.height,
              0.01,
            ]}
            castShadow
          >
            <MeshReflectorMaterial
              color={"#ffffff"}
              blur={[50, 25]}
              resolution={2048}
              mixBlur={0.0}
              mixStrength={1.0}
              metalness={0.5}
              roughness={0.05}
              mirror={1.0}
              emissiveIntensity={lightsOn ? 0.2 : 0.0}
            />
          </Box>
        </>
      )}

      {/* Для типа "triple" (три зеркала в ряд) */}
      {mirror.type === "triple" && (
        <>
          <Box
            position={[
              -mirror.width / 3,
              mirror.position,
              -dimensions.depth / 2 + 0.05, // Увеличил отступ зеркала от стены
            ]}
            args={[
              mirror.width / 3 - 0.05,
              mirror.height,
              0.01,
            ]}
            castShadow
          >
            <MeshReflectorMaterial
              color={"#ffffff"}
              blur={[50, 25]}
              resolution={2048}
              mixBlur={0.0}
              mixStrength={1.0}
              metalness={0.5}
              roughness={0.05}
              mirror={1.0}
              emissiveIntensity={lightsOn ? 0.2 : 0.0}
            />
          </Box>

          <Box
            position={[
              0,
              mirror.position,
              -dimensions.depth / 2 + 0.05, // Увеличил отступ зеркала от стены
            ]}
            args={[
              mirror.width / 3 - 0.05,
              mirror.height,
              0.01,
            ]}
            castShadow
          >
            <MeshReflectorMaterial
              color={"#ffffff"}
              blur={[50, 25]}
              resolution={2048}
              mixBlur={0.0}
              mixStrength={1.0}
              metalness={0.5}
              roughness={0.05}
              mirror={1.0}
              emissiveIntensity={lightsOn ? 0.2 : 0.0}
            />
          </Box>

          <Box
            position={[
              mirror.width / 3,
              mirror.position,
              -dimensions.depth / 2 + 0.05, // Увеличил отступ зеркала от стены
            ]}
            args={[
              mirror.width / 3 - 0.05,
              mirror.height,
              0.01,
            ]}
            castShadow
          >
            <MeshReflectorMaterial
              color={"#ffffff"}
              blur={[50, 25]}
              resolution={2048}
              mixBlur={0.0}
              mixStrength={1.0}
              metalness={0.5}
              roughness={0.05}
              mirror={1.0}
              emissiveIntensity={lightsOn ? 0.2 : 0.0}
            />
          </Box>
        </>
      )}

      {/* Рамка зеркала */}
      <Box
        position={[
          0,
          mirror.position,
          -dimensions.depth / 2 + 0.04, // Увеличил отступ рамки от стены
        ]}
        args={[
          mirror.width + 0.05,
          mirror.height + 0.05,
          0.005,
        ]}
        castShadow
      >
        <meshStandardMaterial
          color={materials.walls}
          metalness={0.9}
          roughness={0.1}
          emissive={lightsOn ? materials.walls : "#000000"}
          emissiveIntensity={lightsOn ? 0.05 : 0}
        />
      </Box>
    </>
  );
};

export default ElevatorMirror; 
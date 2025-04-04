import React, { useEffect, useRef } from "react";
import { useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useSelector } from "react-redux";
import * as THREE from "three";
import type { RootState } from "../../store/store";
import FreeCameraController from "./FreeCameraController";

/**
 * Компонент для динамического управления камерой и переключения между режимами камеры
 */
const CameraController: React.FC = () => {
  const { camera, invalidate } = useThree();
  const cameraSettings = useSelector(
    (state: RootState) => state.elevator.camera
  );
  const dimensions = useSelector(
    (state: RootState) => state.elevator.dimensions
  );

  // Референс для контроллеров
  const orbitControlsRef = useRef(null);

  // Применяем настройки камеры при изменении
  useEffect(() => {
    // Проверяем, что камера это PerspectiveCamera, у которой есть свойство fov
    if (camera instanceof THREE.PerspectiveCamera) {
      camera.fov = cameraSettings.fov;
      camera.updateProjectionMatrix(); // Важно вызвать это для применения изменений
    }
  }, [camera, cameraSettings.fov]);

  // Изменяем позицию камеры при переключении режима
  useEffect(() => {
    const cameraHeight = cameraSettings.cameraHeight ?? 0.2;
    camera.position.set(0, cameraHeight, 0);
    camera.lookAt(0, cameraHeight ?? 0.2, 2);

    // Принудительно обновляем рендер при переключении режима камеры
    invalidate();
  }, [
    camera,
    cameraSettings.freeCamera,
    cameraSettings.cameraHeight,
    dimensions.height,
    dimensions.depth,
    invalidate,
  ]);

  return (
    <>
      {cameraSettings.freeCamera ? (
        <FreeCameraController />
      ) : (
        <OrbitControls
          ref={orbitControlsRef}
          enablePan={false}
          enableZoom={false}
          target={[0, cameraSettings.cameraHeight ?? 0.2, 0.2]}
          minPolarAngle={Math.PI / 10}
          maxPolarAngle={(Math.PI * 9) / 10}
          rotateSpeed={1.5}
          enableDamping={true}
          dampingFactor={0.1}
        />
      )}
    </>
  );
};

export default CameraController;

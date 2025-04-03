import React, { useEffect, useRef } from 'react';
import { useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useSelector, useDispatch } from 'react-redux';
import * as THREE from 'three';
import type { RootState } from '../../store/store';
import { setCamera } from '../../store/elevatorSlice';
import FreeCameraController from './FreeCameraController';

/**
 * Компонент для динамического управления камерой и переключения между режимами камеры
 */
const CameraController: React.FC = () => {
  const { camera, invalidate } = useThree();
  const cameraSettings = useSelector((state: RootState) => state.elevator.camera);
  const dimensions = useSelector((state: RootState) => state.elevator.dimensions);
  const dispatch = useDispatch();
  
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
    if (cameraSettings.freeCamera) {
      // =====================================
      // НАЧАЛО БЛОКА ДЛЯ РЕДАКТИРОВАНИЯ ПОЗИЦИИ КАМЕРЫ В РЕЖИМЕ СВОБОДНОГО ПОЛЕТА
      // =====================================
      // Здесь можно изменить начальную позицию камеры в режиме свободного полета
      // Формат: camera.position.set(X, Y, Z);
      // X - влево/вправо, Y - вверх/вниз, Z - вперед/назад
      camera.position.set(0, dimensions.height * 0.8 - 0.8, dimensions.depth * 0.3); // На уровне глаз человека, немного сдвинуто вперед
      
      // Направляем камеру внутрь лифта
      camera.lookAt(0, dimensions.height * 0.8 - 0.8, -dimensions.depth);
      // =====================================
      // КОНЕЦ БЛОКА ДЛЯ РЕДАКТИРОВАНИЯ
      // =====================================
      
      // Автоматически фокусируемся на Canvas элементе
      setTimeout(() => {
        const canvasElement = document.querySelector('canvas');
        if (canvasElement) {
          canvasElement.focus();
        }
      }, 100);
    } else {
      // =====================================
      // НАЧАЛО БЛОКА ДЛЯ РЕДАКТИРОВАНИЯ ПОЗИЦИИ КАМЕРЫ В ОБЫЧНОМ РЕЖИМЕ
      // =====================================
      // Здесь можно изменить начальную позицию камеры в обычном режиме
      // Формат: camera.position.set(X, Y, Z);
      // X - влево/вправо, Y - вверх/вниз, Z - вперед/назад
      const cameraHeight = cameraSettings.cameraHeight ?? 1.2; // Используем значение из Redux
      camera.position.set(0, cameraHeight, 0); // Высота из настроек
      // Направление взгляда сохраняется автоматически
      // =====================================
      // КОНЕЦ БЛОКА ДЛЯ РЕДАКТИРОВАНИЯ
      // =====================================
    }
    
    // Принудительно обновляем рендер при переключении режима камеры
    invalidate();
  }, [camera, cameraSettings.freeCamera, cameraSettings.cameraHeight, dimensions.height, dimensions.depth, invalidate]);
  
  // Обновляем высоту камеры при изменении высоты лифта только в режиме свободного полета
  useEffect(() => {
    if (cameraSettings.freeCamera) {
      // Сохраняем X и Z координаты, меняем только Y
      const x = camera.position.x;
      const z = camera.position.z;
      camera.position.set(x, dimensions.height * 0.8 - 0.8, z);
      invalidate(); // Принудительно обновляем рендер
    }
  }, [camera, dimensions.height, cameraSettings.freeCamera, invalidate]);
  
  // Отслеживаем изменение позиции камеры и обеспечиваем постоянное обновление в режиме свободной камеры
  useEffect(() => {
    // Устанавливаем интервал обновления позиции (100 мс = 10 раз в секунду)
    let lastPosition = { x: 0, y: 0, z: 0 };
    let lastUpdateTime = 0;
    
    const updateCameraPosition = () => {
      const now = performance.now();
      // Обновляем позицию не чаще чем раз в 100 мс для оптимизации производительности
      if (now - lastUpdateTime < 100) return;
      
      // Получаем текущую позицию с округлением до 2 знаков
      const currentPosition = {
        x: parseFloat(camera.position.x.toFixed(2)),
        y: parseFloat(camera.position.y.toFixed(2)),
        z: parseFloat(camera.position.z.toFixed(2))
      };
      
      // Проверяем, изменилась ли позиция значительно (минимум на 0.05 единиц)
      const positionChanged = 
        Math.abs(lastPosition.x - currentPosition.x) > 0.05 || 
        Math.abs(lastPosition.y - currentPosition.y) > 0.05 || 
        Math.abs(lastPosition.z - currentPosition.z) > 0.05;
      
      // Обновляем только если позиция значительно изменилась
      if (positionChanged) {
        // Обновляем позицию в Redux
        dispatch(setCamera({ position: currentPosition }));
        
        // В режиме свободной камеры принудительно обновляем рендер
        if (cameraSettings.freeCamera) {
          invalidate();
        }
        
        // Запоминаем последнюю позицию и время обновления
        lastPosition = { ...currentPosition };
        lastUpdateTime = now;
      }
    };
    
    // Устанавливаем интервал обновления
    const intervalId = setInterval(updateCameraPosition, 100);
    
    // Очищаем интервал при размонтировании
    return () => clearInterval(intervalId);
  }, [camera, dispatch, cameraSettings.freeCamera, invalidate]);
  
  return (
    <>
      {cameraSettings.freeCamera ? (
        <FreeCameraController />
      ) : (
        <OrbitControls 
          ref={orbitControlsRef}
          enablePan={false}
          enableZoom={false}
          target={[0, cameraSettings.cameraHeight ?? 0.2, -0.2]}
          minPolarAngle={Math.PI / 10}        // Расширяем диапазон сверху
          maxPolarAngle={Math.PI * 9 / 10}    // Расширяем диапазон снизу
          rotateSpeed={1.5}
          enableDamping={true}
          dampingFactor={0.1}
        />
      )}
    </>
  );
};

export default CameraController; 
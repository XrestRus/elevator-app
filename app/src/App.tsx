import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, FlyControls } from '@react-three/drei';
import './App.css';
import { Suspense, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import * as THREE from 'three';
import UIPanel from './components/ui/UIPanel.tsx';
import BasicElevator from './components/elevator/BasicElevator';
import CeilingLights from './components/elevator/CeilingLights';
import type { RootState } from './store/store';
import { setCamera } from './store/elevatorSlice';

/**
 * Компонент для динамического управления камерой и контроллерами
 */
function CameraController() {
  const { camera } = useThree();
  const cameraSettings = useSelector((state: RootState) => state.elevator.camera);
  const dimensions = useSelector((state: RootState) => state.elevator.dimensions);
  const dispatch = useDispatch();
  
  // Референсы для контроллеров
  const orbitControlsRef = useRef(null);
  const flyControlsRef = useRef(null);
  
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
      camera.position.set(0, dimensions.height * 0.8 - 0.8, 0); // На уровне глаз человека
      // =====================================
      // КОНЕЦ БЛОКА ДЛЯ РЕДАКТИРОВАНИЯ
      // =====================================
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
  }, [camera, cameraSettings.freeCamera, cameraSettings.cameraHeight]);
  
  // Обновляем высоту камеры при изменении высоты лифта только в режиме свободного полета
  useEffect(() => {
    if (cameraSettings.freeCamera) {
      // Сохраняем X и Z координаты, меняем только Y
      const x = camera.position.x;
      const z = camera.position.z;
      camera.position.set(x, dimensions.height * 0.8 - 0.8, z);
    }
  }, [camera, dimensions.height, cameraSettings.freeCamera]);
  
  // Отслеживаем изменение позиции камеры
  useEffect(() => {
    // Устанавливаем интервал обновления позиции (100 мс = 10 раз в секунду)
    let lastPosition = { x: 0, y: 0, z: 0 };
    
    const updateCameraPosition = () => {
      // Получаем текущую позицию с округлением до 2 знаков
      const currentPosition = {
        x: parseFloat(camera.position.x.toFixed(2)),
        y: parseFloat(camera.position.y.toFixed(2)),
        z: parseFloat(camera.position.z.toFixed(2))
      };
      
      // Проверяем, изменилась ли позиция
      if (lastPosition.x !== currentPosition.x || 
          lastPosition.y !== currentPosition.y || 
          lastPosition.z !== currentPosition.z) {
        
        // Обновляем позицию в Redux
        dispatch(setCamera({ position: currentPosition }));
        
        // Запоминаем последнюю позицию
        lastPosition = { ...currentPosition };
      }
    };
    
    // Устанавливаем интервал обновления
    const intervalId = setInterval(updateCameraPosition, 100);
    
    // Очищаем интервал при размонтировании
    return () => clearInterval(intervalId);
  }, [camera, dispatch]);
  
  return (
    <>
      {cameraSettings.freeCamera ? (
        <FlyControls 
          movementSpeed={2.0}
          rollSpeed={2.0}
          dragToLook={true}
          ref={flyControlsRef}
        />
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
}

/**
 * Главный компонент приложения для конструктора лифта
 */
function App() {
  // Получаем настройки из Redux
  const lighting = useSelector((state: RootState) => state.elevator.lighting);
  const cameraSettings = useSelector((state: RootState) => state.elevator.camera);
  
  return (
    <div className="app-container">
      <Canvas
        shadows={false}
        camera={{ 
          position: [0, 0, 0],
          fov: cameraSettings.fov // Начальное значение FOV
        }}
        gl={{ 
          antialias: true,
          pixelRatio: window.devicePixelRatio
        }}
        style={{ height: '100vh', width: '100%' }}
      >
        <CameraController />
        
        {/* Базовое освещение */}
        <ambientLight intensity={lighting.enabled ? 1.5 : 0.2} />
        
        <Suspense fallback={null}>
          <BasicElevator />
          
          {/* Добавляем светильники */}
          <CeilingLights 
            count={lighting.count} 
            color={lighting.color} 
            intensity={lighting.intensity} 
          />
        </Suspense>
      </Canvas>
      <UIPanel />
    </div>
  );
}

export default App;

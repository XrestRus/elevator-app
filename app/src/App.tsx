import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { OrbitControls, FlyControls } from '@react-three/drei';
import './App.css';
import { Suspense, useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import * as THREE from 'three';
import UIPanel from './components/ui/UIPanel.tsx';
import BasicElevator from './components/elevator/BasicElevator';
import CeilingLights from './components/elevator/CeilingLights';
import DebugStats from './components/debug/DebugStats';
import DebugPanel from './components/debug/DebugPanel';
import type { RootState } from './store/store';
import { setCamera } from './store/elevatorSlice';

/**
 * Компонент для адаптивного управления качеством рендеринга
 */
function PerformanceMonitor() {
  const { gl } = useThree();
  const frameRates = useRef<number[]>([]);
  const lastTime = useRef<number>(performance.now());
  const [lowPerformance, setLowPerformance] = useState(false);
  
  // Мониторинг FPS и адаптивное управление качеством рендеринга
  useFrame(() => {
    const currentTime = performance.now();
    const delta = currentTime - lastTime.current;
    lastTime.current = currentTime;
    
    // Рассчитываем текущий FPS
    const fps = 1000 / delta;
    
    // Сохраняем последние 20 значений FPS для сглаживания
    frameRates.current.push(fps);
    if (frameRates.current.length > 20) {
      frameRates.current.shift();
    }
    
    // Рассчитываем средний FPS
    const avgFps = frameRates.current.reduce((sum, value) => sum + value, 0) / frameRates.current.length;
    
    // Адаптивно настраиваем качество рендеринга
    if (avgFps < 40 && !lowPerformance) {
      setLowPerformance(true);
      // Снижаем качество рендеринга
      gl.setPixelRatio(Math.min(window.devicePixelRatio, 1)); // Ограничиваем pixelRatio
    } else if (avgFps > 50 && lowPerformance) {
      setLowPerformance(false);
      // Повышаем качество рендеринга
      gl.setPixelRatio(Math.min(window.devicePixelRatio, 1.5)); // Восстанавливаем pixelRatio
    }
  });
  
  return null;
}

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
    // Устанавливаем интервал обновления позиции (200 мс = 5 раз в секунду, увеличиваем для оптимизации FPS)
    let lastPosition = { x: 0, y: 0, z: 0 };
    let lastUpdateTime = 0;
    
    const updateCameraPosition = () => {
      const now = performance.now();
      // Обновляем позицию не чаще чем раз в 200 мс для оптимизации производительности
      if (now - lastUpdateTime < 200) return;
      
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
        
        // Запоминаем последнюю позицию и время обновления
        lastPosition = { ...currentPosition };
        lastUpdateTime = now;
      }
    };
    
    // Устанавливаем интервал обновления
    const intervalId = setInterval(updateCameraPosition, 200); // Увеличиваем до 200мс
    
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
  
  // Состояние отладочных инструментов
  const [debugSettings, setDebugSettings] = useState({
    showFps: true,
    showWireframe: false,
    showAxes: false,
    showGizmo: true
  });
  
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
          powerPreference: "high-performance", 
          alpha: false,
          stencil: false, 
          depth: true,
          precision: "lowp",
          pixelRatio: Math.min(window.devicePixelRatio, 2) // Ограничиваем pixelRatio для повышения FPS
        }}
        frameloop="demand" // Рендер только при необходимости
        style={{ height: '100vh', width: '100%' }}
      >
        <CameraController />
        
        {/* Добавляем монитор производительности */}
        <PerformanceMonitor />
        
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
          
          {/* Добавляем отладочные инструменты */}
          <DebugStats 
            showFps={debugSettings.showFps}
            showWireframe={debugSettings.showWireframe}
            showAxes={debugSettings.showAxes}
            showGizmo={debugSettings.showGizmo}
          />
        </Suspense>
      </Canvas>
      
      {/* Панель управления для UI */}
      <UIPanel />
      
      {/* Панель отладки */}
      <DebugPanel 
        onToggleFps={(show) => setDebugSettings({...debugSettings, showFps: show})}
        onToggleWireframe={(show) => setDebugSettings({...debugSettings, showWireframe: show})}
        onToggleAxes={(show) => setDebugSettings({...debugSettings, showAxes: show})}
        onToggleGizmo={(show) => setDebugSettings({...debugSettings, showGizmo: show})}
      />
    </div>
  );
}

export default App;

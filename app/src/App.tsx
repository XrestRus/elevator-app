import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { OrbitControls, FlyControls } from '@react-three/drei';
import './App.css';
import { Suspense, useEffect, useRef, useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import * as THREE from 'three';
import UIPanel from './components/ui/UIPanel.tsx';
import BasicElevator from './components/elevator/BasicElevator';
import CeilingLights from './components/elevator/CeilingLights';
import DebugStats from './components/debug/DebugStats';
import DebugPanel from './components/debug/DebugPanel';
import SceneOptimizer from './components/elevator/SceneOptimizer';
import PerformanceOptimizer from './utils/PerformanceOptimizer';
import type { RootState } from './store/store';
import { setCamera } from './store/elevatorSlice';

/**
 * Компонент для адаптивного управления качеством рендеринга
 */
function PerformanceMonitor() {
  const { gl, scene } = useThree();
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
      
      // Оптимизируем сцену для повышения производительности
      PerformanceOptimizer.optimizeScene(scene, false);
      
      console.log('Производительность снижена: оптимизация включена');
    } else if (avgFps > 50 && lowPerformance) {
      setLowPerformance(false);
      // Повышаем качество рендеринга, но только если устройство мощное
      if (PerformanceOptimizer.isHighPerformanceDevice()) {
        gl.setPixelRatio(Math.min(window.devicePixelRatio, 1.5)); // Восстанавливаем pixelRatio
        
        // Оптимизируем сцену с высоким качеством
        PerformanceOptimizer.optimizeScene(scene, true);
        
        console.log('Производительность восстановлена: высокое качество');
      }
    }
  });
  
  return null;
}

/**
 * Компонент для свободного управления камерой (режим FlyControls)
 */
function FreeCameraController() {
  const { camera, gl, invalidate } = useThree();
  const isPressed = useRef<Record<string, boolean>>({});
  
  // Создаем обработчики клавиш для перемещения камеры
  useEffect(() => {
    // Функция для обработки нажатия клавиш
    const handleKeyDown = (e: KeyboardEvent) => {
      isPressed.current[e.key.toLowerCase()] = true;
    };
    
    // Функция для обработки отпускания клавиш
    const handleKeyUp = (e: KeyboardEvent) => {
      isPressed.current[e.key.toLowerCase()] = false;
    };
    
    // Добавляем обработчики событий
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    // Удаляем обработчики при размонтировании компонента
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [camera, gl]);
  
  // Создаем функцию обновления положения камеры при нажатых клавишах
  useFrame(() => {
    // Базовая скорость перемещения камеры
    const baseSpeed = 0.2;
    
    // Применяем ускорение при нажатии Shift
    const speedMultiplier = isPressed.current['shift'] ? 3.0 : 1.0;
    const moveSpeed = baseSpeed * speedMultiplier;
    
    // Направление взгляда камеры
    const direction = new THREE.Vector3(0, 0, -1);
    direction.applyQuaternion(camera.quaternion);
    
    // Вектор для стрейфа (движение влево/вправо)
    const right = new THREE.Vector3(1, 0, 0);
    right.applyQuaternion(camera.quaternion);
    
    // Проверяем нажатые клавиши и обновляем позицию
    let moved = false;
    
    // W - вперед
    if (isPressed.current['w']) {
      camera.position.addScaledVector(direction, moveSpeed);
      moved = true;
    }
    
    // S - назад
    if (isPressed.current['s']) {
      camera.position.addScaledVector(direction, -moveSpeed);
      moved = true;
    }
    
    // A - влево
    if (isPressed.current['a']) {
      camera.position.addScaledVector(right, -moveSpeed);
      moved = true;
    }
    
    // D - вправо
    if (isPressed.current['d']) {
      camera.position.addScaledVector(right, moveSpeed);
      moved = true;
    }
    
    // Q - вверх
    if (isPressed.current['q']) {
      camera.position.y += moveSpeed;
      moved = true;
    }
    
    // E - вниз
    if (isPressed.current['e']) {
      camera.position.y -= moveSpeed;
      moved = true;
    }
    
    // Принудительно обновляем рендер при движении
    if (moved) {
      invalidate();
    }
    
    // В любом случае вызываем invalidate для обработки поворотов камеры
    invalidate();
  });
  
  return (
    <FlyControls 
      movementSpeed={1.5}
      rollSpeed={2.0}
      dragToLook={true}
      autoForward={false}
    />
  );
}

/**
 * Компонент для динамического управления камерой и контроллерами
 */
function CameraController() {
  const { camera, invalidate } = useThree();
  const cameraSettings = useSelector((state: RootState) => state.elevator.camera);
  const dimensions = useSelector((state: RootState) => state.elevator.dimensions);
  const dispatch = useDispatch();
  
  // Референсы для контроллеров
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
}

/**
 * Компонент для оптимизации теней и освещения
 */
function ShadowOptimizer() {
  const { gl, scene } = useThree();
  const dimensions = useSelector((state: RootState) => state.elevator.dimensions);
  
  // Настройка рендерера для теней с оптимизацией
  useEffect(() => {
    if (gl.shadowMap.enabled) {
      // Устанавливаем оптимальные настройки для теней
      gl.shadowMap.type = THREE.PCFSoftShadowMap;
      gl.shadowMap.autoUpdate = false; // Отключаем автоматическое обновление теней
      gl.shadowMap.needsUpdate = true; // Обновляем тени один раз при старте
      
      // Функция для оптимизации настроек тени для каждого источника света
      const optimizeShadows = () => {
        scene.traverse((object) => {
          if (object instanceof THREE.Light && object.castShadow) {
            // Настраиваем размер карты теней в зависимости от производительности
            const isMobileOrLowPerf = window.navigator.userAgent.includes('Mobile') || 
                                      !PerformanceOptimizer.isHighPerformanceDevice();
            
            const shadowMapSize = isMobileOrLowPerf ? 512 : 1024;
            
            if (object.shadow) {
              object.shadow.mapSize.width = shadowMapSize;
              object.shadow.mapSize.height = shadowMapSize;
              
              // Оптимизация ближней и дальней границы тени для лифта
              object.shadow.camera.near = 0.1;
              object.shadow.camera.far = dimensions.height * 2;
              
              // Для SpotLight особые настройки
              if (object instanceof THREE.SpotLight) {
                object.shadow.bias = -0.0005;
                object.shadow.focus = 1;
              }
              
              // Для PointLight и DirectionalLight
              if (object instanceof THREE.PointLight || 
                  object instanceof THREE.DirectionalLight) {
                object.shadow.bias = -0.001;
              }
              
              // Обновляем карту теней данного источника
              object.shadow.needsUpdate = true;
            }
          }
        });
        
        // Обновляем тени один раз
        gl.shadowMap.needsUpdate = true;
      };
      
      // Выполняем оптимизацию через небольшую задержку,
      // чтобы все источники света успели загрузиться
      const timeoutId = setTimeout(optimizeShadows, 500);
      
      return () => clearTimeout(timeoutId);
    }
  }, [gl, scene, dimensions]);
  
  return null;
}

/**
 * Компонент для обеспечения анимации дверей
 */
function DoorAnimationUpdater() {
  const doorsOpen = useSelector((state: RootState) => state.elevator.doorsOpen);
  const { invalidate } = useThree();
  const isAnimating = useRef(false);
  const animationTime = useRef(0);
  
  // Запускаем обновление кадров при изменении состояния дверей
  useEffect(() => {
    isAnimating.current = true;
    animationTime.current = 0;
  }, [doorsOpen]);
  
  // Обновляем сцену на протяжении всей анимации двери (примерно 1 секунда)
  useFrame((_, delta) => {
    if (isAnimating.current) {
      animationTime.current += delta;
      
      // Продолжаем обновление в течение 1.5 секунд (с запасом)
      if (animationTime.current < 1.5) {
        invalidate(); // Принудительно обновляем рендер
      } else {
        isAnimating.current = false;
      }
    }
  });
  
  return null;
}

/**
 * Главный компонент приложения для конструктора лифта
 */
function App() {
  // Получаем настройки из Redux
  const lighting = useSelector((state: RootState) => state.elevator.lighting);
  const cameraSettings = useSelector((state: RootState) => state.elevator.camera);
  
  // Определяем производительность устройства
  const isHighPerformance = useMemo(() => PerformanceOptimizer.isHighPerformanceDevice(), []);
  
  // Состояние отладочных инструментов
  const [debugSettings, setDebugSettings] = useState({
    showFps: true,
    showWireframe: false,
    showAxes: false,
    showGizmo: true
  });
  
  // Оптимизированные настройки для рендерера
  const glSettings = useMemo(() => ({
    antialias: true,
    powerPreference: "high-performance" as const, 
    alpha: false,
    stencil: false, 
    depth: true,
    precision: "lowp" as const, // Используем низкую точность для лучшей производительности
    // Включаем shadowMap только для устройств с достаточной производительностью
    shadowMap: isHighPerformance ? { 
      enabled: true,
      type: THREE.PCFSoftShadowMap,
      autoUpdate: false
    } : false,
    // Ограничиваем pixelRatio для повышения FPS
    pixelRatio: Math.min(window.devicePixelRatio, 1.5)
  }), [isHighPerformance]);
  
  return (
    <div className="app-container">
      <Canvas
        shadows={isHighPerformance}
        camera={{ 
          position: [0, 0, 0],
          fov: cameraSettings.fov // Начальное значение FOV
        }}
        gl={glSettings}
        frameloop={cameraSettings.freeCamera ? "always" : "demand"} // В режиме свободной камеры всегда обновляем кадры
        style={{ 
          height: '100vh', 
          width: '100%', 
          outline: 'none', // Убираем контур при фокусе
          touchAction: 'none' // Предотвращаем действия браузера по умолчанию на сенсорных устройствах
        }}
        tabIndex={0} // Делаем Canvas фокусируемым для обработки клавиатурных событий
      >
        <CameraController />
        
        {/* Добавляем монитор производительности */}
        <PerformanceMonitor />
        
        {/* Добавляем компонент для анимации дверей */}
        <DoorAnimationUpdater />
        
        {/* Добавляем оптимизатор теней */}
        {isHighPerformance && <ShadowOptimizer />}
        
        {/* Добавляем компонент для оптимизации сцены */}
        <SceneOptimizer />
        
        {/* Базовое освещение - оптимизированное */}
        <ambientLight intensity={lighting.enabled ? 1.0 : 0.2} />
        
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

import { Canvas, useThree } from '@react-three/fiber';
import './styles/App.css';
import './styles/UIPanel.css';
import { Suspense, useState, useMemo, useCallback } from 'react';
import { useSelector } from 'react-redux';
import * as THREE from 'three';
import UIPanel from './components/ui/UIPanel.tsx';
import BasicElevator from './components/elevator/BasicElevator';
import CeilingLights from './components/elevator/CeilingLights';
import DebugStats from './components/debug/DebugStats';
import DebugPanel from './components/debug/DebugPanel';
import DoorAnimationUpdater from './components/elevator/DoorAnimationUpdater';
import CameraController from './components/camera/CameraController';
import { 
  ShadowOptimizer, 
  SceneOptimizerComponent 
} from './components/optimization';
import { PerformanceOptimizer } from './utils/optimization';
import SoftShadowEnhancer from './components/camera/SoftShadowEnhancer';
import type { RootState } from './store/store';

/**
 * Компонент для изменения цвета фона сцены
 */
const BackgroundColorUpdater: React.FC<{
  color: string;
}> = ({ color }) => {
  const { scene } = useThree();
  
  // Обновляем цвет фона при изменении пропса color
  useMemo(() => {
    if (scene && scene.background) {
      if (typeof scene.background === 'object' && 'set' in scene.background) {
        scene.background.set(color);
      } else {
        scene.background = new THREE.Color(color);
      }
    } else if (scene) {
      scene.background = new THREE.Color(color);
    }
  }, [scene, color]);
  
  return null;
};

/**
 * Компонент для получения ссылки на текущую сцену
 */
const SceneGrabber: React.FC<{
  onSceneReady: (scene: THREE.Scene) => void;
}> = ({ onSceneReady }) => {
  const { scene } = useThree();
  
  // Вызываем колбэк при монтировании компонента
  useMemo(() => {
    onSceneReady(scene);
  }, [scene, onSceneReady]);
  
  return null;
};

/**
 * Главный компонент приложения для конструктора лифта
 */
function App() {
  // Получаем настройки из Redux
  const lighting = useSelector((state: RootState) => state.elevator.lighting);
  const cameraSettings = useSelector((state: RootState) => state.elevator.camera);
  const dimensions = useSelector((state: RootState) => state.elevator.dimensions);
  
  // Определяем производительность устройства
  const isHighPerformance = useMemo(() => PerformanceOptimizer.isHighPerformanceDevice(), []);
  
  // Состояние отладочных инструментов
  const [debugSettings, setDebugSettings] = useState({
    showFps: true,
    showWireframe: false,
    showAxes: false,
    showGizmo: true
  });
  
  // Состояние для хранения импортированной сцены
  const [importedScene, setImportedScene] = useState<THREE.Scene | null>(null);
  
  // Ссылка на текущую сцену
  const [currentScene, setCurrentScene] = useState<THREE.Scene | null>(null);
  
  // Состояние для цвета фона
  const [backgroundColor, setBackgroundColor] = useState('#000000');
  
  // Обработчик получения сцены
  const handleSceneReady = useCallback((scene: THREE.Scene) => {
    setCurrentScene(scene);
  }, []);
  
  // Обработчик импорта сцены
  const handleImportScene = useCallback((scene: THREE.Scene) => {
    // Устанавливаем импортированную сцену
    setImportedScene(scene);
  }, []);
  
  // Обработчик изменения цвета фона
  const handleBackgroundColorChange = useCallback((color: string) => {
    setBackgroundColor(color);
  }, []);
  
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
      autoUpdate: false,
      softness: 8 // Добавляем параметр мягкости для теней
    } : false,
    // Ограничиваем pixelRatio для повышения FPS
    pixelRatio: Math.min(window.devicePixelRatio, 1.5)
  }), [isHighPerformance]);
  
  return (
    <div className="app-container">
      <div className="canvas-container">
        <Canvas
          shadows={isHighPerformance}
          camera={{ 
            position: [0, 0, 0],
            fov: cameraSettings.fov // Начальное значение FOV
          }}
          gl={glSettings}
          frameloop={cameraSettings.freeCamera ? "always" : "demand"} // В режиме свободной камеры всегда обновляем кадры
          style={{ 
            height: '100%', 
            width: '100%', 
            outline: 'none', // Убираем контур при фокусе
            touchAction: 'none' // Предотвращаем действия браузера по умолчанию на сенсорных устройствах
          }}
          tabIndex={0} // Делаем Canvas фокусируемым для обработки клавиатурных событий
        >
          {/* Компонент для обновления цвета фона */}
          <BackgroundColorUpdater color={backgroundColor} />
          
          {/* Компонент для получения ссылки на сцену */}
          <SceneGrabber onSceneReady={handleSceneReady} />
          
          <CameraController />
        
          {/* Добавляем компонент для анимации дверей */}
          <DoorAnimationUpdater />
          
          {/* Добавляем оптимизатор теней */}
          {isHighPerformance && <ShadowOptimizer />}
          
          {/* Добавляем компонент для более мягких теней */}
          <SoftShadowEnhancer />
          
          {/* Добавляем компонент для оптимизации сцены */}
          <SceneOptimizerComponent />
          
          {/* Базовое освещение - оптимизированное */}
          <ambientLight intensity={lighting.enabled ? 0.7 : 0.2} />
          
          {/* Добавляем мягкое направленное освещение сверху для более естественных теней */}
          <directionalLight 
            position={[0, dimensions.height * 1.5, 0]} 
            intensity={lighting.enabled ? 0.3 : 0.1}
            castShadow={isHighPerformance}
            shadow-radius={8}
            shadow-mapSize-width={isHighPerformance ? 2048 : 512}
            shadow-mapSize-height={isHighPerformance ? 2048 : 512}
            shadow-bias={-0.001}
            shadow-normalBias={0.05}
            shadow-camera-near={0.1}
            shadow-camera-far={dimensions.height * 3}
          />
          
          <Suspense fallback={null}>
            {/* Если есть импортированная сцена, отображаем её, иначе - базовый лифт */}
            {importedScene ? (
              <primitive object={importedScene} />
            ) : (
              <>
                <BasicElevator />
                
                {/* Добавляем светильники */}
                <CeilingLights 
                  color={lighting.color} 
                  intensity={lighting.intensity} 
                />
              </>
            )}
            
            {/* Добавляем отладочные инструменты */}
            <DebugStats 
              showFps={debugSettings.showFps}
              showWireframe={debugSettings.showWireframe}
              showAxes={debugSettings.showAxes}
              showGizmo={debugSettings.showGizmo}
            />
          </Suspense>
        </Canvas>
      </div>
      
      {/* Панель управления для UI */}
      <UIPanel />
      
      {/* Панель отладки */}
      <DebugPanel 
        onToggleFps={(show) => setDebugSettings({...debugSettings, showFps: show})}
        onToggleWireframe={(show) => setDebugSettings({...debugSettings, showWireframe: show})}
        onToggleAxes={(show) => setDebugSettings({...debugSettings, showAxes: show})}
        onToggleGizmo={(show) => setDebugSettings({...debugSettings, showGizmo: show})}
        onImportScene={handleImportScene}
        onChangeBackgroundColor={handleBackgroundColorChange}
        currentScene={currentScene}
      />
    </div>
  );
}

export default App;

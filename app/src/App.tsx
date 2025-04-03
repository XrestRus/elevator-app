import { Canvas } from '@react-three/fiber';
import './App.css';
import { Suspense, useState, useMemo } from 'react';
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
import ObjectHoverHandler from './components/ui/ObjectHoverHandler';
import ObjectTooltip from './components/ui/ObjectTooltip';

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
      {/* Стили для тултипа */}
      <style>
        {`
          .object-tooltip {
            position: fixed;
            z-index: 9999;
            background-color: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 8px 12px;
            border-radius: 4px;
            max-width: 300px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
            font-size: 14px;
            pointer-events: none;
            transition: opacity 0.2s ease;
          }
          
          .object-tooltip-title {
            font-weight: bold;
            margin-bottom: 4px;
          }
          
          .object-tooltip-row {
            margin-bottom: 4px;
          }
          
          .object-tooltip-label {
            opacity: 0.7;
          }
          
          .object-tooltip-additional {
            border-top: 1px solid rgba(255, 255, 255, 0.2);
            padding-top: 4px;
            margin-top: 4px;
          }
        `}
      </style>
      
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
          
          {/* Компонент для обработки наведения на объекты должен быть внутри Canvas */}
          <ObjectHoverHandler />
        </Suspense>
      </Canvas>
      
      {/* Тултип теперь отображается вне Canvas, но использует данные из Canvas */}
      <ObjectTooltip />
      
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

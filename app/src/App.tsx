import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import './App.css';
import { Suspense } from 'react';
import { useSelector } from 'react-redux';
import UIPanel from './components/ui/UIPanel.tsx';
import BasicElevator from './components/elevator/BasicElevator';
import CeilingLights from './components/elevator/CeilingLights';
import type { RootState } from './store/store';

/**
 * Главный компонент приложения для конструктора лифта
 */
function App() {
  // Получаем настройки из Redux
  const lighting = useSelector((state: RootState) => state.elevator.lighting);
  
  return (
    <div className="app-container">
      <Canvas
        shadows={false}
        camera={{ 
          position: [0, 0, 0],
          fov: 75
        }}
        gl={{ 
          antialias: true,
          pixelRatio: window.devicePixelRatio
        }}
        style={{ height: '100vh', width: '100%' }}
      >
        {/* Усиливаем освещение */}
        <ambientLight intensity={1.5} />
        <pointLight position={[0, 1, 0]} intensity={3} />
        <pointLight position={[-1, 0, 0]} intensity={1} />
        <pointLight position={[1, 0, 0]} intensity={1} />
        <pointLight position={[0, 0, -1]} intensity={1} />
        
        <Suspense fallback={null}>
          <BasicElevator />
          
          {/* Добавляем светильники */}
          <CeilingLights 
            count={lighting.count} 
            color={lighting.color} 
            intensity={lighting.intensity} 
          />
        </Suspense>
        
        <OrbitControls 
          enablePan={false}
          enableZoom={false}
          target={[0, 0, -0.1]}
          minPolarAngle={0.1}
          maxPolarAngle={Math.PI - 0.1}
        />
      </Canvas>
      <UIPanel />
    </div>
  );
}

export default App;

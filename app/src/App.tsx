import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import './App.css';
import { Suspense } from 'react';
import UIPanel from './components/ui/UIPanel';
import BasicElevator from './components/elevator/BasicElevator';

/**
 * Главный компонент приложения для конструктора лифта
 */
function App() {
  return (
    <div className="app-container">
      <Canvas
        shadows
        camera={{ position: [5, 5, 5], fov: 50 }}
        style={{ height: '100vh', width: '100%' }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight
          position={[10, 10, 5]}
          intensity={1}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <Suspense fallback={null}>
          <BasicElevator />
        </Suspense>
        <OrbitControls />
      </Canvas>
      <UIPanel />
    </div>
  );
}

export default App;

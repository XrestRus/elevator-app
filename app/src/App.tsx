import { Canvas } from '@react-three/fiber';
import { OrbitControls, MeshReflectorMaterial } from '@react-three/drei';
import './App.css';
import { Suspense } from 'react';
import UIPanel from './components/ui/UIPanel.tsx';
import BasicElevator from './components/elevator/BasicElevator';

/**
 * Главный компонент приложения для конструктора лифта
 */
function App() {
  return (
    <div className="app-container">
      <Canvas
        shadows
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

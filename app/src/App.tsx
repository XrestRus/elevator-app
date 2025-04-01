import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
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
          position: [0, 0, 0], // Камера точно в центре лифта
          fov: 75 // Широкий угол обзора
        }}
        style={{ height: '100vh', width: '100%' }}
      >
        {/* Мягкое окружающее освещение */}
        <ambientLight intensity={0.6} />
        
        {/* Основной источник света сверху */}
        <pointLight
          position={[0, 2, 0]}
          intensity={1}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        
        {/* Дополнительные источники света для лучшего освещения стен */}
        <pointLight position={[-1, 0, 0]} intensity={0.5} />
        <pointLight position={[1, 0, 0]} intensity={0.5} />
        <pointLight position={[0, 0, -1]} intensity={0.5} />
        
        <Suspense fallback={null}>
          <BasicElevator />
        </Suspense>
        
        {/* Настройки управления камерой */}
        <OrbitControls 
          enablePan={false}
          enableZoom={false}
          minDistance={0.1}
          maxDistance={0.1} // Фиксируем расстояние - камера не может двигаться от центра
          target={[0, 0, -0.1]} // Легкий сдвиг цели, чтобы камера "смотрела" в лифт
          minPolarAngle={0.1} // Ограничиваем вращение
          maxPolarAngle={Math.PI - 0.1}
        />
      </Canvas>
      <UIPanel />
    </div>
  );
}

export default App;

import React, { useRef, useState } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import PerformanceOptimizer from '../../utils/PerformanceOptimizer';

/**
 * Компонент для адаптивного управления качеством рендеринга
 * Отслеживает FPS и динамически регулирует качество рендеринга
 */
const PerformanceMonitor: React.FC = () => {
  const { gl, scene } = useThree();
  const frameRates = useRef<number[]>([]);
  const lastTime = useRef<number>(performance.now());
  const [optimizationApplied, setOptimizationApplied] = useState(false);
  
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
    
    // Используем улучшенный метод оптимизации с настройками, зависящими от FPS
    // Оптимизации будут применяться постепенно, в зависимости от производительности
    if (frameRates.current.length >= 10) { // Ждем накопления статистики
      // Используем новую функцию управления производительностью
      PerformanceOptimizer.manageFPS(avgFps, gl, scene);
      
      // Отмечаем, что оптимизация применена (для отладки)
      if (!optimizationApplied) {
        console.log(`Начальный мониторинг FPS: ${avgFps.toFixed(1)}`);
        setOptimizationApplied(true);
      }
    }
  });
  
  return null;
};

export default PerformanceMonitor; 
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
};

export default PerformanceMonitor; 
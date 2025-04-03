import React, { useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import PerformanceOptimizer from '../../utils/PerformanceOptimizer';

/**
 * Компонент для автоматической оптимизации всей сцены Three.js в зависимости от производительности устройства
 */
const SceneOptimizer: React.FC = () => {
  const { scene, gl } = useThree();
  
  // Определяем мощность устройства один раз при монтировании компонента
  const isHighPerformance = PerformanceOptimizer.isHighPerformanceDevice();
  
  // Применяем оптимизацию сцены на старте и при изменении объектов
  useEffect(() => {
    // Сообщаем в консоль режим производительности
    console.log(`Режим рендеринга: ${isHighPerformance ? 'Высокое качество' : 'Оптимизированный'}`);
    
    // Оптимизируем WebGL-рендерер
    if (!isHighPerformance) {
      // Для слабых устройств снижаем качество
      gl.setPixelRatio(Math.min(window.devicePixelRatio, 1));
      gl.shadowMap.enabled = false; // Отключаем тени
    } else {
      // Для мощных устройств повышаем качество
      gl.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
      // Если тени включены, оптимизируем их
      if (gl.shadowMap.enabled) {
        gl.shadowMap.autoUpdate = false;
        gl.shadowMap.needsUpdate = true;
      }
    }
    
    // Оптимизируем весь граф сцены
    PerformanceOptimizer.optimizeScene(scene, isHighPerformance);
    
    // Планируем периодическую оптимизацию каждые 10 секунд
    // Это может быть полезно при динамическом добавлении контента
    const intervalId = setInterval(() => {
      PerformanceOptimizer.optimizeScene(scene, isHighPerformance);
    }, 10000);
    
    // Очищаем интервал при размонтировании компонента
    return () => clearInterval(intervalId);
  }, [scene, gl, isHighPerformance]);
  
  // Повторно оптимизируем при изменении размера окна
  useEffect(() => {
    const handleResize = () => {
      // Пересчитываем размер рендерера с учетом производительности
      if (!isHighPerformance) {
        gl.setPixelRatio(Math.min(window.devicePixelRatio, 1));
      } else {
        gl.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [gl, isHighPerformance]);
  
  // Компонент не возвращает никакого контента, так как только оптимизирует
  return null;
};

export default SceneOptimizer; 
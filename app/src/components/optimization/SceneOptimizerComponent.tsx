import React, { useEffect, useRef } from 'react';
import { useThree } from '@react-three/fiber';
import SceneOptimizer from '../../utils/optimization/SceneOptimizer';

/**
 * Компонент для автоматической оптимизации сцены на основе производительности устройства
 */
const SceneOptimizerComponent: React.FC = () => {
  const { scene, gl } = useThree();
  const optimizerRef = useRef<SceneOptimizer | null>(null);
  
  // Применяем оптимизацию сцены при инициализации
  useEffect(() => {
    // Создаем оптимизатор и выполняем начальную оптимизацию
    optimizerRef.current = SceneOptimizer.applyOptimizations(scene, gl);
    
    // Планируем периодическую оптимизацию каждые 10 секунд для обработки новых объектов
    const intervalId = setInterval(() => {
      if (optimizerRef.current) {
        optimizerRef.current.update();
      }
    }, 10000);
    
    // Очищаем интервал при размонтировании компонента
    return () => clearInterval(intervalId);
  }, [scene, gl]);
  
  // Обновляем оптимизацию при изменении размера окна
  useEffect(() => {
    const handleResize = () => {
      // Запускаем повторную оптимизацию при изменении размера окна
      if (optimizerRef.current) {
        optimizerRef.current.update();
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Компонент не возвращает никакого контента, так как только оптимизирует сцену
  return null;
};

export default SceneOptimizerComponent;
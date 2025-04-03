import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useFrame, useThree } from '@react-three/fiber';
import type { RootState } from '../../store/store';

/**
 * Компонент для обеспечения анимации дверей
 * Отслеживает состояние дверей и обеспечивает принудительное обновление кадров
 * при их анимации в режиме frameloop="demand"
 */
const DoorAnimationUpdater: React.FC = () => {
  const doorsOpen = useSelector((state: RootState) => state.elevator.doorsOpen);
  const { invalidate } = useThree();
  const isAnimating = useRef(false);
  const animationTime = useRef(0);
  
  // Запускаем обновление кадров при изменении состояния дверей
  useEffect(() => {
    isAnimating.current = true;
    animationTime.current = 0;
  }, [doorsOpen]);
  
  // Обновляем сцену на протяжении всей анимации двери (примерно 1 секунда)
  useFrame((_, delta) => {
    if (isAnimating.current) {
      animationTime.current += delta;
      
      // Продолжаем обновление в течение 1.5 секунд (с запасом)
      if (animationTime.current < 1.5) {
        invalidate(); // Принудительно обновляем рендер
      } else {
        isAnimating.current = false;
      }
    }
  });
  
  return null;
};

export default DoorAnimationUpdater; 
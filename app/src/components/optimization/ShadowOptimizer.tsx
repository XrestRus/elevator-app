import React, { useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import { useSelector } from 'react-redux';
import * as THREE from 'three';
import type { RootState } from '../../store/store';
import PerformanceOptimizer from '../../utils/PerformanceOptimizer';

/**
 * Компонент для оптимизации теней и освещения
 * Настраивает параметры теней для разных источников света
 * в зависимости от производительности устройства
 */
const ShadowOptimizer: React.FC = () => {
  const { gl, scene } = useThree();
  const dimensions = useSelector((state: RootState) => state.elevator.dimensions);
  
  // Настройка рендерера для теней с оптимизацией
  useEffect(() => {
    if (gl.shadowMap.enabled) {
      // Устанавливаем оптимальные настройки для теней
      gl.shadowMap.type = THREE.PCFSoftShadowMap;
      gl.shadowMap.autoUpdate = false; // Отключаем автоматическое обновление теней
      gl.shadowMap.needsUpdate = true; // Обновляем тени один раз при старте
      
      // Функция для оптимизации настроек тени для каждого источника света
      const optimizeShadows = () => {
        scene.traverse((object) => {
          if (object instanceof THREE.Light && object.castShadow) {
            // Настраиваем размер карты теней в зависимости от производительности
            const isMobileOrLowPerf = window.navigator.userAgent.includes('Mobile') || 
                                      !PerformanceOptimizer.isHighPerformanceDevice();
            
            const shadowMapSize = isMobileOrLowPerf ? 512 : 2048; // Увеличиваем размер карты теней
            
            if (object.shadow) {
              object.shadow.mapSize.width = shadowMapSize;
              object.shadow.mapSize.height = shadowMapSize;
              
              // Оптимизация ближней и дальней границы тени для лифта
              object.shadow.camera.near = 0.1;
              object.shadow.camera.far = dimensions.height * 2;
              
              // Добавляем радиус размытия для всех источников света
              object.shadow.radius = isMobileOrLowPerf ? 3 : 8;
              
              // Для SpotLight особые настройки
              if (object instanceof THREE.SpotLight) {
                object.shadow.bias = -0.0003; // Уменьшаем для предотвращения артефактов
                object.shadow.focus = 0.7; // Снижаем фокус для размытия
                object.shadow.blurSamples = isMobileOrLowPerf ? 4 : 12; // Увеличиваем количество сэмплов
                object.penumbra = 0.7; // Увеличиваем зону полутени
              }
              
              // Для PointLight и DirectionalLight
              if (object instanceof THREE.PointLight || 
                  object instanceof THREE.DirectionalLight) {
                object.shadow.bias = -0.0005;
                object.shadow.normalBias = 0.02; // Добавляем для улучшения качества теней
              }
              
              // Обновляем карту теней данного источника
              object.shadow.needsUpdate = true;
            }
          }
        });
        
        // Обновляем тени один раз
        gl.shadowMap.needsUpdate = true;
      };
      
      // Выполняем оптимизацию через небольшую задержку,
      // чтобы все источники света успели загрузиться
      const timeoutId = setTimeout(optimizeShadows, 500);
      
      return () => clearTimeout(timeoutId);
    }
  }, [gl, scene, dimensions]);
  
  return null;
};

export default ShadowOptimizer; 
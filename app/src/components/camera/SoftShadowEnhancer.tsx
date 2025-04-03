import React, { useEffect, useMemo } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import PerformanceOptimizer from '../../utils/PerformanceOptimizer';

/**
 * Компонент для улучшения рендеринга теней и создания более мягкого освещения окружения
 */
const SoftShadowEnhancer: React.FC = () => {
  const { scene } = useThree();
  const isHighPerformance = useMemo(() => PerformanceOptimizer.isHighPerformanceDevice(), []);
  
  // Создаем равномерное окружающее освещение для более мягких теней
  useEffect(() => {
    // Создаем куб-текстуру с мягким светом
    const generateEnvironmentMap = () => {
      // Создаем небольшую светло-серую текстуру для равномерного освещения
      const size = isHighPerformance ? 256 : 128;
      const cubeData = new Uint8Array(size * size * 3);
      
      // Заполняем текстуру градиентом от верха (светлее) к низу (темнее)
      for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
          const index = (y * size + x) * 3;
          
          // Градиент сверху вниз (более светлый сверху)
          const gradientValue = Math.max(180, 230 - (y / size) * 100);
          
          cubeData[index] = gradientValue;
          cubeData[index + 1] = gradientValue;
          cubeData[index + 2] = gradientValue;
        }
      }
      
      // Создаем куб-текстуру для окружения
      const dataTexture = new THREE.DataTexture(cubeData, size, size, THREE.RGBFormat);
      dataTexture.needsUpdate = true;
      
      // Устанавливаем окружение для сцены
      scene.environment = dataTexture;
      
      // Этот метод создает мягкие тени, так как равномерное освещение не создает резких контрастов
      return dataTexture;
    };
    
    const envMap = generateEnvironmentMap();
    
    // Очистка ресурсов при размонтировании
    return () => {
      if (envMap) {
        envMap.dispose();
      }
      scene.environment = null;
    };
  }, [scene, isHighPerformance]);
  
  return null;
};

export default SoftShadowEnhancer; 
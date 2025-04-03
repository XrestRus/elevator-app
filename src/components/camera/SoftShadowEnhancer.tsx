import React, { useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';

/**
 * Компонент для создания мягких теней с помощью управления общим освещением
 */
const SoftShadowEnhancer: React.FC = () => {
  const { scene } = useThree();
  const isHighPerformance = useSelector((state: RootState) => 
    state.elevator.performance?.highPerformance || false);
  
  useEffect(() => {
    // Создаем куб-текстуру с мягким светом
    const generateEnvironmentMap = () => {
      // Создаем небольшую светло-серую текстуру для равномерного освещения
      const size = isHighPerformance ? 512 : 256; // Увеличиваем размер для лучшего качества
      const cubeData = new Uint8Array(size * size * 3);
      
      // Заполняем текстуру градиентом от верха (светлее) к низу (темнее)
      for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
          const index = (y * size + x) * 3;
          
          // Плавный градиент сверху вниз (более светлый сверху) с более мягким переходом
          const gradientValue = Math.max(180, 240 - (y / size) * 80);
          
          cubeData[index] = gradientValue;
          cubeData[index + 1] = gradientValue;
          cubeData[index + 2] = gradientValue;
        }
      }
      
      // Создаем куб-текстуру для окружения с улучшенными параметрами
      const dataTexture = new THREE.DataTexture(cubeData, size, size, THREE.RGBFormat);
      dataTexture.needsUpdate = true;
      dataTexture.flipY = true; // Исправляет инвертирование градиента
      dataTexture.minFilter = THREE.LinearFilter; // Более плавная фильтрация
      dataTexture.magFilter = THREE.LinearFilter; 
      dataTexture.generateMipmaps = true; // Улучшение качества на разных расстояниях
      
      // Устанавливаем окружение для сцены
      scene.environment = dataTexture;
      scene.background = null; // Убеждаемся, что фон не конфликтует с освещением
      
      // Включаем физически корректный режим освещения для всех материалов на сцене
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh && object.material) {
          const material = object.material as THREE.MeshStandardMaterial;
          if (material.envMap !== undefined) {
            material.envMapIntensity = 0.3; // Уменьшаем интенсивность окружающего освещения
            material.needsUpdate = true;
          }
        }
      });
      
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
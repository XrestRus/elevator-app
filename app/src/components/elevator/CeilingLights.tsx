import React from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store/store';
import { Plane } from '@react-three/drei';
import * as THREE from 'three';

/**
 * Компонент для отображения точечных светильников на потолке лифта
 */
const CeilingLights: React.FC<{
  count?: number;
  color?: string;
  intensity?: number;
}> = ({ 
  count = 5, 
  color = '#ffffff', 
  intensity = 5
}) => {
  // Получаем состояние света из Redux
  const { dimensions } = useSelector((state: RootState) => state.elevator);
  const lightsOn = useSelector((state: RootState) => state.elevator.lighting.enabled ?? true);
  const wallColor = useSelector((state: RootState) => state.elevator.materials.walls);
  
  // Создаем цвет корпуса светильника на основе цвета стен
  const frameLightColor = React.useMemo(() => {
    const color = new THREE.Color(wallColor);
    color.multiplyScalar(0.8); // Делаем цвет немного темнее стен
    return color;
  }, [wallColor]);
  
  // Расположение светильников на потолке
  const positions: [number, number, number][] = [];
  
  // Создание массива позиций светильников (равномерно распределенных)
  if (count === 5) {
    // Центральный светильник
    positions.push([0, 0, 0]); 
    
    // Четыре светильника по углам
    const offsetX = dimensions.width * 0.35;
    const offsetZ = dimensions.depth * 0.35;
    positions.push(
      [-offsetX, 0, -offsetZ],
      [offsetX, 0, -offsetZ],
      [-offsetX, 0, offsetZ],
      [offsetX, 0, offsetZ]
    );
  } else if (count === 4) {
    const offsetX = dimensions.width * 0.3;
    const offsetZ = dimensions.depth * 0.3;
    positions.push(
      [-offsetX, 0, -offsetZ],
      [offsetX, 0, -offsetZ],
      [-offsetX, 0, offsetZ],
      [offsetX, 0, offsetZ]
    );
  } else if (count === 2) {
    const offsetZ = dimensions.depth * 0.3;
    positions.push([0, 0, -offsetZ], [0, 0, offsetZ]);
  } else {
    positions.push([0, 0, 0]);
  }
  
  // Рассчитываем размер и интенсивность светового пятна
  const getSpotSize = (index: number) => {
    // Центральный светильник (индекс 0) делаем немного больше и ярче
    if (count === 5 && index === 0) {
      return dimensions.height * 0.7;
    }
    return dimensions.height * 0.4;
  };
  
  const getSpotIntensity = (index: number) => {
    // Центральный светильник ярче
    if (count === 5 && index === 0) {
      return lightsOn ? (intensity / 10) * 1.1 : 0;
    }
    return lightsOn ? (intensity / 10) * 0.7 : 0;
  };
  
  const getLightIntensity = (index: number) => {
    // Центральный светильник ярче
    if (count === 5 && index === 0) {
      return lightsOn ? intensity * 1.1 : 0;
    }
    return lightsOn ? intensity * 0.7 : 0;
  };
  
  // Создаем текстуру для светового пятна
  const spotTexture = React.useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const context = canvas.getContext('2d');
    if (context) {
      // Создаем градиент от центра к краям
      const gradient = context.createRadialGradient(
        128, 128, 0, 
        128, 128, 128
      );
      
      // Преобразуем hex-цвет в RGB формат для использования в градиенте
      const hexToRgb = (hex: string) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16)
        } : { r: 255, g: 255, b: 255 };
      };
      
      const rgb = hexToRgb(color);
      
      gradient.addColorStop(0, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.8)`);
      gradient.addColorStop(0.3, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.4)`);
      gradient.addColorStop(0.6, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.1)`);
      gradient.addColorStop(0.9, 'rgba(255, 255, 255, 0)');
      
      context.fillStyle = gradient;
      context.fillRect(0, 0, 256, 256);
    }
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }, [color]); // Зависимость от цвета светильника
  
  return (
    <group position={[0, dimensions.height/2 - 0.05, 0]}>
      {positions.map((pos, index) => (
        <group key={index} position={pos}>
          {/* Корпус светильника */}
          <mesh>
            <cylinderGeometry args={[0.0, 0.076, 0.01, 32]} />
            <meshStandardMaterial color={frameLightColor} />
          </mesh>
          
          {/* Стеклянный плафон */}
          <mesh position={[0, -0.01, 0]}>
            <cylinderGeometry args={[0.07, 0.07, 0.005, 32]} />
            <meshStandardMaterial 
              color={lightsOn ? color : '#e0e0e0'} 
              transparent
              opacity={0.9}
              emissive={lightsOn ? color : '#333333'}
              emissiveIntensity={lightsOn ? 1 : 0}
            />
          </mesh>
          
          {/* Сам источник света */}
          <spotLight 
            position={[0, -0.02, 0]} 
            angle={Math.PI / 3}
            penumbra={0.3}
            intensity={getLightIntensity(index)}
            color={color}
            castShadow
            decay={1.5}
            distance={dimensions.height * 2}
          />
          
          {/* Световое пятно на полу */}
          <group position={[0, -dimensions.height + 0.05, 0]} visible={lightsOn}>
            <Plane 
              args={[getSpotSize(index), getSpotSize(index)]} 
              rotation={[-Math.PI / 2, 0, 0]}
              position={[0, 0.01, 0]} // Слегка поднимаем над полом
            >
              <meshBasicMaterial 
                color={color}
                transparent={true}
                opacity={getSpotIntensity(index)}
                map={spotTexture}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
              />
            </Plane>
          </group>
        </group>
      ))}
    </group>
  );
};

export default CeilingLights;
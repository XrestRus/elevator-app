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
  count = 4, 
  color = '#ffffff', 
  intensity = 5
}) => {
  // Получаем состояние света из Redux
  const { dimensions } = useSelector((state: RootState) => state.elevator);
  const lightsOn = useSelector((state: RootState) => state.elevator.lighting.enabled ?? true);
  
  // Расположение светильников на потолке
  const positions: [number, number, number][] = [];
  
  // Создание массива позиций светильников (равномерно распределенных)
  if (count === 4) {
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
  
  // Рассчитываем размер светового пятна в зависимости от высоты лифта
  const spotSize = dimensions.height * 0.6; // Чем выше лифт, тем больше пятно
  const spotIntensity = lightsOn ? (intensity / 10) * 0.9 : 0;
  
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
      gradient.addColorStop(0.5, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.3)`);
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
      
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
            <cylinderGeometry args={[0.1, 0.1, 0.02, 32]} />
            <meshStandardMaterial color="#444444" />
          </mesh>
          
          {/* Стеклянный плафон */}
          <mesh position={[0, -0.015, 0]}>
            <cylinderGeometry args={[0.08, 0.08, 0.01, 32]} />
            <meshStandardMaterial 
              color={lightsOn ? color : '#aaaaaa'} 
              transparent
              opacity={0.8}
              emissive={lightsOn ? color : '#333333'}
              emissiveIntensity={lightsOn ? 1 : 0}
            />
          </mesh>
          
          {/* Сам источник света */}
          <spotLight 
            position={[0, -0.05, 0]} 
            angle={Math.PI / 3}
            penumbra={0.2}
            intensity={lightsOn ? intensity : 0}
            color={color}
            castShadow
            decay={2}
          />
          
          {/* Световое пятно на полу */}
          <group position={[0, -dimensions.height + 0.05, 0]} visible={lightsOn}>
            <Plane 
              args={[spotSize, spotSize]} 
              rotation={[-Math.PI / 2, 0, 0]}
              position={[0, 0.01, 0]} // Слегка поднимаем над полом
            >
              <meshBasicMaterial 
                color={color}
                transparent={true}
                opacity={spotIntensity}
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
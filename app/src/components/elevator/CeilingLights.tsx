import React from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store/store';

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
              emissiveIntensity={lightsOn ? 1 : 0.1}
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
        </group>
      ))}
    </group>
  );
};

export default CeilingLights; 
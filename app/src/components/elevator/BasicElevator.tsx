import React from 'react';
import { Box } from '@react-three/drei';

/**
 * Компонент, представляющий базовую геометрию лифта
 */
const BasicElevator: React.FC = () => {
  // Размеры лифтовой кабины
  const width = 2;
  const height = 2.4;
  const depth = 2;
  
  return (
    <group>
      {/* Пол */}
      <Box 
        position={[0, -height/2, 0]} 
        args={[width, 0.1, depth]}
      >
        <meshStandardMaterial color="#aaaaaa" />
      </Box>
      
      {/* Потолок */}
      <Box 
        position={[0, height/2, 0]} 
        args={[width, 0.1, depth]}
      >
        <meshStandardMaterial color="#ffffff" />
      </Box>
      
      {/* Задняя стена */}
      <Box 
        position={[0, 0, -depth/2]} 
        args={[width, height, 0.05]}
      >
        <meshStandardMaterial color="#f0f0f0" />
      </Box>
      
      {/* Левая стена */}
      <Box 
        position={[-width/2, 0, 0]} 
        args={[0.05, height, depth]}
      >
        <meshStandardMaterial color="#f0f0f0" />
      </Box>
      
      {/* Правая стена */}
      <Box 
        position={[width/2, 0, 0]} 
        args={[0.05, height, depth]}
      >
        <meshStandardMaterial color="#f0f0f0" />
      </Box>
      
      {/* Фронтальная стена с дверью (пока сплошная) */}
      <Box 
        position={[0, 0, depth/2]} 
        args={[width, height, 0.05]}
      >
        <meshStandardMaterial color="#e0e0e0" />
      </Box>
    </group>
  );
};

export default BasicElevator; 
import React, { useEffect, useRef } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { FlyControls } from '@react-three/drei';
import * as THREE from 'three';

/**
 * Компонент для свободного управления камерой (режим FlyControls)
 */
const FreeCameraController: React.FC = () => {
  const { camera, gl, invalidate } = useThree();
  const isPressed = useRef<Record<string, boolean>>({});
  
  // Создаем обработчики клавиш для перемещения камеры
  useEffect(() => {
    // Функция для обработки нажатия клавиш
    const handleKeyDown = (e: KeyboardEvent) => {
      isPressed.current[e.key.toLowerCase()] = true;
    };
    
    // Функция для обработки отпускания клавиш
    const handleKeyUp = (e: KeyboardEvent) => {
      isPressed.current[e.key.toLowerCase()] = false;
    };
    
    // Добавляем обработчики событий
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    // Удаляем обработчики при размонтировании компонента
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [camera, gl]);
  
  // Создаем функцию обновления положения камеры при нажатых клавишах
  useFrame(() => {
    // Базовая скорость перемещения камеры
    const baseSpeed = 0.2;
    
    // Применяем ускорение при нажатии Shift
    const speedMultiplier = isPressed.current['shift'] ? 3.0 : 0.5;
    const moveSpeed = baseSpeed * speedMultiplier;
    
    // Направление взгляда камеры
    const direction = new THREE.Vector3(0, 0, -1);
    direction.applyQuaternion(camera.quaternion);
    
    // Вектор для стрейфа (движение влево/вправо)
    const right = new THREE.Vector3(1, 0, 0);
    right.applyQuaternion(camera.quaternion);
    
    // Проверяем нажатые клавиши и обновляем позицию
    let moved = false;
    
    // W - вперед
    if (isPressed.current['w']) {
      camera.position.addScaledVector(direction, moveSpeed);
      moved = true;
    }
    
    // S - назад
    if (isPressed.current['s']) {
      camera.position.addScaledVector(direction, -moveSpeed);
      moved = true;
    }
    
    // A - влево
    if (isPressed.current['a']) {
      camera.position.addScaledVector(right, -moveSpeed);
      moved = true;
    }
    
    // D - вправо
    if (isPressed.current['d']) {
      camera.position.addScaledVector(right, moveSpeed);
      moved = true;
    }
    
    // Q - вверх
    if (isPressed.current['q']) {
      camera.position.y += moveSpeed;
      moved = true;
    }
    
    // E - вниз
    if (isPressed.current['e']) {
      camera.position.y -= moveSpeed;
      moved = true;
    }
    
    // Принудительно обновляем рендер при движении
    if (moved) {
      invalidate();
    }
    
    // В любом случае вызываем invalidate для обработки поворотов камеры
    invalidate();
  });
  
  return (
    <FlyControls 
      movementSpeed={1.5}
      rollSpeed={2.0}
      dragToLook={true}
      autoForward={false}
    />
  );
};

export default FreeCameraController; 
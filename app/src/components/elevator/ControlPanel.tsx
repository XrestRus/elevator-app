import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store/store';
import * as THREE from 'three';
import TextLabel from './TextLabel';

/**
 * Хук для получения размеров кабины лифта
 */
const useCabin = () => {
  const dimensions = useSelector((state: RootState) => state.elevator.dimensions);
  return { dimensions };
};

/**
 * Действие для перемещения лифта
 */
const moveElevator = (floor: number) => {
  return { type: 'elevator/moveElevator', payload: floor };
};

/**
 * Компонент панели управления лифтом
 */
interface ControlPanelProps {
  floors?: number;
}

/**
 * Компонент панели управления лифтом с кнопками этажей
 */
const ControlPanel: React.FC<ControlPanelProps> = ({ floors = 5 }) => {
  const { dimensions } = useCabin();
  const dispatch = useDispatch();
  const groupRef = useRef<THREE.Group>(null);
  
  // Размеры панели управления
  const panelWidth = 0.3;
  const panelHeight = 0.5;
  const panelDepth = 0.05;
  
  // Создаем текстуру программно с помощью canvas
  const panelTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      // Градиентный фон
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, '#444444');
      gradient.addColorStop(1, '#222222');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Добавляем сетку
      ctx.strokeStyle = '#555555';
      ctx.lineWidth = 1;
      
      // Вертикальные линии
      for (let x = 0; x < canvas.width; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      
      // Горизонтальные линии
      for (let y = 0; y < canvas.height; y += 40) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }
      
      // Добавляем надпись
      ctx.fillStyle = '#999999';
      ctx.font = 'bold 36px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('ЛИФТ-СТРОЙ', canvas.width / 2, 60);
      
      // Добавляем линии-разделители
      ctx.strokeStyle = '#777777';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(50, 100);
      ctx.lineTo(canvas.width - 50, 100);
      ctx.stroke();
    }
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }, []);
  
  // Обрабатываем нажатие на кнопку
  const handleButtonClick = (floorNumber: number) => {
    dispatch(moveElevator(floorNumber));
  };
  
  // Поворачиваем панель для размещения на стене
  useEffect(() => {
    if (groupRef.current) {
      // Разместим панель плоско на стене
      groupRef.current.rotation.set(0, 0, 0);
    }
  }, []);
  
  // Координаты кнопок на панели
  const getButtonPosition = (index: number) => {
    const spacing = 0.08;
    const buttonsPerRow = 3;
    const row = Math.floor(index / buttonsPerRow);
    const col = index % buttonsPerRow;
    
    const x = (col - 1) * spacing;
    const y = -row * spacing + panelHeight / 2 - spacing;
    
    return [x, y, panelDepth / 2 + 0.01];
  };
  
  return (
    <group 
      ref={groupRef} 
      position={[
        -dimensions.width / 2 + 0.15, // Располагаем на левой стене
        dimensions.height / 5,        // Ниже середины высоты стены
        dimensions.depth / 2 - 0.5    // Слева от двери
      ]}
      rotation={[0, Math.PI / 2, 0]} // Поворачиваем к центру кабины
    >
      {/* Основа панели */}
      <mesh>
        <boxGeometry args={[panelWidth, panelHeight, panelDepth]} />
        <meshStandardMaterial 
          color="#333333" 
          metalness={0.7} 
          roughness={0.2} 
          map={panelTexture}
        />
      </mesh>
      
      {/* Кнопки этажей */}
      {Array.from({ length: floors }, (_, i) => (
        <PanelButton 
          key={i} 
          position={getButtonPosition(i) as [number, number, number]} 
          label={`${i + 1}`}
          floorNumber={i + 1}
          onButtonClick={handleButtonClick}
          texture={panelTexture}
        />
      ))}
    </group>
  );
};

interface PanelButtonProps {
  position: [number, number, number];
  label: string;
  floorNumber: number;
  onButtonClick: (floor: number) => void;
  texture: THREE.Texture;
}

/**
 * Компонент кнопки панели управления
 */
const PanelButton: React.FC<PanelButtonProps> = ({ 
  position, 
  label, 
  floorNumber, 
  onButtonClick,
  texture
}) => {
  const buttonRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = React.useState(false);
  const [pressed, setPressed] = React.useState(false);
  
  // Изменяем цвет кнопки при наведении
  useFrame(() => {
    if (buttonRef.current) {
      const material = buttonRef.current.material as THREE.MeshStandardMaterial;
      if (material) {
        const targetColor = pressed 
          ? new THREE.Color('#ff6600') 
          : hovered 
            ? new THREE.Color('#aaaaaa') 
            : new THREE.Color('#888888');
        
        material.color.lerp(targetColor, 0.1);
        material.emissive.set(pressed ? '#ff3300' : hovered ? '#555555' : '#000000');
      }
    }
  });
  
  return (
    <group position={position}>
      {/* Кнопка */}
      <mesh
        ref={buttonRef}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onPointerDown={() => {
          setPressed(true);
          onButtonClick(floorNumber);
        }}
        onPointerUp={() => setPressed(false)}
      >
        <cylinderGeometry args={[0.025, 0.025, 0.01, 16]} />
        <meshStandardMaterial 
          color="#888888" 
          metalness={0.5} 
          roughness={0.3} 
          map={texture}
        />
      </mesh>
      
      {/* Номер этажа */}
      <TextLabel
        position={[0, 0, 0.01]}
        fontSize={10}
        color="white"
        fontWeight="bold"
        scale={0.01}
      >
        {label}
      </TextLabel>
    </group>
  );
};

export default ControlPanel; 
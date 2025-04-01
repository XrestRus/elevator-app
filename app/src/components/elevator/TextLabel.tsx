/**
 * Компонент для отображения текстовой метки в 3D пространстве
 */
import React from 'react';
import { Html } from '@react-three/drei';

interface TextLabelProps {
  children: React.ReactNode;
  position: [number, number, number];
  color?: string;
  fontSize?: number;
  fontWeight?: string;
  scale?: number;
  rotation?: [number, number, number];
  maxWidth?: number;
  distanceLimit?: number;
}

const TextLabel: React.FC<TextLabelProps> = ({
  children,
  position,
  color = 'black',
  fontSize = 12,
  fontWeight = 'normal',
  scale = 0.01,
  rotation = [0, 0, 0],
  maxWidth = 150,
  distanceLimit = 1.5
}) => {
  // Просто возвращаем null, чтобы скрыть все текстовые метки
  return null;
};

export default TextLabel; 
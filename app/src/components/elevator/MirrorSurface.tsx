import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface MirrorSurfaceProps {
  position: [number, number, number];
  args: [number, number, number];
  rotation?: [number, number, number];
  color?: string;
}

/**
 * Компонент для создания зеркальной поверхности с реальными отражениями
 */
const MirrorSurface: React.FC<MirrorSurfaceProps> = ({ 
  position, 
  args, 
  rotation = [0, 0, 0], 
  color = '#ffffff' 
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const cubeRenderTargetRef = useRef<THREE.WebGLCubeRenderTarget>();
  const cubeCamera = useRef<THREE.CubeCamera>();
  
  // Инициализация рендер-цели и камеры при первом рендере
  React.useEffect(() => {
    if (!cubeRenderTargetRef.current) {
      cubeRenderTargetRef.current = new THREE.WebGLCubeRenderTarget(256, {
        format: THREE.RGBFormat,
        generateMipmaps: true,
        minFilter: THREE.LinearMipmapLinearFilter
      });
    }
    
    if (!cubeCamera.current && cubeRenderTargetRef.current) {
      cubeCamera.current = new THREE.CubeCamera(0.1, 1000, cubeRenderTargetRef.current);
    }
  }, []);
  
  // Обновление отражения каждый кадр
  useFrame(({ gl, scene }) => {
    if (meshRef.current && cubeCamera.current && cubeRenderTargetRef.current) {
      // Скрываем зеркало перед рендерингом кубической камеры
      meshRef.current.visible = false;
      
      // Устанавливаем позицию камеры в центр зеркала
      cubeCamera.current.position.copy(meshRef.current.position);
      
      // Обновляем кубическую карту
      cubeCamera.current.update(gl, scene);
      
      // Показываем зеркало снова
      meshRef.current.visible = true;
    }
  });
  
  return (
    <mesh 
      ref={meshRef} 
      position={position} 
      rotation={rotation as [number, number, number]}
    >
      <boxGeometry args={args} />
      <meshStandardMaterial 
        envMap={cubeRenderTargetRef.current?.texture}
        metalness={1}
        roughness={0}
        color={color}
      />
    </mesh>
  );
};

export default MirrorSurface; 
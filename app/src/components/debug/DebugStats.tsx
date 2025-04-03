import { useEffect, useRef } from 'react';
import { useThree } from '@react-three/fiber';
import { Stats, GizmoHelper, GizmoViewport } from '@react-three/drei';
import * as THREE from 'three';

/**
 * Компонент для отображения отладочной информации Three.js
 */
const DebugStats: React.FC<{
  showFps?: boolean;
  showWireframe?: boolean; 
  showAxes?: boolean;
  showGizmo?: boolean;
}> = ({ 
  showFps = true, 
  showWireframe = false, 
  showAxes = true,
  showGizmo = true
}) => {
  const { scene } = useThree();
  const axesHelperRef = useRef<THREE.AxesHelper | null>(null);
  
  // Эффект для создания и удаления вспомогательных осей
  useEffect(() => {
    if (showAxes) {
      // Создаем вспомогательные оси длиной 5 метров
      const axesHelper = new THREE.AxesHelper(5);
      scene.add(axesHelper);
      axesHelperRef.current = axesHelper;
      
      // Очистка при размонтировании
      return () => {
        scene.remove(axesHelper);
        axesHelperRef.current = null;
      };
    }
  }, [scene, showAxes]);
  
  // Включаем wireframe для всех материалов в сцене
  useEffect(() => {
    if (showWireframe) {
      // Список для хранения оригинальных состояний wireframe
      const originalWireframeState: Map<THREE.Material, boolean> = new Map();
      
      // Функция обхода сцены и обновления материалов
      const updateMaterials = (object: THREE.Object3D) => {
        if ((object as THREE.Mesh).isMesh) {
          const mesh = object as THREE.Mesh;
          let materials: THREE.Material[] = [];
          
          if (Array.isArray(mesh.material)) {
            materials = mesh.material;
          } else if (mesh.material) {
            materials = [mesh.material];
          }
          
          materials.forEach(material => {
            // Проверяем, что материал поддерживает wireframe
            if ('wireframe' in material) {
              const materialWithWireframe = material as THREE.MeshBasicMaterial | 
                                                         THREE.MeshLambertMaterial | 
                                                         THREE.MeshPhongMaterial | 
                                                         THREE.MeshStandardMaterial | 
                                                         THREE.MeshPhysicalMaterial;
              
              // Сохраняем оригинальное состояние
              if (!originalWireframeState.has(material)) {
                originalWireframeState.set(material, materialWithWireframe.wireframe || false);
              }
              
              // Включаем режим wireframe
              materialWithWireframe.wireframe = true;
            }
          });
        }
        
        // Рекурсивно обрабатываем дочерние объекты
        object.children.forEach(updateMaterials);
      };
      
      // Применяем ко всей сцене
      updateMaterials(scene);
      
      // Очистка при размонтировании
      return () => {
        // Возвращаем оригинальные настройки wireframe
        const restoreMaterials = (object: THREE.Object3D) => {
          if ((object as THREE.Mesh).isMesh) {
            const mesh = object as THREE.Mesh;
            let materials: THREE.Material[] = [];
            
            if (Array.isArray(mesh.material)) {
              materials = mesh.material;
            } else if (mesh.material) {
              materials = [mesh.material];
            }
            
            materials.forEach(material => {
              if ('wireframe' in material && originalWireframeState.has(material)) {
                const materialWithWireframe = material as THREE.MeshBasicMaterial | 
                                                          THREE.MeshLambertMaterial | 
                                                          THREE.MeshPhongMaterial | 
                                                          THREE.MeshStandardMaterial | 
                                                          THREE.MeshPhysicalMaterial;
                
                materialWithWireframe.wireframe = originalWireframeState.get(material) || false;
              }
            });
          }
          
          object.children.forEach(restoreMaterials);
        };
        
        restoreMaterials(scene);
      };
    }
  }, [scene, showWireframe]);
  
  return (
    <>
      {showFps && <Stats />}
      
      {showGizmo && (
        <GizmoHelper
          alignment="bottom-right"
          margin={[80, 80]}
        >
          <GizmoViewport axisColors={['red', 'green', 'blue']} labelColor="black" />
        </GizmoHelper>
      )}
    </>
  );
};

export default DebugStats; 
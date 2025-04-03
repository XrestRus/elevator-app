import { useEffect, useRef } from 'react';
import { useThree } from '@react-three/fiber';
import { Stats, GizmoHelper, GizmoViewport } from '@react-three/drei';
import * as THREE from 'three';

/**
 * Компонент для отображения отладочной информации Three.js с оптимизацией производительности
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
      const processedObjects = new Set<THREE.Object3D>();
      
      // Функция обхода сцены и обновления материалов (оптимизированная)
      const updateMaterials = (object: THREE.Object3D) => {
        // Пропускаем уже обработанные объекты для предотвращения дублирования
        if (processedObjects.has(object)) return;
        processedObjects.add(object);
        
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
              materialWithWireframe.needsUpdate = true; // Помечаем, что материал нужно обновить
            }
          });
        }
        
        // Рекурсивно обрабатываем дочерние объекты
        for (let i = 0; i < object.children.length; i++) {
          updateMaterials(object.children[i]);
        }
      };
      
      // Применяем ко всей сцене
      updateMaterials(scene);
      
      // Очистка при размонтировании
      return () => {
        // Сбрасываем Set для обработанных объектов
        processedObjects.clear();
        
        // Возвращаем оригинальные настройки wireframe
        const restoreMaterials = (object: THREE.Object3D) => {
          if (processedObjects.has(object)) return;
          processedObjects.add(object);
          
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
                materialWithWireframe.needsUpdate = true; // Помечаем, что материал нужно обновить
              }
            });
          }
          
          for (let i = 0; i < object.children.length; i++) {
            restoreMaterials(object.children[i]);
          }
        };
        
        restoreMaterials(scene);
      };
    }
  }, [scene, showWireframe]);
  
  return (
    <>
      {showFps && <Stats className="stats" showPanel={0} />}
      
      {showGizmo && (
        <GizmoHelper
          alignment="bottom-right"
          margin={[80, 80]}
          renderPriority={-2} // Низкий приоритет рендеринга
        >
          <GizmoViewport axisColors={['red', 'green', 'blue']} labelColor="black" />
        </GizmoHelper>
      )}
    </>
  );
};

export default DebugStats; 
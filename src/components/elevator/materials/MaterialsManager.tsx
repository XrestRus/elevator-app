import { useMemo } from 'react';
import * as THREE from 'three';
import { createWallMaterialWithCustomRepeat } from '../ElevatorMaterialsUtils';
import type { ElevatorState, Materials } from '../../../store/elevatorSlice';
import { 
  ExtendedMaterialParameters, 
  MaterialsManagerResult,
  MaterialsConfig
} from './types';

/**
 * Хук для управления материалами лифта
 * Отвечает за создание и конфигурирование всех материалов, используемых в модели лифта
 */
export const useMaterialsManager = (
  materials: MaterialsConfig | Materials, 
  elevator: ElevatorState
): MaterialsManagerResult => {
  // Базовый материал для стен
  const basicWallMaterial = useMemo(
    () => {
      // Начинаем с стандартного материала
      const materialProps: ExtendedMaterialParameters = {
        color: materials.walls,
        metalness: materials.metalness.walls,
        roughness: materials.roughness.walls,
      };
      
      // Добавляем свойство эмиссии (свечения)
      if (materials.emission.enabled) {
        materialProps.emissive = new THREE.Color(materials.emission.color);
        materialProps.emissiveIntensity = materials.emission.walls;
      }
      
      // Добавляем свойство прозрачности
      if (materials.transparency.enabled && materials.transparency.walls > 0) {
        materialProps.transparent = true;
        materialProps.opacity = 1 - materials.transparency.walls;
        materialProps.depthWrite = materials.transparency.walls < 0.95;
      }
      
      // Создаем материал определенного типа в зависимости от включенных свойств
      if ((materials.refraction.enabled) || 
          (materials.anisotropy.enabled && materials.anisotropy.walls > 0)) {
        // Для преломления и анизотропии нужен MeshPhysicalMaterial
        const physicalMaterial = new THREE.MeshPhysicalMaterial(materialProps);
        
        // Применяем свойство преломления
        if (materials.refraction.enabled) {
          physicalMaterial.transmission = materials.transparency.enabled 
            ? materials.transparency.walls
            : 0.5;
          physicalMaterial.ior = materials.refraction.walls;
        }
        
        // Применяем свойство анизотропности
        if (materials.anisotropy.enabled && materials.anisotropy.walls > 0) {
          physicalMaterial.anisotropy = materials.anisotropy.walls;
          physicalMaterial.anisotropyRotation = materials.anisotropy.direction;
        }
        
        return physicalMaterial;
      } else {
        // Для остальных случаев достаточно MeshStandardMaterial
        return new THREE.MeshStandardMaterial(materialProps);
      }
    },
    [
      materials.walls, 
      materials.metalness.walls, 
      materials.roughness.walls,
      materials.emission.walls,
      materials.emission.color,
      materials.emission.enabled,
      materials.transparency.walls,
      materials.transparency.enabled,
      materials.refraction.walls,
      materials.refraction.enabled,
      materials.anisotropy.walls,
      materials.anisotropy.direction,
      materials.anisotropy.enabled
    ]
  );

  // Базовый материал для пола
  const basicFloorMaterial = useMemo(
    () => {
      // Начинаем с стандартного материала
      const materialProps: ExtendedMaterialParameters = {
        color: materials.floor,
        metalness: materials.metalness.floor,
        roughness: materials.roughness.floor,
      };
      
      // Добавляем свойство эмиссии (свечения)
      if (materials.emission.enabled) {
        materialProps.emissive = new THREE.Color(materials.emission.color);
        materialProps.emissiveIntensity = materials.emission.floor;
      }
      
      // Добавляем свойство прозрачности
      if (materials.transparency.enabled && materials.transparency.floor > 0) {
        materialProps.transparent = true;
        materialProps.opacity = 1 - materials.transparency.floor;
        materialProps.depthWrite = materials.transparency.floor < 0.95;
      }
      
      // Создаем материал определенного типа в зависимости от включенных свойств
      if ((materials.refraction.enabled) || 
          (materials.anisotropy.enabled && materials.anisotropy.floor > 0)) {
        // Для преломления и анизотропии нужен MeshPhysicalMaterial
        const physicalMaterial = new THREE.MeshPhysicalMaterial(materialProps);
        
        // Применяем свойство преломления
        if (materials.refraction.enabled) {
          physicalMaterial.transmission = materials.transparency.enabled 
            ? materials.transparency.floor
            : 0.5;
          physicalMaterial.ior = materials.refraction.floor;
        }
        
        // Применяем свойство анизотропности
        if (materials.anisotropy.enabled && materials.anisotropy.floor > 0) {
          physicalMaterial.anisotropy = materials.anisotropy.floor;
          physicalMaterial.anisotropyRotation = materials.anisotropy.direction;
        }
        
        return physicalMaterial;
      } else {
        // Для остальных случаев достаточно MeshStandardMaterial
        return new THREE.MeshStandardMaterial(materialProps);
      }
    },
    [
      materials.floor, 
      materials.metalness.floor, 
      materials.roughness.floor,
      materials.emission.floor,
      materials.emission.color,
      materials.emission.enabled,
      materials.transparency.floor,
      materials.transparency.enabled,
      materials.refraction.floor,
      materials.refraction.enabled,
      materials.anisotropy.floor,
      materials.anisotropy.direction,
      materials.anisotropy.enabled
    ]
  );

  // Базовый материал для потолка
  const basicCeilingMaterial = useMemo(
    () => {
      // Начинаем с стандартного материала
      const materialProps: ExtendedMaterialParameters = {
        color: materials.ceiling,
        metalness: materials.metalness.ceiling,
        roughness: materials.roughness.ceiling,
      };
      
      // Добавляем свойство эмиссии (свечения)
      if (materials.emission.enabled) {
        materialProps.emissive = new THREE.Color(materials.emission.color);
        materialProps.emissiveIntensity = materials.emission.ceiling;
      }
      
      // Добавляем свойство прозрачности
      if (materials.transparency.enabled && materials.transparency.ceiling > 0) {
        materialProps.transparent = true;
        materialProps.opacity = 1 - materials.transparency.ceiling;
        materialProps.depthWrite = materials.transparency.ceiling < 0.95;
      }
      
      // Создаем материал определенного типа в зависимости от включенных свойств
      if ((materials.refraction.enabled) || 
          (materials.anisotropy.enabled && materials.anisotropy.ceiling > 0)) {
        // Для преломления и анизотропии нужен MeshPhysicalMaterial
        const physicalMaterial = new THREE.MeshPhysicalMaterial(materialProps);
        
        // Применяем свойство преломления
        if (materials.refraction.enabled) {
          physicalMaterial.transmission = materials.transparency.enabled 
            ? materials.transparency.ceiling
            : 0.5;
          physicalMaterial.ior = materials.refraction.ceiling;
        }
        
        // Применяем свойство анизотропности
        if (materials.anisotropy.enabled && materials.anisotropy.ceiling > 0) {
          physicalMaterial.anisotropy = materials.anisotropy.ceiling;
          physicalMaterial.anisotropyRotation = materials.anisotropy.direction;
        }
        
        return physicalMaterial;
      } else {
        // Для остальных случаев достаточно MeshStandardMaterial
        return new THREE.MeshStandardMaterial(materialProps);
      }
    },
    [
      materials.ceiling, 
      materials.metalness.ceiling, 
      materials.roughness.ceiling,
      materials.emission.ceiling,
      materials.emission.color,
      materials.emission.enabled,
      materials.transparency.ceiling,
      materials.transparency.enabled,
      materials.refraction.ceiling,
      materials.refraction.enabled,
      materials.anisotropy.ceiling,
      materials.anisotropy.direction,
      materials.anisotropy.enabled
    ]
  );

  // Базовый материал для дверей
  const doorMaterial = useMemo(
    () => {
      // Начинаем с стандартного материала
      const materialProps: ExtendedMaterialParameters = {
        color: materials.doors,
        metalness: materials.metalness.doors,
        roughness: materials.roughness.doors,
      };
      
      // Добавляем свойство эмиссии (свечения)
      if (materials.emission.enabled) {
        materialProps.emissive = new THREE.Color(materials.emission.color);
        materialProps.emissiveIntensity = materials.emission.doors;
      }
      
      // Добавляем свойство прозрачности
      if (materials.transparency.enabled && materials.transparency.doors > 0) {
        materialProps.transparent = true;
        materialProps.opacity = 1 - materials.transparency.doors;
        materialProps.depthWrite = materials.transparency.doors < 0.95;
      }
      
      // Создаем материал определенного типа в зависимости от включенных свойств
      if ((materials.refraction.enabled) || 
          (materials.anisotropy.enabled && materials.anisotropy.doors > 0)) {
        // Для преломления и анизотропии нужен MeshPhysicalMaterial
        const physicalMaterial = new THREE.MeshPhysicalMaterial(materialProps);
        
        // Применяем свойство преломления
        if (materials.refraction.enabled) {
          physicalMaterial.transmission = materials.transparency.enabled 
            ? materials.transparency.doors
            : 0.5;
          physicalMaterial.ior = materials.refraction.doors;
        }
        
        // Применяем свойство анизотропности
        if (materials.anisotropy.enabled && materials.anisotropy.doors > 0) {
          physicalMaterial.anisotropy = materials.anisotropy.doors;
          physicalMaterial.anisotropyRotation = materials.anisotropy.direction;
        }
        
        return physicalMaterial;
      } else {
        // Для остальных случаев достаточно MeshStandardMaterial
        return new THREE.MeshStandardMaterial(materialProps);
      }
    },
    [
      materials.doors, 
      materials.metalness.doors, 
      materials.roughness.doors,
      materials.emission.doors,
      materials.emission.color,
      materials.emission.enabled,
      materials.transparency.doors,
      materials.transparency.enabled,
      materials.refraction.doors,
      materials.refraction.enabled,
      materials.anisotropy.doors,
      materials.anisotropy.direction,
      materials.anisotropy.enabled
    ]
  );

  // Материал для передней стены
  const frontWallMaterial = useMemo(
    () => {
      // Начинаем с стандартного материала
      const materialProps: ExtendedMaterialParameters = {
        color: materials.walls,
        metalness: materials.metalness.walls,
        roughness: materials.roughness.walls,
      };
      
      // Добавляем свойство эмиссии (свечения)
      if (materials.emission.enabled) {
        materialProps.emissive = new THREE.Color(materials.emission.color);
        materialProps.emissiveIntensity = materials.emission.walls;
      }
      
      // Добавляем свойство прозрачности
      if (materials.transparency.enabled && materials.transparency.walls > 0) {
        materialProps.transparent = true;
        materialProps.opacity = 1 - materials.transparency.walls;
        materialProps.depthWrite = materials.transparency.walls < 0.95;
      }
      
      // Создаем материал определенного типа в зависимости от включенных свойств
      if ((materials.refraction.enabled) || 
          (materials.anisotropy.enabled && materials.anisotropy.walls > 0)) {
        // Для преломления и анизотропии нужен MeshPhysicalMaterial
        const physicalMaterial = new THREE.MeshPhysicalMaterial(materialProps);
        
        // Применяем свойство преломления
        if (materials.refraction.enabled) {
          physicalMaterial.transmission = materials.transparency.enabled 
            ? materials.transparency.walls
            : 0.5;
          physicalMaterial.ior = materials.refraction.walls;
        }
        
        // Применяем свойство анизотропности
        if (materials.anisotropy.enabled && materials.anisotropy.walls > 0) {
          physicalMaterial.anisotropy = materials.anisotropy.walls;
          physicalMaterial.anisotropyRotation = materials.anisotropy.direction;
        }
        
        return physicalMaterial;
      } else {
        // Для остальных случаев достаточно MeshStandardMaterial
        return new THREE.MeshStandardMaterial(materialProps);
      }
    },
    [
      materials.walls, 
      materials.metalness.walls, 
      materials.roughness.walls,
      materials.emission.walls,
      materials.emission.color,
      materials.emission.enabled,
      materials.transparency.walls,
      materials.transparency.enabled,
      materials.refraction.walls,
      materials.refraction.enabled,
      materials.anisotropy.walls,
      materials.anisotropy.direction,
      materials.anisotropy.enabled
    ]
  );
  
  // Материалы с разным повторением текстур для разных стен
  const sideWallMaterial = useMemo(
    () => createWallMaterialWithCustomRepeat(basicWallMaterial, 1, 1),
    [basicWallMaterial]
  );

  const backWallMaterial = useMemo(
    () => createWallMaterialWithCustomRepeat(basicWallMaterial, 1, 1),
    [basicWallMaterial]
  );

  // Материал для поручней (автоматически использует цвет из настроек)
  const handrailMaterial = useMemo(
    () => {
      const color = new THREE.Color(materials.handrails);
      
      return new THREE.MeshPhysicalMaterial({
        color: color,
        metalness: 0.9,
        roughness: 0.1,
        envMapIntensity: 1.5,
        clearcoat: 0.3, // Добавляем легкое покрытие лаком для глянца
        clearcoatRoughness: 0.1, // Делаем покрытие гладким
      });
    },
    [materials.handrails] // Зависимость только от цвета поручней
  );

  // Материал для декоративных полос
  const decorationStripesMaterial = useMemo(() => {
    if (!elevator.decorationStripes?.enabled) return null;
    
    // Наследуем цвет стен, возможно с небольшим оттенком
    const baseColor = new THREE.Color(materials.walls);
    
    // Вместо добавления небольшого оттенка используем сам цвет полос напрямую
    let finalColor = baseColor;
    
    if (elevator.decorationStripes.color) {
      // Используем цвет полос как основной
      finalColor = new THREE.Color(elevator.decorationStripes.color);
      
      // Добавляем совсем небольшое влияние цвета стен только для металлических 
      // материалов, чтобы сохранить гармоничность
      if (elevator.decorationStripes.material === 'metal') {
        finalColor.lerp(baseColor, 0.15); // 15% влияния цвета стен
      }
    }
    
    return new THREE.MeshStandardMaterial({
      color: finalColor,
      metalness: elevator.decorationStripes.material === 'metal' ? 0.9 : 
                (elevator.decorationStripes.material === 'glossy' ? 0.7 : 0.1),
      roughness: elevator.decorationStripes.material === 'metal' ? 0.1 : 
                (elevator.decorationStripes.material === 'glossy' ? 0.05 : 0.8),
      emissive: elevator.decorationStripes.material === 'glossy' ? 
                finalColor : '#000000',
      emissiveIntensity: elevator.decorationStripes.material === 'glossy' ? 0.05 : 0
    });
  }, [
    elevator.decorationStripes?.enabled,
    elevator.decorationStripes?.color,
    elevator.decorationStripes?.material,
    materials.walls
  ]);

  // Материал для стыков между стенами
  const jointStripeMaterial = useMemo(() => {
    // Если стыки не включены, возвращаем null
    if (!elevator.joints?.enabled) return null;
    
    // Если полосы активированы, используем их цвет и материал для стыков
    if (elevator.decorationStripes?.enabled && decorationStripesMaterial) {
      return decorationStripesMaterial;
    }
    
    // Если указан цвет стыков, используем его
    if (elevator.joints?.color) {
      const jointColor = new THREE.Color(elevator.joints.color);
      
      return new THREE.MeshStandardMaterial({
        color: jointColor,
        metalness: elevator.joints.material === 'metal' ? 0.9 : 
                  (elevator.joints.material === 'glossy' ? 0.7 : 0.1),
        roughness: elevator.joints.material === 'metal' ? 0.1 : 
                  (elevator.joints.material === 'glossy' ? 0.05 : 0.8),
        emissive: elevator.joints.material === 'glossy' ? 
                  jointColor : '#000000',
        emissiveIntensity: elevator.joints.material === 'glossy' ? 0.05 : 0
      });
    }
    
    // Если цвет не указан, используем цвет стен, но делаем его гораздо темнее
    const color = new THREE.Color(materials.walls);
    color.multiplyScalar(0.5); // Делаем цвет ещё темнее (50% от исходного)
    
    return new THREE.MeshStandardMaterial({
      color: color,
      metalness: 0.9, // Увеличиваем металличность
      roughness: 0.1, // Уменьшаем шероховатость для более заметного блеска
    });
  }, [
    elevator.joints?.enabled,
    elevator.joints?.color,
    elevator.joints?.material,
    elevator.decorationStripes?.enabled,
    decorationStripesMaterial,
    materials.walls
  ]);

  // Экспортируем все созданные материалы как единый объект
  return {
    actualWallMaterial: basicWallMaterial,
    actualFloorMaterial: basicFloorMaterial, 
    actualCeilingMaterial: basicCeilingMaterial,
    actualDoorMaterial: doorMaterial,
    actualFrontWallMaterial: frontWallMaterial,
    sideWallMaterial,
    backWallMaterial,
    handrailMaterial,
    decorationStripesMaterial,
    jointStripeMaterial
  };
}; 
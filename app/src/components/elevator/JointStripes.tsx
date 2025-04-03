import React, { useMemo, useRef, useEffect } from "react";
import * as THREE from "three";
import { JointOptions } from "../../store/elevatorSlice";
import { makeHoverable } from "../../utils/objectInfo";

/**
 * Свойства компонента стыков между стенами
 */
interface JointStripesProps {
  dimensions: {
    width: number;
    height: number;
    depth: number;
  };
  jointStripeMaterial: THREE.Material | null;
  jointOptions?: JointOptions;
}

/**
 * Тип данных для информации о стыке
 */
interface JointInfo {
  position: [number, number, number];
  args: [number, number, number];
  name: string;
}

/**
 * Компонент для отображения стыков между стенами лифта с оптимизацией через InstancedMesh
 */
const JointStripes: React.FC<JointStripesProps> = ({
  dimensions,
  jointStripeMaterial,
  jointOptions,
}) => {
  const instancedMeshRef = useRef<THREE.InstancedMesh>(null);
  
  // Мемоизированный массив данных о стыках и их преобразованиях
  const jointInfos = useMemo<JointInfo[]>(() => {
    // Если материал не определен или стыки отключены, возвращаем пустой массив
    if (!jointStripeMaterial || !jointOptions?.enabled) {
      return [];
    }

    // Получаем коэффициент качества из параметров, по умолчанию 1 (высокое качество)
    const qualityFactor = jointOptions.qualityFactor ?? 1;

    // Толщина стыка - из настроек, преобразованная из мм в метры
    const jointWidth = (jointOptions.width || 4) / 100;

    // Выступ стыков - из настроек, преобразованный из мм в метры
    // Уменьшаем выступ для низкого качества
    const protrusion = ((jointOptions.protrusion || 3) / 1000) * qualityFactor;

    const joints: JointInfo[] = [];

    // Вертикальные стыки между стенами
    // Стык между задней стеной и левой боковой
    joints.push({
      name: "Стык задней и левой стены",
      position: [
        -dimensions.width / 2 + jointWidth / 2,
        0,
        -dimensions.depth / 2 + jointWidth / 2,
      ],
      args: [
        jointWidth + protrusion,
        dimensions.height,
        jointWidth + protrusion,
      ],
    });

    // Стык между задней стеной и правой боковой
    joints.push({
      name: "Стык задней и правой стены",
      position: [
        dimensions.width / 2 - jointWidth / 2,
        0,
        -dimensions.depth / 2 + jointWidth / 2,
      ],
      args: [
        jointWidth + protrusion,
        dimensions.height,
        jointWidth + protrusion,
      ],
    });

    // Стык между левой боковой и передней стенками
    joints.push({
      name: "Стык передней и левой стены",
      position: [
        -dimensions.width / 2 + jointWidth / 2,
        0,
        dimensions.depth / 2 - (jointWidth * 1),
      ],
      args: [
        jointWidth + protrusion,
        dimensions.height,
        jointWidth + protrusion,
      ],
    });

    // Стык между правой боковой и передней стенками
    joints.push({
      name: "Стык передней и правой стены",
      position: [
        dimensions.width / 2 - jointWidth / 2,
        0,
        dimensions.depth / 2 - (jointWidth * 1),
      ],
      args: [
        jointWidth + protrusion,
        dimensions.height,
        jointWidth + protrusion,
      ],
    });

    // Горизонтальные стыки между стенами и полом/потолком

    // Стык между левой стеной и полом
    joints.push({
      name: "Стык левой стены и пола",
      position: [
        -dimensions.width / 2 + jointWidth / 2,
        -dimensions.height / 2 + jointWidth / 2,
        0,
      ],
      args: [
        jointWidth + protrusion,
        jointWidth + protrusion,
        dimensions.depth + 0.01,
      ],
    });

    // Стык между правой стеной и полом
    joints.push({
      name: "Стык правой стены и пола",
      position: [
        dimensions.width / 2 - jointWidth / 2,
        -dimensions.height / 2 + jointWidth / 2,
        0,
      ],
      args: [
        jointWidth + protrusion,
        jointWidth + protrusion,
        dimensions.depth + 0.01,
      ],
    });

    // Стык между задней стеной и полом
    joints.push({
      name: "Стык задней стены и пола",
      position: [
        0,
        -dimensions.height / 2 + jointWidth / 2,
        -dimensions.depth / 2 + jointWidth / 2,
      ],
      args: [
        dimensions.width + protrusion,
        jointWidth + protrusion,
        jointWidth + protrusion,
      ],
    });

    // Стык между передней стеной и полом (исключая пространство для дверей)
    // Левая часть стыка передней стены
    joints.push({
      name: "Стык пола и левой части передней стены",
      position: [
        -dimensions.width / 5,
        -dimensions.height / 2 + jointWidth / 2,
        dimensions.depth / 2.02 - jointWidth / 2,
      ],
      args: [
        dimensions.width / 2.5,
        jointWidth + protrusion,
        jointWidth + protrusion,
      ],
    });

    // Правая часть стыка передней стены
    joints.push({
      name: "Стык пола и правой части передней стены",
      position: [
        dimensions.width / 5,
        -dimensions.height / 2 + jointWidth / 2,
        dimensions.depth / 2.02 - jointWidth / 2,
      ],
      args: [
        dimensions.width / 2.5,
        jointWidth + protrusion,
        jointWidth + protrusion,
      ],
    });

    // Стык между левой стеной и потолком
    joints.push({
      name: "Стык левой стены и потолка",
      position: [
        -dimensions.width / 2 + jointWidth / 2,
        dimensions.height / 2 - jointWidth / 2,
        0,
      ],
      args: [
        jointWidth + protrusion,
        jointWidth + protrusion,
        dimensions.depth + 0.01,
      ],
    });

    // Стык между правой стеной и потолком
    joints.push({
      name: "Стык правой стены и потолка",
      position: [
        dimensions.width / 2 - jointWidth / 2,
        dimensions.height / 2 - jointWidth / 2,
        0,
      ],
      args: [
        jointWidth + protrusion,
        jointWidth + protrusion,
        dimensions.depth + 0.01,
      ],
    });

    // Стык между задней стеной и потолком
    joints.push({
      name: "Стык задней стены и потолка",
      position: [
        0,
        dimensions.height / 2 - jointWidth / 2,
        -dimensions.depth / 2 + jointWidth / 2,
      ],
      args: [
        dimensions.width + protrusion,
        jointWidth + protrusion,
        jointWidth + protrusion,
      ],
    });

    // Стык между передней стеной и потолком (исключая пространство для дверей)
    // Левая часть стыка передней стены
    joints.push({
      name: "Стык потолка и левой части передней стены",
      position: [
        -dimensions.width / 6,
        dimensions.height / 2 - jointWidth / 2,
        dimensions.depth / 2.02 - jointWidth / 2,
      ],
      args: [
        dimensions.width / 1.5,
        jointWidth + protrusion,
        jointWidth + protrusion,
      ],
    });

    // Правая часть стыка передней стены
    joints.push({
      name: "Стык потолка и правой части передней стены",
      position: [
        dimensions.width / 6,
        dimensions.height / 2 - jointWidth / 2,
        dimensions.depth / 2.02 - jointWidth / 2,
      ],
      args: [
        dimensions.width / 1.5,
        jointWidth + protrusion,
        jointWidth + protrusion,
      ],
    });

    return joints;
  }, [dimensions, jointOptions]);

  // Создаем общую геометрию для всех стыков
  const boxGeometry = useMemo(() => {
    // Если материал не определен или стыки отключены, возвращаем null
    if (!jointStripeMaterial || !jointOptions?.enabled || jointInfos.length === 0) {
      return null;
    }
    
    // Создаем простую коробку с размерами 1x1x1, она будет масштабирована через матрицу
    return new THREE.BoxGeometry(1, 1, 1);
  }, [jointStripeMaterial, jointOptions, jointInfos]);

  // Эффект для настройки инстансов после рендера компонента
  useEffect(() => {
    if (instancedMeshRef.current && jointInfos.length > 0) {
      const mesh = instancedMeshRef.current;
      // Создаем массив объектов для хранения информации о каждом стыке
      const jointObjects: THREE.Object3D[] = [];
      
      // Создаем инстансы для каждого стыка
      jointInfos.forEach((joint, index) => {
        // Создаем временный невидимый объект для установки матрицы
        const tempObject = new THREE.Object3D();
        
        // Устанавливаем позицию
        tempObject.position.set(...joint.position);
        
        // Устанавливаем масштаб для размеров стыка
        tempObject.scale.set(...joint.args);
        
        // Обновляем матрицу 
        tempObject.updateMatrix();
        
        // Применяем матрицу к инстансу
        mesh.setMatrixAt(index, tempObject.matrix);
        
        // Сохраняем объект для возможного использования в будущем
        jointObjects.push(tempObject);
        
        // Сохраняем название стыка в userData инстанса
        if (!mesh.userData.jointNames) {
          mesh.userData.jointNames = [];
        }
        mesh.userData.jointNames[index] = joint.name;
      });
      
      // Уведомляем Three.js, что матрицы изменены
      mesh.instanceMatrix.needsUpdate = true;
      
      // Добавление информации для наведения мыши
      makeHoverable(mesh, {
        name: "Стык",
        description: "Декоративная накладка на стыке элементов лифта",
        material: "Материал стыков",
        additionalInfo: {
          толщина: `${(jointOptions?.width || 4)} мм`,
          выступ: `${(jointOptions?.protrusion || 3)} мм`
        }
      });
    }
  }, [jointInfos, jointOptions, instancedMeshRef]);

  // Если материал не определен или стыки отключены, возвращаем null
  if (!jointStripeMaterial || !jointOptions?.enabled || jointInfos.length === 0 || !boxGeometry) {
    return null;
  }

  // Рендерим InstancedMesh с указанным количеством инстансов
  return (
    <instancedMesh 
      ref={instancedMeshRef} 
      args={[boxGeometry, jointStripeMaterial, jointInfos.length]}
      castShadow={false}
    />
  );
};

export default JointStripes;

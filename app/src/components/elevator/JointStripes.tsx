import React, { useMemo } from "react";
import * as THREE from "three";
import { JointOptions } from "../../store/elevatorSlice";
import { useDispatch } from "react-redux";
import { setJoints } from "../../store/elevatorSlice";
import MakeHoverable from "../../components/ui/makeHoverable";

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
  const dispatch = useDispatch();
  
  // Обработчик клика по стыку
  const handleJointClick = (jointName: string) => {
    console.log("Выбран стык:", jointName);
    dispatch(setJoints({ selectedJoint: jointName }));
  };

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
        dimensions.width / 1.6,
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
        dimensions.width / 1.6,
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
  }, [dimensions, jointOptions, jointStripeMaterial]);

  // Мемоизируем все элементы для оптимизации
  const jointElements = useMemo(() => {
    // Если материал не определен или стыки отключены, возвращаем пустой массив
    if (!jointStripeMaterial || !jointOptions?.enabled) {
      return [];
    }
    
    const elements: React.ReactElement[] = [];
    
    // Для каждого стыка создаем отдельный элемент
    jointInfos.forEach((joint, index) => {
      elements.push(
        <MakeHoverable
          key={`joint-${index}`}
          name={joint.name}
          type="Стык элементов"
          description="Декоративная накладка на стыке элементов лифта"
          material={`Материал: ${jointOptions.material || 'металл'}`}
          dimensions={{
            width: joint.args[0],
            height: joint.args[1],
            depth: joint.args[2]
          }}
          additionalInfo={{
            "Толщина": `${(jointOptions.width || 4)} мм`,
            "Выступ": `${(jointOptions.protrusion || 3)} мм`
          }}
          onSelect={() => handleJointClick(joint.name)}
        >
          <mesh
            position={joint.position}
            castShadow={false}
          >
            <boxGeometry args={joint.args} />
            <primitive object={jointStripeMaterial} attach="material" />
          </mesh>
        </MakeHoverable>
      );
    });
    
    return elements;
  }, [jointInfos, jointStripeMaterial, jointOptions, handleJointClick]);

  // Если материал не определен или стыки отключены, возвращаем null
  if (!jointStripeMaterial || !jointOptions?.enabled || jointInfos.length === 0) {
    return null;
  }

  // Рендерим группу с созданными элементами
  return <>{jointElements}</>;
};

export default JointStripes;

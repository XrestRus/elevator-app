import React from "react";
import { RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import MakeHoverable from "../ui/makeHoverable";
import colorUtils from "../../utils/colorUtils";

/**
 * Свойства компонента поручней лифта
 */
interface ElevatorHandrailsProps {
  dimensions: {
    width: number;
    depth: number;
  };
  handrailMaterial: THREE.Material;
  isVisible: boolean;
  showLowerHandrails?: boolean; // Добавлен опциональный параметр для нижних поручней
}

/**
 * Компонент для отображения поручней в лифте с Т-образной формой
 */
const ElevatorHandrails: React.FC<ElevatorHandrailsProps> = ({
  dimensions,
  handrailMaterial,
  isVisible,
  showLowerHandrails = true, // По умолчанию нижние поручни включены
}) => {
  if (!isVisible) {
    return null;
  }
  
  // Получаем цвет материала поручней для отображения в тултипе
  const getHandrailColor = () => {
    return colorUtils.getMaterialColor(handrailMaterial);
  };
  
  // Создаем обертки для левого и правого стандартных поручней
  const leftHandrail = (
    <group position={[-dimensions.width / 2 + 0.06, -0.1, 0]}>
      {/* Основная горизонтальная часть поручня (рукоять) */}
      <RoundedBox
        position={[0, 0, 0]}
        args={[0.04, 0.03, dimensions.depth * 0.6]}
        radius={0.01}
        smoothness={4}
        castShadow
        receiveShadow
      >
        <primitive object={handrailMaterial} attach="material" />
      </RoundedBox>
      
      {/* Вертикальные крепления к стене (ножки Т-образной формы) - выдвинутые от стены */}
      <RoundedBox
        position={[-0.06, 0, dimensions.depth * 0.25]}
        args={[0.08, 0.025, 0.025]}
        radius={0.005}
        smoothness={4}
        castShadow
        receiveShadow
      >
        <primitive object={handrailMaterial} attach="material" />
      </RoundedBox>
      
      <RoundedBox
        position={[-0.06, 0, 0]}
        args={[0.08, 0.025, 0.025]}
        radius={0.005}
        smoothness={4}
        castShadow
        receiveShadow
      >
        <primitive object={handrailMaterial} attach="material" />
      </RoundedBox>
      
      <RoundedBox
        position={[-0.06, 0, -dimensions.depth * 0.25]}
        args={[0.08, 0.025, 0.025]}
        radius={0.005}
        smoothness={4}
        castShadow
        receiveShadow
      >
        <primitive object={handrailMaterial} attach="material" />
      </RoundedBox>
    </group>
  );
  
  const rightHandrail = (
    <group position={[dimensions.width / 2 - 0.06, -0.1, 0]}>
      {/* Основная горизонтальная часть поручня (рукоять) */}
      <RoundedBox
        position={[0, 0, 0]}
        args={[0.04, 0.03, dimensions.depth * 0.6]}
        radius={0.01}
        smoothness={4}
        castShadow
        receiveShadow
      >
        <primitive object={handrailMaterial} attach="material" />
      </RoundedBox>
      
      {/* Вертикальные крепления к стене (ножки Т-образной формы) - выдвинутые от стены */}
      <RoundedBox
        position={[0.06, 0, dimensions.depth * 0.25]}
        args={[0.08, 0.025, 0.025]}
        radius={0.005}
        smoothness={4}
        castShadow
        receiveShadow
      >
        <primitive object={handrailMaterial} attach="material" />
      </RoundedBox>
      
      <RoundedBox
        position={[0.06, 0, 0]}
        args={[0.08, 0.025, 0.025]}
        radius={0.005}
        smoothness={4}
        castShadow
        receiveShadow
      >
        <primitive object={handrailMaterial} attach="material" />
      </RoundedBox>
      
      <RoundedBox
        position={[0.06, 0, -dimensions.depth * 0.25]}
        args={[0.08, 0.025, 0.025]}
        radius={0.005}
        smoothness={4}
        castShadow
        receiveShadow
      >
        <primitive object={handrailMaterial} attach="material" />
      </RoundedBox>
    </group>
  );
  
  // Создаем обертки для нижних поручней (ближе к полу)
  const leftLowerHandrail = (
    <group position={[-dimensions.width / 2 + 0.025, -1.05, 0]}>
      {/* Узкая горизонтальная панель нижнего поручня без выступов */}
      <RoundedBox
        position={[0, 0, 0]}
        args={[0.05, 0.12, dimensions.depth]} // Делаем на всю длину стены
        radius={0.01}
        smoothness={4}
        castShadow
        receiveShadow
      >
        <primitive object={handrailMaterial} attach="material" />
      </RoundedBox>
      
      {/* Тень на полу от нижнего поручня */}
      <mesh 
        position={[0, -0.065, 0]} 
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[0.1, dimensions.depth]} />
        <meshBasicMaterial 
          color="black" 
          transparent={true} 
          opacity={0.08} 
          depthWrite={false}
        />
      </mesh>
    </group>
  );
  
  const rightLowerHandrail = (
    <group position={[dimensions.width / 2 - 0.025, -1.05, 0]}>
      {/* Узкая горизонтальная панель нижнего поручня без выступов */}
      <RoundedBox
        position={[0, 0, 0]}
        args={[0.05, 0.12, dimensions.depth]} // Делаем на всю длину стены
        radius={0.01}
        smoothness={4}
        castShadow
        receiveShadow
      >
        <primitive object={handrailMaterial} attach="material" />
      </RoundedBox>
      
      {/* Тень на полу от нижнего поручня */}
      <mesh 
        position={[0, -0.065, 0]} 
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[0.1, dimensions.depth * 1.05]} />
        <meshBasicMaterial 
          color="black" 
          transparent={true} 
          opacity={0.08} 
          depthWrite={false}
        />
      </mesh>
    </group>
  );
  
  // Добавляем задний нижний поручень, соединяющий боковые
  const backLowerHandrail = (
    <group position={[0, -1.05, -dimensions.depth / 2 + 0.025]}>
      {/* Узкая горизонтальная панель заднего поручня */}
      <RoundedBox
        position={[0, 0, 0]}
        args={[dimensions.width, 0.12, 0.05]} // Размеры на всю ширину стены
        radius={0.01}
        smoothness={4}
        castShadow
        receiveShadow
      >
        <primitive object={handrailMaterial} attach="material" />
      </RoundedBox>
      
      {/* Тень на полу от нижнего поручня */}
      <mesh 
        position={[0, -0.01, 0.03]} 
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[dimensions.width * 1.05, 0.15]} />
        <meshBasicMaterial 
          color="black" 
          transparent={true} 
          opacity={0.08} 
          depthWrite={false}
        />
      </mesh>
    </group>
  );

  return (
    <>
      {/* Стандартные поручни с возможностью наведения */}
      <MakeHoverable
        name="Левый поручень"
        type="Элемент безопасности"
        description="Т-образный поручень для обеспечения устойчивости пассажиров"
        material="Нержавеющая сталь"
        dimensions={{
          width: 0.04,
          height: 0.03,
          depth: dimensions.depth * 0.6
        }}
        additionalInfo={{
          color: getHandrailColor(),
          texture: "Металлическая поверхность со скругленными краями",
          "Расположение": "Левая стена",
          "Форма": "Т-образная конструкция с выступающими креплениями"
        }}
        requiresDoubleClick={false}
      >
        {leftHandrail}
      </MakeHoverable>
      
      <MakeHoverable
        name="Правый поручень"
        type="Элемент безопасности"
        description="Т-образный поручень для обеспечения устойчивости пассажиров"
        material="Нержавеющая сталь"
        dimensions={{
          width: 0.04,
          height: 0.03,
          depth: dimensions.depth * 0.6
        }}
        additionalInfo={{
          color: getHandrailColor(),
          texture: "Металлическая поверхность со скругленными краями",
          "Расположение": "Правая стена",
          "Форма": "Т-образная конструкция с выступающими креплениями"
        }}
        requiresDoubleClick={false}
      >
        {rightHandrail}
      </MakeHoverable>
      
      {/* Нижние поручни (ближе к полу) */}
      {showLowerHandrails && (
        <>
          <MakeHoverable
            name="Левый нижний поручень"
            type="Элемент безопасности и декора"
            description="Узкая защитная панель у основания стены для предотвращения повреждений"
            material="Нержавеющая сталь"
            dimensions={{
              width: 0.05,
              height: 0.12,
              depth: dimensions.depth
            }}
            additionalInfo={{
              color: getHandrailColor(),
              texture: "Металлическая поверхность со скругленными краями",
              "Расположение": "Левая стена, нижний уровень",
              "Форма": "Монолитная защитная панель"
            }}
            requiresDoubleClick={false}
          >
            {leftLowerHandrail}
          </MakeHoverable>
          
          <MakeHoverable
            name="Правый нижний поручень"
            type="Элемент безопасности и декора"
            description="Узкая защитная панель у основания стены для предотвращения повреждений"
            material="Нержавеющая сталь"
            dimensions={{
              width: 0.05,
              height: 0.12,
              depth: dimensions.depth
            }}
            additionalInfo={{
              color: getHandrailColor(),
              texture: "Металлическая поверхность со скругленными краями",
              "Расположение": "Правая стена, нижний уровень",
              "Форма": "Монолитная защитная панель"
            }}
            requiresDoubleClick={false}
          >
            {rightLowerHandrail}
          </MakeHoverable>
          
          <MakeHoverable
            name="Задний нижний поручень"
            type="Элемент безопасности и декора"
            description="Узкая защитная панель у основания задней стены для завершения защитного контура"
            material="Нержавеющая сталь"
            dimensions={{
              width: dimensions.width,
              height: 0.12,
              depth: 0.05
            }}
            additionalInfo={{
              color: getHandrailColor(),
              texture: "Металлическая поверхность со скругленными краями",
              "Расположение": "Задняя стена, нижний уровень",
              "Форма": "Монолитная защитная панель"
            }}
            requiresDoubleClick={false}
          >
            {backLowerHandrail}
          </MakeHoverable>
        </>
      )}
    </>
  );
};

export default ElevatorHandrails; 
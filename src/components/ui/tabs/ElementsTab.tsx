import { useDispatch } from "react-redux";
import {
  ElevatorState,
  setVisibility,
  setDecorationStripes,
  setLighting,
  setJoints,
  setMaterial
} from "../../../store/elevatorSlice";
import {
  RangeSlider,
  ColorPicker,
  SelectInput,
  CheckboxInput
} from "../common/UIControls";

/**
 * Интерфейс пропсов для компонента ElementsTab
 */
interface ElementsTabProps {
  elevator: ElevatorState;
}

/**
 * Компонент вкладки управления элементами лифта
 * Отвечает за настройку декоративных элементов, освещения и дополнительных компонентов
 */
const ElementsTab: React.FC<ElementsTabProps> = ({ elevator }) => {
  return (
    <div>
      <h3>Управление элементами лифта</h3>
      
      {/* Элементы интерьера */}
      <InteriorElements elevator={elevator} />
      
      {/* Декоративные полосы */}
      <DecorationStripes elevator={elevator} />
      
      {/* Стыки между стенами */}
      <JointControls elevator={elevator} />
      
      {/* Освещение */}
      <LightingControls elevator={elevator} />
    </div>
  );
};

/**
 * Компонент управления элементами интерьера
 */
interface InteriorElementsProps {
  elevator: ElevatorState;
}

const InteriorElements: React.FC<InteriorElementsProps> = ({ elevator }) => {
  const dispatch = useDispatch();
  
  return (
    <div style={{ marginBottom: '16px' }}>
      <h4>Элементы интерьера</h4>
      
      <CheckboxInput
        id="showHandrails"
        label="Поручни"
        checked={elevator.visibility.handrails}
        onChange={(checked) => dispatch(setVisibility({ 
          element: 'handrails', 
          visible: checked 
        }))}
      />
      
      {/* Настройка цвета поручней - отображается только если поручни включены */}
      {elevator.visibility.handrails && (
        <div style={{ marginLeft: '20px', marginTop: '8px', marginBottom: '12px' }}>
          <ColorPicker
            label="Цвет поручней:"
            value={elevator.materials.handrails}
            onChange={(value) => dispatch(setMaterial({ part: 'handrails', color: value }))}
          />
        </div>
      )}
      
      <CheckboxInput
        id="showControlPanel"
        label="Панель управления"
        checked={elevator.visibility.controlPanel}
        onChange={(checked) => dispatch(setVisibility({ 
          element: 'controlPanel', 
          visible: checked 
        }))}
      />
    </div>
  );
};

/**
 * Компонент управления декоративными полосами
 */
interface DecorationStripesProps {
  elevator: ElevatorState;
}

const DecorationStripes: React.FC<DecorationStripesProps> = ({ elevator }) => {
  const dispatch = useDispatch();
  
  // Опции для выбора ориентации полос
  const orientationOptions = [
    { value: 'horizontal', label: 'Горизонтальные' },
    { value: 'vertical', label: 'Вертикальные' }
  ];
  
  // Опции для выбора количества полос
  const countOptions = Array.from({ length: 10 }, (_, i) => ({
    value: (i + 1).toString(),
    label: `${i + 1} ${i === 0 ? 'полоса' : i < 4 ? 'полосы' : 'полос'}`
  }));
  
  return (
    <div style={{ marginBottom: '16px' }}>
      <h4>Декоративные полосы</h4>
      
      <CheckboxInput
        id="showStripes"
        label="Показать декоративные полосы"
        checked={elevator.decorationStripes?.enabled ?? false}
        onChange={(checked) => dispatch(setDecorationStripes({ 
          enabled: checked
        }))}
      />
      
      {(elevator.decorationStripes?.enabled ?? false) && (
        <>
          <SelectInput
            label="Ориентация полос:"
            value={elevator.decorationStripes?.orientation ?? 'horizontal'}
            onChange={(value) => {
              if (value === 'horizontal' || value === 'vertical') {
                dispatch(setDecorationStripes({ orientation: value }));
              }
            }}
            options={orientationOptions}
          />
          
          <SelectInput
            label="Количество полос:"
            value={(elevator.decorationStripes?.count ?? 1).toString()}
            onChange={(value) => dispatch(setDecorationStripes({ 
              count: parseInt(value) 
            }))}
            options={countOptions}
          />
          
          <RangeSlider
            label="Ширина полосы (см):"
            min={0.1}
            max={30}
            step={0.1}
            value={elevator.decorationStripes?.width ?? 5}
            onChange={(value) => dispatch(setDecorationStripes({ 
              width: value 
            }))}
            centerLabel={(value) => `${value.toFixed(1)} см`}
            leftLabel="0.1 см"
            rightLabel="30 см"
          />
          
          <RangeSlider
            label="Расстояние между полосами (см):"
            min={1}
            max={30}
            step={0.5}
            value={elevator.decorationStripes?.spacing ?? 3}
            onChange={(value) => {
              // Убедимся, что value - число и логируем для отладки
              const numericValue = typeof value === 'string' ? parseFloat(value) : value;
              
              dispatch(setDecorationStripes({ 
                spacing: numericValue 
              }));
            }}
            centerLabel={(value) => `${value.toFixed(1)} см`}
            leftLabel="1 см"
            rightLabel="30 см"
          />
          
          <CheckboxInput
            id="skipMirrorWall"
            label="Не отображать на стене с зеркалом"
            checked={elevator.decorationStripes?.skipMirrorWall ?? true}
            onChange={(checked) => dispatch(setDecorationStripes({ 
              skipMirrorWall: checked 
            }))}
          />
          
          <ColorPicker
            label="Цвет полос:"
            value={elevator.decorationStripes?.color ?? '#C0C0C0'}
            onChange={(value) => dispatch(setDecorationStripes({ 
              color: value 
            }))}
          />
        </>
      )}
    </div>
  );
};

/**
 * Компонент управления стыками между стенами
 */
interface JointControlsProps {
  elevator: ElevatorState;
}

const JointControls: React.FC<JointControlsProps> = ({ elevator }) => {
  const dispatch = useDispatch();
  
  // Опции для выбора материала стыков
  const materialOptions = [
    { value: 'metal', label: 'Металл' },
    { value: 'glossy', label: 'Глянцевый' },
    { value: 'wood', label: 'Дерево' }
  ];
  
  return (
    <div style={{ marginBottom: '16px' }}>
      <h4>Стыки между стенами</h4>
      
      <CheckboxInput
        id="showJoints"
        label="Показать стыки между стенами"
        checked={elevator.joints?.enabled ?? false}
        onChange={(checked) => dispatch(setJoints({ 
          enabled: checked
        }))}
      />
      
      {(elevator.joints?.enabled ?? false) && (
        <>
          <ColorPicker
            label="Цвет стыков:"
            value={elevator.joints?.color ?? '#888888'}
            onChange={(value) => dispatch(setJoints({ 
              color: value 
            }))}
          />
          
          <SelectInput
            label="Материал стыков:"
            value={elevator.joints?.material ?? 'metal'}
            onChange={(value) => {
              if (value === 'metal' || value === 'glossy' || value === 'wood') {
                dispatch(setJoints({ material: value }));
              }
            }}
            options={materialOptions}
          />
          
          <RangeSlider
            label="Ширина стыка (мм):"
            min={1}
            max={20}
            step={0.5}
            value={elevator.joints?.width ?? 2.5}
            onChange={(value) => dispatch(setJoints({ 
              width: value 
            }))}
            centerLabel={(value) => `${value.toFixed(1)} мм`}
            leftLabel="1 мм"
            rightLabel="20 мм"
          />
          
          {elevator.joints?.selectedJoint && (
            <div style={{ 
              margin: '10px 0',
              padding: '8px 12px',
              backgroundColor: '#f0f0f0',
              borderRadius: '4px',
              border: '1px solid #ddd' 
            }}>
              <h5 style={{ margin: '0 0 8px 0', fontSize: '14px' }}>
                Выбранный стык:
              </h5>
              <div style={{ fontSize: '13px' }}>
                {elevator.joints.selectedJoint}
              </div>
              
              <button 
                onClick={() => dispatch(setJoints({ selectedJoint: undefined }))}
                style={{
                  marginTop: '8px',
                  padding: '4px 8px',
                  fontSize: '12px',
                  background: '#e0e0e0',
                  border: '1px solid #ccc',
                  borderRadius: '3px',
                  cursor: 'pointer'
                }}
              >
                Сбросить выбор
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

/**
 * Компонент управления освещением
 */
interface LightingControlsProps {
  elevator: ElevatorState;
}

const LightingControls: React.FC<LightingControlsProps> = ({ elevator }) => {
  const dispatch = useDispatch();
  
  // Опции для выбора количества светильников
  const lightCountOptions = [
    { value: "1", label: "1 (центральный)" },
    { value: "2", label: "2 (спереди и сзади)" },
    { value: "4", label: "4 (по углам)" }
  ];
  
  return (
    <div style={{ marginBottom: '16px' }}>
      <h4>Освещение</h4>
      
      <SelectInput
        label="Количество светильников:"
        value={elevator.lighting.count.toString()}
        onChange={(value) => dispatch(setLighting({ 
          count: parseInt(value) 
        }))}
        options={lightCountOptions}
      />
      
      <ColorPicker
        label="Цвет света:"
        value={elevator.lighting.color}
        onChange={(value) => dispatch(setLighting({ color: value }))}
      />

      <RangeSlider
        label="Интенсивность:"
        min={0.5}
        max={50}
        step={0.1}
        value={elevator.lighting.intensity}
        onChange={(value) => dispatch(setLighting({ intensity: value }))}
        leftLabel="Слабый"
        rightLabel="Яркий"
      />
      
      <RangeSlider
        label="Рассеивание:"
        min={0}
        max={1}
        step={0.05}
        value={elevator.lighting.diffusion}
        onChange={(value) => dispatch(setLighting({ diffusion: value }))}
        leftLabel="Сфокусированный"
        rightLabel="Рассеянный"
      />
      
      <CheckboxInput
        id="enableLighting"
        label="Включить свет"
        checked={elevator.lighting.enabled}
        onChange={(checked) => dispatch(setLighting({ enabled: checked }))}
      />
    </div>
  );
};

export default ElementsTab; 
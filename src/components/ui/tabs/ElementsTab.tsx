import { useDispatch } from "react-redux";
import {
  ElevatorState,
  setVisibility,
  setDecorationStripes,
  setLighting,
  setJoints,
  setMaterial,
  setDoorLogo
} from "../../../store/elevatorSlice";
import {
  RangeSlider,
  ColorPicker,
  SelectInput,
  CheckboxInput
} from "../common/UIControls";
import { LightType } from "../../elevator/lightTypes.ts";

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
      
      {/* Логотип на дверях */}
      <DoorLogoControls elevator={elevator} />
      
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
      
      {/* Настройка цвета панели управления - отображается только если панель включена */}
      {elevator.visibility.controlPanel && (
        <div style={{ marginLeft: '20px', marginTop: '8px', marginBottom: '12px' }}>
          <ColorPicker
            label="Цвет панели управления:"
            value={elevator.materials.controlPanel}
            onChange={(value) => dispatch(setMaterial({ part: 'controlPanel', color: value }))}
          />
        </div>
      )}
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
            max={120}
            step={0.1}
            value={elevator.decorationStripes?.width ?? 5}
            onChange={(value) => dispatch(setDecorationStripes({ 
              width: value 
            }))}
            centerLabel={(value) => `${value.toFixed(1)} см`}
            leftLabel="0.1 см"
            rightLabel="120 см"
          />
          
          <RangeSlider
            label="Расстояние между полосами (см):"
            min={1}
            max={120}
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
            rightLabel="120 см"
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
    </div>
  );
};

/**
 * Компонент управления логотипом на дверях лифта
 */
interface DoorLogoControlsProps {
  elevator: ElevatorState;
}

const DoorLogoControls: React.FC<DoorLogoControlsProps> = ({ elevator }) => {
  const dispatch = useDispatch();

  return (
    <div style={{ marginBottom: '16px' }}>
      <h4>Логотип на дверях</h4>
      
      <CheckboxInput
        id="showDoorLogo"
        label="Показать логотип на дверях"
        checked={elevator.doorLogo?.enabled ?? false}
        onChange={(checked) => dispatch(setDoorLogo({ 
          enabled: checked
        }))}
      />
      
      {(elevator.doorLogo?.enabled ?? false) && (
        <>
          <ColorPicker
            label="Цвет логотипа:"
            value={elevator.doorLogo?.color ?? '#ffffff'}
            onChange={(value) => dispatch(setDoorLogo({ 
              color: value 
            }))}
          />
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

  // Опции для выбора типа светильника
  const lightTypeOptions = [
    { value: LightType.SPOTLIGHT, label: "Точечные светильники" },
    { value: LightType.PLAFOND, label: "Круглые плафоны" }
  ];
  
  return (
    <div style={{ marginBottom: '16px' }}>
      <h4>Освещение</h4>
      
      <SelectInput
        label="Тип светильника:"
        value={elevator.lighting.type || LightType.SPOTLIGHT}
        onChange={(value) => dispatch(setLighting({ 
          type: value 
        }))}
        options={lightTypeOptions}
      />
      
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
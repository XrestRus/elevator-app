import { useDispatch } from "react-redux";
import {
  ElevatorState,
  setVisibility,
  setDecorationStripes,
  setLighting,
} from "../../../store/elevatorSlice";
import {
  RangeSlider,
  ColorPicker,
  SelectInput,
  PresetButton,
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
  
  // Опции для выбора положения полос
  const positionOptions = [
    { value: 'top', label: 'Верхняя часть стен' },
    { value: 'middle', label: 'Середина стен' },
    { value: 'bottom', label: 'Нижняя часть стен' },
    { value: 'all', label: 'Все стены' }
  ];
  
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
  
  // Опции для выбора материала полос
  const materialOptions = [
    { value: 'metal', label: 'Металл' },
    { value: 'glossy', label: 'Глянцевый' },
    { value: 'wood', label: 'Дерево' }
  ];
  
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
            label="Расположение полос:"
            value={elevator.decorationStripes?.position ?? 'middle'}
            onChange={(value) => {
              if (value === 'top' || value === 'middle' || value === 'bottom' || value === 'all') {
                dispatch(setDecorationStripes({ position: value }));
              }
            }}
            options={positionOptions}
          />
          
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
          
          <CheckboxInput
            id="stripesOnDoors"
            label="Полосы на дверях"
            checked={elevator.decorationStripes?.showOnDoors ?? false}
            onChange={(checked) => dispatch(setDecorationStripes({ 
              showOnDoors: checked 
            }))}
          />
          
          <RangeSlider
            label="Ширина полосы (см):"
            min={0.1}
            max={15}
            step={0.1}
            value={elevator.decorationStripes?.width ?? 5}
            onChange={(value) => dispatch(setDecorationStripes({ 
              width: value 
            }))}
            centerLabel={(value) => `${value.toFixed(1)} см`}
            leftLabel="0.1 см"
            rightLabel="15 см"
          />
          
          <RangeSlider
            label="Расстояние между полосами (см):"
            min={1}
            max={20}
            step={0.5}
            value={elevator.decorationStripes?.spacing ?? 3}
            onChange={(value) => dispatch(setDecorationStripes({ 
              spacing: value 
            }))}
            centerLabel={(value) => `${value.toFixed(1)} см`}
            leftLabel="1 см"
            rightLabel="20 см"
          />
          
          <RangeSlider
            label="Смещение от центра (см):"
            min={-20}
            max={20}
            step={0.5}
            value={elevator.decorationStripes?.offset ?? 0}
            onChange={(value) => dispatch(setDecorationStripes({ 
              offset: value 
            }))}
            centerLabel={(value) => `${value.toFixed(1)} см`}
            leftLabel="Левее"
            rightLabel="Правее"
          />
          
          <CheckboxInput
            id="skipMirrorWall"
            label="Не отображать на стене с зеркалом"
            checked={elevator.decorationStripes?.skipMirrorWall ?? true}
            onChange={(checked) => dispatch(setDecorationStripes({ 
              skipMirrorWall: checked 
            }))}
          />
          
          <SelectInput
            label="Материал полос:"
            value={elevator.decorationStripes?.material ?? 'metal'}
            onChange={(value) => {
              if (value === 'metal' || value === 'glossy' || value === 'wood') {
                dispatch(setDecorationStripes({ material: value }));
              }
            }}
            options={materialOptions}
          />
          
          <ColorPicker
            label="Цвет полос:"
            value={elevator.decorationStripes?.color ?? '#C0C0C0'}
            onChange={(value) => dispatch(setDecorationStripes({ 
              color: value 
            }))}
          />
          
          <StripesPresets />
        </>
      )}
    </div>
  );
};

/**
 * Компонент с пресетами декоративных полос
 */
const StripesPresets: React.FC = () => {
  const dispatch = useDispatch();
  
  const applyGoldStripe = () => {
    dispatch(setDecorationStripes({
      enabled: true,
      position: 'middle',
      count: 1,
      width: 5,
      material: 'metal',
      color: '#FFD700', // Золотой цвет
      orientation: 'horizontal',
      spacing: 3,
      skipMirrorWall: true,
      offset: 0,
      showOnDoors: false
    }));
  };
  
  const applySilverStripe = () => {
    dispatch(setDecorationStripes({
      enabled: true,
      position: 'middle',
      count: 1,
      width: 3,
      material: 'metal',
      color: '#C0C0C0', // Серебряный цвет
      orientation: 'horizontal',
      spacing: 3,
      skipMirrorWall: true,
      offset: 0,
      showOnDoors: false
    }));
  };
  
  const applyWoodenStripes = () => {
    dispatch(setDecorationStripes({
      enabled: true,
      position: 'all',
      count: 3,
      width: 8,
      material: 'wood',
      color: '#8B4513', // Деревянный цвет
      orientation: 'horizontal',
      spacing: 3,
      skipMirrorWall: true,
      offset: 0,
      showOnDoors: false
    }));
  };
  
  const applyVerticalStripes = () => {
    dispatch(setDecorationStripes({
      enabled: true,
      position: 'all',
      count: 5,
      width: 2,
      material: 'metal',
      color: '#C0C0C0', // Серебряный цвет
      orientation: 'vertical',
      spacing: 3,
      skipMirrorWall: true,
      offset: 0,
      showOnDoors: false
    }));
  };
  
  const applyGoldStripeWithDoors = () => {
    dispatch(setDecorationStripes({
      enabled: true,
      position: 'middle',
      count: 1,
      width: 5,
      material: 'metal',
      color: '#FFD700', // Золотой цвет
      orientation: 'horizontal',
      spacing: 3,
      skipMirrorWall: true,
      offset: 0,
      showOnDoors: true
    }));
  };
  
  const applyVerticalStripesWithDoors = () => {
    dispatch(setDecorationStripes({
      enabled: true,
      position: 'all',
      count: 3,
      width: 2,
      material: 'metal',
      color: '#C0C0C0', // Серебряный цвет
      orientation: 'vertical',
      spacing: 3,
      skipMirrorWall: true,
      offset: 0,
      showOnDoors: true
    }));
  };
  
  return (
    <div style={{ marginBottom: '8px' }}>
      <PresetButton 
        label="Золотая полоса" 
        onClick={applyGoldStripe} 
        fullWidth={true}
      />
      
      <PresetButton 
        label="Серебряная полоса" 
        onClick={applySilverStripe} 
        fullWidth={true}
      />
      
      <PresetButton 
        label="Деревянные полосы" 
        onClick={applyWoodenStripes} 
        fullWidth={true}
      />
      
      <PresetButton 
        label="Вертикальные полосы" 
        onClick={applyVerticalStripes} 
        fullWidth={true}
      />
      
      <PresetButton 
        label="Золотая полоса с дверями" 
        onClick={applyGoldStripeWithDoors} 
        fullWidth={true}
      />
      
      <PresetButton 
        label="Вертикальные полосы с дверями" 
        onClick={applyVerticalStripesWithDoors} 
        fullWidth={true}
      />
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
        max={5}
        step={0.1}
        value={elevator.lighting.intensity}
        onChange={(value) => dispatch(setLighting({ intensity: value }))}
        leftLabel="Слабый"
        rightLabel="Яркий"
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
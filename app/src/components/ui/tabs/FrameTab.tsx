import { useDispatch } from "react-redux";
import {
  ElevatorState,
  setElevatorDimensions,
  toggleDoors,
  setCamera
} from "../../../store/elevatorSlice";
import {
  RangeSlider,
  SelectInput,
  PresetButton,
  CheckboxInput
} from "../common/UIControls";

/**
 * Интерфейс пропсов для компонента FrameTab
 */
interface FrameTabProps {
  elevator: ElevatorState;
}

/**
 * Вкладка настроек каркаса лифта
 * Управляет размерами и формой кабины
 */
const FrameTab: React.FC<FrameTabProps> = ({ elevator }) => {
  return (
    <div>
      <h3>Настройка каркаса</h3>
      
      {/* Основные размеры */}
      <DimensionsSection elevator={elevator} />
      
      {/* Сохраненные размеры */}
      <PresetsSection />
      
      {/* Управление камерой */}
      <CameraSection elevator={elevator} />
      
      {/* Управление дверями */}
      <DoorsSection elevator={elevator} />
    </div>
  );
};

/**
 * Компонент настройки основных размеров лифта
 */
interface DimensionsSectionProps {
  elevator: ElevatorState;
}

const DimensionsSection: React.FC<DimensionsSectionProps> = ({ elevator }) => {
  const dispatch = useDispatch();
  
  // Опции типа лифта
  const typeOptions = [
    { value: 'residential', label: 'Пассажирский' },
    { value: 'cargo', label: 'Грузовой' },
    { value: 'panoramic', label: 'Панорамный' }
  ];
  
  return (
    <div style={{ marginBottom: '16px' }}>
      <h4>Основные размеры</h4>
      
      <SelectInput
        label="Тип лифта:"
        value={'residential'} // в типе данных отсутствует поле type, вместо этого используем фиксированное значение
        onChange={(value) => {
          // Здесь можно добавить логику для изменения типа лифта
          console.log("Выбран тип лифта:", value);
        }}
        options={typeOptions}
      />
      
      <RangeSlider
        label="Высота (м):"
        min={2.0}
        max={3.0}
        step={0.1}
        value={elevator.dimensions.height}
        onChange={(value) => dispatch(setElevatorDimensions({ height: value }))}
        centerLabel={(value) => `${value.toFixed(1)} м`}
        leftLabel="2.0 м"
        rightLabel="3.0 м"
      />
      
      <RangeSlider
        label="Ширина (м):"
        min={1.5}
        max={3.0}
        step={0.1}
        value={elevator.dimensions.width}
        onChange={(value) => dispatch(setElevatorDimensions({ width: value }))}
        centerLabel={(value) => `${value.toFixed(1)} м`}
        leftLabel="1.5 м"
        rightLabel="3.0 м"
      />
      
      <RangeSlider
        label="Глубина (м):"
        min={1.5}
        max={3.0}
        step={0.1}
        value={elevator.dimensions.depth}
        onChange={(value) => dispatch(setElevatorDimensions({ depth: value }))}
        centerLabel={(value) => `${value.toFixed(1)} м`}
        leftLabel="1.5 м"
        rightLabel="3.0 м"
      />
    </div>
  );
};

/**
 * Компонент с пресетами размеров лифта
 */
const PresetsSection: React.FC = () => {
  const dispatch = useDispatch();
  
  const applySmallSize = () => {
    dispatch(setElevatorDimensions({
      height: 2.2,
      width: 1.1,
      depth: 1.4
    }));
  };
  
  const applyMediumSize = () => {
    dispatch(setElevatorDimensions({
      height: 2.4,
      width: 1.5,
      depth: 1.7
    }));
  };
  
  const applyLargeSize = () => {
    dispatch(setElevatorDimensions({
      height: 2.6,
      width: 2.0,
      depth: 2.1
    }));
  };
  
  const applyCargoSize = () => {
    dispatch(setElevatorDimensions({
      height: 2.8,
      width: 2.3,
      depth: 2.7
    }));
  };
  
  const applyWideSize = () => {
    dispatch(setElevatorDimensions({
      height: 2.4,
      width: 2.0,
      depth: 1.5
    }));
  };
  
  const applyDeepSize = () => {
    dispatch(setElevatorDimensions({
      height: 2.4,
      width: 1.2,
      depth: 2.4
    }));
  };
  
  return (
    <div style={{ marginBottom: '16px' }}>
      <h4>Стандартные размеры</h4>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        <PresetButton 
          label="Малый (4 чел.)" 
          onClick={applySmallSize} 
        />
        
        <PresetButton 
          label="Средний (6 чел.)" 
          onClick={applyMediumSize} 
        />
        
        <PresetButton 
          label="Большой (10 чел.)" 
          onClick={applyLargeSize} 
        />
        
        <PresetButton 
          label="Грузовой" 
          onClick={applyCargoSize} 
        />
        
        <PresetButton 
          label="Широкий" 
          onClick={applyWideSize} 
        />
        
        <PresetButton 
          label="Глубокий" 
          onClick={applyDeepSize} 
        />
      </div>
    </div>
  );
};

/**
 * Компонент управления камерой
 */
interface CameraSectionProps {
  elevator: ElevatorState;
}

const CameraSection: React.FC<CameraSectionProps> = ({ elevator }) => {
  const dispatch = useDispatch();
  
  return (
    <div style={{ marginBottom: '16px' }}>
      <h4>Камера и обзор</h4>
      
      <RangeSlider
        label="Угол обзора (FOV):"
        min={50}
        max={100}
        step={1}
        value={elevator.camera.fov}
        onChange={(value) => dispatch(setCamera({ fov: value }))}
        centerLabel={(value) => `${value.toFixed(0)}°`}
        leftLabel="Узкий (50°)"
        rightLabel="Широкий (100°)"
      />
      
      <RangeSlider
        label="Высота камеры:"
        min={0.1}
        max={1.8}
        step={0.05}
        value={elevator.camera.cameraHeight ?? 1.2}
        onChange={(value) => dispatch(setCamera({ cameraHeight: value }))}
        centerLabel={(value) => `${value.toFixed(2)} м`}
        leftLabel="Очень низко"
        rightLabel="Высоко"
        disabled={elevator.camera.freeCamera}
      />
      
      <CheckboxInput
        id="freeCameraMode"
        label="Режим свободного полета"
        checked={elevator.camera.freeCamera}
        onChange={(checked) => dispatch(setCamera({ 
          freeCamera: checked 
        }))}
      />
      
      {/* Отображение координат камеры */}
      <div style={{ marginTop: '8px', padding: '8px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
        <p style={{ fontWeight: 'bold', margin: '0 0 4px' }}>Текущее положение камеры:</p>
        <div style={{ fontFamily: 'monospace', fontSize: '13px' }}>
          X: {elevator.camera.position?.x ?? 0}<br />
          Y: {elevator.camera.position?.y ?? 0}<br />
          Z: {elevator.camera.position?.z ?? 0}
        </div>
      </div>
    </div>
  );
};

/**
 * Компонент управления дверями
 */
interface DoorsSectionProps {
  elevator: ElevatorState;
}

const DoorsSection: React.FC<DoorsSectionProps> = ({ elevator }) => {
  const dispatch = useDispatch();
  
  return (
    <div style={{ marginBottom: '16px' }}>
      <h4>Управление дверями</h4>
      
      <PresetButton 
        label={elevator.doorsOpen ? "Закрыть двери" : "Открыть двери"} 
        onClick={() => dispatch(toggleDoors())} 
        fullWidth={true}
      />
    </div>
  );
};

export default FrameTab; 
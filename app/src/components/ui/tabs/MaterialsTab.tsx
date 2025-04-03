import { useDispatch } from "react-redux";
import {
  ElevatorState,
  setMaterial,
  setMirrorSurface,
  setMirrorOptions,
  setTexture,
  setRoughness,
  setMetalness,
  setDecorationStripes,
} from "../../../store/elevatorSlice";
import {
  RangeSlider,
  ColorPicker,
  SelectInput,
  PresetButton,
  CheckboxInput
} from "../common/UIControls";

/**
 * Интерфейс пропсов для компонента MaterialsTab
 */
interface MaterialsTabProps {
  elevator: ElevatorState;
}

/**
 * Компонент вкладки управления отделкой лифта
 * Отвечает за настройку материалов, цветов, текстур, зеркал
 */
const MaterialsTab: React.FC<MaterialsTabProps> = ({ elevator }) => {
  return (
    <div>
      <h3>Управление отделкой лифта</h3>
      
      {/* Базовые цвета */}
      <ColorControls elevator={elevator} />
      
      {/* Пресеты */}
      <MaterialPresets />
      
      {/* Зеркала */}
      <MirrorControls elevator={elevator} />
      
      {/* Шероховатость */}
      <RoughnessControls elevator={elevator} />
      
      {/* Металличность */}
      <MetalnessControls elevator={elevator} />
      
      {/* Текстуры */}
      <TextureControls elevator={elevator} />
    </div>
  );
};

/**
 * Компонент управления цветами материалов
 */
interface ColorControlsProps {
  elevator: ElevatorState;
}

const ColorControls: React.FC<ColorControlsProps> = ({ elevator }) => {
  const dispatch = useDispatch();
  
  return (
    <div style={{ marginBottom: '16px' }}>
      <ColorPicker 
        label="Цвет стен:" 
        value={elevator.materials.walls}
        onChange={(value) => dispatch(setMaterial({ part: 'walls', color: value }))}
      />
      
      <ColorPicker 
        label="Цвет пола:" 
        value={elevator.materials.floor}
        onChange={(value) => dispatch(setMaterial({ part: 'floor', color: value }))}
      />
      
      <ColorPicker 
        label="Цвет потолка:" 
        value={elevator.materials.ceiling}
        onChange={(value) => dispatch(setMaterial({ part: 'ceiling', color: value }))}
      />
      
      <ColorPicker 
        label="Цвет дверей:" 
        value={elevator.materials.doors}
        onChange={(value) => dispatch(setMaterial({ part: 'doors', color: value }))}
      />
    </div>
  );
};

/**
 * Компонент с пресетами материалов
 */
const MaterialPresets: React.FC = () => {
  const dispatch = useDispatch();
  
  const applyGoldPreset = () => {
    dispatch(setMaterial({ part: 'walls', color: '#D4AF37' }));
    dispatch(setMaterial({ part: 'ceiling', color: '#D4AF37' }));
    dispatch(setMaterial({ part: 'floor', color: '#332211' })); // Тёмный пол, контрастирующий с золотом
    dispatch(setMaterial({ part: 'doors', color: '#D4AF37' }));
    dispatch(setMetalness({ part: 'walls', value: 0.9 }));
    dispatch(setMetalness({ part: 'ceiling', value: 0.9 }));
    dispatch(setMetalness({ part: 'doors', value: 0.9 }));
    dispatch(setMetalness({ part: 'floor', value: 0.5 })); // Средняя металличность для пола
    dispatch(setRoughness({ part: 'walls', value: 0.1 }));
    dispatch(setRoughness({ part: 'ceiling', value: 0.1 }));
    dispatch(setRoughness({ part: 'doors', value: 0.1 }));
    dispatch(setRoughness({ part: 'floor', value: 0.3 })); // Невысокая шероховатость для пола
    dispatch(setDecorationStripes({ color: '#302010', material: 'metal' }));
  };
  
  const applyBronzePreset = () => {
    dispatch(setMaterial({ part: 'walls', color: '#CD7F32' }));
    dispatch(setMaterial({ part: 'ceiling', color: '#CD7F32' }));
    dispatch(setMaterial({ part: 'floor', color: '#3D2B1F' })); // Тёмно-коричневый пол
    dispatch(setMaterial({ part: 'doors', color: '#CD7F32' }));
    dispatch(setMetalness({ part: 'walls', value: 0.8 }));
    dispatch(setMetalness({ part: 'ceiling', value: 0.8 }));
    dispatch(setMetalness({ part: 'doors', value: 0.8 }));
    dispatch(setMetalness({ part: 'floor', value: 0.4 })); // Средняя металличность для пола
    dispatch(setRoughness({ part: 'walls', value: 0.2 }));
    dispatch(setRoughness({ part: 'ceiling', value: 0.2 }));
    dispatch(setRoughness({ part: 'doors', value: 0.2 }));
    dispatch(setRoughness({ part: 'floor', value: 0.5 })); // Средняя шероховатость для пола
    dispatch(setDecorationStripes({ color: '#E2C87A', material: 'metal' }));
  };
  
  const applySilverPreset = () => {
    dispatch(setMaterial({ part: 'walls', color: '#C0C0C0' }));
    dispatch(setMaterial({ part: 'ceiling', color: '#C0C0C0' }));
    dispatch(setMaterial({ part: 'floor', color: '#303030' })); // Тёмно-серый пол
    dispatch(setMaterial({ part: 'doors', color: '#C0C0C0' }));
    dispatch(setMetalness({ part: 'walls', value: 0.9 }));
    dispatch(setMetalness({ part: 'ceiling', value: 0.9 }));
    dispatch(setMetalness({ part: 'doors', value: 0.9 }));
    dispatch(setMetalness({ part: 'floor', value: 0.7 })); // Высокая металличность для пола
    dispatch(setRoughness({ part: 'walls', value: 0.1 }));
    dispatch(setRoughness({ part: 'ceiling', value: 0.1 }));
    dispatch(setRoughness({ part: 'doors', value: 0.1 }));
    dispatch(setRoughness({ part: 'floor', value: 0.2 })); // Низкая шероховатость для пола
    dispatch(setDecorationStripes({ color: '#1A1A1A', material: 'metal' })); // Темные полосы для контраста
  };
  
  const applyCopperPreset = () => {
    dispatch(setMaterial({ part: 'walls', color: '#B87333' }));
    dispatch(setMaterial({ part: 'ceiling', color: '#B87333' }));
    dispatch(setMaterial({ part: 'floor', color: '#2D2D2D' })); // Почти чёрный пол
    dispatch(setMaterial({ part: 'doors', color: '#B87333' }));
    dispatch(setMetalness({ part: 'walls', value: 0.8 }));
    dispatch(setMetalness({ part: 'ceiling', value: 0.8 }));
    dispatch(setMetalness({ part: 'doors', value: 0.8 }));
    dispatch(setMetalness({ part: 'floor', value: 0.6 })); // Металличность для пола
    dispatch(setRoughness({ part: 'walls', value: 0.2 }));
    dispatch(setRoughness({ part: 'ceiling', value: 0.2 }));
    dispatch(setRoughness({ part: 'doors', value: 0.2 }));
    dispatch(setRoughness({ part: 'floor', value: 0.3 })); // Низкая шероховатость для пола
    dispatch(setDecorationStripes({ color: '#FFCA80', material: 'metal' })); // Светлые золотистые полосы
  };
  
  // Новые пресеты
  const applyMinimalistPreset = () => {
    dispatch(setMaterial({ part: 'walls', color: '#F2F2F2' })); // Светло-серые стены
    dispatch(setMaterial({ part: 'ceiling', color: '#FFFFFF' })); // Белый потолок 
    dispatch(setMaterial({ part: 'floor', color: '#333333' })); // Тёмный пол
    dispatch(setMaterial({ part: 'doors', color: '#E0E0E0' })); // Светло-серые двери
    dispatch(setMetalness({ part: 'walls', value: 0.1 }));
    dispatch(setMetalness({ part: 'ceiling', value: 0.0 }));
    dispatch(setMetalness({ part: 'doors', value: 0.3 }));
    dispatch(setMetalness({ part: 'floor', value: 0.2 }));
    dispatch(setRoughness({ part: 'walls', value: 0.7 }));
    dispatch(setRoughness({ part: 'ceiling', value: 0.8 }));
    dispatch(setRoughness({ part: 'doors', value: 0.4 }));
    dispatch(setRoughness({ part: 'floor', value: 0.5 }));
    dispatch(setDecorationStripes({ color: '#000000', material: 'glossy' }));
  };
  
  const applyLuxuryBluePreset = () => {
    dispatch(setMaterial({ part: 'walls', color: '#1E2D48' })); // Темно-синие стены
    dispatch(setMaterial({ part: 'ceiling', color: '#1E2D48' })); // Темно-синий потолок 
    dispatch(setMaterial({ part: 'floor', color: '#0A0A0A' })); // Почти черный пол
    dispatch(setMaterial({ part: 'doors', color: '#2C3C56' })); // Чуть светлее, чем стены
    dispatch(setMetalness({ part: 'walls', value: 0.6 }));
    dispatch(setMetalness({ part: 'ceiling', value: 0.6 }));
    dispatch(setMetalness({ part: 'doors', value: 0.7 }));
    dispatch(setMetalness({ part: 'floor', value: 0.8 }));
    dispatch(setRoughness({ part: 'walls', value: 0.3 }));
    dispatch(setRoughness({ part: 'ceiling', value: 0.3 }));
    dispatch(setRoughness({ part: 'doors', value: 0.2 }));
    dispatch(setRoughness({ part: 'floor', value: 0.2 }));
    dispatch(setDecorationStripes({ color: '#C0AA70', material: 'metal' })); // Золотистые полосы
  };
  
  return (
    <div style={{ marginBottom: '16px' }}>
      <h4>Пресеты для лифта</h4>
      
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '8px' }}>
        <PresetButton 
          label="Золотой" 
          onClick={applyGoldPreset} 
        />
        
        <PresetButton 
          label="Бронзовый" 
          onClick={applyBronzePreset} 
        />
        
        <PresetButton 
          label="Серебряный" 
          onClick={applySilverPreset} 
        />
        
        <PresetButton 
          label="Медный" 
          onClick={applyCopperPreset} 
        />

        <PresetButton 
          label="Минимализм" 
          onClick={applyMinimalistPreset} 
        />

        <PresetButton 
          label="Синий люкс" 
          onClick={applyLuxuryBluePreset} 
        />
      </div>
    </div>
  );
};

/**
 * Компонент управления зеркалами
 */
interface MirrorControlsProps {
  elevator: ElevatorState;
}

const MirrorControls: React.FC<MirrorControlsProps> = ({ elevator }) => {
  const dispatch = useDispatch();
  
  const mirrorTypeOptions = [
    { value: 'full', label: 'Сплошное зеркало' },
    { value: 'double', label: 'Два зеркала в ряд' },
    { value: 'triple', label: 'Три зеркала в ряд' }
  ];
  
  return (
    <div style={{ marginBottom: '16px' }}>
      <h4>Зеркальные поверхности</h4>
      
      <CheckboxInput
        id="mirrorWalls"
        label="Зеркальная задняя стена"
        checked={elevator.materials.isMirror.walls}
        onChange={(checked) => dispatch(setMirrorSurface({ part: 'walls', value: checked }))}
      />
      
      {/* Настройки зеркала доступны только если включено зеркало на задней стене */}
      {elevator.materials.isMirror.walls && (
        <>
          <RangeSlider
            label="Ширина зеркала (м):"
            min={0.5}
            max={Math.min(elevator.dimensions.width * 0.9, 2.5)}
            step={0.1}
            value={elevator.materials.mirror.width}
            onChange={(value) => dispatch(setMirrorOptions({ width: value }))}
            centerLabel={(value) => `${value.toFixed(1)} м`}
          />
          
          <RangeSlider
            label="Высота зеркала (м):"
            min={0.5}
            max={elevator.dimensions.height * 0.8}
            step={0.1}
            value={elevator.materials.mirror.height}
            onChange={(value) => dispatch(setMirrorOptions({ height: value }))}
            centerLabel={(value) => `${value.toFixed(1)} м`}
          />
          
          <RangeSlider
            label="Положение по высоте:"
            min={-elevator.dimensions.height/4}
            max={elevator.dimensions.height/4}
            step={0.05}
            value={elevator.materials.mirror.position}
            onChange={(value) => dispatch(setMirrorOptions({ position: value }))}
            leftLabel="Ниже"
            rightLabel="Выше"
          />
          
          <SelectInput
            label="Тип зеркала:"
            value={elevator.materials.mirror.type}
            onChange={(value) => dispatch(setMirrorOptions({ 
              type: value as 'full' | 'double' | 'triple' 
            }))}
            options={mirrorTypeOptions}
          />
        </>
      )}
    </div>
  );
};

/**
 * Компонент управления шероховатостью поверхностей
 */
interface RoughnessControlsProps {
  elevator: ElevatorState;
}

const RoughnessControls: React.FC<RoughnessControlsProps> = ({ elevator }) => {
  const dispatch = useDispatch();
  
  return (
    <div style={{ marginBottom: '16px' }}>
      <h4>Шероховатость поверхностей</h4>
      
      <details>
        <summary>О параметре шероховатости</summary>
        <div style={{ padding: '8px', fontSize: '0.9em', backgroundColor: '#f5f5f5', borderRadius: '4px', marginBottom: '8px' }}>
          <strong>Шероховатость поверхностей (roughness):</strong>
          <ul style={{ marginTop: '4px', paddingLeft: '16px' }}>
            <li>Определяет насколько поверхность гладкая или шероховатая</li>
            <li>Низкое значение (0-0.3) - глянцевая, зеркальная поверхность с чёткими отражениями</li>
            <li>Высокое значение (0.7-1.0) - матовая, диффузная поверхность без бликов</li>
            <li>Влияет на рассеивание света и характер отражений</li>
          </ul>
        </div>
      </details>
      
      <RangeSlider
        label="Стены:"
        min={0}
        max={1}
        step={0.01}
        value={elevator.materials.roughness.walls}
        onChange={(value) => dispatch(setRoughness({ part: 'walls', value }))}
      />
      
      <RangeSlider
        label="Пол:"
        min={0}
        max={1}
        step={0.01}
        value={elevator.materials.roughness.floor}
        onChange={(value) => dispatch(setRoughness({ part: 'floor', value }))}
      />
      
      <RangeSlider
        label="Потолок:"
        min={0}
        max={1}
        step={0.01}
        value={elevator.materials.roughness.ceiling}
        onChange={(value) => dispatch(setRoughness({ part: 'ceiling', value }))}
      />
      
      <RangeSlider
        label="Двери:"
        min={0}
        max={1}
        step={0.01}
        value={elevator.materials.roughness.doors}
        onChange={(value) => dispatch(setRoughness({ part: 'doors', value }))}
      />
    </div>
  );
};

/**
 * Компонент управления металличностью поверхностей
 */
interface MetalnessControlsProps {
  elevator: ElevatorState;
}

const MetalnessControls: React.FC<MetalnessControlsProps> = ({ elevator }) => {
  const dispatch = useDispatch();
  
  return (
    <div style={{ marginBottom: '16px' }}>
      <h4>Металличность поверхностей</h4>
      
      <details>
        <summary>О параметре металличности</summary>
        <div style={{ padding: '8px', fontSize: '0.9em', backgroundColor: '#f5f5f5', borderRadius: '4px', marginBottom: '8px' }}>
          <strong>Металличность поверхностей (metalness):</strong>
          <ul style={{ marginTop: '4px', paddingLeft: '16px' }}>
            <li>Определяет металлический характер материала</li>
            <li>Низкое значение (0-0.3) - неметаллические материалы (дерево, пластик, стекло)</li>
            <li>Высокое значение (0.7-1.0) - металлические материалы (сталь, золото, серебро)</li>
            <li>Влияет на тип и интенсивность отражений, характер бликов и светопоглощение</li>
          </ul>
        </div>
      </details>
      
      <RangeSlider
        label="Стены:"
        min={0}
        max={1}
        step={0.01}
        value={elevator.materials.metalness.walls}
        onChange={(value) => dispatch(setMetalness({ part: 'walls', value }))}
        leftLabel="Матовый"
        rightLabel="Металлик"
      />
      
      <RangeSlider
        label="Пол:"
        min={0}
        max={1}
        step={0.01}
        value={elevator.materials.metalness.floor}
        onChange={(value) => dispatch(setMetalness({ part: 'floor', value }))}
        leftLabel="Матовый"
        rightLabel="Металлик"
      />
      
      <RangeSlider
        label="Потолок:"
        min={0}
        max={1}
        step={0.01}
        value={elevator.materials.metalness.ceiling}
        onChange={(value) => dispatch(setMetalness({ part: 'ceiling', value }))}
        leftLabel="Матовый"
        rightLabel="Металлик"
      />
      
      <RangeSlider
        label="Двери:"
        min={0}
        max={1}
        step={0.01}
        value={elevator.materials.metalness.doors}
        onChange={(value) => dispatch(setMetalness({ part: 'doors', value }))}
        leftLabel="Матовый"
        rightLabel="Металлик"
      />
    </div>
  );
};

/**
 * Компонент выбора текстур
 */
interface TextureControlsProps {
  elevator: ElevatorState;
}

const TextureControls: React.FC<TextureControlsProps> = ({ elevator }) => {
  const dispatch = useDispatch();
  
  /**
   * Опции текстур, доступные для выбора.
   * Для добавления новых текстур:
   * 1. Добавьте папку с PBR-текстурами в app/public/textures/example/
   * 2. Добавьте новый элемент в массив textureOptions, где:
   *    - value: путь к директории с текстурами (относительно public)
   *    - label: отображаемое имя текстуры в интерфейсе
   */
  const textureOptions = [
    { value: "", label: "Без текстуры" },
    { value: "/textures/example/wood_0066_1k_HoQeAg", label: "Дерево (PBR)" },
    { value: "/textures/example/metal_0049_1k_1dmpSz", label: "Металл 1 (PBR)" },
    { value: "/textures/example/metal_0071_1k_HD5XFx", label: "Металл 2 (PBR)" },
    { value: "/textures/example/metal_0081_1k_qh6kbG", label: "Металл 3 (PBR)" },
    { value: "/textures/example/metal_0082_1k_je0RXH", label: "Металл 4 (PBR)" },
    { value: "/textures/example/metal_0083_1k_r9ZJJl", label: "Металл 5 (PBR)" },
    { value: "/textures/example/metal_0084_1k_uJitA0", label: "Металл 6 (PBR)" }
  ];
  
  return (
    <div style={{ marginBottom: '16px' }}>
      <h4>Текстуры</h4>
      
      <SelectInput
        label="Текстура стен:"
        value={elevator.materials.texture.walls || ""}
        onChange={(value) => dispatch(setTexture({ 
          part: 'walls', 
          value: value || null 
        }))}
        options={textureOptions}
      />
      
      <SelectInput
        label="Текстура пола:"
        value={elevator.materials.texture.floor || ""}
        onChange={(value) => dispatch(setTexture({ 
          part: 'floor', 
          value: value || null 
        }))}
        options={textureOptions}
      />
      
      <SelectInput
        label="Текстура потолка:"
        value={elevator.materials.texture.ceiling || ""}
        onChange={(value) => dispatch(setTexture({ 
          part: 'ceiling', 
          value: value || null 
        }))}
        options={textureOptions}
      />
    </div>
  );
};

export default MaterialsTab; 
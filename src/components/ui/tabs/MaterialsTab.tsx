import { useDispatch } from "react-redux";
import {
  ElevatorState,
  setMaterial,
  setMirrorSurface,
  setMirrorOptions,
  setTexture,
  setRoughness,
  setMetalness,
  setEmission,
  setTransparency,
  setRefraction,
  setAnisotropy
} from "../../../store/elevatorSlice";
import {
  RangeSlider,
  ColorPicker,
  SelectInput,
  CheckboxInput,
  SelectOption,
  SelectOptionOrGroup
} from "../common/UIControls";
import { useState } from "react";
import { materialPresets } from "../presets/materialPresets";
import { textureOptions } from "../textures/textureOptions";

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
      
      {/* Эмиссия (свечение) */}
      <EmissionControls elevator={elevator} />
      
      {/* Прозрачность */}
      <TransparencyControls elevator={elevator} />
      
      {/* Преломление */}
      <RefractionControls elevator={elevator} />
      
      {/* Анизотропность */}
      <AnisotropyControls elevator={elevator} />
      
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
  const [selectedPreset, setSelectedPreset] = useState<string>("");
  
  // Создаем опции для селектора из массива пресетов
  const presetOptions: SelectOption[] = materialPresets.map(preset => ({
    value: preset.id,
    label: preset.label
  }));

  // Обработчик изменения пресета
  const handlePresetChange = (value: string) => {
    setSelectedPreset(value);
    const preset = materialPresets.find(preset => preset.id === value);
    if (preset) {
      preset.apply(dispatch);
    }
  };
  
  return (
    <div style={{ marginBottom: '16px' }}>
      <h4>Пресеты для лифта</h4>
      
      <div style={{ marginBottom: '8px' }}>
        <SelectInput
          label="Выберите стиль оформления:"
          value={selectedPreset}
          onChange={handlePresetChange}
          options={presetOptions}
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
 * Компонент управления свечением (эмиссией) поверхностей
 */
interface EmissionControlsProps {
  elevator: ElevatorState;
}

const EmissionControls: React.FC<EmissionControlsProps> = ({ elevator }) => {
  const dispatch = useDispatch();
  
  return (
    <div style={{ marginBottom: '16px' }}>
      <h4>Свечение поверхностей</h4>
      
      <details>
        <summary>О параметре свечения</summary>
        <div style={{ padding: '8px', fontSize: '0.9em', backgroundColor: '#f5f5f5', borderRadius: '4px', marginBottom: '8px' }}>
          <strong>Свечение поверхностей (emission):</strong>
          <ul style={{ marginTop: '4px', paddingLeft: '16px' }}>
            <li>Определяет насколько поверхность сама излучает свет</li>
            <li>Низкое значение (0) - без собственного свечения</li>
            <li>Высокое значение (1.0) - яркое свечение собственным светом</li>
            <li>Влияет на общее освещение сцены, создает эффект неонового или светодиодного освещения</li>
          </ul>
        </div>
      </details>
      
      <CheckboxInput
        id="emissionEnabled"
        label="Включить эффект свечения"
        checked={elevator.materials.emission.enabled}
        onChange={(checked) => dispatch(setEmission({ enabled: checked }))}
      />
      
      {elevator.materials.emission.enabled && (
        <>
          <ColorPicker
            label="Цвет свечения:"
            value={elevator.materials.emission.color}
            onChange={(value) => dispatch(setEmission({ color: value }))}
          />
          
          <RangeSlider
            label="Стены:"
            min={0}
            max={1}
            step={0.01}
            value={elevator.materials.emission.walls}
            onChange={(value) => dispatch(setEmission({ part: 'walls', value }))}
            leftLabel="Выкл"
            rightLabel="Макс"
          />
          
          <RangeSlider
            label="Пол:"
            min={0}
            max={1}
            step={0.01}
            value={elevator.materials.emission.floor}
            onChange={(value) => dispatch(setEmission({ part: 'floor', value }))}
            leftLabel="Выкл"
            rightLabel="Макс"
          />
          
          <RangeSlider
            label="Потолок:"
            min={0}
            max={1}
            step={0.01}
            value={elevator.materials.emission.ceiling}
            onChange={(value) => dispatch(setEmission({ part: 'ceiling', value }))}
            leftLabel="Выкл"
            rightLabel="Макс"
          />
          
          <RangeSlider
            label="Двери:"
            min={0}
            max={1}
            step={0.01}
            value={elevator.materials.emission.doors}
            onChange={(value) => dispatch(setEmission({ part: 'doors', value }))}
            leftLabel="Выкл"
            rightLabel="Макс"
          />
        </>
      )}
    </div>
  );
};

/**
 * Компонент управления прозрачностью поверхностей
 */
interface TransparencyControlsProps {
  elevator: ElevatorState;
}

const TransparencyControls: React.FC<TransparencyControlsProps> = ({ elevator }) => {
  const dispatch = useDispatch();
  
  return (
    <div style={{ marginBottom: '16px' }}>
      <h4>Прозрачность поверхностей</h4>
      
      <details>
        <summary>О параметре прозрачности</summary>
        <div style={{ padding: '8px', fontSize: '0.9em', backgroundColor: '#f5f5f5', borderRadius: '4px', marginBottom: '8px' }}>
          <strong>Прозрачность поверхностей (transparency):</strong>
          <ul style={{ marginTop: '4px', paddingLeft: '16px' }}>
            <li>Определяет насколько поверхность пропускает свет</li>
            <li>Низкое значение (0) - полностью непрозрачная поверхность</li>
            <li>Высокое значение (1.0) - полностью прозрачная поверхность</li>
            <li>Промежуточные значения создают эффект тонированного стекла</li>
            <li>Влияет на видимость объектов сквозь материал</li>
          </ul>
        </div>
      </details>
      
      <CheckboxInput
        id="transparencyEnabled"
        label="Включить эффект прозрачности"
        checked={elevator.materials.transparency.enabled}
        onChange={(checked) => dispatch(setTransparency({ enabled: checked }))}
      />
      
      {elevator.materials.transparency.enabled && (
        <>
          <RangeSlider
            label="Стены:"
            min={0}
            max={1}
            step={0.01}
            value={elevator.materials.transparency.walls}
            onChange={(value) => dispatch(setTransparency({ part: 'walls', value }))}
            leftLabel="Непрозрачно"
            rightLabel="Прозрачно"
          />
          
          <RangeSlider
            label="Пол:"
            min={0}
            max={1}
            step={0.01}
            value={elevator.materials.transparency.floor}
            onChange={(value) => dispatch(setTransparency({ part: 'floor', value }))}
            leftLabel="Непрозрачно"
            rightLabel="Прозрачно"
          />
          
          <RangeSlider
            label="Потолок:"
            min={0}
            max={1}
            step={0.01}
            value={elevator.materials.transparency.ceiling}
            onChange={(value) => dispatch(setTransparency({ part: 'ceiling', value }))}
            leftLabel="Непрозрачно"
            rightLabel="Прозрачно"
          />
          
          <RangeSlider
            label="Двери:"
            min={0}
            max={1}
            step={0.01}
            value={elevator.materials.transparency.doors}
            onChange={(value) => dispatch(setTransparency({ part: 'doors', value }))}
            leftLabel="Непрозрачно"
            rightLabel="Прозрачно"
          />
        </>
      )}
    </div>
  );
};

/**
 * Компонент управления преломлением поверхностей
 */
interface RefractionControlsProps {
  elevator: ElevatorState;
}

const RefractionControls: React.FC<RefractionControlsProps> = ({ elevator }) => {
  const dispatch = useDispatch();
  
  return (
    <div style={{ marginBottom: '16px' }}>
      <h4>Преломление света</h4>
      
      <details>
        <summary>О параметре преломления</summary>
        <div style={{ padding: '8px', fontSize: '0.9em', backgroundColor: '#f5f5f5', borderRadius: '4px', marginBottom: '8px' }}>
          <strong>Преломление света (refraction):</strong>
          <ul style={{ marginTop: '4px', paddingLeft: '16px' }}>
            <li>Определяет как свет меняет направление при прохождении через материал</li>
            <li>Значение 1.0 - без преломления (как воздух)</li>
            <li>Значение 1.3-1.4 - как вода</li>
            <li>Значение 1.5-1.7 - как стекло</li>
            <li>Значение 2.0-2.4 - как алмаз</li>
            <li>Создает эффект искажения света, как в стекле или воде</li>
          </ul>
        </div>
      </details>
      
      <CheckboxInput
        id="refractionEnabled"
        label="Включить эффект преломления"
        checked={elevator.materials.refraction.enabled}
        onChange={(checked) => dispatch(setRefraction({ enabled: checked }))}
      />
      
      {elevator.materials.refraction.enabled && (
        <>
          <RangeSlider
            label="Стены:"
            min={1}
            max={2.4}
            step={0.05}
            value={elevator.materials.refraction.walls}
            onChange={(value) => dispatch(setRefraction({ part: 'walls', value }))}
            leftLabel="Воздух"
            rightLabel="Алмаз"
            centerLabel={(value) => `${value.toFixed(2)}`}
          />
          
          <RangeSlider
            label="Пол:"
            min={1}
            max={2.4}
            step={0.05}
            value={elevator.materials.refraction.floor}
            onChange={(value) => dispatch(setRefraction({ part: 'floor', value }))}
            leftLabel="Воздух"
            rightLabel="Алмаз"
            centerLabel={(value) => `${value.toFixed(2)}`}
          />
          
          <RangeSlider
            label="Потолок:"
            min={1}
            max={2.4}
            step={0.05}
            value={elevator.materials.refraction.ceiling}
            onChange={(value) => dispatch(setRefraction({ part: 'ceiling', value }))}
            leftLabel="Воздух"
            rightLabel="Алмаз"
            centerLabel={(value) => `${value.toFixed(2)}`}
          />
          
          <RangeSlider
            label="Двери:"
            min={1}
            max={2.4}
            step={0.05}
            value={elevator.materials.refraction.doors}
            onChange={(value) => dispatch(setRefraction({ part: 'doors', value }))}
            leftLabel="Воздух"
            rightLabel="Алмаз"
            centerLabel={(value) => `${value.toFixed(2)}`}
          />
        </>
      )}
    </div>
  );
};

/**
 * Компонент управления анизотропностью поверхностей
 */
interface AnisotropyControlsProps {
  elevator: ElevatorState;
}

const AnisotropyControls: React.FC<AnisotropyControlsProps> = ({ elevator }) => {
  const dispatch = useDispatch();
  
  return (
    <div style={{ marginBottom: '16px' }}>
      <h4>Анизотропность</h4>
      
      <details>
        <summary>О параметре анизотропности</summary>
        <div style={{ padding: '8px', fontSize: '0.9em', backgroundColor: '#f5f5f5', borderRadius: '4px', marginBottom: '8px' }}>
          <strong>Анизотропность поверхностей (anisotropy):</strong>
          <ul style={{ marginTop: '4px', paddingLeft: '16px' }}>
            <li>Определяет разное отражение света в зависимости от направления</li>
            <li>Используется для материалов с выраженной направленной структурой</li>
            <li>Значение 0 - без анизотропии (обычное отражение)</li>
            <li>Значение 1.0 - максимальная анизотропия</li>
            <li>Создает эффект как на полированном металле с текстурой, виниле или CD-дисках</li>
            <li>Параметр направления указывает угол направления микроструктуры материала</li>
          </ul>
        </div>
      </details>
      
      <CheckboxInput
        id="anisotropyEnabled"
        label="Включить эффект анизотропности"
        checked={elevator.materials.anisotropy.enabled}
        onChange={(checked) => dispatch(setAnisotropy({ enabled: checked }))}
      />
      
      {elevator.materials.anisotropy.enabled && (
        <>
          <RangeSlider
            label="Направление структуры:"
            min={0}
            max={Math.PI * 2}
            step={0.1}
            value={elevator.materials.anisotropy.direction}
            onChange={(value) => dispatch(setAnisotropy({ direction: value }))}
            leftLabel="0°"
            rightLabel="360°"
            centerLabel={(value) => `${Math.round(value * 180 / Math.PI)}°`}
          />
          
          <RangeSlider
            label="Стены:"
            min={0}
            max={1}
            step={0.01}
            value={elevator.materials.anisotropy.walls}
            onChange={(value) => dispatch(setAnisotropy({ part: 'walls', value }))}
            leftLabel="Выкл"
            rightLabel="Макс"
          />
          
          <RangeSlider
            label="Пол:"
            min={0}
            max={1}
            step={0.01}
            value={elevator.materials.anisotropy.floor}
            onChange={(value) => dispatch(setAnisotropy({ part: 'floor', value }))}
            leftLabel="Выкл"
            rightLabel="Макс"
          />
          
          <RangeSlider
            label="Потолок:"
            min={0}
            max={1}
            step={0.01}
            value={elevator.materials.anisotropy.ceiling}
            onChange={(value) => dispatch(setAnisotropy({ part: 'ceiling', value }))}
            leftLabel="Выкл"
            rightLabel="Макс"
          />
          
          <RangeSlider
            label="Двери:"
            min={0}
            max={1}
            step={0.01}
            value={elevator.materials.anisotropy.doors}
            onChange={(value) => dispatch(setAnisotropy({ part: 'doors', value }))}
            leftLabel="Выкл"
            rightLabel="Макс"
          />
        </>
      )}
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
  
  // Группируем опции для отображения в селекторе
  const groupedOptions = textureOptions.reduce<Record<string, SelectOption[]>>((acc, option) => {
    const group = option.group || "Другие";
    if (!acc[group]) {
      acc[group] = [];
    }
    acc[group].push({ value: option.value, label: option.label });
    return acc;
  }, {});
  
  // Создаем структуру для группированного селектора
  const formattedOptions: SelectOptionOrGroup[] = Object.entries(groupedOptions).map(([group, options]) => {
    // Пропускаем группу для "Без текстуры"
    if (group === "") {
      return options[0];
    }
    
    return {
      label: group,
      options
    };
  });
  
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
        options={formattedOptions}
      />
      
      <SelectInput
        label="Текстура пола:"
        value={elevator.materials.texture.floor || ""}
        onChange={(value) => dispatch(setTexture({ 
          part: 'floor', 
          value: value || null 
        }))}
        options={formattedOptions}
      />
      
      <SelectInput
        label="Текстура потолка:"
        value={elevator.materials.texture.ceiling || ""}
        onChange={(value) => dispatch(setTexture({ 
          part: 'ceiling', 
          value: value || null 
        }))}
        options={formattedOptions}
      />
      
      <SelectInput
        label="Текстура дверей:"
        value={elevator.materials.texture.doors || ""}
        onChange={(value) => dispatch(setTexture({ 
          part: 'doors', 
          value: value || null 
        }))}
        options={formattedOptions}
      />
      
      <SelectInput
        label="Текстура передней стены:"
        value={elevator.materials.texture.frontWall || ""}
        onChange={(value) => dispatch(setTexture({ 
          part: 'frontWall', 
          value: value || null 
        }))}
        options={formattedOptions}
      />
    </div>
  );
};

export default MaterialsTab; 
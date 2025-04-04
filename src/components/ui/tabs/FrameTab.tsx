import { useDispatch } from "react-redux";
import {
  ElevatorState,
  setElevatorDimensions,
  toggleDoors,
  setCamera,
} from "../../../store/elevatorSlice";
import { RangeSlider, PresetButton, CheckboxInput } from "../common/UIControls";

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

  return (
    <div style={{ marginBottom: "16px" }}>
      <h4>Основные размеры</h4>

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
 * Компонент управления камерой
 */
interface CameraSectionProps {
  elevator: ElevatorState;
}

const CameraSection: React.FC<CameraSectionProps> = ({ elevator }) => {
  const dispatch = useDispatch();

  return (
    <div style={{ marginBottom: "16px" }}>
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
        onChange={(checked) =>
          dispatch(
            setCamera({
              freeCamera: checked,
            })
          )
        }
      />

      {/* Подсказка по управлению в режиме свободного полета */}
      {elevator.camera.freeCamera && (
        <div
          style={{
            marginTop: "8px",
            padding: "8px",
            backgroundColor: "#fffce0",
            borderRadius: "4px",
            border: "1px solid #eee8a9",
          }}
        >
          <p style={{ fontWeight: "bold", margin: "0 0 4px" }}>Управление:</p>
          <div style={{ fontSize: "13px" }}>
            <b>W</b> - вперед,
            <b>S</b> - назад
            <br />
            <b>A</b> - влево,
            <b>D</b> - вправо
            <br />
            <b>Q</b> - наклон влево,
            <b>E</b> - наклон вправо
            <br />
            <b>R</b> - вверх,
            <b>F</b> - вниз
            <br />
            <b>Shift</b> - ускорение движения
            <br />
            <b>Мышь</b> - поворот камеры
            <br />
            <b>Стрелки</b> - вращение камеры
          </div>
        </div>
      )}

      {/* Отображение координат камеры */}
      <div
        style={{
          marginTop: "8px",
          padding: "8px",
          backgroundColor: "#f5f5f5",
          borderRadius: "4px",
        }}
      >
        <p style={{ fontWeight: "bold", margin: "0 0 4px" }}>
          Текущее положение камеры:
        </p>
        <div style={{ fontFamily: "monospace", fontSize: "13px" }}>
          X: {elevator.camera.position?.x ?? 0}
          <br />
          Y: {elevator.camera.position?.y ?? 0}
          <br />
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
    <div style={{ marginBottom: "16px" }}>
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

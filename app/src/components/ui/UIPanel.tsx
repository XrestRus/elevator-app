import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setElevatorDimensions,
  toggleDoors,
  setMaterial,
  ElevatorState,
} from "../../store/elevatorSlice";
import type { RootState } from "../../store/store";

/**
 * Компонент боковой панели управления конструктором лифта
 */
const UIPanel = () => {
  const [activeTab, setActiveTab] = useState("frame");
  const dispatch = useDispatch();
  const elevator = useSelector(
    (state: RootState) => state.elevator as ElevatorState
  );

  // Обработчик изменения размеров лифта
  const handleDimensionChange = (
    dimension: "width" | "height" | "depth",
    value: number
  ) => {
    dispatch(setElevatorDimensions({ [dimension]: value }));
  };

  // Обработчик открытия/закрытия дверей
  const handleDoorToggle = () => {
    dispatch(toggleDoors());
  };

  // Обработчик изменения материала
  const handleMaterialChange = (
    part: "floor" | "ceiling" | "walls" | "doors",
    color: string
  ) => {
    dispatch(setMaterial({ part, color }));
  };

  return (
    <div
      style={{
        color: "black",
        position: "absolute",
        top: 0,
        right: 0,
        width: "300px",
        height: "100vh",
        backgroundColor: "white",
        boxShadow: "0 0 10px rgba(0,0,0,0.2)",
        padding: "16px",
        overflow: "auto",
        zIndex: 10,
      }}
    >
      <h2 style={{ marginBottom: "16px" }}>Конструктор лифта</h2>

      <div
        style={{
          display: "flex",
          borderBottom: "1px solid #e2e8f0",
          marginBottom: "16px",
          color: "black",
        }}
      >
        <button
          style={{
            color: "black",
            padding: "8px 16px",
            backgroundColor: activeTab === "frame" ? "#e2e8f0" : "transparent",
            border: "none",
            cursor: "pointer",
          }}
          onClick={() => setActiveTab("frame")}
        >
          Каркас
        </button>
        <button
          style={{
            color: "black",
            padding: "8px 16px",
            backgroundColor:
              activeTab === "materials" ? "#e2e8f0" : "transparent",
            border: "none",
            cursor: "pointer",
          }}
          onClick={() => setActiveTab("materials")}
        >
          Отделка
        </button>
        <button
          style={{
            color: "black",
            padding: "8px 16px",
            backgroundColor:
              activeTab === "elements" ? "#e2e8f0" : "transparent",
            border: "none",
            cursor: "pointer",
          }}
          onClick={() => setActiveTab("elements")}
        >
          Элементы
        </button>
      </div>

      <div>
        {activeTab === "frame" && (
          <div>
            <h3>Управление каркасом лифта</h3>

            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", marginBottom: "8px" }}>
                Ширина (м):
              </label>
              <input
                type="range"
                min="1.5"
                max="3"
                step="0.1"
                value={elevator.dimensions.width}
                onChange={(e) =>
                  handleDimensionChange("width", parseFloat(e.target.value))
                }
                style={{ width: "100%" }}
              />
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>1.5</span>
                <span>{elevator.dimensions.width.toFixed(1)}</span>
                <span>3.0</span>
              </div>
            </div>

            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", marginBottom: "8px" }}>
                Высота (м):
              </label>
              <input
                type="range"
                min="2.0"
                max="3.0"
                step="0.1"
                value={elevator.dimensions.height}
                onChange={(e) =>
                  handleDimensionChange("height", parseFloat(e.target.value))
                }
                style={{ width: "100%" }}
              />
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>2.0</span>
                <span>{elevator.dimensions.height.toFixed(1)}</span>
                <span>3.0</span>
              </div>
            </div>

            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", marginBottom: "8px" }}>
                Глубина (м):
              </label>
              <input
                type="range"
                min="1.5"
                max="3.0"
                step="0.1"
                value={elevator.dimensions.depth}
                onChange={(e) =>
                  handleDimensionChange("depth", parseFloat(e.target.value))
                }
                style={{ width: "100%" }}
              />
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>1.5</span>
                <span>{elevator.dimensions.depth.toFixed(1)}</span>
                <span>3.0</span>
              </div>
            </div>

            <div style={{ marginBottom: "16px" }}>
              <button
                style={{
                  padding: "8px 16px",
                  backgroundColor: "#4299e1",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  width: "100%",
                }}
                onClick={handleDoorToggle}
              >
                {elevator.doorsOpen ? "Закрыть двери" : "Открыть двери"}
              </button>
            </div>
          </div>
        )}

        {activeTab === "materials" && (
          <div>
            <p>Управление отделкой лифта</p>
            {/* Здесь будут элементы управления отделкой */}
          </div>
        )}

        {activeTab === "elements" && (
          <div>
            <p>Управление элементами лифта</p>
            {/* Здесь будут элементы управления дополнительными элементами */}
          </div>
        )}
      </div>
    </div>
  );
};

export default UIPanel;

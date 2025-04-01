import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setElevatorDimensions,
  toggleDoors,
  setMaterial,
  setMirrorSurface,
  setTexture,
  setRoughness,
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
            <h3>Управление отделкой лифта</h3>
            
            {/* Выбор цвета для стен */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px' }}>Цвет стен:</label>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <input 
                  type="color" 
                  value={elevator.materials.walls}
                  onChange={(e) => dispatch(setMaterial({ part: 'walls', color: e.target.value }))}
                  style={{ marginRight: '8px' }}
                />
                <span>{elevator.materials.walls}</span>
              </div>
            </div>
            
            {/* Выбор цвета для пола */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px' }}>Цвет пола:</label>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <input 
                  type="color" 
                  value={elevator.materials.floor}
                  onChange={(e) => dispatch(setMaterial({ part: 'floor', color: e.target.value }))}
                  style={{ marginRight: '8px' }}
                />
                <span>{elevator.materials.floor}</span>
              </div>
            </div>
            
            {/* Выбор цвета для потолка */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px' }}>Цвет потолка:</label>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <input 
                  type="color" 
                  value={elevator.materials.ceiling}
                  onChange={(e) => dispatch(setMaterial({ part: 'ceiling', color: e.target.value }))}
                  style={{ marginRight: '8px' }}
                />
                <span>{elevator.materials.ceiling}</span>
              </div>
            </div>
            
            {/* Выбор цвета для дверей */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px' }}>Цвет дверей:</label>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <input 
                  type="color" 
                  value={elevator.materials.doors}
                  onChange={(e) => dispatch(setMaterial({ part: 'doors', color: e.target.value }))}
                  style={{ marginRight: '8px' }}
                />
                <span>{elevator.materials.doors}</span>
              </div>
            </div>
            
            {/* Настройка зеркальных поверхностей */}
            <div style={{ marginBottom: '16px' }}>
              <h4>Зеркальные поверхности</h4>
              
              <div style={{ marginBottom: '8px' }}>
                <label>
                  <input 
                    type="checkbox" 
                    checked={elevator.materials.isMirror.walls}
                    onChange={(e) => dispatch(setMirrorSurface({ part: 'walls', value: e.target.checked }))}
                    style={{ marginRight: '8px' }}
                  />
                  Зеркальные стены
                </label>
              </div>
              
              <div style={{ marginBottom: '8px' }}>
                <label>
                  <input 
                    type="checkbox" 
                    checked={elevator.materials.isMirror.ceiling}
                    onChange={(e) => dispatch(setMirrorSurface({ part: 'ceiling', value: e.target.checked }))}
                    style={{ marginRight: '8px' }}
                  />
                  Зеркальный потолок
                </label>
              </div>
              
              <div style={{ marginBottom: '8px' }}>
                <label>
                  <input 
                    type="checkbox" 
                    checked={elevator.materials.isMirror.doors}
                    onChange={(e) => dispatch(setMirrorSurface({ part: 'doors', value: e.target.checked }))}
                    style={{ marginRight: '8px' }}
                  />
                  Зеркальные двери
                </label>
              </div>
            </div>
            
            {/* Настройка шероховатости */}
            <div style={{ marginBottom: '16px' }}>
              <h4>Шероховатость поверхностей</h4>
              
              <div style={{ marginBottom: '8px' }}>
                <label style={{ display: 'block', marginBottom: '4px' }}>Стены:</label>
                <input 
                  type="range" 
                  min="0" 
                  max="1" 
                  step="0.01" 
                  value={elevator.materials.roughness.walls}
                  onChange={(e) => dispatch(setRoughness({ part: 'walls', value: parseFloat(e.target.value) }))}
                  style={{ width: '100%' }}
                />
              </div>
              
              <div style={{ marginBottom: '8px' }}>
                <label style={{ display: 'block', marginBottom: '4px' }}>Пол:</label>
                <input 
                  type="range" 
                  min="0" 
                  max="1" 
                  step="0.01" 
                  value={elevator.materials.roughness.floor}
                  onChange={(e) => dispatch(setRoughness({ part: 'floor', value: parseFloat(e.target.value) }))}
                  style={{ width: '100%' }}
                />
              </div>
              
              <div style={{ marginBottom: '8px' }}>
                <label style={{ display: 'block', marginBottom: '4px' }}>Потолок:</label>
                <input 
                  type="range" 
                  min="0" 
                  max="1" 
                  step="0.01" 
                  value={elevator.materials.roughness.ceiling}
                  onChange={(e) => dispatch(setRoughness({ part: 'ceiling', value: parseFloat(e.target.value) }))}
                  style={{ width: '100%' }}
                />
              </div>
              
              <div style={{ marginBottom: '8px' }}>
                <label style={{ display: 'block', marginBottom: '4px' }}>Двери:</label>
                <input 
                  type="range" 
                  min="0" 
                  max="1" 
                  step="0.01" 
                  value={elevator.materials.roughness.doors}
                  onChange={(e) => dispatch(setRoughness({ part: 'doors', value: parseFloat(e.target.value) }))}
                  style={{ width: '100%' }}
                />
              </div>
            </div>
            
            {/* Предустановленные текстуры */}
            <div style={{ marginBottom: '16px' }}>
              <h4>Текстуры</h4>
              
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px' }}>Текстура стен:</label>
                <select
                  value={elevator.materials.texture.walls || ""}
                  onChange={(e) => dispatch(setTexture({ 
                    part: 'walls', 
                    value: e.target.value || null 
                  }))}
                  style={{ width: '100%', padding: '4px' }}
                >
                  <option value="">Без текстуры</option>
                  <option value="/textures/wall_wood.jpg">Дерево</option>
                  <option value="/textures/wall_marble.jpg">Мрамор</option>
                  <option value="/textures/wall_metal.jpg">Металл</option>
                  <option value="/textures/wall_fabric.jpg">Ткань</option>
                </select>
              </div>
              
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px' }}>Текстура пола:</label>
                <select
                  value={elevator.materials.texture.floor || ""}
                  onChange={(e) => dispatch(setTexture({ 
                    part: 'floor', 
                    value: e.target.value || null 
                  }))}
                  style={{ width: '100%', padding: '4px' }}
                >
                  <option value="">Без текстуры</option>
                  <option value="/textures/floor_wood.jpg">Дерево</option>
                  <option value="/textures/floor_marble.jpg">Мрамор</option>
                  <option value="/textures/floor_carpet.jpg">Ковёр</option>
                  <option value="/textures/floor_tile.jpg">Плитка</option>
                </select>
              </div>
              
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px' }}>Текстура потолка:</label>
                <select
                  value={elevator.materials.texture.ceiling || ""}
                  onChange={(e) => dispatch(setTexture({ 
                    part: 'ceiling', 
                    value: e.target.value || null 
                  }))}
                  style={{ width: '100%', padding: '4px' }}
                >
                  <option value="">Без текстуры</option>
                  <option value="/textures/ceiling_panel.jpg">Панели</option>
                  <option value="/textures/ceiling_grid.jpg">Решётка</option>
                  <option value="/textures/ceiling_smooth.jpg">Гладкий</option>
                </select>
              </div>
            </div>
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

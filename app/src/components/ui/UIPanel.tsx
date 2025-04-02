import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setElevatorDimensions,
  toggleDoors,
  setMaterial,
  setMirrorSurface,
  setTexture,
  setRoughness,
  setLighting,
  ElevatorState,
  setVisibility,
  setCamera,
  setMetalness,
  setMirrorOptions,
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
  
  // Обработчик изменения угла обзора камеры
  const handleFovChange = (value: number) => {
    dispatch(setCamera({ fov: value }));
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
              <label style={{ display: "block", marginBottom: "8px" }}>
                Угол обзора (FOV):
              </label>
              <input
                type="range"
                min="50"
                max="100"
                step="1"
                value={elevator.camera.fov}
                onChange={(e) =>
                  handleFovChange(parseFloat(e.target.value))
                }
                style={{ width: "100%" }}
              />
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Узкий (50°)</span>
                <span>{elevator.camera.fov.toFixed(0)}°</span>
                <span>Широкий (100°)</span>
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
            
            {/* Пресеты металлических цветов */}
            <div style={{ marginBottom: '16px' }}>
              <h4>Пресеты для лифта</h4>
              
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '8px' }}>
                <button 
                  style={{
                    padding: '8px',
                    backgroundColor: '#FFD700',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    color: '#000',
                    fontWeight: 'bold',
                    fontSize: '12px',
                  }}
                  onClick={() => {
                    // Золотой пресет
                    dispatch(setMaterial({ part: 'walls', color: '#D4AF37' }));
                    dispatch(setMaterial({ part: 'ceiling', color: '#D4AF37' }));
                    dispatch(setMaterial({ part: 'floor', color: '#8B4513' }));
                    dispatch(setMaterial({ part: 'doors', color: '#D4AF37' }));
                    dispatch(setMetalness({ part: 'walls', value: 0.9 }));
                    dispatch(setMetalness({ part: 'ceiling', value: 0.9 }));
                    dispatch(setMetalness({ part: 'doors', value: 0.9 }));
                    dispatch(setRoughness({ part: 'walls', value: 0.1 }));
                    dispatch(setRoughness({ part: 'ceiling', value: 0.1 }));
                    dispatch(setRoughness({ part: 'doors', value: 0.1 }));
                  }}
                >
                  Золотой
                </button>
                
                <button 
                  style={{
                    padding: '8px',
                    backgroundColor: '#CD7F32',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    color: '#000',
                    fontWeight: 'bold',
                    fontSize: '12px',
                  }}
                  onClick={() => {
                    // Бронзовый пресет
                    dispatch(setMaterial({ part: 'walls', color: '#CD7F32' }));
                    dispatch(setMaterial({ part: 'ceiling', color: '#CD7F32' }));
                    dispatch(setMaterial({ part: 'floor', color: '#8B4513' }));
                    dispatch(setMaterial({ part: 'doors', color: '#CD7F32' }));
                    dispatch(setMetalness({ part: 'walls', value: 0.8 }));
                    dispatch(setMetalness({ part: 'ceiling', value: 0.8 }));
                    dispatch(setMetalness({ part: 'doors', value: 0.8 }));
                    dispatch(setRoughness({ part: 'walls', value: 0.2 }));
                    dispatch(setRoughness({ part: 'ceiling', value: 0.2 }));
                    dispatch(setRoughness({ part: 'doors', value: 0.2 }));
                  }}
                >
                  Бронзовый
                </button>
                
                <button 
                  style={{
                    padding: '8px',
                    backgroundColor: '#C0C0C0',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    color: '#000',
                    fontWeight: 'bold',
                    fontSize: '12px',
                  }}
                  onClick={() => {
                    // Серебряный пресет
                    dispatch(setMaterial({ part: 'walls', color: '#C0C0C0' }));
                    dispatch(setMaterial({ part: 'ceiling', color: '#C0C0C0' }));
                    dispatch(setMaterial({ part: 'floor', color: '#8B4513' }));
                    dispatch(setMaterial({ part: 'doors', color: '#C0C0C0' }));
                    dispatch(setMetalness({ part: 'walls', value: 0.9 }));
                    dispatch(setMetalness({ part: 'ceiling', value: 0.9 }));
                    dispatch(setMetalness({ part: 'doors', value: 0.9 }));
                    dispatch(setRoughness({ part: 'walls', value: 0.1 }));
                    dispatch(setRoughness({ part: 'ceiling', value: 0.1 }));
                    dispatch(setRoughness({ part: 'doors', value: 0.1 }));
                  }}
                >
                  Серебряный
                </button>
                
                <button 
                  style={{
                    padding: '8px',
                    backgroundColor: '#B87333',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    color: '#000',
                    fontWeight: 'bold',
                    fontSize: '12px',
                  }}
                  onClick={() => {
                    // Медный пресет
                    dispatch(setMaterial({ part: 'walls', color: '#B87333' }));
                    dispatch(setMaterial({ part: 'ceiling', color: '#B87333' }));
                    dispatch(setMaterial({ part: 'floor', color: '#8B4513' }));
                    dispatch(setMaterial({ part: 'doors', color: '#B87333' }));
                    dispatch(setMetalness({ part: 'walls', value: 0.8 }));
                    dispatch(setMetalness({ part: 'ceiling', value: 0.8 }));
                    dispatch(setMetalness({ part: 'doors', value: 0.8 }));
                    dispatch(setRoughness({ part: 'walls', value: 0.2 }));
                    dispatch(setRoughness({ part: 'ceiling', value: 0.2 }));
                    dispatch(setRoughness({ part: 'doors', value: 0.2 }));
                  }}
                >
                  Медный
                </button>
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
                  Зеркальная задняя стена
                </label>
              </div>
              
              {/* Настройки зеркала доступны только если включено зеркало на задней стене */}
              {elevator.materials.isMirror.walls && (
                <>
                  <div style={{ marginBottom: '8px' }}>
                    <label style={{ display: 'block', marginBottom: '4px' }}>Ширина зеркала (м):</label>
                    <input
                      type="range"
                      min="0.5"
                      max={Math.min(elevator.dimensions.width * 0.9, 2.5)}
                      step="0.1"
                      value={elevator.materials.mirror.width}
                      onChange={(e) => dispatch(setMirrorOptions({ width: parseFloat(e.target.value) }))}
                      style={{ width: '100%' }}
                    />
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>0.5</span>
                      <span>{elevator.materials.mirror.width.toFixed(1)} м</span>
                      <span>{Math.min(elevator.dimensions.width * 0.9, 2.5).toFixed(1)}</span>
                    </div>
                  </div>
                  
                  <div style={{ marginBottom: '8px' }}>
                    <label style={{ display: 'block', marginBottom: '4px' }}>Высота зеркала (м):</label>
                    <input 
                      type="range" 
                      min="0.5" 
                      max={elevator.dimensions.height * 0.8} 
                      step="0.1" 
                      value={elevator.materials.mirror.height}
                      onChange={(e) => dispatch(setMirrorOptions({ height: parseFloat(e.target.value) }))}
                      style={{ width: '100%' }}
                    />
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>0.5</span>
                      <span>{elevator.materials.mirror.height.toFixed(1)} м</span>
                      <span>{(elevator.dimensions.height * 0.8).toFixed(1)}</span>
                    </div>
                  </div>
                  
                  <div style={{ marginBottom: '8px' }}>
                    <label style={{ display: 'block', marginBottom: '4px' }}>Положение по высоте:</label>
                    <input 
                      type="range" 
                      min={-elevator.dimensions.height/4} 
                      max={elevator.dimensions.height/4} 
                      step="0.05" 
                      value={elevator.materials.mirror.position}
                      onChange={(e) => dispatch(setMirrorOptions({ position: parseFloat(e.target.value) }))}
                      style={{ width: '100%' }}
                    />
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Ниже</span>
                      <span>{elevator.materials.mirror.position.toFixed(2)}</span>
                      <span>Выше</span>
                    </div>
                  </div>
                  
                  <div style={{ marginBottom: '8px' }}>
                    <label style={{ display: 'block', marginBottom: '4px' }}>Тип зеркала:</label>
                    <select
                      value={elevator.materials.mirror.type}
                      onChange={(e) => dispatch(setMirrorOptions({ 
                        type: e.target.value as 'full' | 'double' | 'triple' 
                      }))}
                      style={{ width: '100%', padding: '4px' }}
                    >
                      <option value="full">Сплошное зеркало</option>
                      <option value="double">Два зеркала в ряд</option>
                      <option value="triple">Три зеркала в ряд</option>
                    </select>
                  </div>
                  
                  {/* Пресеты для зеркал */}
                  <div style={{ marginBottom: '8px' }}>
                    <label style={{ display: 'block', marginBottom: '4px' }}>Пресеты зеркал:</label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      <button 
                        style={{
                          padding: '4px 8px',
                          backgroundColor: '#f0f0f0',
                          border: '1px solid #ccc',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '12px',
                        }}
                        onClick={() => {
                          // Большое зеркало во всю стену
                          dispatch(setMirrorOptions({ 
                            width: Math.min(elevator.dimensions.width * 0.9, 2.5),
                            height: elevator.dimensions.height * 0.8,
                            type: 'full' 
                          }));
                        }}
                      >
                        Большое зеркало
                      </button>
                      
                      <button 
                        style={{
                          padding: '4px 8px',
                          backgroundColor: '#f0f0f0',
                          border: '1px solid #ccc',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '12px',
                        }}
                        onClick={() => {
                          // Два вертикальных зеркала
                          dispatch(setMirrorOptions({ 
                            width: Math.min(elevator.dimensions.width * 0.8, 2.2),
                            height: elevator.dimensions.height * 0.7,
                            type: 'double' 
                          }));
                        }}
                      >
                        Два зеркала
                      </button>
                      
                      <button 
                        style={{
                          padding: '4px 8px',
                          backgroundColor: '#f0f0f0',
                          border: '1px solid #ccc',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '12px',
                        }}
                        onClick={() => {
                          // Три маленьких зеркала
                          dispatch(setMirrorOptions({ 
                            width: Math.min(elevator.dimensions.width * 0.85, 2.4),
                            height: elevator.dimensions.height * 0.5,
                            type: 'triple' 
                          }));
                        }}
                      >
                        Три зеркала
                      </button>
                    </div>
                  </div>
                </>
              )}
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
            
            {/* Настройка металличности */}
            <div style={{ marginBottom: '16px' }}>
              <h4>Металличность поверхностей</h4>
              
              <div style={{ marginBottom: '8px' }}>
                <label style={{ display: 'block', marginBottom: '4px' }}>Стены:</label>
                <input 
                  type="range" 
                  min="0" 
                  max="1" 
                  step="0.01" 
                  value={elevator.materials.metalness.walls}
                  onChange={(e) => dispatch(setMetalness({ part: 'walls', value: parseFloat(e.target.value) }))}
                  style={{ width: '100%' }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Матовый</span>
                  <span>{elevator.materials.metalness.walls.toFixed(2)}</span>
                  <span>Металлик</span>
                </div>
              </div>
              
              <div style={{ marginBottom: '8px' }}>
                <label style={{ display: 'block', marginBottom: '4px' }}>Пол:</label>
                <input 
                  type="range" 
                  min="0" 
                  max="1" 
                  step="0.01" 
                  value={elevator.materials.metalness.floor}
                  onChange={(e) => dispatch(setMetalness({ part: 'floor', value: parseFloat(e.target.value) }))}
                  style={{ width: '100%' }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Матовый</span>
                  <span>{elevator.materials.metalness.floor.toFixed(2)}</span>
                  <span>Металлик</span>
                </div>
              </div>
              
              <div style={{ marginBottom: '8px' }}>
                <label style={{ display: 'block', marginBottom: '4px' }}>Потолок:</label>
                <input 
                  type="range" 
                  min="0" 
                  max="1" 
                  step="0.01" 
                  value={elevator.materials.metalness.ceiling}
                  onChange={(e) => dispatch(setMetalness({ part: 'ceiling', value: parseFloat(e.target.value) }))}
                  style={{ width: '100%' }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Матовый</span>
                  <span>{elevator.materials.metalness.ceiling.toFixed(2)}</span>
                  <span>Металлик</span>
                </div>
              </div>
              
              <div style={{ marginBottom: '8px' }}>
                <label style={{ display: 'block', marginBottom: '4px' }}>Двери:</label>
                <input 
                  type="range" 
                  min="0" 
                  max="1" 
                  step="0.01" 
                  value={elevator.materials.metalness.doors}
                  onChange={(e) => dispatch(setMetalness({ part: 'doors', value: parseFloat(e.target.value) }))}
                  style={{ width: '100%' }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Матовый</span>
                  <span>{elevator.materials.metalness.doors.toFixed(2)}</span>
                  <span>Металлик</span>
                </div>
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
                  <option value="/textures/example/wood_0066_1k_HoQeAg">Дерево (PBR)</option>
                  <option value="/textures/example/marble_0018_1k_pq6AtM">Мрамор (PBR)</option>
                  <option value="/textures/example/metal_0084_1k_uJitA0">Металл (PBR)</option>
                  <option value="/textures/example/fabrics_0080_1k_1jAg4B">Ткань (PBR)</option>
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
                  <option value="/textures/example/wood_0066_1k_HoQeAg">Дерево (PBR)</option>
                  <option value="/textures/example/marble_0018_1k_pq6AtM">Мрамор (PBR)</option>
                  <option value="/textures/example/metal_0084_1k_uJitA0">Металл (PBR)</option>
                  <option value="/textures/example/fabrics_0080_1k_1jAg4B">Ткань (PBR)</option>
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
                  <option value="/textures/example/wood_0066_1k_HoQeAg">Дерево (PBR)</option>
                  <option value="/textures/example/marble_0018_1k_pq6AtM">Мрамор (PBR)</option>
                  <option value="/textures/example/metal_0084_1k_uJitA0">Металл (PBR)</option>
                  <option value="/textures/example/fabrics_0080_1k_1jAg4B">Ткань (PBR)</option>
                </select>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === "elements" && (
          <div>
            <h3>Управление элементами лифта</h3>
            
            {/* Переключатели для элементов лифта */}
            <div style={{ marginBottom: '16px' }}>
              <h4>Элементы интерьера</h4>
              
              <div style={{ marginBottom: '8px', display: 'flex', alignItems: 'center' }}>
                <input 
                  type="checkbox" 
                  id="showHandrails"
                  checked={elevator.visibility.handrails}
                  onChange={() => dispatch(setVisibility({ 
                    element: 'handrails', 
                    visible: !elevator.visibility.handrails 
                  }))}
                  style={{ marginRight: '8px' }}
                />
                <label htmlFor="showHandrails">Поручни</label>
              </div>
              
              <div style={{ marginBottom: '8px', display: 'flex', alignItems: 'center' }}>
                <input 
                  type="checkbox" 
                  id="showControlPanel"
                  checked={elevator.visibility.controlPanel}
                  onChange={() => dispatch(setVisibility({ 
                    element: 'controlPanel', 
                    visible: !elevator.visibility.controlPanel 
                  }))}
                  style={{ marginRight: '8px' }}
                />
                <label htmlFor="showControlPanel">Панель управления</label>
              </div>
            </div>
            
            {/* Настройки освещения */}
            <div style={{ marginBottom: '16px' }}>
              <h4>Освещение</h4>
              
              <div style={{ marginBottom: '8px' }}>
                <label style={{ display: 'block', marginBottom: '4px' }}>Количество светильников:</label>
                <select
                  value={elevator.lighting.count}
                  onChange={(e) => dispatch(setLighting({ 
                    count: parseInt(e.target.value) 
                  }))}
                  style={{ width: '100%', padding: '4px' }}
                >
                  <option value="1">1 (центральный)</option>
                  <option value="2">2 (спереди и сзади)</option>
                  <option value="4">4 (по углам)</option>
                </select>
              </div>
              
              <div style={{ marginBottom: '8px' }}>
                <label style={{ display: 'block', marginBottom: '4px' }}>Цвет света:</label>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <input 
                    type="color" 
                    value={elevator.lighting.color}
                    onChange={(e) => dispatch(setLighting({ color: e.target.value }))}
                    style={{ marginRight: '8px' }}
                  />
                  <span>{elevator.lighting.color}</span>
                </div>
              </div>
              
              <div style={{ marginBottom: '8px' }}>
                <label style={{ display: 'block', marginBottom: '4px' }}>Интенсивность:</label>
                <input 
                  type="range" 
                  min="0.5" 
                  max="5" 
                  step="0.1" 
                  value={elevator.lighting.intensity}
                  onChange={(e) => dispatch(setLighting({ intensity: parseFloat(e.target.value) }))}
                  style={{ width: '100%' }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Слабый</span>
                  <span>{elevator.lighting.intensity.toFixed(1)}</span>
                  <span>Яркий</span>
                </div>
              </div>
              
              {/* Переключатель света */}
              <div style={{ marginBottom: '8px' }}>
                <label>
                  <input 
                    type="checkbox" 
                    checked={elevator.lighting.enabled}
                    onChange={(e) => dispatch(setLighting({ enabled: e.target.checked }))}
                    style={{ marginRight: '8px' }}
                  />
                  Включить свет
                </label>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UIPanel; 

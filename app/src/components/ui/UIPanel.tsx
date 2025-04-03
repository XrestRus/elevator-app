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
  setDecorationStripes,
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
              <label style={{ display: "block", marginBottom: "8px" }}>
                Высота камеры:
              </label>
              <input
                type="range"
                min="0.1"
                max="1.8"
                step="0.05"
                value={elevator.camera.cameraHeight ?? 1.2}
                onChange={(e) =>
                  dispatch(setCamera({ cameraHeight: parseFloat(e.target.value) }))
                }
                style={{ width: "100%" }}
                disabled={elevator.camera.freeCamera}
              />
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Очень низко</span>
                <span>{(elevator.camera.cameraHeight ?? 1.2).toFixed(2)} м</span>
                <span>Высоко</span>
              </div>
              <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                Недоступно в режиме свободного полета
              </div>
            </div>

            <div style={{ marginBottom: "16px" }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                <input 
                  type="checkbox" 
                  id="freeCameraMode"
                  checked={elevator.camera.freeCamera}
                  onChange={() => dispatch(setCamera({ 
                    freeCamera: !elevator.camera.freeCamera 
                  }))}
                  style={{ marginRight: '8px' }}
                />
                <label htmlFor="freeCameraMode">Режим свободного полета</label>
              </div>
              <div style={{ fontSize: '12px', color: '#666', marginLeft: '22px' }}>
                <div style={{ marginBottom: '4px', fontWeight: 'bold' }}>В режиме свободного полета:</div>
                <ul style={{ marginTop: '4px', paddingLeft: '20px' }}>
                  <li>WASD - движение вперед/назад/влево/вправо</li>
                  <li>R/F - движение вверх/вниз</li>
                  <li>Мышь с зажатой ЛКМ - поворот камеры</li>
                </ul>
                <div style={{ marginTop: '8px', marginBottom: '4px', fontWeight: 'bold' }}>В обычном режиме:</div>
                <ul style={{ marginTop: '4px', paddingLeft: '20px' }}>
                  <li>Камера очень низко (20 см от пола по умолчанию)</li>
                  <li>Вращение происходит вокруг точки наблюдения</li>
                  <li>Изменение высоты не сбрасывает взгляд</li>
                </ul>
              </div>
            </div>

            {/* Отображение координат камеры */}
            <div style={{ marginBottom: "16px" }}>
              <h4 style={{ marginBottom: '8px', fontSize: '14px' }}>Текущее положение камеры:</h4>
              <div style={{ 
                padding: '8px', 
                backgroundColor: '#f5f5f5', 
                borderRadius: '4px',
                fontFamily: 'monospace',
                fontSize: '13px'
              }}>
                X: {elevator.camera.position?.x ?? 0}<br />
                Y: {elevator.camera.position?.y ?? 0}<br />
                Z: {elevator.camera.position?.z ?? 0}
              </div>
              <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                Чтобы изменить позицию камеры по умолчанию:
                <ol style={{ marginTop: '4px', paddingLeft: '20px' }}>
                  <li>Откройте файл app/src/App.tsx</li>
                  <li>Найдите блоки с комментариями "БЛОК ДЛЯ РЕДАКТИРОВАНИЯ ПОЗИЦИИ КАМЕРЫ"</li>
                  <li>Измените числовые значения в строке camera.position.set(X, Y, Z)</li>
                  <li>Чтобы изменения вступили в силу, перезапустите приложение</li>
                </ol>
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
                          // Два зеркала в ряд
                          dispatch(setMirrorOptions({ 
                            width: Math.min(elevator.dimensions.width * 0.4, 1.0),
                            height: elevator.dimensions.height * 0.6,
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
                          // Три зеркала в ряд
                          dispatch(setMirrorOptions({ 
                            width: Math.min(elevator.dimensions.width * 0.25, 0.7),
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
            
            {/* Декоративные полосы */}
            <div style={{ marginBottom: '16px' }}>
              <h4>Декоративные полосы</h4>
              
              <div style={{ marginBottom: '8px', display: 'flex', alignItems: 'center' }}>
                <input 
                  type="checkbox" 
                  id="showStripes"
                  checked={elevator.decorationStripes?.enabled ?? false}
                  onChange={() => dispatch(setDecorationStripes({ 
                    enabled: !(elevator.decorationStripes?.enabled ?? false)
                  }))}
                  style={{ marginRight: '8px' }}
                />
                <label htmlFor="showStripes">Показать декоративные полосы</label>
              </div>
              
              {(elevator.decorationStripes?.enabled ?? false) && (
                <>
                  <div style={{ marginBottom: '8px' }}>
                    <label style={{ display: 'block', marginBottom: '4px' }}>Расположение полос:</label>
                    <select
                      value={elevator.decorationStripes?.position ?? 'middle'}
                      onChange={(e) => {
                        const position = e.target.value;
                        if (position === 'top' || position === 'middle' || position === 'bottom' || position === 'all') {
                          dispatch(setDecorationStripes({ position }));
                        }
                      }}
                      style={{ width: '100%', padding: '4px' }}
                    >
                      <option value="top">Верхняя часть стен</option>
                      <option value="middle">Середина стен</option>
                      <option value="bottom">Нижняя часть стен</option>
                      <option value="all">Все стены</option>
                    </select>
                  </div>
                  
                  <div style={{ marginBottom: '8px' }}>
                    <label style={{ display: 'block', marginBottom: '4px' }}>Ориентация полос:</label>
                    <select
                      value={elevator.decorationStripes?.orientation ?? 'horizontal'}
                      onChange={(e) => {
                        const orientation = e.target.value;
                        if (orientation === 'horizontal' || orientation === 'vertical') {
                          dispatch(setDecorationStripes({ orientation }));
                        }
                      }}
                      style={{ width: '100%', padding: '4px' }}
                    >
                      <option value="horizontal">Горизонтальные</option>
                      <option value="vertical">Вертикальные</option>
                    </select>
                  </div>
                  
                  <div style={{ marginBottom: '8px' }}>
                    <label style={{ display: 'block', marginBottom: '4px' }}>Количество полос:</label>
                    <select
                      value={elevator.decorationStripes?.count ?? 1}
                      onChange={(e) => dispatch(setDecorationStripes({ 
                        count: parseInt(e.target.value) 
                      }))}
                      style={{ width: '100%', padding: '4px' }}
                    >
                      <option value="1">1 полоса</option>
                      <option value="2">2 полосы</option>
                      <option value="3">3 полосы</option>
                      <option value="4">4 полосы</option>
                      <option value="5">5 полос</option>
                      <option value="6">6 полос</option>
                      <option value="7">7 полос</option>
                      <option value="8">8 полос</option>
                      <option value="9">9 полос</option>
                      <option value="10">10 полос</option>
                    </select>
                  </div>
                  
                  <div style={{ marginBottom: '8px' }}>
                    <label>
                      <input 
                        type="checkbox" 
                        checked={elevator.decorationStripes?.showOnDoors ?? false}
                        onChange={(e) => dispatch(setDecorationStripes({ 
                          showOnDoors: e.target.checked 
                        }))}
                        style={{ marginRight: '8px' }}
                      />
                      Полосы на дверях
                    </label>
                  </div>
                  
                  <div style={{ marginBottom: '8px' }}>
                    <label style={{ display: 'block', marginBottom: '4px' }}>Ширина полосы (см):</label>
                    <input 
                      type="range" 
                      min="0.1" 
                      max="15" 
                      step="0.1" 
                      value={elevator.decorationStripes?.width ?? 5}
                      onChange={(e) => dispatch(setDecorationStripes({ 
                        width: parseFloat(e.target.value) 
                      }))}
                      style={{ width: '100%' }}
                    />
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>0.1 см</span>
                      <span>{(elevator.decorationStripes?.width ?? 5).toFixed(1)} см</span>
                      <span>15 см</span>
                    </div>
                  </div>
                  
                  <div style={{ marginBottom: '8px' }}>
                    <label style={{ display: 'block', marginBottom: '4px' }}>Расстояние между полосами (см):</label>
                    <input 
                      type="range" 
                      min="1" 
                      max="20" 
                      step="0.5" 
                      value={elevator.decorationStripes?.spacing ?? 3}
                      onChange={(e) => dispatch(setDecorationStripes({ 
                        spacing: parseFloat(e.target.value) 
                      }))}
                      style={{ width: '100%' }}
                    />
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>1 см</span>
                      <span>{(elevator.decorationStripes?.spacing ?? 3).toFixed(1)} см</span>
                      <span>20 см</span>
                    </div>
                  </div>
                  
                  <div style={{ marginBottom: '8px' }}>
                    <label style={{ display: 'block', marginBottom: '4px' }}>Смещение от центра (см):</label>
                    <input 
                      type="range" 
                      min="-20" 
                      max="20" 
                      step="0.5" 
                      value={elevator.decorationStripes?.offset ?? 0}
                      onChange={(e) => dispatch(setDecorationStripes({ 
                        offset: parseFloat(e.target.value) 
                      }))}
                      style={{ width: '100%' }}
                    />
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Левее</span>
                      <span>{(elevator.decorationStripes?.offset ?? 0).toFixed(1)} см</span>
                      <span>Правее</span>
                    </div>
                  </div>
                  
                  <div style={{ marginBottom: '8px' }}>
                    <label>
                      <input 
                        type="checkbox" 
                        checked={elevator.decorationStripes?.skipMirrorWall ?? true}
                        onChange={(e) => dispatch(setDecorationStripes({ 
                          skipMirrorWall: e.target.checked 
                        }))}
                        style={{ marginRight: '8px' }}
                      />
                      Не отображать на стене с зеркалом
                    </label>
                  </div>
                  
                  <div style={{ marginBottom: '8px' }}>
                    <label style={{ display: 'block', marginBottom: '4px' }}>Материал полос:</label>
                    <select
                      value={elevator.decorationStripes?.material ?? 'metal'}
                      onChange={(e) => {
                        const material = e.target.value;
                        if (material === 'metal' || material === 'glossy' || material === 'wood') {
                          dispatch(setDecorationStripes({ material }));
                        }
                      }}
                      style={{ width: '100%', padding: '4px' }}
                    >
                      <option value="metal">Металл</option>
                      <option value="glossy">Глянцевый</option>
                      <option value="wood">Дерево</option>
                    </select>
                  </div>
                  
                  <div style={{ marginBottom: '8px' }}>
                    <label style={{ display: 'block', marginBottom: '4px' }}>Цвет полос:</label>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <input 
                        type="color" 
                        value={elevator.decorationStripes?.color ?? '#C0C0C0'}
                        onChange={(e) => dispatch(setDecorationStripes({ 
                          color: e.target.value 
                        }))}
                        style={{ marginRight: '8px' }}
                      />
                      <span>{elevator.decorationStripes?.color ?? '#C0C0C0'}</span>
                    </div>
                  </div>
                  
                  <div style={{ marginBottom: '8px' }}>
                    <button 
                      style={{
                        padding: '8px',
                        backgroundColor: '#f0f0f0',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        width: '100%',
                        marginBottom: '8px'
                      }}
                      onClick={() => {
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
                      }}
                    >
                      Золотая полоса
                    </button>
                    
                    <button 
                      style={{
                        padding: '8px',
                        backgroundColor: '#f0f0f0',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        width: '100%',
                        marginBottom: '8px'
                      }}
                      onClick={() => {
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
                      }}
                    >
                      Серебряная полоса
                    </button>
                    
                    <button 
                      style={{
                        padding: '8px',
                        backgroundColor: '#f0f0f0',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        width: '100%',
                        marginBottom: '8px'
                      }}
                      onClick={() => {
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
                      }}
                    >
                      Деревянные полосы
                    </button>
                    
                    <button 
                      style={{
                        padding: '8px',
                        backgroundColor: '#f0f0f0',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        width: '100%',
                        marginBottom: '8px'
                      }}
                      onClick={() => {
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
                      }}
                    >
                      Вертикальные полосы
                    </button>
                    
                    <button 
                      style={{
                        padding: '8px',
                        backgroundColor: '#f0f0f0',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        width: '100%',
                        marginBottom: '8px'
                      }}
                      onClick={() => {
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
                      }}
                    >
                      Золотая полоса с дверями
                    </button>
                    
                    <button 
                      style={{
                        padding: '8px',
                        backgroundColor: '#f0f0f0',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        width: '100%',
                        marginBottom: '8px'
                      }}
                      onClick={() => {
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
                      }}
                    >
                      Вертикальные полосы с дверями
                    </button>
                  </div>
                </>
              )}
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

import React, { useState, useEffect } from 'react';
import { useHoverStore } from './HoverStore';
import '../../styles/ObjectInfoPanel.css';

/**
 * Компонент для отображения информации о выбранном объекте в боковой панели
 * 
 * Принцип работы:
 * 1. Получает данные о выбранном и наведенном объектах из глобального хранилища useHoverStore
 * 2. Отображает детальную информацию о выбранном объекте в структурированном виде
 * 3. Показывает подсказку о наведенном объекте, если пользователь навел курсор на элемент
 * 4. Обеспечивает возможность сворачивания/разворачивания панели
 * 5. Интегрируется с системой отслеживания и управляет расположением элементов интерфейса
 */
const ObjectInfoPanel: React.FC = () => {
  // Получаем данные о выбранном объекте из хранилища
  const selectedObject = useHoverStore((state) => state.selectedObject);
  const hoveredObject = useHoverStore((state) => state.hoveredObject);
  
  // Состояние для отслеживания свернутости панели
  const [isPanelCollapsed, setIsPanelCollapsed] = useState(false);
  
  // Обработчик сворачивания/разворачивания панели
  const togglePanel = () => {
    setIsPanelCollapsed(!isPanelCollapsed);
  };
  
  // Обновляем класс для контейнера Canvas при сворачивании/разворачивании панели
  useEffect(() => {
    const canvasContainer = document.querySelector('.canvas-container');
    if (canvasContainer) {
      if (isPanelCollapsed) {
        canvasContainer.classList.add('full-width');
      } else {
        canvasContainer.classList.remove('full-width');
      }
    }
  }, [isPanelCollapsed]);
  
  // Если объект не выбран, отображаем пустую панель с подсказкой
  if (!selectedObject) {
    return (
      <div className={`object-info-panel ${isPanelCollapsed ? 'collapsed' : ''}`}>
        <button 
          className="object-info-panel-toggle"
          onClick={togglePanel}
          title={isPanelCollapsed ? "Развернуть панель" : "Свернуть панель"}
        >
          {isPanelCollapsed ? ">" : "<"}
        </button>
        
        <div className="object-info-panel-header">
          <h2>Информация</h2>
        </div>
        
        <div className="object-info-panel-hover-hint">
          {hoveredObject ? (
            <>Наведено на: <strong>{hoveredObject.name}</strong></>
          ) : (
            <span>Наведите курсор на объект</span>
          )}
        </div>
        
        <div className="object-info-panel-empty">
          <p>Нажмите на элемент лифта, чтобы увидеть информацию о нём</p>
          {!hoveredObject && (
            <p style={{ fontSize: '0.9rem', marginTop: '10px', opacity: 0.7 }}>
              Наведите курсор на любой элемент для подсказки
            </p>
          )}
        </div>
      </div>
    );
  }

  // Форматирование размеров для отображения
  const formatDimensions = () => {
    if (!selectedObject.dimensions) return null;
    
    const dimensions = [];
    if (selectedObject.dimensions.width !== undefined) 
      dimensions.push(<div key="width" className="object-info-panel-detail">
        <strong>Ширина:</strong> {selectedObject.dimensions.width.toFixed(2)}м
      </div>);
    if (selectedObject.dimensions.height !== undefined) 
      dimensions.push(<div key="height" className="object-info-panel-detail">
        <strong>Высота:</strong> {selectedObject.dimensions.height.toFixed(2)}м
      </div>);
    if (selectedObject.dimensions.depth !== undefined) 
      dimensions.push(<div key="depth" className="object-info-panel-detail">
        <strong>Глубина:</strong> {selectedObject.dimensions.depth.toFixed(2)}м
      </div>);
    
    return dimensions.length > 0 ? dimensions : null;
  };

  return (
    <div className={`object-info-panel ${isPanelCollapsed ? 'collapsed' : ''}`}>
      <button 
        className="object-info-panel-toggle"
        onClick={togglePanel}
        title={isPanelCollapsed ? "Развернуть панель" : "Свернуть панель"}
      >
        {isPanelCollapsed ? ">" : "<"}
      </button>
      
      <div className="object-info-panel-header">
        <h2>Информация</h2>
        <button 
          className="object-info-panel-close"
          onClick={() => useHoverStore.getState().setSelectedObject(null)}
          title="Закрыть"
        >
          ×
        </button>
      </div>
      
      <div className="object-info-panel-hover-hint">
        {hoveredObject && hoveredObject.uuid !== selectedObject.uuid ? (
          <>Наведено на: <strong>{hoveredObject.name}</strong></>
        ) : (
          <span>Выбрано: <strong>{selectedObject.name}</strong></span>
        )}
      </div>
      
      <div className="object-info-panel-content">
        <div className="object-info-panel-section">
          <h3>Элемент</h3>
          <div className="object-info-panel-detail">
            <strong>Название:</strong> {selectedObject.name}
          </div>
          {selectedObject.type && (
            <div className="object-info-panel-detail">
              <strong>Тип:</strong> {selectedObject.type}
            </div>
          )}
        </div>
        
        {selectedObject.description && (
          <div className="object-info-panel-section">
            <h3>Описание</h3>
            <div className="object-info-panel-detail">
              {selectedObject.description}
            </div>
          </div>
        )}
        
        {selectedObject.material && (
          <div className="object-info-panel-section">
            <h3>Материал</h3>
            <div className="object-info-panel-detail">
              {selectedObject.material}
            </div>
          </div>
        )}
        
        {selectedObject.dimensions && formatDimensions() && (
          <div className="object-info-panel-section">
            <h3>Размеры</h3>
            {formatDimensions()}
          </div>
        )}
        
        {selectedObject.additionalInfo && Object.keys(selectedObject.additionalInfo).length > 0 && (
          <div className="object-info-panel-section">
            <h3>Дополнительно</h3>
            {Object.entries(selectedObject.additionalInfo).map(([key, value], index) => (
              <div key={index} className="object-info-panel-detail">
                <strong>{key}:</strong> {String(value)}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ObjectInfoPanel; 
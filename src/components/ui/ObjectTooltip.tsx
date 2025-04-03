import React, { useEffect, useState } from 'react';
import { useHoverStore } from './HoverStore';
import '../../styles/Tooltip.css';

/**
 * Компонент для отображения информации об объекте при наведении мыши
 */
const ObjectTooltip: React.FC = () => {
  // Получаем данные о наведении из хранилища
  const hoveredObject = useHoverStore((state) => state.hoveredObject);
  const mousePosition = useHoverStore((state) => state.mousePosition);
  
  const [style, setStyle] = useState({
    left: '0px',
    top: '0px',
    opacity: 0,
    visibility: 'hidden' as 'hidden' | 'visible'
  });

  // Обновляем стиль и позицию тултипа при изменении позиции мыши или объекта
  useEffect(() => {
    if (hoveredObject && mousePosition) {
      // Добавляем небольшое смещение, чтобы тултип не перекрывал курсор
      const offsetX = 15;
      const offsetY = 15;
      
      // Устанавливаем новый стиль
      setStyle({
        left: `${mousePosition.x + offsetX}px`,
        top: `${mousePosition.y + offsetY}px`,
        opacity: 1,
        visibility: 'visible'
      });
    } else {
      // Скрываем тултип, если нет объекта под курсором
      setStyle({
        ...style,
        opacity: 0,
        visibility: 'hidden'
      });
    }
  }, [hoveredObject, mousePosition, style]);

  // Если нет объекта под курсором, не отображаем тултип
  if (!hoveredObject) {
    return null;
  }

  // Форматирование размеров для отображения
  const formatDimensions = () => {
    if (!hoveredObject.dimensions) return '';
    
    const dimensions = [];
    if (hoveredObject.dimensions.width !== undefined) 
      dimensions.push(`Ширина: ${hoveredObject.dimensions.width.toFixed(2)}м`);
    if (hoveredObject.dimensions.height !== undefined) 
      dimensions.push(`Высота: ${hoveredObject.dimensions.height.toFixed(2)}м`);
    if (hoveredObject.dimensions.depth !== undefined) 
      dimensions.push(`Глубина: ${hoveredObject.dimensions.depth.toFixed(2)}м`);
    
    return dimensions.join(', ');
  };
  
  // Отображение информации о цвете
  const getColorInfo = () => {
    if (!hoveredObject.additionalInfo) return null;
    
    // Проверяем есть ли информация о цвете
    const colorInfo = hoveredObject.additionalInfo.color;
    if (!colorInfo) return null;
    
    return (
      <div className="object-tooltip-row">
        <span className="object-tooltip-label">Цвет: </span>
        <span className="color-preview" style={{ 
          backgroundColor: typeof colorInfo === 'string' ? colorInfo : '#cccccc',
          display: 'inline-block',
          width: '12px',
          height: '12px',
          marginRight: '5px',
          border: '1px solid #666',
          borderRadius: '2px',
          verticalAlign: 'middle'
        }}></span>
        {typeof colorInfo === 'string' ? colorInfo : JSON.stringify(colorInfo)}
      </div>
    );
  };
  
  // Отображение информации о текстуре
  const getTextureInfo = () => {
    if (!hoveredObject.additionalInfo) return null;
    
    // Проверяем есть ли информация о текстуре
    const textureInfo = hoveredObject.additionalInfo.texture;
    if (!textureInfo) return null;
    
    return (
      <div className="object-tooltip-row">
        <span className="object-tooltip-label">Текстура: </span>
        {typeof textureInfo === 'string' ? textureInfo : JSON.stringify(textureInfo)}
      </div>
    );
  };

  return (
    <div className="object-tooltip" style={style}>
      <div className="object-tooltip-title">
        {hoveredObject.name}
      </div>
      
      {hoveredObject.type && (
        <div className="object-tooltip-row">
          <span className="object-tooltip-label">Тип: </span>
          {hoveredObject.type}
        </div>
      )}
      
      {hoveredObject.description && (
        <div className="object-tooltip-row">
          <span className="object-tooltip-label">Описание: </span>
          {hoveredObject.description}
        </div>
      )}
      
      {hoveredObject.material && (
        <div className="object-tooltip-row">
          <span className="object-tooltip-label">Материал: </span>
          {hoveredObject.material}
        </div>
      )}
      
      {/* Добавляем информацию о цвете */}
      {getColorInfo()}
      
      {/* Добавляем информацию о текстуре */}
      {getTextureInfo()}
      
      {hoveredObject.dimensions && (
        <div className="object-tooltip-row">
          <span className="object-tooltip-label">Размеры: </span>
          {formatDimensions()}
        </div>
      )}
      
      {hoveredObject.additionalInfo && Object.keys(hoveredObject.additionalInfo).length > 0 && 
       hoveredObject.additionalInfo.color === undefined && 
       hoveredObject.additionalInfo.texture === undefined && (
        <div className="object-tooltip-additional">
          {Object.entries(hoveredObject.additionalInfo)
            .filter(([key]) => key !== 'color' && key !== 'texture')
            .map(([key, value]) => (
              <div key={key} className="object-tooltip-row">
                <span className="object-tooltip-label">{key}: </span>
                {String(value)}
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default ObjectTooltip; 
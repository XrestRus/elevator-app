import React, { useEffect, useState } from 'react';
import { useHoverStore } from './ObjectHoverHandler';

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
  }, [hoveredObject, mousePosition]);

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
      
      {hoveredObject.dimensions && (
        <div className="object-tooltip-row">
          <span className="object-tooltip-label">Размеры: </span>
          {formatDimensions()}
        </div>
      )}
      
      {hoveredObject.additionalInfo && Object.keys(hoveredObject.additionalInfo).length > 0 && (
        <div className="object-tooltip-additional">
          {Object.entries(hoveredObject.additionalInfo).map(([key, value]) => (
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
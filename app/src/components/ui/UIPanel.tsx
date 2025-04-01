import React, { useState } from 'react';

/**
 * Компонент боковой панели управления конструктором лифта
 */
const UIPanel = () => {
  const [activeTab, setActiveTab] = useState('frame');

  return (
    <div 
      style={{
        position: 'absolute',
        top: 0,
        right: 0,
        width: '300px',
        height: '100vh',
        backgroundColor: 'white',
        boxShadow: '0 0 10px rgba(0,0,0,0.2)',
        padding: '16px',
        overflow: 'auto',
        zIndex: 10
      }}
    >
      <h2 style={{ marginBottom: '16px' }}>Конструктор лифта</h2>
      
      <div style={{ display: 'flex', borderBottom: '1px solid #e2e8f0', marginBottom: '16px' }}>
        <button 
          style={{
            padding: '8px 16px',
            backgroundColor: activeTab === 'frame' ? '#e2e8f0' : 'transparent',
            border: 'none',
            cursor: 'pointer'
          }}
          onClick={() => setActiveTab('frame')}
        >
          Каркас
        </button>
        <button 
          style={{
            padding: '8px 16px',
            backgroundColor: activeTab === 'materials' ? '#e2e8f0' : 'transparent',
            border: 'none',
            cursor: 'pointer'
          }}
          onClick={() => setActiveTab('materials')}
        >
          Отделка
        </button>
        <button 
          style={{
            padding: '8px 16px',
            backgroundColor: activeTab === 'elements' ? '#e2e8f0' : 'transparent',
            border: 'none',
            cursor: 'pointer'
          }}
          onClick={() => setActiveTab('elements')}
        >
          Элементы
        </button>
      </div>
      
      <div>
        {activeTab === 'frame' && (
          <div>
            <p>Управление каркасом лифта</p>
            {/* Здесь будут элементы управления каркасом */}
          </div>
        )}
        
        {activeTab === 'materials' && (
          <div>
            <p>Управление отделкой лифта</p>
            {/* Здесь будут элементы управления отделкой */}
          </div>
        )}
        
        {activeTab === 'elements' && (
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
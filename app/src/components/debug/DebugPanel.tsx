import { useState } from 'react';

/**
 * Компонент панели управления отладочными функциями
 */
const DebugPanel: React.FC<{
  onToggleFps: (show: boolean) => void;
  onToggleWireframe: (show: boolean) => void;
  onToggleAxes: (show: boolean) => void;
  onToggleGizmo: (show: boolean) => void;
}> = ({ 
  onToggleFps, 
  onToggleWireframe, 
  onToggleAxes,
  onToggleGizmo
}) => {
  const [expanded, setExpanded] = useState(false);
  const [settings, setSettings] = useState({
    fps: true,
    wireframe: false,
    axes: false,
    gizmo: true
  });
  
  const toggleExpand = () => setExpanded(!expanded);
  
  const toggleSetting = (setting: 'fps' | 'wireframe' | 'axes' | 'gizmo') => {
    const newValue = !settings[setting];
    setSettings({ ...settings, [setting]: newValue });
    
    // Вызываем соответствующий callback
    switch (setting) {
      case 'fps':
        onToggleFps(newValue);
        break;
      case 'wireframe':
        onToggleWireframe(newValue);
        break;
      case 'axes':
        onToggleAxes(newValue);
        break;
      case 'gizmo':
        onToggleGizmo(newValue);
        break;
    }
  };
  
  return (
    <div
      style={{
        position: 'absolute',
        bottom: '10px',
        left: '10px',
        backgroundColor: '#00000099',
        color: 'white',
        padding: '10px',
        borderRadius: '5px',
        zIndex: 1000,
        fontFamily: 'monospace',
        fontSize: '12px',
        width: expanded ? '250px' : 'auto',
      }}
    >
      <div 
        style={{ 
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
        onClick={toggleExpand}
      >
        <span>{expanded ? 'Скрыть панель отладки' : 'Панель отладки'}</span>
        <span>{expanded ? '▲' : '▼'}</span>
      </div>
      
      {expanded && (
        <div style={{ marginTop: '10px' }}>
          <div style={{ marginBottom: '5px' }}>
            <label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
              <input
                type="checkbox"
                checked={settings.fps}
                onChange={() => toggleSetting('fps')}
                style={{ marginRight: '5px' }}
              />
              Счетчик FPS
            </label>
          </div>
          
          <div style={{ marginBottom: '5px' }}>
            <label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
              <input
                type="checkbox"
                checked={settings.wireframe}
                onChange={() => toggleSetting('wireframe')}
                style={{ marginRight: '5px' }}
              />
              Каркасный режим (Wireframe)
            </label>
          </div>
          
          <div style={{ marginBottom: '5px' }}>
            <label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
              <input
                type="checkbox"
                checked={settings.axes}
                onChange={() => toggleSetting('axes')}
                style={{ marginRight: '5px' }}
              />
              Оси координат
            </label>
          </div>
          
          <div style={{ marginBottom: '5px' }}>
            <label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
              <input
                type="checkbox"
                checked={settings.gizmo}
                onChange={() => toggleSetting('gizmo')}
                style={{ marginRight: '5px' }}
              />
              3D-указатель
            </label>
          </div>
        </div>
      )}
    </div>
  );
};

export default DebugPanel; 
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setDecorationStripes, setJoints } from '../../store/elevatorSlice';
import type { RootState } from '../../store/store';

/**
 * Компонент панели управления отладочными функциями и оптимизацией
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
  const dispatch = useDispatch();
  const decorationStripes = useSelector((state: RootState) => state.elevator.decorationStripes);
  const joints = useSelector((state: RootState) => state.elevator.joints);
  
  const [expanded, setExpanded] = useState(false);
  const [settings, setSettings] = useState({
    fps: true,
    wireframe: false,
    axes: false,
    gizmo: true,
    highQuality: true // Высокое качество по умолчанию
  });
  
  const toggleExpand = () => setExpanded(!expanded);
  
  const toggleSetting = (setting: 'fps' | 'wireframe' | 'axes' | 'gizmo' | 'highQuality') => {
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
      case 'highQuality': {
        // Устанавливаем фактор качества 1.0 для высокого качества, 0.3 для низкого
        const qualityFactor = newValue ? 1.0 : 0.3;
        
        // Обновляем фактор качества для декоративных полос
        if (decorationStripes) {
          dispatch(setDecorationStripes({ qualityFactor }));
        }
        
        // Обновляем фактор качества для стыков
        if (joints) {
          dispatch(setJoints({ qualityFactor }));
        }
        break;
      }
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
          <div style={{ marginBottom: '10px', borderBottom: '1px solid #666', paddingBottom: '5px' }}>
            <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>Отладка</div>
            
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
          
          <div>
            <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>Оптимизация</div>
            
            <div style={{ marginBottom: '5px' }}>
              <label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                <input
                  type="checkbox"
                  checked={settings.highQuality}
                  onChange={() => toggleSetting('highQuality')}
                  style={{ marginRight: '5px' }}
                />
                Высокое качество
              </label>
              <div style={{ fontSize: '10px', marginLeft: '20px', color: '#aaa' }}>
                {settings.highQuality 
                  ? "Отображаются все детали (может снизить FPS)" 
                  : "Упрощенный режим для увеличения FPS"}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DebugPanel; 
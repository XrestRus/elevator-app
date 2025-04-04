import { useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setDecorationStripes, setJoints } from '../../store/elevatorSlice';
import type { RootState } from '../../store/store';
import { SceneImporter } from '../../utils/sceneImporter';
import * as THREE from 'three';

/**
 * Компонент панели управления отладочными функциями и оптимизацией
 */
const DebugPanel: React.FC<{
  onToggleFps: (show: boolean) => void;
  onToggleWireframe: (show: boolean) => void;
  onToggleAxes: (show: boolean) => void;
  onToggleGizmo: (show: boolean) => void;
  onImportScene?: (scene: THREE.Scene) => void;
  currentScene?: THREE.Scene | null;
}> = ({ 
  onToggleFps, 
  onToggleWireframe, 
  onToggleAxes,
  onToggleGizmo,
  onImportScene,
  currentScene
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
  
  // Ref для скрытого input file
  const fileInputRef = useRef<HTMLInputElement>(null);
  
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
  
  // Обработчик клика на кнопку импорта сцены
  const handleImportClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  // Обработчик клика на кнопку экспорта сцены
  const handleExportClick = () => {
    if (!currentScene) {
      alert('Не удалось экспортировать сцену - сцена не доступна');
      return;
    }
    
    try {
      // Сохраняем сцену в файл
      SceneImporter.saveSceneToFile(currentScene, 'elevator-scene');
    } catch (error: unknown) {
      console.error('Ошибка при экспорте сцены:', error);
      const errorMessage = error instanceof Error ? error.message : 'Неизвестная ошибка';
      alert(`Ошибка при экспорте сцены: ${errorMessage}`);
    }
  };
  
  // Обработчик изменения файла
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    try {
      // Читаем файл как текст
      const text = await file.text();
      
      // Проверяем формат
      if (!SceneImporter.isValidSceneFormat(text)) {
        alert('Неверный формат файла. Загрузите файл сцены Three.js JSON.');
        return;
      }
      
      // Импортируем сцену
      const scene = await SceneImporter.importScene(text);
      
      // Вызываем callback с импортированной сценой
      if (onImportScene) {
        onImportScene(scene);
      }
    } catch (error: unknown) {
      console.error('Ошибка при импорте сцены:', error);
      const errorMessage = error instanceof Error ? error.message : 'Неизвестная ошибка';
      alert(`Ошибка при импорте сцены: ${errorMessage}`);
    } finally {
      // Сбрасываем input file для возможности повторной загрузки того же файла
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
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
          
          <div style={{ marginBottom: '10px', borderBottom: '1px solid #666', paddingBottom: '5px' }}>
            <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>Импорт/Экспорт</div>
            
            <div style={{ marginBottom: '5px' }}>
              <button
                onClick={handleImportClick}
                style={{
                  width: '100%',
                  padding: '5px',
                  backgroundColor: '#2a2a2a',
                  color: 'white',
                  border: '1px solid #444',
                  borderRadius: '3px',
                  cursor: 'pointer',
                  fontSize: '12px',
                  marginBottom: '5px'
                }}
              >
                Импортировать сцену
              </button>
              <input
                ref={fileInputRef}
                type="file"
                style={{ display: 'none' }}
                accept=".json"
                onChange={handleFileChange}
              />
              
              <button
                onClick={handleExportClick}
                style={{
                  width: '100%',
                  padding: '5px',
                  backgroundColor: '#2a2a2a',
                  color: 'white',
                  border: '1px solid #444',
                  borderRadius: '3px',
                  cursor: 'pointer',
                  fontSize: '12px'
                }}
                disabled={!currentScene}
              >
                Экспортировать сцену
              </button>
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
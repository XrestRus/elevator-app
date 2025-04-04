import * as THREE from 'three';
import { ObjectLoader } from 'three';

/**
 * Утилита для импорта и экспорта 3D сцены
 */
export class SceneImporter {
  /**
   * Импортирует сцену из JSON строки или объекта
   * @param jsonData JSON строка или объект с данными сцены
   * @returns Promise с загруженной сценой
   */
  static importScene(jsonData: string | object): Promise<THREE.Scene> {
    return new Promise((resolve, reject) => {
      try {
        const loader = new ObjectLoader();
        
        // Если передана строка, преобразуем её в объект
        const data = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;
        
        // Загружаем сцену
        loader.parse(data, (object) => {
          if (object.type === 'Scene') {
            resolve(object as THREE.Scene);
          } else {
            // Если загружен не сцена, а другой объект, создаем новую сцену и добавляем в неё объект
            const scene = new THREE.Scene();
            scene.add(object);
            resolve(scene);
          }
        });
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Неизвестная ошибка';
        reject(new Error(`Ошибка при импорте сцены: ${errorMessage}`));
      }
    });
  }

  /**
   * Экспортирует сцену в формат JSON
   * @param scene Сцена для экспорта
   * @returns JSON объект с данными сцены
   */
  static exportScene(scene: THREE.Scene): string {
    // Создаем JSON объект из сцены
    const sceneJson = scene.toJSON();
    
    // Возвращаем в виде строки
    return JSON.stringify(sceneJson, null, 2);
  }
  
  /**
   * Сохраняет сцену в файл JSON
   * @param scene Сцена для сохранения
   * @param filename Имя файла (без расширения)
   */
  static saveSceneToFile(scene: THREE.Scene, filename: string = 'scene'): void {
    // Получаем JSON данные
    const jsonData = this.exportScene(scene);
    
    // Создаем объект Blob с данными
    const blob = new Blob([jsonData], { type: 'application/json' });
    
    // Создаем URL для загрузки
    const url = URL.createObjectURL(blob);
    
    // Создаем ссылку для загрузки файла
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}.json`;
    
    // Добавляем ссылку в DOM, активируем и удаляем
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Освобождаем URL
    URL.revokeObjectURL(url);
  }

  /**
   * Проверяет, является ли строка или объект валидным JSON форматом сцены Three.js
   * @param jsonData JSON строка или объект для проверки
   * @returns Результат проверки
   */
  static isValidSceneFormat(jsonData: string | object): boolean {
    try {
      const data = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;
      
      // Проверяем наличие необходимых полей в JSON
      if (!data.metadata || !data.object) {
        return false;
      }
      
      // Проверяем версию
      if (!data.metadata.version || !data.metadata.type) {
        return false;
      }
      
      return true;
    } catch {
      return false;
    }
  }
} 
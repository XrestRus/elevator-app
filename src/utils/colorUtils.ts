import * as THREE from 'three';

/**
 * Утилиты для работы с цветами в приложении
 */
export const colorUtils = {
  /**
   * Преобразует цвет (THREE.Color или строку) в строку формата RGB
   * @param color Цвет для преобразования
   * @returns Строковое представление цвета в формате RGB(r, g, b)
   */
  colorToRGBString(color: THREE.Color | string): string {
    const colorObj = color instanceof THREE.Color ? color : new THREE.Color(color);
    const r = Math.round(colorObj.r * 255);
    const g = Math.round(colorObj.g * 255);
    const b = Math.round(colorObj.b * 255);
    return `RGB(${r}, ${g}, ${b})`;
  },

  /**
   * Создает немного затемненную версию указанного цвета
   * @param color Исходный цвет
   * @param factor Коэффициент затемнения (0.9 = 90% исходной яркости)
   * @returns Затемненный цвет
   */
  darkenColor(color: THREE.Color | string, factor: number = 0.9): THREE.Color {
    const colorObj = color instanceof THREE.Color ? color.clone() : new THREE.Color(color);
    colorObj.multiplyScalar(factor);
    return colorObj;
  },

  /**
   * Создает немного осветленную версию указанного цвета
   * @param color Исходный цвет
   * @param factor Коэффициент осветления (1.1 = 110% исходной яркости)
   * @returns Осветленный цвет
   */
  lightenColor(color: THREE.Color | string, factor: number = 1.1): THREE.Color {
    const colorObj = color instanceof THREE.Color ? color.clone() : new THREE.Color(color);
    colorObj.multiplyScalar(factor);
    return colorObj;
  },

  /**
   * Проверяет, содержит ли объект материал с цветом, и возвращает его в формате RGB
   * @param material Материал для проверки
   * @returns Строка с цветом в формате RGB или "Неизвестно"
   */
  getMaterialColor(material: THREE.Material | undefined): string {
    if (!material) return "Неизвестно";
    
    if (material instanceof THREE.MeshStandardMaterial ||
        material instanceof THREE.MeshPhongMaterial ||
        material instanceof THREE.MeshLambertMaterial ||
        material instanceof THREE.MeshBasicMaterial) {
      return this.colorToRGBString(material.color);
    }
    
    return "Неизвестно";
  },

  /**
   * Возвращает цвет материала как объект с компонентами RGB
   * @param material Материал для получения цвета
   * @returns Объект с компонентами r, g, b или дефолтный цвет если материал не определен
   */
  getMaterialColorAsRgb(material: THREE.Material | undefined): { r: number, g: number, b: number } {
    if (!material) return { r: 0.5, g: 0.5, b: 0.5 }; // Дефолтный серый, если материал не задан
    
    if (material instanceof THREE.MeshStandardMaterial ||
        material instanceof THREE.MeshPhongMaterial ||
        material instanceof THREE.MeshLambertMaterial ||
        material instanceof THREE.MeshBasicMaterial) {
      return { 
        r: material.color.r, 
        g: material.color.g, 
        b: material.color.b 
      };
    }
    
    return { r: 0.5, g: 0.5, b: 0.5 }; // Дефолтный серый для других типов материалов
  }
};

export default colorUtils; 
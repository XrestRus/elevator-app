import * as THREE from "three";

/**
 * Создает текстуру с числом для кнопки лифта
 * @param text Текст для отображения на кнопке
 * @returns Текстура с числом для кнопки лифта
 */
export function createNumberTexture(text: string): THREE.Texture {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const context = canvas.getContext('2d');
    if (!context) return new THREE.Texture();
    
    // Используем белый текст для лучшего контраста
    context.fillStyle = '#FFFFFF';
    context.font = 'bold 40px Arial';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(text, 32, 32);
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }
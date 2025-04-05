# Проекта
## Описание

**Краткое описание проекта:**  
Веб-конструктор лифта — это 3D-редактор, позволяющий проектировать и визуализировать кабину лифта в режиме реального времени. Пользователь может:  
- Настраивать **внутреннюю отделку** (стены, пол, потолок, зеркала).  
- Выбирать материалы, цвета и текстуры.  
- Добавлять реалистичные элементы: двери с анимацией, кнопочные панели, освещение.  
- Вращать камеру, приближать детали и видеть изменения мгновенно.  

**Для кого:**  
- Архитекторы, дизайнеры интерьеров.  
- Производители лифтов (демонстрация клиентам).  
- Любители DIY-проектирования.  

**Фишки:**  
- Реализм: физические материалы, тени, анимация дверей.  
- Интуитивный интерфейс без навыков 3D-моделирования.  
- Расчет стоимости на основе выбранных опций.  

Прототип создается на Three.js и React, что обеспечивает кросс-платформенность и высокую производительность.

---

### **Этап 0: Настройка среды**
1. **Инициализация проекта**:
   ```bash
   npx create-react-app elevator-constructor
   cd elevator-constructor
   npm install three @react-three/fiber @react-three/drei drei
   ```
2. **Структура файлов**:
   - `src/components/Scene.js` – 3D-сцена.
   - `src/components/ControlsPanel.js` – панель управления отделкой.

---

### **Этап 1: Каркас лифта (Primitives)**
#### **1.1. Базовая геометрия (Three.js-примитивы)**
- **Стены**: 3 `Box` (задняя, боковые) с материалом `MeshStandardMaterial`.
- **Пол/потолок**: `Plane` с масштабированием под размер кабины.
- **Двери**: 2 `Box` (раздвижные створки), анимированные через `useFrame`.

**Код примера**:
```javascript
// Scene.js
import { useFrame } from '@react-three/fiber';

function Elevator() {
  const leftDoor = useRef();
  const rightDoor = useRef();

  // Анимация открытия дверей
  useFrame(({ clock }) => {
    const t = Math.sin(clock.getElapsedTime()) * 0.5;
    leftDoor.current.position.x = -0.6 + t;
    rightDoor.current.position.x = 0.6 - t;
  });

  return (
    <>
      {/* Стены */}
      <Box args={[1.2, 2.2, 0.1]} position={[0, 1.1, -0.6]}>
        <meshStandardMaterial color="#808080" />
      </Box>
      
      {/* Двери */}
      <Box args={[0.5, 2.2, 0.1]} ref={leftDoor} position={[-0.6, 1.1, 0]}>
        <meshStandardMaterial color="#30475E" metalness={0.7} />
      </Box>
      <Box args={[0.5, 2.2, 0.1]} ref={rightDoor} position={[0.6, 1.1, 0]}>
        <meshStandardMaterial color="#30475E" metalness={0.7} />
      </Box>
    </>
  );
}
```

---

### **Этап 2: Внутренняя отделка (динамические материалы)**
#### **2.1. Система выбора материалов**
- **Стены**: Переключение между материалами (металл, дерево, плитка) через `useLoader(TextureLoader)`.
- **Пол**: Варианты узоров (плитка, ковер) через UV-масштабирование.
- **Цвета**: Интеграция RGB-пикера (`react-colorful`).

**Пример динамической текстуры**:
```javascript
const [wallTexture, setWallTexture] = useState("metal");
const texture = useLoader(TextureLoader, `./textures/${wallTexture}.jpg`);

// В рендере:
<Box>
  <meshStandardMaterial map={texture} />
</Box>
```

#### **2.2. Зеркала**
- Создание плоскости с `metalness: 0.9`, `roughness: 0.05`:
  ```javascript
  <Plane args={[1, 2]} position={[0, 1.1, 0.59]}>
    <meshStandardMaterial 
      metalness={0.9}
      roughness={0.05}
      envMap={envMapTexture} // HDR окружение
    />
  </Plane>
  ```

---

### **Этап 3: Детализация (без моделей)**
#### **3.1. Кнопочная панель**
- **Кнопки**: Массив `Sphere` или `Circle` (2D) с анимацией нажатия:
  ```javascript
  const buttons = [1, 2, 3, 4, 5];
  buttons.map((num, i) => (
    <mesh 
      key={i}
      position={[0.4, 0.5 + i*0.2, 0.55]}
      onClick={() => playButtonSound()}
    >
      <sphereGeometry args={[0.05]} />
      <meshStandardMaterial color="red" />
    </mesh>
  ));
  ```

#### **3.2. Освещение**
- **Точечные светильники**: `Sphere` с эмиссионным материалом:
  ```javascript
  <mesh position={[0, 2, 0]}>
    <sphereGeometry args={[0.1]} />
    <meshStandardMaterial 
      color="white"
      emissive="#fff"
      emissiveIntensity={2} 
    />
  </mesh>
  ```

---

### **Этап 4: Интерактивность**
#### **4.1. Управление камерой**
- `OrbitControls` с ограничениями (чтобы не вылетать за пределы кабины):
  ```javascript
  <OrbitControls 
    maxDistance={5}
    minDistance={1}
    enablePan={false}
  />
  ```

#### **4.2. Взаимодействие с элементами**
- Клик по стене → открытие панели выбора материала.
- Ховер над кнопками → подсветка (через `onPointerOver`).

---

### **Этап 5: Оптимизация**
1. **Тени**: Включение для DirectionalLight:
   ```javascript
   <directionalLight 
     castShadow
     shadow-mapSize={[1024, 1024]}
   />
   ```
2. **Группировка мешей**: Объединение статичных элементов в `Group`.

---

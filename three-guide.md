# Руководство по использованию Three.js в проекте конструктора лифта

## Основные концепции

### Scene (Сцена)
- **Что это**: Контейнер для всех 3D объектов, света и камер.
- **Как используется**: Все элементы лифта (стены, пол, потолок) добавляются в сцену.
- **Настройка**: Через `useThree()` в React Three Fiber или при создании компонентов.

### Camera (Камера)
- **Что это**: Определяет точку зрения пользователя.
- **Как используется**: В проекте - PerspectiveCamera, расположенная в центре лифта.
- **Настройка**: Параметры FOV, aspect ratio, near/far; управление через OrbitControls.

### Meshes (Меши)
- **Что это**: 3D объекты, состоящие из геометрии и материала.
- **Применение**: Стены, пол, потолок, двери лифта.
- **Настройка**: 
  - Геометрии: BoxGeometry для стен, плоскости для зеркал
  - Материалы: MeshStandardMaterial с настраиваемыми текстурами и цветами

### Lights (Свет)
- **Что это**: Источники освещения сцены.
- **Типы в проекте**: 
  - PointLight: точечные светильники в потолке
  - AmbientLight: фоновое освещение
- **Настройка**: Интенсивность, цвет, позиция, тени

### Textures (Текстуры)
- **Что это**: Изображения, накладываемые на материалы.
- **Как используются**: Для отделки стен, пола, зеркал.
- **Настройка**: Загрузка через TextureLoader, управление repeat, offset, wrap.

### Анимации
- **Двери**: Использование useFrame для плавного открытия/закрытия
- **Интерактивные элементы**: События onClick для кнопок

## Важные хуки и утилиты React Three Fiber

### useThree()
- Доступ к объектам Three.js (camera, scene, renderer)
- Получение размеров viewport

### useFrame()
- Выполнение кода в цикле рендеринга
- Используется для анимаций и обновлений

### useLoader()
- Асинхронная загрузка текстур и моделей

## Оптимизация

### Управление рендерингом
- frameloop="demand" для рендера только при изменениях
- Группировка мешей для уменьшения draw calls

### Текстуры и материалы
- Правильное разрешение текстур
- Переиспользование материалов

### Модели
- Оптимизация полигонов
- Инстансинг для повторяющихся элементов

## Оптимизация производительности

### Настройки рендерера

```jsx
// Оптимизация настроек WebGLRenderer
const renderer = new THREE.WebGLRenderer({
  powerPreference: "high-performance", // Предпочтение высокой производительности GPU
  antialias: true,                    // При false - выше производительность
  precision: "mediump",               // "highp", "mediump" или "lowp" - компромисс между качеством и скоростью
  stencil: false,                     // Отключаем, если не нужен буфер трафарета
  depth: true,                        // Отключить только если не нужна сортировка по глубине
  logarithmicDepthBuffer: false       // Включать только при сценах с большим диапазоном глубины
});

// Ограничение пиксельной плотности для высокоплотных дисплеев
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));

// Оптимизация теней
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.shadowMap.autoUpdate = false; // Обновлять тени только вручную
```

### Оптимизация геометрии

```jsx
// Объединение геометрий
const geometries = [];
objects.forEach(obj => {
  const tempGeo = new THREE.BoxGeometry(1, 1, 1);
  tempGeo.translate(obj.position.x, obj.position.y, obj.position.z);
  geometries.push(tempGeo);
});
const mergedGeometry = BufferGeometryUtils.mergeBufferGeometries(geometries);
const mergedMesh = new THREE.Mesh(mergedGeometry, material);

// Для статичных объектов - "заморозка" буферов
geometry.attributes.position.needsUpdate = false;
```

### Оптимизация текстур

```jsx
// Управление размером текстур
const texture = new THREE.TextureLoader().load('texture.jpg');
texture.minFilter = THREE.LinearFilter; // вместо MipmapLinearFilter
texture.generateMipmaps = false; // отключение mipmap для памяти

// Переиспользование текстур
const sharedTexture = textureLoader.load('texture.jpg');
const material1 = new THREE.MeshStandardMaterial({ map: sharedTexture });
const material2 = new THREE.MeshStandardMaterial({ map: sharedTexture });
```

### Управление памятью

```jsx
// Удаление неиспользуемых ресурсов
mesh.geometry.dispose();
mesh.material.dispose();
texture.dispose();

// Отслеживание потери контекста WebGL
renderer.domElement.addEventListener('webglcontextlost', function(event) {
  event.preventDefault();
  console.error('WebGL context lost');
  // Логика восстановления
}, false);
```

### Оптимизация рендеринга

```jsx
// Использование frustum culling (отсечение невидимых объектов)
const frustum = new THREE.Frustum();
const camera = new THREE.PerspectiveCamera();
frustum.setFromProjectionMatrix(camera.projectionMatrix);
if (frustum.intersectsObject(mesh)) {
  // Рендерим объект, только если он в зоне видимости
}

// Уменьшение частоты обновления для фоновых вкладок
let isTabActive = true;
window.addEventListener('blur', () => { isTabActive = false; });
window.addEventListener('focus', () => { isTabActive = true; });

function animate() {
  requestAnimationFrame(animate);
  // Обновляем сцену с разной частотой
  if (isTabActive) {
    renderer.render(scene, camera);
  } else {
    // Рендерим с более низкой частотой или останавливаем
  }
}
```

### Использование аппаратного ускорения

```jsx
// Включение WebGPU (для современных браузеров)
// Для React Three Fiber:
<Canvas gl={{ powerPreference: 'high-performance' }}>

// Использование instancing для повторяющихся объектов
const instancedMesh = new THREE.InstancedMesh(
  geometry, material, 1000 // количество экземпляров
);
// Устанавливаем положение и поворот для каждого экземпляра
const matrix = new THREE.Matrix4();
for (let i = 0; i < 1000; i++) {
  matrix.setPosition(positions[i]);
  instancedMesh.setMatrixAt(i, matrix);
}
```

### Отложенная загрузка и LOD (Level Of Detail)

```jsx
// Уровни детализации для разных расстояний
const lod = new THREE.LOD();
lod.addLevel(highDetailMesh, 0);    // Высокая детализация вблизи
lod.addLevel(mediumDetailMesh, 50); // Средняя детализация на среднем расстоянии
lod.addLevel(lowDetailMesh, 200);   // Низкая детализация вдали
scene.add(lod);

// Асинхронная загрузка моделей
const loadModel = async () => {
  const gltfLoader = new GLTFLoader();
  return new Promise((resolve) => {
    gltfLoader.load('model.glb', (gltf) => {
      resolve(gltf.scene);
    });
  });
};
```

### Мониторинг производительности

```jsx
// Добавление Stats.js для мониторинга FPS
import Stats from 'three/examples/jsm/libs/stats.module';
const stats = new Stats();
document.body.appendChild(stats.dom);

// В цикле анимации
function animate() {
  stats.begin();
  // Рендеринг
  stats.end();
  requestAnimationFrame(animate);
}
```

### Оптимизация для мобильных устройств

```jsx
// Определение возможностей устройства
const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
const isLowPerformance = !(/iPad/i.test(navigator.userAgent) || window.navigator.hardwareConcurrency > 4);

// Настройка качества на основе устройства
if (isMobile && isLowPerformance) {
  renderer.setPixelRatio(1);
  renderer.shadowMap.enabled = false;
  // Уменьшение размера сцены, текстур, сложности геометрии
}
```

## Интеграция с React-компонентами

### Состояние и пропсы
- Управление внешним видом через React-state
- Передача настроек через props

### Контролы
- Панель управления для изменения параметров лифта
- Колор-пикер для выбора цветов элементов

## Советы по работе с проектом

- Используйте инструменты отладки (FPS монитор, wireframe-режим)
- Тестируйте производительность на разных устройствах
- При добавлении новых элементов следите за оптимизацией 

## Распространенные проблемы и их решения

### Проблемы с тенями
- **Артефакты и "холмы"**: Часто возникают из-за неправильных настроек shadow map
- **Решение**: 
  - Увеличьте разрешение карты теней (shadowMap.size)
  - Настройте bias параметр для предотвращения self-shadowing
  - Используйте PCFSoftShadowMap вместо BasicShadowMap
  ```jsx
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  light.shadow.bias = -0.001;
  light.shadow.normalBias = 0.05;
  light.shadow.mapSize.width = 2048;
  light.shadow.mapSize.height = 2048;
  ```
  - Используйте более мягкие настройки для SpotLight
  ```jsx
  <spotLight
    penumbra={0.8}
    shadow-bias={-0.001}
    shadow-normalBias={0.05}
    shadow-focus={0.7}
    shadow-radius={8}
  />
  ```
  - Применяйте повторное обновление карт теней после полной загрузки сцены
  ```jsx
  const secondUpdateId = setTimeout(() => {
    gl.shadowMap.needsUpdate = true;
  }, 2000);
  ```

### Проблемы с отражениями
- **Темные или искаженные отражения**: Появляются на зеркальных/металлических поверхностях
- **Решение**:
  - Настройте параметры roughness и metalness для материалов
  - Используйте environment maps для реалистичных отражений
  - Для зеркал используйте MeshReflectorMaterial из @react-three/drei с правильными настройками
  ```jsx
  const mirrorMaterialProps = {
    blur: [300, 100],
    resolution: 2048,
    mixBlur: 0.3,
    mixStrength: 0.8,
    depthScale: 0.4,
    metalness: 0.4,
    roughness: 0.1,
    mirror: 0.8,
    distortion: 0.1,
    reflectorOffset: 0.01
  };
  ```
  - Добавляйте небольшое смещение по Z-оси (zOffset) для избегания Z-fighting в отражениях
  ```jsx
  const zOffset = 0.001;
  position={[x, y, z + zOffset]}
  ```

### Улучшение качества отражений и теней
- **Проблема**: Недостаточная реалистичность теней и отражений
- **Решение**:
  - Используйте SoftShadowEnhancer для создания мягкого окружающего освещения
  ```jsx
  // Создаем градиентное окружение для более мягких теней
  const size = 512;
  const dataTexture = new THREE.DataTexture(cubeData, size, size, THREE.RGBFormat);
  dataTexture.flipY = true;
  dataTexture.minFilter = THREE.LinearFilter;
  dataTexture.magFilter = THREE.LinearFilter; 
  dataTexture.generateMipmaps = true;
  scene.environment = dataTexture;
  ```
  - Подгоняйте качество в зависимости от производительности устройства
  - Используйте повторяющиеся обновления теней для их стабильности

### Артефакты рендеринга
- **Z-fighting**: Когда две поверхности перекрываются на одной плоскости
- **Решение**: Небольшой отступ между перекрывающимися поверхностями (0.001 единиц)
- **Поправка camera near/far**: Настройте near не слишком близко к 0, а far не слишком большим
  ```jsx
  camera.near = 0.1; // Не 0.001
  camera.far = 1000; // Не 10000
  ``` 
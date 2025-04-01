/**
 * Конфигуратор лифтовых кабин в 3D
 * Позволяет настраивать текстуры пола, стен и потолка
 */
class ElevatorConfigurator {
    constructor() {
        // Инициализация основных переменных
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
        this.elevator = null;
        
        // Текущие текстуры
        this.currentTextures = {
            walls: null,
            floor: null,
            ceiling: null
        };
        
        // Элементы лифта
        this.elevatorParts = {
            walls: null,
            floor: null,
            ceiling: null,
            mirror: null,
            handrail: null,
            floorPanel: null,
            doorLeft: null,
            doorRight: null
        };
        
        // Предзагруженные текстуры
        this.textures = {
            walls: [],
            floor: [],
            ceiling: []
        };
        
        // Размеры лифта (в метрах)
        this.elevatorDimensions = {
            width: 2.0,
            depth: 2.0,
            height: 2.4
        };
        
        // Флаг для отслеживания ошибок загрузки текстур
        this.textureLoadErrors = false;
        
        // Флаги для отображения дополнительных элементов
        this.showMirror = false;
        this.showHandrail = false;
        
        // Текущий выбранный этаж
        this.currentFloor = 1;
        this.totalFloors = 20;
        
        // Убираем автоматическое вращение
        // this.autoRotate = false;
        // this.autoRotateSpeed = 0.005; // скорость вращения
        
        this.init();
    }
    
    /**
     * Инициализация конфигуратора
     */
    init() {
        // Инициализация Three.js
        this.initThreeJs();
        
        // Создание модели лифта
        this.createElevator();
        
        // Загрузка и подготовка текстур
        this.loadTextures();
        
        // Обработчики событий
        this.setupEventListeners();
        
        // Запуск рендеринга
        this.animate();
    }
    
    /**
     * Инициализация Three.js компонентов
     */
    initThreeJs() {
        // Получение контейнера для рендеринга
        this.container = document.getElementById('elevator-viewer');
        
        // Проверка наличия контейнера
        if (!this.container) {
            console.error('Элемент #elevator-viewer не найден в DOM!');
            return;
        }
        
        // Создание сцены
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0xf0f0f0);
        
        // Настройка камеры с увеличенным углом обзора
        this.camera = new THREE.PerspectiveCamera(
            90, // Увеличиваем угол обзора до 90 градусов для лучшего вида изнутри
            this.container.clientWidth / this.container.clientHeight, 
            0.1, 
            100
        );
        
        // Фиксируем камеру строго по центру лифта
        const { width, depth, height } = this.elevatorDimensions;
        this.camera.position.set(0, height/2, 0);
        this.camera.lookAt(0, height/2, -depth/3);
        
        // Настройка рендерера
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.renderer.shadowMap.enabled = true;
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.container.appendChild(this.renderer.domElement);
        
        // Создаем базовую карту окружения для отражений
        this.createEnvironmentMap();
        
        // Настраиваем фиксированную камеру вместо OrbitControls
        // Камера будет только вращаться на месте, но не двигаться
        this.setupFixedCamera();
        
        // Добавление освещения
        this.addLights();
        
        // Обработка изменения размера окна
        window.addEventListener('resize', () => this.onWindowResize());
    }
    
    /**
     * Настройка фиксированной камеры с возможностью только поворота
     */
    setupFixedCamera() {
        // Создаем элементы управления для камеры
        const { height } = this.elevatorDimensions;
        
        // Угол вращения камеры по горизонтали
        this.cameraRotation = {
            horizontal: 0,  // начальное значение - смотрим вперед
            vertical: 0     // начальное значение - смотрим прямо
        };
        
        // Увеличиваем ограничения для вертикального вращения, чтобы можно было смотреть вверх и вниз
        this.rotationLimits = {
            verticalMin: -Math.PI/2,    // 90 градусов вниз
            verticalMax: Math.PI/2      // 90 градусов вверх
        };
        
        // Фиксируем положение камеры точно по центру лифта
        this.camera.position.set(0, height/2, 0);
        
        // Добавляем обработчики событий для вращения камеры с помощью мыши
        this.container.addEventListener('mousedown', this.onMouseDown.bind(this));
        document.addEventListener('mouseup', this.onMouseUp.bind(this));
        document.addEventListener('mousemove', this.onMouseMove.bind(this));
        
        // Флаг для отслеживания нажатия кнопки мыши
        this.isMouseDown = false;
        this.lastMousePosition = { x: 0, y: 0 };
        
        // Начальная ориентация камеры
        this.updateCameraRotation();
    }
    
    /**
     * Обработчик нажатия кнопки мыши
     */
    onMouseDown(event) {
        this.isMouseDown = true;
        this.lastMousePosition = { x: event.clientX, y: event.clientY };
    }
    
    /**
     * Обработчик отпускания кнопки мыши
     */
    onMouseUp() {
        this.isMouseDown = false;
    }
    
    /**
     * Обработчик движения мыши
     */
    onMouseMove(event) {
        if (!this.isMouseDown) return;
        
        // Вычисляем изменение положения мыши
        const deltaX = event.clientX - this.lastMousePosition.x;
        const deltaY = event.clientY - this.lastMousePosition.y;
        
        // Обновляем положение мыши
        this.lastMousePosition = { x: event.clientX, y: event.clientY };
        
        // Вычисляем новый угол вращения камеры (уменьшаем чувствительность)
        this.cameraRotation.horizontal -= deltaX * 0.01;
        this.cameraRotation.vertical -= deltaY * 0.01;
        
        // Ограничиваем только вертикальные углы вращения
        this.cameraRotation.vertical = Math.max(
            this.rotationLimits.verticalMin,
            Math.min(this.rotationLimits.verticalMax, this.cameraRotation.vertical)
        );
        
        // Для горизонтального вращения: обеспечиваем непрерывность при повороте на 360°
        // Нормализуем угол в диапазоне [0, 2π]
        this.cameraRotation.horizontal = this.cameraRotation.horizontal % (Math.PI * 2);
        if (this.cameraRotation.horizontal < 0) {
            this.cameraRotation.horizontal += Math.PI * 2;
        }
        
        // Обновляем ориентацию камеры
        this.updateCameraRotation();
    }
    
    /**
     * Обновление ориентации камеры
     */
    updateCameraRotation() {
        // Вычисляем направление взгляда камеры
        const { depth } = this.elevatorDimensions;
        
        // Расстояние до точки, на которую смотрит камера
        const lookDistance = depth / 2;
        
        // Вычисляем координаты точки, на которую смотрит камера
        const lookAtX = Math.sin(this.cameraRotation.horizontal) * lookDistance;
        const lookAtY = Math.sin(this.cameraRotation.vertical) * lookDistance;
        const lookAtZ = -Math.cos(this.cameraRotation.horizontal) * lookDistance;
        
        // Устанавливаем направление взгляда камеры
        this.camera.lookAt(lookAtX, this.camera.position.y + lookAtY, lookAtZ);
    }
    
    /**
     * Создание карты окружения для отражений
     */
    createEnvironmentMap() {
        try {
            // Создаем базовую светлую текстуру для отражений
            const width = 512;
            const height = 512;
            const size = width * height;
            const data = new Uint8Array(4 * size);
            
            // Заполняем яркими цветами для лучших отражений
            for (let i = 0; i < size; i++) {
                // Белый с лёгким оттенком синего для skybox
                data[i * 4] = 240;     // R
                data[i * 4 + 1] = 240; // G
                data[i * 4 + 2] = 255; // B
                data[i * 4 + 3] = 255; // A
            }
            
            // Создаем текстуру Data
            const dataTexture = new THREE.DataTexture(data, width, height, THREE.RGBAFormat);
            dataTexture.needsUpdate = true;
            
            // Используем эту текстуру как базовую карту окружения
            this.scene.environment = dataTexture;
            this.envMap = dataTexture;
            
            console.log("Карта окружения успешно создана");
        } catch (error) {
            console.error("Ошибка создания карты окружения:", error);
            this.scene.environment = null;
        }
    }
    
    /**
     * Добавление освещения
     */
    addLights() {
        // Основное освещение - окружающий свет
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambientLight);
        
        // Создаем группу для светильников
        this.lightingGroup = new THREE.Group();
        this.scene.add(this.lightingGroup);
        
        // Доступные типы светильников
        this.availableLights = [
            {
                id: 'rectangular',
                name: 'Прямоугольный светильник',
                create: () => this.createRectangularLight()
            },
            {
                id: 'round',
                name: 'Круглый светильник',
                create: () => this.createRoundLight()
            },
            {
                id: 'spots',
                name: 'Точечные светильники',
                create: () => this.createSpotLights()
            },
            {
                id: 'led',
                name: 'LED подсветка',
                create: () => this.createLEDLight()
            }
        ];
        
        // Устанавливаем тип светильника по умолчанию
        this.currentLightType = 'round';
        this.setLightType(this.currentLightType);
    }
    
    /**
     * Устанавливает тип светильника
     * @param {string} lightType - Тип светильника
     */
    setLightType(lightType) {
        // Удаляем существующие светильники
        while (this.lightingGroup.children.length) {
            this.lightingGroup.remove(this.lightingGroup.children[0]);
        }
        
        // Находим выбранный тип светильника
        const selectedLight = this.availableLights.find(light => light.id === lightType);
        if (selectedLight) {
            // Устанавливаем новый тип
            this.currentLightType = lightType;
            // Создаем новые светильники
            selectedLight.create();
        } else {
            console.error(`Тип светильника ${lightType} не найден`);
        }
    }
    
    /**
     * Создает прямоугольный светильник
     */
    createRectangularLight() {
        const { width, depth } = this.elevatorDimensions;
        
        // Создаем геометрию светильника
        const lightWidth = width * 0.6;
        const lightDepth = depth * 0.3;
        const frameGeometry = new THREE.BoxGeometry(lightWidth, 0.05, lightDepth);
        const frameMaterial = new THREE.MeshStandardMaterial({ 
            color: 0xffffff, 
            metalness: 0.3, 
            roughness: 0.2 
        });
        const lightFrame = new THREE.Mesh(frameGeometry, frameMaterial);
        
        // Позиционируем светильник на потолке
        lightFrame.position.set(0, this.elevatorDimensions.height - 0.05, 0);
        this.lightingGroup.add(lightFrame);
        
        // Добавляем источник света внутри светильника
        const light = new THREE.RectAreaLight(0xffffff, 5, lightWidth * 0.9, lightDepth * 0.9);
        light.position.set(0, this.elevatorDimensions.height - 0.1, 0);
        light.rotation.x = Math.PI;
        this.lightingGroup.add(light);
        
        // Добавляем плафон (прозрачное стекло)
        const diffuserGeometry = new THREE.BoxGeometry(lightWidth * 0.95, 0.01, lightDepth * 0.95);
        const diffuserMaterial = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.7,
            metalness: 0.1,
            roughness: 0.1
        });
        const diffuser = new THREE.Mesh(diffuserGeometry, diffuserMaterial);
        diffuser.position.set(0, this.elevatorDimensions.height - 0.08, 0);
        this.lightingGroup.add(diffuser);
    }
    
    /**
     * Создает круглый светильник
     */
    createRoundLight() {
        // Создаем геометрию светильника
        const frameGeometry = new THREE.TorusGeometry(0.4, 0.05, 16, 32);
        const frameMaterial = new THREE.MeshStandardMaterial({ 
            color: 0xcccccc, 
            metalness: 0.5, 
            roughness: 0.2 
        });
        const lightFrame = new THREE.Mesh(frameGeometry, frameMaterial);
        
        // Поворачиваем рамку, чтобы она была параллельна потолку
        lightFrame.rotation.x = Math.PI / 2;
        
        // Позиционируем светильник на потолке
        lightFrame.position.set(0, this.elevatorDimensions.height - 0.05, 0);
        this.lightingGroup.add(lightFrame);
        
        // Добавляем плафон (прозрачное стекло)
        const diffuserGeometry = new THREE.CircleGeometry(0.38, 32);
        const diffuserMaterial = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.7,
            metalness: 0.1,
            roughness: 0.1,
            side: THREE.DoubleSide
        });
        const diffuser = new THREE.Mesh(diffuserGeometry, diffuserMaterial);
        diffuser.rotation.x = Math.PI / 2;
        diffuser.position.set(0, this.elevatorDimensions.height - 0.08, 0);
        this.lightingGroup.add(diffuser);
        
        // Добавляем источник света
        const light = new THREE.PointLight(0xffffff, 1, 4);
        light.position.set(0, this.elevatorDimensions.height - 0.2, 0);
        this.lightingGroup.add(light);
    }
    
    /**
     * Создает точечные светильники
     */
    createSpotLights() {
        // Создаем 4 точечных светильника
        const positions = [
            [-0.4, 0, -0.4],
            [0.4, 0, -0.4],
            [-0.4, 0, 0.4],
            [0.4, 0, 0.4]
        ];
        
        positions.forEach((pos, index) => {
            // Создаем геометрию светильника
            const frameMaterial = new THREE.MeshStandardMaterial({ 
                color: 0xcccccc, 
                metalness: 0.5, 
                roughness: 0.2 
            });
            
            // Корпус светильника
            const housing = new THREE.Mesh(
                new THREE.CylinderGeometry(0.07, 0.07, 0.05, 16),
                frameMaterial
            );
            housing.position.set(pos[0], this.elevatorDimensions.height - 0.025, pos[2]);
            this.lightingGroup.add(housing);
            
            // Добавляем источник света
            const light = new THREE.SpotLight(0xffffff, 0.5, 4, Math.PI / 4, 0.5, 2);
            light.position.set(pos[0], this.elevatorDimensions.height - 0.05, pos[2]);
            light.target.position.set(pos[0], 0, pos[2]);
            this.lightingGroup.add(light);
            this.lightingGroup.add(light.target);
        });
    }
    
    /**
     * Создает LED подсветку по периметру
     */
    createLEDLight() {
        const { width, depth, height } = this.elevatorDimensions;
        const margin = 0.1; // отступ от стен
        
        // Создаем LED полосы по периметру потолка
        const ledMaterial = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            emissive: 0xffffff,
            emissiveIntensity: 1,
            metalness: 0.1,
            roughness: 0.2
        });
        
        // Передняя полоса
        const frontLED = new THREE.Mesh(
            new THREE.BoxGeometry(width - margin * 2, 0.02, 0.02),
            ledMaterial
        );
        frontLED.position.set(0, height - 0.05, depth / 2 - margin);
        this.lightingGroup.add(frontLED);
        
        // Задняя полоса
        const backLED = new THREE.Mesh(
            new THREE.BoxGeometry(width - margin * 2, 0.02, 0.02),
            ledMaterial
        );
        backLED.position.set(0, height - 0.05, -depth / 2 + margin);
        this.lightingGroup.add(backLED);
        
        // Левая полоса
        const leftLED = new THREE.Mesh(
            new THREE.BoxGeometry(0.02, 0.02, depth - margin * 2),
            ledMaterial
        );
        leftLED.position.set(-width / 2 + margin, height - 0.05, 0);
        this.lightingGroup.add(leftLED);
        
        // Правая полоса
        const rightLED = new THREE.Mesh(
            new THREE.BoxGeometry(0.02, 0.02, depth - margin * 2),
            ledMaterial
        );
        rightLED.position.set(width / 2 - margin, height - 0.05, 0);
        this.lightingGroup.add(rightLED);
        
        // Добавляем основной свет
        const light = new THREE.PointLight(0xffffff, 0.8, 4);
        light.position.set(0, height - 0.2, 0);
        this.lightingGroup.add(light);
    }
    
    /**
     * Создание модели лифта
     */
    createElevator() {
        // Контейнер для всех частей лифта
        this.elevator = new THREE.Group();
        this.scene.add(this.elevator);
        
        const { width, depth, height } = this.elevatorDimensions;
        const halfWidth = width / 2;
        const halfDepth = depth / 2;
        
        // Создаем базовую геометрию и материалы
        const defaultMaterial = new THREE.MeshStandardMaterial({ 
            color: 0xeeeeee, 
            roughness: 0.5, 
            metalness: 0.2,
            map: null
        });
        
        // Пол
        const floorGeometry = new THREE.BoxGeometry(width, 0.05, depth);
        this.elevatorParts.floor = new THREE.Mesh(floorGeometry, defaultMaterial.clone());
        this.elevatorParts.floor.position.y = -0.025;
        this.elevatorParts.floor.receiveShadow = true;
        this.elevator.add(this.elevatorParts.floor);
        
        // Потолок
        const ceilingGeometry = new THREE.BoxGeometry(width, 0.05, depth);
        this.elevatorParts.ceiling = new THREE.Mesh(ceilingGeometry, defaultMaterial.clone());
        this.elevatorParts.ceiling.position.y = height - 0.025;
        this.elevatorParts.ceiling.receiveShadow = true;
        this.elevator.add(this.elevatorParts.ceiling);
        
        // Стены (группа)
        this.elevatorParts.walls = new THREE.Group();
        this.elevator.add(this.elevatorParts.walls);
        
        // Задняя стена
        const backWallGeometry = new THREE.BoxGeometry(width, height, 0.05);
        const backWall = new THREE.Mesh(backWallGeometry, defaultMaterial.clone());
        backWall.position.set(0, height/2, -halfDepth);
        this.elevatorParts.walls.add(backWall);
        
        // Левая стена
        const leftWallGeometry = new THREE.BoxGeometry(0.05, height, depth);
        const leftWall = new THREE.Mesh(leftWallGeometry, defaultMaterial.clone());
        leftWall.position.set(-halfWidth, height/2, 0);
        this.elevatorParts.walls.add(leftWall);
        
        // Правая стена
        const rightWallGeometry = new THREE.BoxGeometry(0.05, height, depth);
        const rightWall = new THREE.Mesh(rightWallGeometry, defaultMaterial.clone());
        rightWall.position.set(halfWidth, height/2, 0);
        this.elevatorParts.walls.add(rightWall);
        
        // Передняя стена (с дверью)
        const frontWallWidthSegment = width / 2 - 0.5; // Ширина сегмента стены по обе стороны от двери
        
        // Левая часть передней стены
        const frontLeftWallGeometry = new THREE.BoxGeometry(frontWallWidthSegment, height, 0.05);
        const frontLeftWall = new THREE.Mesh(frontLeftWallGeometry, defaultMaterial.clone());
        frontLeftWall.position.set(-width/4 - 0.25, height/2, halfDepth);
        this.elevatorParts.walls.add(frontLeftWall);
        
        // Правая часть передней стены
        const frontRightWallGeometry = new THREE.BoxGeometry(frontWallWidthSegment, height, 0.05);
        const frontRightWall = new THREE.Mesh(frontRightWallGeometry, defaultMaterial.clone());
        frontRightWall.position.set(width/4 + 0.25, height/2, halfDepth);
        this.elevatorParts.walls.add(frontRightWall);
        
        // Верх двери
        const doorTopGeometry = new THREE.BoxGeometry(1.0, 0.1, 0.05);
        const doorTop = new THREE.Mesh(doorTopGeometry, defaultMaterial.clone());
        doorTop.position.set(0, height - 0.05, halfDepth);
        this.elevatorParts.walls.add(doorTop);
        
        // Добавляем более реалистичные двери лифта с рамками и створками
        this.createDoors(width, height, depth);
        
        // Создаем зеркало с помощью Reflector
        const mirrorWidth = width * 0.9;
        const mirrorHeight = height * 0.6;
        
        // Создаем геометрию для зеркала (плоскость вместо box)
        const mirrorGeometry = new THREE.PlaneGeometry(mirrorWidth, mirrorHeight);
        
        // Создаем Reflector для реалистичного отражения
        this.elevatorParts.mirror = new THREE.Reflector(mirrorGeometry, {
            clipBias: 0.003,
            textureWidth: window.innerWidth * window.devicePixelRatio,
            textureHeight: window.innerHeight * window.devicePixelRatio,
            color: 0xaaaaaa,
            recursion: 1
        });
        
        // Устанавливаем позицию зеркала - ближе к центру и выше
        this.elevatorParts.mirror.position.set(0, height * 0.6, -halfDepth + 0.05);
        // Увеличиваем размер зеркала для лучшей видимости
        this.elevatorParts.mirror.scale.set(1.2, 1.2, 1);
        this.elevatorParts.mirror.visible = this.showMirror;
        this.elevator.add(this.elevatorParts.mirror);
        
        // Создаем только боковые поручни (оптимизированные)
        this.createSideHandrails(width, height, depth);
        
        // Создаем панель выбора этажа
        this.createFloorPanel();
    }
    
    /**
     * Создает более реалистичные двери лифта
     * @param {number} width - Ширина лифта
     * @param {number} height - Высота лифта
     * @param {number} depth - Глубина лифта
     */
    createDoors(width, height, depth) {
        const halfDepth = depth / 2;
        
        // Материал для дверей - металлический с небольшим блеском
        const doorMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x777777, 
            roughness: 0.3, 
            metalness: 0.8,
            envMap: this.envMap
        });
        
        // Материал для декоративных элементов дверей
        const doorTrimMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x555555, 
            roughness: 0.2, 
            metalness: 0.9,
            envMap: this.envMap
        });
        
        // Размеры дверного проема
        const doorWidth = 0.5; // Ширина одной створки
        const doorHeight = height - 0.1;
        const doorThickness = 0.03;
        
        // Группа для всех элементов дверей
        const doorGroup = new THREE.Group();
        
        // Левая створка двери
        const leftDoorGeometry = new THREE.BoxGeometry(doorWidth, doorHeight, doorThickness);
        this.elevatorParts.doorLeft = new THREE.Mesh(leftDoorGeometry, doorMaterial);
        this.elevatorParts.doorLeft.position.set(-doorWidth/2, doorHeight/2, halfDepth);
        
        // Создаем рамку для левой двери
        const leftDoorRimGeometry = new THREE.BoxGeometry(doorWidth - 0.1, doorHeight - 0.1, 0.005);
        const leftDoorRim = new THREE.Mesh(leftDoorRimGeometry, doorTrimMaterial);
        leftDoorRim.position.z = doorThickness/2 + 0.001;
        this.elevatorParts.doorLeft.add(leftDoorRim);
        
        // Вертикальная линия посередине левой двери
        const leftLineGeometry = new THREE.BoxGeometry(0.01, doorHeight - 0.2, 0.005);
        const leftLine = new THREE.Mesh(leftLineGeometry, doorTrimMaterial);
        leftLine.position.set(doorWidth/4, 0, doorThickness/2 + 0.002);
        this.elevatorParts.doorLeft.add(leftLine);
        
        doorGroup.add(this.elevatorParts.doorLeft);
        
        // Правая створка двери
        const rightDoorGeometry = new THREE.BoxGeometry(doorWidth, doorHeight, doorThickness);
        this.elevatorParts.doorRight = new THREE.Mesh(rightDoorGeometry, doorMaterial);
        this.elevatorParts.doorRight.position.set(doorWidth/2, doorHeight/2, halfDepth);
        
        // Создаем рамку для правой двери
        const rightDoorRimGeometry = new THREE.BoxGeometry(doorWidth - 0.1, doorHeight - 0.1, 0.005);
        const rightDoorRim = new THREE.Mesh(rightDoorRimGeometry, doorTrimMaterial);
        rightDoorRim.position.z = doorThickness/2 + 0.001;
        this.elevatorParts.doorRight.add(rightDoorRim);
        
        // Вертикальная линия посередине правой двери
        const rightLineGeometry = new THREE.BoxGeometry(0.01, doorHeight - 0.2, 0.005);
        const rightLine = new THREE.Mesh(rightLineGeometry, doorTrimMaterial);
        rightLine.position.set(-doorWidth/4, 0, doorThickness/2 + 0.002);
        this.elevatorParts.doorRight.add(rightLine);
        
        doorGroup.add(this.elevatorParts.doorRight);
        
        // Добавление сенсора дверей
        const sensorWidth = 0.1;
        const sensorHeight = 0.7;
        
        const sensorGeometry = new THREE.BoxGeometry(sensorWidth, sensorHeight, 0.01);
        const sensorMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x333333, 
            roughness: 0.2, 
            metalness: 0.5,
            envMap: this.envMap
        });
        
        const doorSensor = new THREE.Mesh(sensorGeometry, sensorMaterial);
        doorSensor.position.set(0, doorHeight - sensorHeight/2 - 0.05, halfDepth + doorThickness/2 + 0.005);
        doorGroup.add(doorSensor);
        
        // Добавляем светодиодную полоску на сенсоре
        const ledGeometry = new THREE.BoxGeometry(sensorWidth - 0.02, 0.02, 0.005);
        const ledMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x00ff00, 
            emissive: 0x00ff00,
            emissiveIntensity: 0.5,
            roughness: 0.2, 
            metalness: 0.5
        });
        
        const led = new THREE.Mesh(ledGeometry, ledMaterial);
        led.position.set(0, -sensorHeight/2 + 0.1, 0.01);
        doorSensor.add(led);
        
        // Добавляем двери к лифту
        this.elevator.add(doorGroup);
    }
    
    /**
     * Создает поручни только на боковых стенах у двери (оптимизированная версия)
     * @param {number} width - Ширина лифта
     * @param {number} height - Высота лифта
     * @param {number} depth - Глубина лифта
     */
    createSideHandrails(width, height, depth) {
        const halfWidth = width / 2;
        const halfDepth = depth / 2;
        
        // Создаем поручень (по умолчанию скрыт)
        const handrailRadius = 0.02;
        const handrailMaterial = new THREE.MeshStandardMaterial({
            color: 0xb0b0b0,
            roughness: 0.1,
            metalness: 0.8
        });
        
        // Группа для поручня
        this.elevatorParts.handrail = new THREE.Group();
        this.elevatorParts.handrail.visible = this.showHandrail;
        this.elevator.add(this.elevatorParts.handrail);
        
        // Укороченные поручни только по бокам от двери
        const handrailLength = depth * 0.4; // Укорачиваем длину
        
        // Левый поручень
        const handrailLeftGeometry = new THREE.CylinderGeometry(handrailRadius, handrailRadius, handrailLength, 8);
        handrailLeftGeometry.rotateX(Math.PI/2); // Поворачиваем, чтобы цилиндр был вдоль стены
        
        const handrailLeft = new THREE.Mesh(handrailLeftGeometry, handrailMaterial);
        // Размещаем ближе к передней стене (двери)
        handrailLeft.position.set(-halfWidth + 0.05, height * 0.3, halfDepth/4);
        this.elevatorParts.handrail.add(handrailLeft);
        
        // Правый поручень
        const handrailRightGeometry = new THREE.CylinderGeometry(handrailRadius, handrailRadius, handrailLength, 8);
        handrailRightGeometry.rotateX(Math.PI/2);
        
        const handrailRight = new THREE.Mesh(handrailRightGeometry, handrailMaterial);
        // Размещаем ближе к передней стене (двери)
        handrailRight.position.set(halfWidth - 0.05, height * 0.3, halfDepth/4);
        this.elevatorParts.handrail.add(handrailRight);
    }
    
    /**
     * Создание панели выбора этажа
     */
    createFloorPanel() {
        // Размеры и позиция панели
        const panelWidth = 0.25;
        const panelHeight = 0.5;
        const panelDepth = 0.03;
        const { width, depth, height } = this.elevatorDimensions;
        
        // Создаем группу для панели выбора этажа и всех её элементов
        this.elevatorParts.floorPanel = new THREE.Group();
        
        // Материал для панели - металлическая поверхность
        const panelMaterial = new THREE.MeshStandardMaterial({
            color: 0x404040,
            metalness: 0.8,
            roughness: 0.2,
            envMap: this.envMap
        });
        
        // Материал для дисплея
        const displayMaterial = new THREE.MeshStandardMaterial({
            color: 0x000000,
            emissive: 0x003366,
            emissiveIntensity: 0.5,
            metalness: 0.1,
            roughness: 0.2
        });
        
        // Основная панель
        const panelGeometry = new THREE.BoxGeometry(panelWidth, panelHeight, panelDepth);
        const panel = new THREE.Mesh(panelGeometry, panelMaterial);
        
        // Скругленные края панели
        panel.geometry.parameters = {
            radiusTop: 0.01,
            radiusBottom: 0.01,
            height: panelHeight,
            radialSegments: 16,
            heightSegments: 1
        };
        
        // Позиционируем панель на правой стене
        panel.position.set(
            width / 2 - 0.3,            // Немного отступ от правого края
            height / 2,                 // По центру высоты
            0                           // По центру глубины
        );
        panel.rotation.y = -Math.PI / 2; // Поворачиваем лицом внутрь лифта
        
        this.elevatorParts.floorPanel.add(panel);
        
        // Дисплей этажа в верхней части панели
        const displayWidth = panelWidth * 0.8;
        const displayHeight = 0.07;
        const displayGeometry = new THREE.BoxGeometry(displayWidth, displayHeight, panelDepth + 0.001);
        const display = new THREE.Mesh(displayGeometry, displayMaterial);
        
        // Позиционируем дисплей в верхней части панели
        display.position.set(
            0,                          // По центру панели
            panelHeight / 2 - displayHeight, // В верхней части с небольшим отступом
            panelDepth / 2 + 0.001      // Немного выдвигаем вперед
        );
        
        panel.add(display);
        
        // Добавляем текстуру с цифрами для отображения этажа
        this.floorDisplayMaterial = displayMaterial;
        
        // Добавляем кнопки этажей
        const buttonRows = 5;
        const buttonCols = 4;
        const buttonSize = 0.03;
        const buttonMargin = 0.01;
        const buttonsWidth = (buttonSize + buttonMargin) * buttonCols - buttonMargin;
        const buttonsHeight = (buttonSize + buttonMargin) * buttonRows - buttonMargin;
        const buttonsStartY = panelHeight / 4;  // Начинаем кнопки с середины верхней половины панели
        
        const buttonMaterial = new THREE.MeshStandardMaterial({
            color: 0x707070,
            metalness: 0.5,
            roughness: 0.4,
            envMap: this.envMap
        });
        
        // Материал для светящихся цифр
        const digitMaterial = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            side: THREE.DoubleSide
        });
        
        // Создаем этажные кнопки
        this.floorButtons = [];
        for (let row = 0; row < buttonRows; row++) {
            for (let col = 0; col < buttonCols; col++) {
                const floorNum = row * buttonCols + col + 1;
                if (floorNum > this.totalFloors) break;
                
                // Позиция кнопки
                const x = -buttonsWidth / 2 + col * (buttonSize + buttonMargin) + buttonSize / 2;
                const y = buttonsStartY - row * (buttonSize + buttonMargin) - buttonSize / 2;
                
                // Создаем кнопку
                const buttonGeometry = new THREE.CylinderGeometry(buttonSize / 2, buttonSize / 2, panelDepth + 0.005, 16);
                buttonGeometry.rotateX(Math.PI / 2);
                const button = new THREE.Mesh(buttonGeometry, buttonMaterial);
                
                // Позиционируем кнопку на панели
                button.position.set(
                    x,                       // Положение по горизонтали
                    y,                       // Положение по вертикали
                    panelDepth / 2 + 0.0025  // Немного выдвигаем вперед
                );
                
                // Добавляем информацию о кнопке
                button.userData = {
                    floor: floorNum,
                    isPressed: false
                };
                
                // Добавляем кнопку на панель
                panel.add(button);
                this.floorButtons.push(button);
                
                // Добавляем цифру на кнопку
                const textLoader = new THREE.TextureLoader();
                const canvas = document.createElement('canvas');
                canvas.width = 64;
                canvas.height = 64;
                const context = canvas.getContext('2d');
                context.fillStyle = 'black';
                context.fillRect(0, 0, 64, 64);
                context.font = '48px Arial';
                context.fillStyle = 'white';
                context.textAlign = 'center';
                context.textBaseline = 'middle';
                context.fillText(floorNum.toString(), 32, 32);
                
                const digitTexture = new THREE.CanvasTexture(canvas);
                const digitMaterial = new THREE.MeshBasicMaterial({ 
                    map: digitTexture,
                    transparent: true
                });
                
                const digitGeometry = new THREE.PlaneGeometry(buttonSize * 0.8, buttonSize * 0.8);
                const digit = new THREE.Mesh(digitGeometry, digitMaterial);
                digit.position.z = panelDepth / 2 + 0.004;
                digit.rotation.y = Math.PI;
                
                button.add(digit);
            }
        }
        
        // Добавляем кнопки управления (открыть/закрыть)
        const controlButtonSize = buttonSize * 1.2;
        const controlButtonY = buttonsStartY - buttonRows * (buttonSize + buttonMargin) - controlButtonSize;
        
        // Кнопка "Открыть двери"
        const openButtonGeometry = new THREE.CylinderGeometry(controlButtonSize / 2, controlButtonSize / 2, panelDepth + 0.005, 16);
        openButtonGeometry.rotateX(Math.PI / 2);
        const openButtonMaterial = new THREE.MeshStandardMaterial({
            color: 0x00aa00,
            metalness: 0.5,
            roughness: 0.4,
            envMap: this.envMap
        });
        const openButton = new THREE.Mesh(openButtonGeometry, openButtonMaterial);
        
        // Позиционируем кнопку "Открыть"
        openButton.position.set(
            -controlButtonSize,         // Слева
            controlButtonY,             // Ниже этажных кнопок
            panelDepth / 2 + 0.0025     // Немного выдвигаем вперед
        );
        
        // Иконка открытых дверей
        const openCanvas = document.createElement('canvas');
        openCanvas.width = 64;
        openCanvas.height = 64;
        const openContext = openCanvas.getContext('2d');
        openContext.fillStyle = 'black';
        openContext.fillRect(0, 0, 64, 64);
        openContext.strokeStyle = 'white';
        openContext.lineWidth = 3;
        
        // Рисуем открытые двери
        openContext.beginPath();
        openContext.moveTo(20, 20);
        openContext.lineTo(10, 44);
        openContext.moveTo(44, 20);
        openContext.lineTo(54, 44);
        openContext.stroke();
        
        const openTexture = new THREE.CanvasTexture(openCanvas);
        const openIconMaterial = new THREE.MeshBasicMaterial({ 
            map: openTexture,
            transparent: true
        });
        
        const openIconGeometry = new THREE.PlaneGeometry(controlButtonSize * 0.8, controlButtonSize * 0.8);
        const openIcon = new THREE.Mesh(openIconGeometry, openIconMaterial);
        openIcon.position.z = panelDepth / 2 + 0.004;
        openIcon.rotation.y = Math.PI;
        
        openButton.add(openIcon);
        panel.add(openButton);
        
        // Кнопка "Закрыть двери"
        const closeButtonGeometry = new THREE.CylinderGeometry(controlButtonSize / 2, controlButtonSize / 2, panelDepth + 0.005, 16);
        closeButtonGeometry.rotateX(Math.PI / 2);
        const closeButtonMaterial = new THREE.MeshStandardMaterial({
            color: 0xaa0000,
            metalness: 0.5,
            roughness: 0.4,
            envMap: this.envMap
        });
        const closeButton = new THREE.Mesh(closeButtonGeometry, closeButtonMaterial);
        
        // Позиционируем кнопку "Закрыть"
        closeButton.position.set(
            controlButtonSize,          // Справа
            controlButtonY,             // Ниже этажных кнопок
            panelDepth / 2 + 0.0025     // Немного выдвигаем вперед
        );
        
        // Иконка закрытых дверей
        const closeCanvas = document.createElement('canvas');
        closeCanvas.width = 64;
        closeCanvas.height = 64;
        const closeContext = closeCanvas.getContext('2d');
        closeContext.fillStyle = 'black';
        closeContext.fillRect(0, 0, 64, 64);
        closeContext.strokeStyle = 'white';
        closeContext.lineWidth = 3;
        
        // Рисуем закрытые двери
        closeContext.beginPath();
        closeContext.moveTo(32, 20);
        closeContext.lineTo(32, 44);
        closeContext.moveTo(20, 42);
        closeContext.lineTo(44, 42);
        closeContext.stroke();
        
        const closeTexture = new THREE.CanvasTexture(closeCanvas);
        const closeIconMaterial = new THREE.MeshBasicMaterial({ 
            map: closeTexture,
            transparent: true
        });
        
        const closeIconGeometry = new THREE.PlaneGeometry(controlButtonSize * 0.8, controlButtonSize * 0.8);
        const closeIcon = new THREE.Mesh(closeIconGeometry, closeIconMaterial);
        closeIcon.position.z = panelDepth / 2 + 0.004;
        closeIcon.rotation.y = Math.PI;
        
        closeButton.add(closeIcon);
        panel.add(closeButton);
        
        // Добавляем кнопку тревоги
        const alarmButtonGeometry = new THREE.CylinderGeometry(controlButtonSize / 2, controlButtonSize / 2, panelDepth + 0.005, 16);
        alarmButtonGeometry.rotateX(Math.PI / 2);
        const alarmButtonMaterial = new THREE.MeshStandardMaterial({
            color: 0xffcc00,
            metalness: 0.5,
            roughness: 0.4,
            envMap: this.envMap
        });
        const alarmButton = new THREE.Mesh(alarmButtonGeometry, alarmButtonMaterial);
        
        // Позиционируем кнопку тревоги
        alarmButton.position.set(
            0,                          // По центру
            controlButtonY - controlButtonSize * 1.5, // Ниже кнопок открытия/закрытия
            panelDepth / 2 + 0.0025     // Немного выдвигаем вперед
        );
        
        // Иконка тревоги (треугольник с восклицательным знаком)
        const alarmCanvas = document.createElement('canvas');
        alarmCanvas.width = 64;
        alarmCanvas.height = 64;
        const alarmContext = alarmCanvas.getContext('2d');
        alarmContext.fillStyle = 'black';
        alarmContext.fillRect(0, 0, 64, 64);
        
        // Рисуем треугольник
        alarmContext.fillStyle = 'white';
        alarmContext.beginPath();
        alarmContext.moveTo(32, 15);
        alarmContext.lineTo(50, 45);
        alarmContext.lineTo(14, 45);
        alarmContext.closePath();
        alarmContext.fill();
        
        // Рисуем восклицательный знак
        alarmContext.fillStyle = 'black';
        alarmContext.beginPath();
        alarmContext.arc(32, 38, 3, 0, Math.PI * 2);
        alarmContext.fill();
        alarmContext.fillRect(29, 22, 6, 12);
        
        const alarmTexture = new THREE.CanvasTexture(alarmCanvas);
        const alarmIconMaterial = new THREE.MeshBasicMaterial({ 
            map: alarmTexture,
            transparent: true
        });
        
        const alarmIconGeometry = new THREE.PlaneGeometry(controlButtonSize * 0.8, controlButtonSize * 0.8);
        const alarmIcon = new THREE.Mesh(alarmIconGeometry, alarmIconMaterial);
        alarmIcon.position.z = panelDepth / 2 + 0.004;
        alarmIcon.rotation.y = Math.PI;
        
        alarmButton.add(alarmIcon);
        panel.add(alarmButton);
        
        // Обновляем состояние текущего этажа
        this.updateFloorDisplay();
        
        // Добавляем панель к лифту
        this.elevator.add(this.elevatorParts.floorPanel);
        
        return this.elevatorParts.floorPanel;
    }
    
    /**
     * Обновляет отображение текущего этажа на дисплее
     */
    updateFloorDisplay() {
        // Создаем текстуру для дисплея с текущим этажом
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 64;
        const context = canvas.getContext('2d');
        
        if (!context) return;
        
        // Заполняем фон
        const gradient = context.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, '#000000');
        gradient.addColorStop(1, '#001428');
        context.fillStyle = gradient;
        context.fillRect(0, 0, canvas.width, canvas.height);
        
        // Создаем эффект свечения цифр (цифровой дисплей)
        const floorText = this.currentFloor.toString().padStart(2, '0');
        context.font = 'bold 40px "Digital-7", monospace';
        
        // Сначала рисуем эффект свечения
        context.fillStyle = '#00ccff';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.globalAlpha = 0.5;
        context.fillText(floorText, canvas.width / 2 + 1, canvas.height / 2 + 1);
        context.fillText(floorText, canvas.width / 2 - 1, canvas.height / 2 - 1);
        context.fillText(floorText, canvas.width / 2 + 1, canvas.height / 2 - 1);
        context.fillText(floorText, canvas.width / 2 - 1, canvas.height / 2 + 1);
        
        // Теперь рисуем основной текст
        context.globalAlpha = 1.0;
        context.fillStyle = '#00ffff';
        context.fillText(floorText, canvas.width / 2, canvas.height / 2);
        
        // Добавляем текст "этаж"
        context.font = 'bold 16px Arial';
        context.fillStyle = '#999999';
        context.fillText('ЭТАЖ', canvas.width / 2, canvas.height - 12);
        
        // Создаем текстуру и применяем к дисплею
        const texture = new THREE.CanvasTexture(canvas);
        
        // Ищем материал дисплея
        const panel = this.elevatorParts.floorPanel.children[0]; // Основная панель
        if (panel && panel.children.length > 0) {
            // Предполагаем, что первый дочерний элемент - это дисплей
            const display = panel.children[0];
            if (display && display.material) {
                display.material.map = texture;
                display.material.emissiveMap = texture;
                display.material.needsUpdate = true;
            }
        }
        
        // Обновляем активные кнопки на панели
        if (this.floorButtons) {
            this.floorButtons.forEach(button => {
                if (button.userData && button.userData.floor === this.currentFloor) {
                    // Подсвечиваем кнопку активного этажа
                    button.material.emissive.setHex(0x555555);
                } else {
                    // Сбрасываем подсветку для остальных кнопок
                    button.material.emissive.setHex(0x000000);
                }
                button.material.needsUpdate = true;
            });
        }
    }
    
    /**
     * Загрузка и подготовка текстур
     */
    loadTextures() {
        console.log('Начинаю загрузку текстур...');
        
        // Имена файлов текстур для каждой категории
        const textureFiles = {
            walls: ['marble.jpg', 'metal.jpg', 'wood_dark.jpg', 'wood_light.jpg'],
            floor: ['carpet.jpg', 'rubber.jpg', 'tile.jpg', 'wood.jpg'],
            ceiling: ['matte.jpg', 'metallic.jpg', 'mirror.jpg', 'white.jpg']
        };
        
        // Сохраняем имена файлов для дальнейшего использования в превью
        this.textureFilenames = textureFiles;
        
        // Создаем загрузчик текстур
        const textureLoader = new THREE.TextureLoader();
        
        // Устанавливаем кроссдоменную политику для текстур
        textureLoader.crossOrigin = 'anonymous';
        
        let loadedCount = 0;
        let totalToLoad = 0;
        
        // Подсчитываем общее количество текстур для загрузки
        for (const category in textureFiles) {
            totalToLoad += textureFiles[category].length;
        }
        
        console.log(`Всего текстур для загрузки: ${totalToLoad}`);
        
        // Создаем резервные текстуры на случай ошибок загрузки
        const fallbackTextures = {
            walls: this.createFallbackTexture('#e0e0e0'),
            floor: this.createFallbackTexture('#d0d0d0'),
            ceiling: this.createFallbackTexture('#f0f0f0')
        };
        
        // Функция для обработки загрузки текстуры
        const onTextureLoad = (texture, category, index) => {
            console.log(`Загружена текстура: ${category}/${this.textureFilenames[category][index]}`);
            
            // Создаем массив, если его еще нет
            if (!this.textures[category]) {
                this.textures[category] = [];
            }
            
            // Добавляем текстуру в соответствующую категорию
            this.textures[category][index] = texture;
            
            // Настройка повторения и фильтрации для текстуры
            texture.wrapS = THREE.RepeatWrapping;
            texture.wrapT = THREE.RepeatWrapping;
            texture.minFilter = THREE.LinearFilter;
            texture.magFilter = THREE.LinearFilter;
            
            // Разные настройки повторения для разных категорий
            if (category === 'walls') {
                texture.repeat.set(1, 1);
            } else if (category === 'floor') {
                texture.repeat.set(2, 2);
            } else if (category === 'ceiling') {
                texture.repeat.set(2, 2);
            }
            
            loadedCount++;
            console.log(`Прогресс загрузки: ${loadedCount}/${totalToLoad}`);
            
            // При загрузке всех текстур применяем первую текстуру из каждой категории
            if (loadedCount === totalToLoad) {
                console.log('Все текстуры загружены, применяю их к модели...');
                
                // Убедимся, что у нас есть хотя бы одна текстура в каждой категории
                if (this.textures.walls.length > 0 && 
                    this.textures.floor.length > 0 && 
                    this.textures.ceiling.length > 0) {
                    
                    // Применяем первую текстуру из каждой категории
                    this.applyTexture('walls', 0);
                    this.applyTexture('floor', 0);
                    this.applyTexture('ceiling', 0);
                    
                    // Создаем кнопки для выбора текстур
                    this.createTextureOptions();
                } else {
                    console.error('Ошибка: не все категории текстур загружены');
                    // Если не загрузились все категории текстур, используем резервные
                    if (!this.textures.walls || this.textures.walls.length === 0) {
                        this.textures.walls = [fallbackTextures.walls];
                    }
                    if (!this.textures.floor || this.textures.floor.length === 0) {
                        this.textures.floor = [fallbackTextures.floor];
                    }
                    if (!this.textures.ceiling || this.textures.ceiling.length === 0) {
                        this.textures.ceiling = [fallbackTextures.ceiling];
                    }
                    
                    this.applyTexture('walls', 0);
                    this.applyTexture('floor', 0);
                    this.applyTexture('ceiling', 0);
                    
                    this.createTextureOptions();
                    
                    console.error('Не все категории текстур были загружены, используются резервные текстуры');
                    this.showLoadError();
                }
            }
        };
        
        // Функция для обработки ошибки загрузки
        const onError = (err, category, index, filename) => {
            console.error(`Ошибка загрузки текстуры ${category}/${filename}:`, err);
            this.textureLoadErrors = true;
            
            // Создаем массив, если его еще нет
            if (!this.textures[category]) {
                this.textures[category] = [];
            }
            
            // Используем резервную текстуру при ошибке загрузки
            this.textures[category][index] = fallbackTextures[category];
            loadedCount++;
            
            // Если не удалось загрузить все текстуры, используем резервные
            if (loadedCount === totalToLoad) {
                console.log('Все текстуры обработаны (с ошибками), применяю их к модели...');
                this.applyTexture('walls', 0);
                this.applyTexture('floor', 0);
                this.applyTexture('ceiling', 0);
                
                this.createTextureOptions();
                
                if (this.textureLoadErrors) {
                    console.warn('Некоторые текстуры были заменены резервными из-за ошибок загрузки');
                    this.showLoadError();
                }
            }
        };
        
        // Загружаем текстуры для каждой категории
        for (const category in textureFiles) {
            // Инициализируем массивы для текстур
            this.textures[category] = [];
            
            textureFiles[category].forEach((file, index) => {
                const path = `textures/${category}/${file}`;
                console.log(`Начинаю загрузку текстуры: ${path}`);
                
                // Пытаемся загрузить текстуру
                textureLoader.load(
                    path,
                    (texture) => onTextureLoad(texture, category, index),
                    undefined, // Прогресс загрузки (не используется)
                    (err) => onError(err, category, index, file)
                );
            });
        }
    }
    
    /**
     * Создание резервной текстуры на случай ошибки загрузки
     */
    createFallbackTexture(color) {
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 256;
        const context = canvas.getContext('2d');
        
        // Заливаем основным цветом
        context.fillStyle = color;
        context.fillRect(0, 0, canvas.width, canvas.height);
        
        // Добавляем сетку для визуального различия
        context.strokeStyle = '#999999';
        context.lineWidth = 2;
        
        // Рисуем горизонтальные линии
        for (let i = 0; i < canvas.height; i += 32) {
            context.beginPath();
            context.moveTo(0, i);
            context.lineTo(canvas.width, i);
            context.stroke();
        }
        
        // Рисуем вертикальные линии
        for (let i = 0; i < canvas.width; i += 32) {
            context.beginPath();
            context.moveTo(i, 0);
            context.lineTo(i, canvas.height);
            context.stroke();
        }
        
        // Создаем текстуру из canvas
        const texture = new THREE.CanvasTexture(canvas);
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        
        return texture;
    }
    
    /**
     * Показывает сообщение об ошибке загрузки текстур
     */
    showLoadError() {
        const errorElement = document.getElementById('load-error');
        if (errorElement) {
            errorElement.style.display = 'block';
        }
    }
    
    /**
     * Создание элементов выбора текстур в интерфейсе
     */
    createTextureOptions() {
        // Создаем элементы выбора для каждой категории текстур
        this.createCategoryOptions('walls', 'walls-options');
        this.createCategoryOptions('floor', 'floor-options');
        this.createCategoryOptions('ceiling', 'ceiling-options');
    }
    
    /**
     * Создание элементов выбора текстур для конкретной категории
     */
    createCategoryOptions(category, containerId) {
        console.log(`Создаю элементы выбора для категории ${category} в контейнере #${containerId}`);
        
        const container = document.getElementById(containerId);
        if (!container) {
            console.error(`Контейнер #${containerId} не найден в DOM`);
            return;
        }
        
        // Получаем текстуры для категории
        const textures = this.textures[category];
        
        if (!textures || textures.length === 0) {
            console.error(`Нет текстур для категории ${category}`);
            return;
        }
        
        console.log(`Найдено ${textures.length} текстур для категории ${category}`);
        
        // Очищаем контейнер
        container.innerHTML = '';
        
        // Добавляем элемент для каждой текстуры
        textures.forEach((texture, index) => {
            const option = document.createElement('div');
            option.className = 'texture-option';
            
            // Используем имя файла для превью
            const fileName = this.textureFilenames[category][index];
            const imageUrl = `textures/${category}/${fileName}`;
            console.log(`Устанавливаю фон для опции ${index}: ${imageUrl}`);
            option.style.backgroundImage = `url(${imageUrl})`;
            
            // Добавляем данные для отладки
            option.setAttribute('data-category', category);
            option.setAttribute('data-index', index);
            option.setAttribute('data-filename', fileName);
            
            // Помечаем первую текстуру как выбранную
            if (index === 0) {
                option.classList.add('selected');
            }
            
            // Обработчик клика для выбора текстуры
            option.addEventListener('click', (event) => {
                console.log(`Выбрана текстура ${category} #${index} (${fileName})`);
                
                // Снимаем выделение со всех опций в контейнере
                container.querySelectorAll('.texture-option').forEach(el => {
                    el.classList.remove('selected');
                });
                
                // Выделяем выбранную опцию
                option.classList.add('selected');
                
                // Применяем выбранную текстуру
                this.applyTexture(category, index);
                
                // Останавливаем всплытие события
                event.preventDefault();
                event.stopPropagation();
            });
            
            container.appendChild(option);
        });
        
        console.log(`Создано ${textures.length} элементов выбора для категории ${category}`);
    }
    
    /**
     * Применение выбранной текстуры к соответствующей части лифта
     */
    applyTexture(category, index) {
        console.log(`Применяю текстуру ${category} #${index}`);
        
        // Получаем текстуру
        const texture = this.textures[category][index];
        if (!texture) {
            console.error(`Текстура ${category} #${index} не найдена`);
            return;
        }
        
        // Сохраняем текущую текстуру
        this.currentTextures[category] = texture;
        
        // Настройка текстуры
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;
        
        // Применяем текстуру к соответствующей части лифта
        if (category === 'walls' && this.elevatorParts.walls) {
            console.log('Применяю текстуру к стенам...');
            // Применяем ко всем частям стен
            this.elevatorParts.walls.children.forEach((wall, i) => {
                if (!wall.material) {
                    console.warn(`У стены #${i} отсутствует материал`);
                    return;
                }
                
                // Создаем новый материал с текстурой
                wall.material = new THREE.MeshStandardMaterial({
                    map: texture,
                    roughness: 0.5,
                    metalness: 0.2
                });
                
                console.log(`Текстура применена к стене #${i}`);
            });
        } else if (category === 'floor' && this.elevatorParts.floor) {
            console.log('Применяю текстуру к полу...');
            // Применяем к полу
            this.elevatorParts.floor.material = new THREE.MeshStandardMaterial({
                map: texture,
                roughness: 0.5,
                metalness: 0.2
            });
            
            console.log('Текстура пола обновлена');
        } else if (category === 'ceiling' && this.elevatorParts.ceiling) {
            console.log('Применяю текстуру к потолку...');
            // Применяем к потолку
            this.elevatorParts.ceiling.material = new THREE.MeshStandardMaterial({
                map: texture,
                roughness: 0.5,
                metalness: 0.2
            });
            
            console.log('Текстура потолка обновлена');
        } else {
            console.warn(`Не удалось применить текстуру ${category} #${index}: часть лифта не найдена`);
        }
        
        // Обновляем рендеринг для мгновенного отображения изменений
        if (this.renderer && this.camera && this.scene) {
            this.renderer.render(this.scene, this.camera);
        }
    }
    
    /**
     * Установка обработчиков событий
     */
    setupEventListeners() {
        // Получаем элементы переключателей
        const mirrorToggle = document.getElementById('toggle-mirror');
        const handrailToggle = document.getElementById('toggle-handrail');
        
        // Обработчики для переключателей
        if (mirrorToggle) {
            mirrorToggle.addEventListener('change', () => {
                this.showMirror = mirrorToggle.checked;
                this.updateMirror();
            });
        }
        
        if (handrailToggle) {
            handrailToggle.addEventListener('change', () => {
                this.showHandrail = handrailToggle.checked;
                this.updateHandrail();
            });
        }
        
        // Обработчики для выбора освещения
        const lightingOptions = document.querySelectorAll('.lighting-option');
        if (lightingOptions) {
            lightingOptions.forEach(option => {
                option.addEventListener('click', () => {
                    // Удаляем выделение со всех опций
                    document.querySelectorAll('.lighting-option').forEach(opt => {
                        opt.classList.remove('selected');
                    });
                    
                    // Добавляем выделение на выбранный элемент
                    option.classList.add('selected');
                    
                    // Получаем и устанавливаем тип освещения
                    const lightType = option.getAttribute('data-light-type');
                    if (lightType) {
                        this.setLightType(lightType);
                    }
                });
            });
        }
        
        // Добавляем обработчик клика на canvas для взаимодействия с панелью
        if (this.renderer && this.renderer.domElement) {
            this.renderer.domElement.addEventListener('click', (event) => this.handleClick(event));
        }
        
        // Создаем текстуры при загрузке страницы
        this.createTextureOptions();
    }
    
    /**
     * Обработчик клика для выбора этажа и взаимодействия с панелью
     */
    handleClick(event) {
        // Проверяем, что рендерер инициализирован
        if (!this.renderer || !this.camera || !this.scene) return;
        
        // Получаем позицию мыши в координатах канваса
        const rect = this.renderer.domElement.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        
        // Создаем рэйкастер для определения нажатой кнопки
        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(new THREE.Vector2(x, y), this.camera);
        
        // Находим все интерактивные элементы на панели
        const interactiveObjects = [];
        
        // Добавляем кнопки этажей
        if (this.floorButtons) {
            interactiveObjects.push(...this.floorButtons);
        }
        
        // Проверяем пересечения
        const intersects = raycaster.intersectObjects(interactiveObjects, true);
        
        if (intersects.length > 0) {
            // Находим ближайший объект, с которым было пересечение
            const intersectedObject = intersects[0].object;
            
            // Ищем родительскую кнопку (если нажали на цифру на кнопке)
            let button = intersectedObject;
            while (button && !button.userData?.floor) {
                button = button.parent;
            }
            
            // Если нашли кнопку с номером этажа
            if (button && button.userData?.floor) {
                // Визуальная обратная связь о нажатии
                this.animateButtonPress(button);
                
                // Устанавливаем выбранный этаж
                this.currentFloor = button.userData.floor;
                console.log(`Выбран этаж: ${this.currentFloor}`);
                
                // Обновляем отображение
                this.updateFloorDisplay();
            }
        }
    }
    
    /**
     * Анимация нажатия кнопки
     */
    animateButtonPress(button) {
        if (!button) return;
        
        // Сохраняем исходное положение кнопки
        const originalZ = button.position.z;
        
        // Имитируем нажатие кнопки (перемещаем внутрь панели)
        button.position.z -= 0.002;
        button.material.emissive.setHex(0x777777);
        button.material.needsUpdate = true;
        
        // Возвращаем кнопку в исходное положение через 200 мс
        setTimeout(() => {
            button.position.z = originalZ;
            
            // Если это не кнопка текущего этажа, сбрасываем подсветку
            if (button.userData.floor !== this.currentFloor) {
                button.material.emissive.setHex(0x000000);
            }
            
            button.material.needsUpdate = true;
        }, 200);
    }
    
    /**
     * Обработка изменения размера окна
     */
    onWindowResize() {
        // Обновляем размеры камеры и рендерера при изменении размера окна
        if (this.camera && this.renderer && this.container) {
            this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        }
    }
    
    /**
     * Анимационный цикл рендеринга
     */
    animate() {
        requestAnimationFrame(() => this.animate());
        this.renderer.render(this.scene, this.camera);
    }
    
    /**
     * Обновляет видимость зеркала
     */
    updateMirror() {
        if (this.elevatorParts.mirror) {
            this.elevatorParts.mirror.visible = this.showMirror;
        }
    }
    
    /**
     * Обновляет видимость поручня
     */
    updateHandrail() {
        if (this.elevatorParts.handrail) {
            this.elevatorParts.handrail.visible = this.showHandrail;
        }
    }
}

// Запуск приложения при загрузке страницы
window.addEventListener('DOMContentLoaded', () => {
    console.log("Конфигуратор лифта загружен с поддержкой горячей перезагрузки!");
    const configurator = new ElevatorConfigurator();
}); 
# AI Elevator - Конфигуратор 3D лифтов
## Общее
- https://cardesigner.kone.com/#/new-buildings/global/n-monospace-exp/edit/blank

## Деплой на GitHub Pages

Проект настроен для автоматического развертывания на GitHub Pages.

### Настройка GitHub Pages

1. Убедитесь, что ваш репозиторий публичный
2. Перейдите в настройки репозитория на GitHub (Settings)
3. В боковом меню выберите "Pages"
4. В разделе "Build and deployment" выберите:
   - Source: GitHub Actions
5. После этого при каждом пуше в ветку main будет запускаться процесс сборки и деплоя

### Просмотр развернутого приложения

После завершения настройки и успешного деплоя, приложение будет доступно по адресу:
`https://<ваше-имя-пользователя>.github.io/elevator-app/`

### Как работает деплой

Процесс деплоя на GitHub Pages управляется GitHub Actions и включает следующие шаги:
1. Клонирование репозитория
2. Установка зависимостей
3. Сборка проекта с помощью команды `npm run build`
4. Публикация содержимого папки `dist` на GitHub Pages

Конфигурация GitHub Actions находится в файле `.github/workflows/deploy.yml`.

## Текстуры и материалы

### Окрашивание текстур

Проект поддерживает функцию окрашивания текстур. При выборе текстуры для поверхности и одновременном выборе цвета, текстура будет окрашена в выбранный цвет. Это позволяет создавать разнообразные комбинации материалов и цветов.

### Добавление новых текстур

Проект поддерживает PBR (Physically Based Rendering) текстуры для реалистичного отображения материалов.

#### Структура директорий текстур

Текстуры размещаются в директории `/public/textures/example/`. Каждый набор текстур должен быть в отдельной папке с соответствующим названием.

```
/public/textures/example/
  ├── wood_0066_1k_HoQeAg/
  ├── metal_0067_1k_AdqCdW/
  ├── metal_0071_1k_HD5XFx/
  ├── metal_0081_1k_qh6kbG/
  ├── metal_0082_1k_je0RXH/
  ├── metal_0083_1k_r9ZJJl/
  ├── metal_0084_1k_uJitA0/
  ├── metal_0006_1k_gq9Cws/
  ├── wood_0018_1k_sQTe3f/
  ├── wood_0014_1k_T4cRBN/
  ├── tiles_0128_1k_18Xy17/
  ├── metal_0007_1k_h5TdNf/
  ├── ground_0045_1k_JNjeUj/
  ├── ground_0023_1k_pnMe9c/
  ├── metal_0050_1k_bvFzT8/
  ├── metal_0058_1k_ZmmcU2/
  ├── metal_0044_1k_QzepB1/
  ├── metal_0049_1k_1dmpSz/
  ├── metal_0019_1k_NrVP9t/
  └── metal_0016_1k_bN2ZC3/
```

#### Формат имён файлов текстур

Внутри каждой папки должны быть следующие текстуры:
- `[type]_[id]_color_1k.jpg` - Текстура цвета
- `[type]_[id]_normal_directx_1k.png` - Карта нормалей
- `[type]_[id]_roughness_1k.jpg` - Карта шероховатости
- `[type]_[id]_ao_1k.jpg` - Карта окклюзии окружения
- `[type]_[id]_metallic_1k.jpg` - Карта металличности (только для металлических текстур)

Где:
- `[type]` - тип текстуры (wood, metal, fabrics и т.д.)
- `[id]` - идентификатор текстуры (обычно 4-значное число)

#### Интеграция новых текстур в UI

После добавления новых текстур в файловую систему, необходимо обновить переменную `textureOptions` в файле `src/components/ui/textures/textureOptions.ts`:

```js
const textureOptions = [
  { value: "", label: "Без текстуры" },
  { value: "/textures/example/wood_0066_1k_HoQeAg", label: "Дерево (PBR)" },
  { value: "/textures/example/metal_0067_1k_AdqCdW", label: "Металл 1 (PBR)" },
  // Добавьте новую текстуру сюда
  { value: "/textures/example/your_new_texture", label: "Название новой текстуры" },
];
```

### Настройки PBR материалов

Проект поддерживает широкий спектр настроек для PBR материалов, которые можно настраивать через интерфейс:

- **Основной цвет (Color)** - базовый цвет поверхности
- **Шероховатость (Roughness)** - от 0 (зеркальная поверхность) до 1 (матовая)
- **Металличность (Metalness)** - от 0 (неметаллический) до 1 (металлический)
- **Эмиссия (Emission)** - свечение поверхности, включает настройки цвета и интенсивности
- **Прозрачность (Transparency)** - позволяет настроить прозрачность материала
- **Преломление (Refraction)** - индекс преломления для стеклоподобных материалов
- **Анизотропность (Anisotropy)** - для создания направленных бликов на металлических поверхностях

## Наследование цветов и автоматическая стилизация

В проекте реализована система автоматического наследования цветов для обеспечения гармоничного дизайна:

1. **Поручни** автоматически наследуют цвет стен (с осветлением на 20%), когда меняется цвет стен.

2. **Панель управления** комплексно наследует цвет стен:
   - Основа панели использует цвет стен с высокой металличностью
   - Внутренняя часть панели использует осветленный цвет стен (на 20%)
   - Кнопки используют еще более светлый вариант цвета стен (на 35%)
   - Рамка/углубление панели использует затемненный цвет стен (на 20%)
   - Экран панели использует осветленный цвет стен (на 30%)
   - Обводка кнопок использует еще более светлый вариант цвета кнопок

3. **Декоративные полосы** могут быть настроены под общий стиль с возможностью выбора цвета.

4. **Зеркало** адаптируется к общему стилю с настраиваемыми параметрами.

## Готовые пресеты материалов 

Проект включает набор готовых пресетов материалов для быстрой стилизации лифта:

- **Стандартный** - базовое светлое оформление
- **Золотой** - роскошная отделка с золотыми поверхностями
- **Бронзовый** - классическая бронзовая отделка
- **Серебряный** - современный стиль с серебристыми поверхностями
- **Медный** - теплый медный стиль
- **Классическое дерево** - отделка с деревянными текстурами
- **Матовый металл** - современная отделка с матовыми металлическими поверхностями
- **Элегантный тёмный** - премиальный темный дизайн

## Возможности конфигуратора

### Размеры и форма кабины
- Настройка ширины, высоты и глубины кабины
- Управление положением и высотой камеры
- Открытие/закрытие дверей

### Элементы и детали интерьера
- **Панель управления** с кнопками этажей
- **Поручни** с настраиваемым цветом
- **Декоративные полосы** с настройками количества, ширины, цвета, материала, ориентации и отступов
- **Стыки между стенами** с настройками ширины, цвета и материала
- **Зеркало** с настройками размера, типа и позиции
- **Логотип** на дверях с настройками масштаба и позиции

### Освещение
- Настройка количества светильников
- Выбор цвета и интенсивности освещения
- Настройка рассеивания света
- Включение/выключение подсветки

### Оптимизация производительности
Конфигуратор имеет встроенную систему оптимизации, которая автоматически определяет возможности устройства и настраивает качество рендеринга:

- **Высокое качество** - полная детализация, высокое разрешение текстур, мягкие тени
- **Оптимизированный режим** - упрощенное отображение для устройств с ограниченной производительностью

Вы можете вручную переключаться между режимами качества в отладочной панели.

### Ресурсы для текстур

- https://www.texturecan.com/category/Ground/
- https://ambientcg.com/ - отличный источник бесплатных PBR текстур
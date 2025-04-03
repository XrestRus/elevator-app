# AI Elevator - Конфигуратор 3D лифтов

## Текстуры и материалы
- https://www.texturecan.com/category/

### Добавление новых текстур

Проект поддерживает PBR (Physically Based Rendering) текстуры для реалистичного отображения материалов.

#### Структура директорий текстур

Текстуры размещаются в директории `/app/public/textures/example/`. Каждый набор текстур должен быть в отдельной папке с соответствующим названием.

```
/app/public/textures/example/
  ├── wood_0066_1k_HoQeAg/
  ├── metal_0067_1k_AdqCdW/
  ├── metal_0071_1k_HD5XFx/
  ├── metal_0081_1k_qh6kbG/
  ├── metal_0082_1k_je0RXH/
  ├── metal_0083_1k_r9ZJJl/
  └── metal_0084_1k_uJitA0/
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

После добавления новых текстур в файловую систему, необходимо обновить компонент `TextureControls` в файле `app/src/components/ui/tabs/MaterialsTab.tsx`:

```js
const textureOptions = [
  { value: "", label: "Без текстуры" },
  { value: "/textures/example/wood_0066_1k_HoQeAg", label: "Дерево (PBR)" },
  { value: "/textures/example/metal_0067_1k_AdqCdW", label: "Металл 1 (PBR)" },
  // Добавьте новую текстуру сюда
  { value: "/textures/example/your_new_texture", label: "Название новой текстуры" },
];
```

### Ресурсы для текстур

- https://www.texturecan.com/category/Ground/
- https://ambientcg.com/ - отличный источник бесплатных PBR текстур
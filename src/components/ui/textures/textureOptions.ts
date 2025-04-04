/**
 * Интерфейс для опции текстуры
 */
export interface TextureOption {
  value: string;
  label: string;
  group: string;
}

/**
 * Опции текстур, доступные для выбора.
 * Для добавления новых текстур:
 * 1. Добавьте папку с PBR-текстурами в app/public/textures/example/
 * 2. Добавьте новый элемент в массив textureOptions, где:
 *    - value: путь к директории с текстурами (относительно public)
 *    - label: отображаемое имя текстуры в интерфейсе
 *    - group: группа текстуры для визуального разделения
 */
export const textureOptions: TextureOption[] = [
  { value: "", label: "Без текстуры", group: "" },
  
  // Деревянные текстуры
  { value: "/textures/example/wood_0066_1k_HoQeAg", label: "Дерево (тёмное)", group: "Деревянные" },
  { value: "/textures/example/wood_0014_1k_T4cRBN", label: "Дерево (светлое)", group: "Деревянные" },
  { value: "/textures/example/wood_0018_1k_sQTe3f", label: "Дерево (натуральное)", group: "Деревянные" },
  
  // Металлические текстуры
  { value: "/textures/example/metal_0016_1k_bN2ZC3", label: "Металл (матовый)", group: "Металлические" },
  { value: "/textures/example/metal_0019_1k_NrVP9t", label: "Металл (полированный)", group: "Металлические" },
  { value: "/textures/example/metal_0044_1k_QzepB1", label: "Металл (текстурный)", group: "Металлические" },
  { value: "/textures/example/metal_0049_1k_1dmpSz", label: "Металл (состаренный)", group: "Металлические" },
  { value: "/textures/example/metal_0050_1k_bvFzT8", label: "Металл (декоративный)", group: "Металлические" },
  { value: "/textures/example/metal_0058_1k_ZmmcU2", label: "Металл (перфорированный)", group: "Металлические" },
  { value: "/textures/example/metal_0071_1k_HD5XFx", label: "Металл (тёмный)", group: "Металлические" },
  { value: "/textures/example/metal_0081_1k_qh6kbG", label: "Металл (узорчатый)", group: "Металлические" },
  { value: "/textures/example/metal_0082_1k_je0RXH", label: "Металл (рифлёный)", group: "Металлические" },
  { value: "/textures/example/metal_0083_1k_r9ZJJl", label: "Металл (золотистый)", group: "Металлические" },
  { value: "/textures/example/metal_0084_1k_uJitA0", label: "Металл (серебристый)", group: "Металлические" },
  // Нестабильные металлические текстуры (временно отключены)
  { value: "/textures/example/metal_0006_1k_gq9Cws", label: "Металл (брашированный)", group: "Металлические" },
  { value: "/textures/example/metal_0007_1k_h5TdNf", label: "Металл (сатиновый)", group: "Металлические" },
  
  // Плитки
  { value: "/textures/example/tiles_0128_1k_18Xy17", label: "Плитка (керамическая)", group: "Плитка" },
  
  // Грунтовые текстуры
  { value: "/textures/example/ground_0023_1k_pnMe9c", label: "Поверхность (камень)", group: "Поверхности" },
  { value: "/textures/example/ground_0045_1k_JNjeUj", label: "Поверхность (бетон)", group: "Поверхности" }
]; 
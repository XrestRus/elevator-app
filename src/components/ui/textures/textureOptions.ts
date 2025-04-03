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
  { value: "/textures/example/wood_0066_1k_HoQeAg", label: "Дерево (тёмное)", group: "Деревянные" },
  { value: "/textures/example/metal_0016_1k_bN2ZC3", label: "Матовый металл", group: "Металлические" },
  { value: "/textures/example/metal_0019_1k_NrVP9t", label: "Металл (полированный)", group: "Металлические" },
  { value: "/textures/example/metal_0044_1k_QzepB1", label: "Металл (текстурный)", group: "Металлические" },
  { value: "/textures/example/metal_0049_1k_1dmpSz", label: "Металл (состаренный)", group: "Металлические" },
  { value: "/textures/example/metal_0050_1k_bvFzT8", label: "Металл (декоративный)", group: "Металлические" },
  { value: "/textures/example/metal_0058_1k_ZmmcU2", label: "Металл (перфорированный)", group: "Металлические" },
  { value: "/textures/example/metal_0071_1k_HD5XFx", label: "Металл (тёмный)", group: "Металлические" },
  { value: "/textures/example/metal_0081_1k_qh6kbG", label: "Металл (узорчатый)", group: "Металлические" },
  { value: "/textures/example/metal_0082_1k_je0RXH", label: "Металл (рифлёный)", group: "Металлические" },
  { value: "/textures/example/metal_0083_1k_r9ZJJl", label: "Металл (золотистый)", group: "Металлические" },
  { value: "/textures/example/metal_0084_1k_uJitA0", label: "Металл (серебристый)", group: "Металлические" }
]; 
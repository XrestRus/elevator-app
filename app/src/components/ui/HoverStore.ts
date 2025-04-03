import { create } from "zustand";
import { HoverableObject } from "../../hooks/useObjectHover";

/**
 * Хранилище для централизованного управления данными взаимодействия с объектами сцены
 */
interface HoverStore {
  hoveredObject: HoverableObject | null;
  mousePosition: { x: number; y: number } | null;
  selectedObject: HoverableObject | null;
  setHoveredObject: (object: HoverableObject | null) => void;
  setMousePosition: (position: { x: number; y: number } | null) => void;
  setSelectedObject: (object: HoverableObject | null) => void;
}

/**
 * Глобальное хранилище состояния для работы с наведенными и выбранными объектами
 */
export const useHoverStore = create<HoverStore>((set) => ({
  hoveredObject: null,
  mousePosition: null,
  selectedObject: null,
  setHoveredObject: (object) => set({ hoveredObject: object }),
  setMousePosition: (position) => set({ mousePosition: position }),
  setSelectedObject: (object) => set({ selectedObject: object }),
})); 
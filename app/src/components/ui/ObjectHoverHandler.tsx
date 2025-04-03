import React from "react";
import { useObjectHover } from "../../hooks/useObjectHover";
import { useHoverStore } from "./HoverStore";
import { useFrame, useThree } from "@react-three/fiber";

/**
 * Компонент для обработки наведения мыши на объекты в сцене и их выбора кликом
 * 
 * Принцип работы системы отслеживания и взаимодействия:
 * 1. Компонент получает данные о наведенных объектах от хука useObjectHover
 * 2. Обрабатывает клики пользователя на canvas и определяет тип взаимодействия:
 *    - Одинарный клик: выбирает объект, если у него установлен requiresDoubleClick=false
 *    - Двойной клик: выбирает объект, если у него requiresDoubleClick=true
 * 3. Использует глобальное хранилище (zustand) для хранения состояния:
 *    - hoveredObject: объект, на который наведен курсор
 *    - selectedObject: выбранный пользователем объект
 *    - mousePosition: координаты мыши для позиционирования тултипа
 * 4. Интегрируется с компонентом MakeHoverable через флаг requiresDoubleClick
 * 5. Обновляет состояние на каждом кадре через useFrame для синхронизации с рендерингом
 * 
 * Этот компонент должен быть добавлен как дочерний к Canvas
 */
const ObjectHoverHandler: React.FC = () => {
  // Используем наш хук для отслеживания наведения мыши на объекты
  const { hoveredObject, mousePosition } = useObjectHover();
  const { setHoveredObject, setMousePosition, setSelectedObject } =
    useHoverStore();
  const { gl } = useThree();

  // Временные переменные для отслеживания двойного клика
  const lastClickTimeRef = React.useRef<number>(0);
  const clickCounterRef = React.useRef<number>(0);

  // Устанавливаем обработчик клика
  React.useEffect(() => {
    // Обработчик клика для выбора объекта
    const handleClick = () => {
      const currentTime = Date.now();

      // Если есть наведенный объект
      if (hoveredObject) {
        // Проверяем, требуется ли двойной клик для выбора
        const requiresDoubleClick =
          hoveredObject.userData?.requiresDoubleClick !== false;

        if (requiresDoubleClick) {
          // Обработка двойного клика
          if (currentTime - lastClickTimeRef.current < 300) {
            // Двойной клик - увеличиваем счетчик
            clickCounterRef.current += 1;

            // Если счетчик достиг 2, это двойной клик
            if (clickCounterRef.current >= 2) {
              setSelectedObject(hoveredObject);
              // Сбрасываем счетчик после двойного клика
              clickCounterRef.current = 0;
            }
          } else {
            // Одиночный клик - сбрасываем счетчик
            clickCounterRef.current = 1;
          }
        } else {
          // Объект выбирается по одиночному клику
          setSelectedObject(hoveredObject);
        }
      }

      // Обновляем время последнего клика
      lastClickTimeRef.current = currentTime;
    };

    const canvas = gl.domElement;
    canvas.addEventListener("click", handleClick);

    return () => {
      canvas.removeEventListener("click", handleClick);
    };
  }, [gl, hoveredObject, setSelectedObject]);

  // Используем useFrame для обновления хранилища на каждом кадре
  // Это позволяет избежать проблем с синхронизацией рендеринга
  useFrame(() => {
    setHoveredObject(hoveredObject);
    setMousePosition(mousePosition);
  });

  return null;
};

export default ObjectHoverHandler;

import React, { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import FrameTab from "./tabs/FrameTab.tsx";
import MaterialsTab from "./tabs/MaterialsTab.tsx";
import ElementsTab from "./tabs/ElementsTab.tsx";
import "../../styles/UIPanel.css";

/**
 * Основной компонент панели управления UI
 * Содержит вкладки для управления различными аспектами лифта
 */
const UIPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"frame" | "materials" | "elements">("frame");
  const [isPanelOpen, setIsPanelOpen] = useState(true);
  const elevator = useSelector((state: RootState) => state.elevator);

  /**
   * Переключение между различными вкладками UI
   */
  const renderTabContent = () => {
    switch (activeTab) {
      case "frame":
        return <FrameTab elevator={elevator} />;
      case "materials":
        return <MaterialsTab elevator={elevator} />;
      case "elements":
        return <ElementsTab elevator={elevator} />;
      default:
        return <FrameTab elevator={elevator} />;
    }
  };

  /**
   * Переключение видимости панели управления
   */
  const togglePanel = () => {
    setIsPanelOpen(!isPanelOpen);
  };

  return (
    <div className={`ui-panel ${!isPanelOpen ? 'collapsed' : ''}`}>
      {/* Кнопка скрытия/показа панели */}
      <button
        onClick={togglePanel}
        className="ui-panel-toggle"
        title={isPanelOpen ? "Свернуть панель" : "Развернуть панель"}
      >
        {isPanelOpen ? ">" : "<"}
      </button>

      {/* Заголовок панели */}
      <div className="ui-panel-header">
        <h2>Конфигуратор лифта</h2>
        <p>Настройте параметры лифта по вашему желанию</p>
      </div>

      {/* Вкладки панели */}
      <div className="ui-panel-tabs">
        <button
          className={`ui-panel-tab ${activeTab === "frame" ? 'active' : ''}`}
          onClick={() => setActiveTab("frame")}
        >
          Каркас
        </button>
        <button
          className={`ui-panel-tab ${activeTab === "materials" ? 'active' : ''}`}
          onClick={() => setActiveTab("materials")}
        >
          Материалы
        </button>
        <button
          className={`ui-panel-tab ${activeTab === "elements" ? 'active' : ''}`}
          onClick={() => setActiveTab("elements")}
        >
          Элементы
        </button>
      </div>

      {/* Содержимое активной вкладки */}
      <div className="ui-panel-content">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default UIPanel; 

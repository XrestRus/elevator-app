import React, { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import FrameTab from "./tabs/FrameTab.tsx";
import MaterialsTab from "./tabs/MaterialsTab.tsx";
import ElementsTab from "./tabs/ElementsTab.tsx";

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
    <div
      style={{
        position: "absolute",
        right: isPanelOpen ? "0" : "-310px",
        top: "0",
        width: "310px",
        height: "100%",
        backgroundColor: "rgba(255, 255, 255, 0.85)",
        boxShadow: "-2px 0 10px rgba(0, 0, 0, 0.2)",
        transition: "right 0.3s ease-in-out",
        display: "flex",
        flexDirection: "column",
        backdropFilter: "blur(10px)",
        borderLeft: "1px solid rgba(200, 200, 200, 0.5)",
        zIndex: 1000,
        color: "#000",
      }}
    >
      {/* Кнопка скрытия/показа панели */}
      <button
        onClick={togglePanel}
        style={{
          position: "absolute",
          left: "-30px",
          top: "50%",
          transform: "translateY(-50%)",
          width: "30px",
          height: "60px",
          backgroundColor: "rgba(255, 255, 255, 0.85)",
          border: "1px solid rgba(200, 200, 200, 0.5)",
          borderRight: "none",
          borderTopLeftRadius: "8px",
          borderBottomLeftRadius: "8px",
          cursor: "pointer",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          boxShadow: "-2px 0 10px rgba(0, 0, 0, 0.1)",
          backdropFilter: "blur(10px)",
          color: "#000",
        }}
      >
        {isPanelOpen ? ">" : "<"}
      </button>

      {isPanelOpen && (
        <>
          {/* Заголовок панели */}
          <div
            style={{
              padding: "16px",
              borderBottom: "1px solid rgba(200, 200, 200, 0.5)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <h2 style={{ margin: 0, fontSize: "18px", fontWeight: "bold" }}>
              Конфигуратор лифта
            </h2>
            <p style={{ margin: "8px 0 0", fontSize: "12px", color: "#666" }}>
              Настройте параметры лифта по вашему желанию
            </p>
          </div>

          {/* Вкладки панели */}
          <div
            style={{
              display: "flex",
              borderBottom: "1px solid rgba(200, 200, 200, 0.5)",
            }}
          >
            <TabButton
              active={activeTab === "frame"}
              onClick={() => setActiveTab("frame")}
              label="Каркас"
            />
            <TabButton
              active={activeTab === "materials"}
              onClick={() => setActiveTab("materials")}
              label="Материалы"
            />
            <TabButton
              active={activeTab === "elements"}
              onClick={() => setActiveTab("elements")}
              label="Элементы"
            />
          </div>

          {/* Содержимое активной вкладки */}
          <div
            style={{
              padding: "16px",
              flexGrow: 1,
              overflowY: "auto",
            }}
          >
            {renderTabContent()}
          </div>
        </>
      )}
    </div>
  );
};

/**
 * Компонент кнопки для переключения вкладок
 */
interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  label: string;
}

const TabButton: React.FC<TabButtonProps> = ({ active, onClick, label }) => {
  return (
    <button
      onClick={onClick}
      style={{
        flex: 1,
        padding: "12px 8px",
        background: active ? "#f0f0f0" : "transparent",
        border: "none",
        borderBottom: active ? "2px solid #4299e1" : "none",
        cursor: "pointer",
        fontWeight: active ? "bold" : "normal",
        color: active ? "#4299e1" : "#333",
        transition: "all 0.2s ease",
      }}
    >
      {label}
    </button>
  );
};

export default UIPanel; 

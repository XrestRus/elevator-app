import React from "react";

/**
 * Интерфейс пропсов для компонента RangeSlider
 */
interface RangeSliderProps {
  label: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (value: number) => void;
  leftLabel?: string;
  rightLabel?: string;
  centerLabel?: (value: number) => string;
  disabled?: boolean;
}

/**
 * Компонент ползунка с настраиваемыми метками
 */
export const RangeSlider: React.FC<RangeSliderProps> = ({
  label,
  min,
  max,
  step,
  value,
  onChange,
  leftLabel,
  rightLabel,
  centerLabel = (value) => value.toString(),
  disabled = false,
}) => {
  return (
    <div style={{ marginBottom: "8px", color: "#000" }}>
      <label style={{ display: "block", marginBottom: "4px", color: "#000" }}>{label}</label>
      <input
        type="range"
        min={min.toFixed(2).toString()}
        max={max.toFixed(2).toString()}
        step={step.toString()}
        value={value}
        onChange={(e) => {
          const newValue = parseFloat(e.target.value);
          onChange(newValue);
        }}
        style={{ width: "100%" }}
        disabled={disabled}
      />
      <div style={{ display: "flex", justifyContent: "space-between", color: "#000" }}>
        <span>{leftLabel || min.toFixed(2).toString()}</span>
        <span>{centerLabel(value)}</span>
        <span>{rightLabel || max.toFixed(2).toString()}</span>
      </div>
    </div>
  );
};

/**
 * Интерфейс пропсов для компонента ColorPicker
 */
interface ColorPickerProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

/**
 * Компонент выбора цвета с отображением текущего значения
 */
export const ColorPicker: React.FC<ColorPickerProps> = ({
  label,
  value,
  onChange,
}) => {
  return (
    <div style={{ marginBottom: "8px", color: "#000" }}>
      <label style={{ display: "block", marginBottom: "4px", color: "#000" }}>{label}</label>
      <div style={{ display: "flex", alignItems: "center" }}>
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{ marginRight: "8px" }}
        />
        <span style={{ color: "#000" }}>{value}</span>
      </div>
    </div>
  );
};

/**
 * Интерфейс опции для селектора
 */
export interface SelectOption {
  value: string;
  label: string;
}

/**
 * Интерфейс для группированных опций селектора
 */
export interface SelectOptionGroup {
  label: string;
  options: SelectOption[];
}

/**
 * Тип, объединяющий обычные опции и группы опций
 */
export type SelectOptionOrGroup = SelectOption | SelectOptionGroup;

/**
 * Интерфейс пропсов для компонента SelectInput
 */
interface SelectInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectOptionOrGroup[];
}

/**
 * Компонент выпадающего списка
 */
export const SelectInput: React.FC<SelectInputProps> = ({
  label,
  value,
  onChange,
  options,
}) => {
  return (
    <div style={{ marginBottom: "8px", color: "#000" }}>
      <label style={{ display: "block", marginBottom: "4px", color: "#000" }}>{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{ 
          width: "100%", 
          padding: "4px", 
          color: "#000",
          backgroundColor: "#fff"
        }}
      >
        {options.map((option) => {
          // Проверяем, является ли опция группой
          if ('options' in option) {
            return (
              <optgroup key={option.label} label={option.label}>
                {option.options.map((subOption) => (
                  <option 
                    key={subOption.value} 
                    value={subOption.value} 
                    style={{ 
                      color: "#000",
                      backgroundColor: "#fff" 
                    }}
                  >
                    {subOption.label}
                  </option>
                ))}
              </optgroup>
            );
          }
          
          // Обычная опция
          return (
            <option 
              key={option.value} 
              value={option.value} 
              style={{ 
                color: "#000",
                backgroundColor: "#fff" 
              }}
            >
              {option.label}
            </option>
          );
        })}
      </select>
    </div>
  );
};

/**
 * Интерфейс пропсов для компонента PresetButton
 */
interface PresetButtonProps {
  label: string;
  onClick: () => void;
  fullWidth?: boolean;
}

/**
 * Кнопка пресета для быстрого применения настроек
 */
export const PresetButton: React.FC<PresetButtonProps> = ({
  label,
  onClick,
  fullWidth = false,
}) => {
  return (
    <button
      style={{
        padding: "8px",
        backgroundColor: "#f0f0f0",
        border: "1px solid #ccc",
        borderRadius: "4px",
        cursor: "pointer",
        width: fullWidth ? "100%" : "auto",
        marginBottom: "8px",
        marginRight: fullWidth ? 0 : "8px",
        color: "#000"
      }}
      onClick={onClick}
    >
      {label}
    </button>
  );
};

/**
 * Интерфейс пропсов для компонента CheckboxInput
 */
interface CheckboxInputProps {
  id: string;
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

/**
 * Компонент чекбокса с меткой
 */
export const CheckboxInput: React.FC<CheckboxInputProps> = ({
  id,
  label,
  checked,
  onChange,
}) => {
  return (
    <div style={{ marginBottom: "8px", display: "flex", alignItems: "center", color: "#000" }}>
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        style={{ marginRight: "8px" }}
      />
      <label htmlFor={id} style={{ color: "#000" }}>{label}</label>
    </div>
  );
}; 
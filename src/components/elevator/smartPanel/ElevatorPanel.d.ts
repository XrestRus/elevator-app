import { FC } from "react";

interface ElevatorPanelProps {
  position: [number, number, number];
  lightsOn: boolean;
  wallColor: string;
}

/**
 * Компонент панели управления лифтом с кнопками, индикаторами и экраном
 */
export interface ElevatorPanelProps {
  position: [number, number, number];
  lightsOn: boolean;
  wallColor: string;
  panelColor: string;
}

declare const ElevatorPanel: FC<ElevatorPanelProps>;

export default ElevatorPanel; 
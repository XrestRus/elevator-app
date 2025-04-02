import { FC } from "react";

interface ElevatorPanelProps {
  position: [number, number, number];
  lightsOn: boolean;
  wallColor: string;
}

declare const ElevatorPanel: FC<ElevatorPanelProps>;

export default ElevatorPanel; 
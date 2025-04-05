import { Stage as S } from 'konva/lib/Stage';

import { DrawType } from '../../types';

export interface ToolbarProps {
  setDrawType: React.Dispatch<React.SetStateAction<DrawType>>;
  setImage: React.Dispatch<React.SetStateAction<HTMLImageElement | undefined>>;
  clearStage: () => void;
  stageRef: React.RefObject<S | null>;
  drawType: DrawType;
}

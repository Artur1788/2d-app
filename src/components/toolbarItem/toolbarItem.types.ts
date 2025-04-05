import { LucideIcon } from 'lucide-react';

import { DrawType } from '../../types';

export interface ToolbarItemProps {
  type: DrawType;
  drawType: DrawType;
  selectTool: (tool: DrawType) => void;
  icon: LucideIcon;
}

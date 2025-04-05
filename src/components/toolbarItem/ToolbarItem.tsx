import { FC } from 'react';

import { ToolbarItemProps } from './toolbarItem.types';

export const ToolbarItem: FC<ToolbarItemProps> = ({
  drawType,
  type,
  selectTool,
  icon: Icon,
}) => {
  return (
    <button
      className={`bg-slate-100 uppercase p-2 rounded-md transition-colors duration-150 cursor-pointer ${drawType === type ? 'bg-teal-400 text-white' : 'hover:bg-slate-200'}`}
      onClick={() => selectTool(type)}
      title={type.toUpperCase()}
    >
      <Icon className='w-6 h-6' />
    </button>
  );
};

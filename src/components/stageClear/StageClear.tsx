import { FC } from 'react';

import { Trash2 } from 'lucide-react';

import { StageClearProps } from './stageClear.types';

export const StageClear: FC<StageClearProps> = ({ clearStage }) => {
  return (
    <button
      className='bg-slate-100 hover:bg-slate-200 p-2 rounded-md transition-colors duration-150 cursor-pointer'
      onClick={clearStage}
      title='Clear Stage'
    >
      <Trash2 className='w-6 h-6' />
    </button>
  );
};

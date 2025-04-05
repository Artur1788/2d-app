import { FC } from 'react';

import { Download } from 'lucide-react';

import { ExportImageProps } from './exportImage.types';

export const ExportImage: FC<ExportImageProps> = ({ exportImage }) => {
  return (
    <button
      className='flex items-center gap-x-2 bg-slate-100 hover:bg-slate-200 p-2 rounded-md transition-colors duration-150 cursor-pointer'
      onClick={exportImage}
    >
      <Download className='w-6 h-6' />
      <p>Export Image</p>
    </button>
  );
};

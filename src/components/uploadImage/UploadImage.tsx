import { FC } from 'react';

import { Import } from 'lucide-react';

import { UploadImageProps } from './uploadImage.types';

export const UploadImage: FC<UploadImageProps> = ({ uploadImage }) => {
  return (
    <div className='bg-slate-100 hover:bg-slate-200 rounded-md transition-colors duration-150 cursor-pointer [&>*]:cursor-pointer'>
      <label className='flex gap-x-2 p-2 w-full'>
        <Import className='w-6 h-6' />
        Upload Image
        <input
          type='file'
          className='hidden'
          accept='image/*'
          onChange={uploadImage}
        />
      </label>
    </div>
  );
};

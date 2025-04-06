import { FC } from 'react';

import { LoaderCircle } from 'lucide-react';

export const Loader: FC = () => {
  return (
    <div className='flex justify-center items-center w-full h-dvh'>
      <LoaderCircle className='w-8 h-8 text-teal-500 animate-spin' />
    </div>
  );
};

import { ChangeEventHandler, FC, memo } from 'react';

import { Circle, Pencil, Square, SquareMousePointer } from 'lucide-react';

import { CIRCLE, PENCIL, RECTANGLE, SELECT, SIZE } from '../../consts';
import { ExportImage, StageClear, ToolbarItem, UploadImage } from '..';
import { ToolbarProps } from './toolbar.types';
import { DrawType } from '../../types';
import { downloadImage } from '../../utils';

export const Toolbar: FC<ToolbarProps> = memo(
  ({ clearStage, drawType, setDrawType, setImage, stageRef }) => {
    const selectTool = (tool: DrawType) => {
      setDrawType(tool);
    };

    const exportImage = () => {
      const dataURI = stageRef.current?.toDataURL({ pixelRatio: 3 });
      if (!dataURI) return;
      downloadImage(dataURI);
    };

    const uploadImage: ChangeEventHandler<HTMLInputElement> = (e) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const imageUrl = URL.createObjectURL(file);
      const image = new Image(SIZE / 3, SIZE / 3);
      image.src = imageUrl;
      setImage(image);

      e.target.files = null;
      e.target.value = '';
    };

    return (
      <div className='flex flex-wrap justify-center items-center gap-x-6 mb-20'>
        <div className='flex justify-center items-center gap-x-4 p-4'>
          <ToolbarItem
            type={SELECT}
            drawType={drawType}
            selectTool={selectTool}
            icon={SquareMousePointer}
          />
          <ToolbarItem
            type={RECTANGLE}
            drawType={drawType}
            selectTool={selectTool}
            icon={Square}
          />
          <ToolbarItem
            type={CIRCLE}
            drawType={drawType}
            selectTool={selectTool}
            icon={Circle}
          />
          <ToolbarItem
            type={PENCIL}
            drawType={drawType}
            selectTool={selectTool}
            icon={Pencil}
          />
          <StageClear clearStage={clearStage} />
        </div>
        <div className='flex justify-center items-center gap-x-4 p-4'>
          <UploadImage uploadImage={uploadImage} />
          <ExportImage exportImage={exportImage} />
        </div>
      </div>
    );
  }
);

import { FC, useCallback, useRef, useState } from 'react';

import { Stage, Layer, Image, Rect } from 'react-konva';
import { Stage as S } from 'konva/lib/Stage';

import { SELECT, SIZE } from '../../consts';
import { DrawType } from '../../types';
import { Toolbar } from '../toolbar/Toolbar';

export const Paint: FC = () => {
  const [drawType, setDrawType] = useState<DrawType>(SELECT);
  const [image, setImage] = useState<HTMLImageElement | undefined>(undefined);
  const stageRef = useRef<S | null>(null);

  const clearStage = useCallback(() => {
    setDrawType(SELECT);
    setImage(undefined);
  }, []);

  return (
    <div className='flex flex-col items-center w-full'>
      <Toolbar
        setDrawType={setDrawType}
        setImage={setImage}
        clearStage={clearStage}
        stageRef={stageRef}
        drawType={drawType}
      />

      <Stage
        ref={stageRef}
        height={SIZE}
        width={SIZE}
      >
        <Layer>
          {/* Background rectangle for exported canvas */}
          <Rect
            x={0}
            y={0}
            width={SIZE}
            height={SIZE}
            fill='white'
          />
          {image && (
            <Image
              x={0}
              y={0}
              image={image}
              width={SIZE / 3}
              height={SIZE / 3}
            />
          )}
        </Layer>
      </Stage>
    </div>
  );
};

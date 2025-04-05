import { FC, useCallback, useRef, useState } from 'react';

import { Stage, Layer, Image, Rect, Group, Circle, Line } from 'react-konva';
import { Stage as S } from 'konva/lib/Stage';
import { v4 as uuidv4 } from 'uuid';

import { CIRCLE, PENCIL, RECTANGLE, SELECT, SIZE } from '../../consts';
import { DrawType } from '../../types';
import { Toolbar } from '../toolbar/Toolbar';
import { IRectangle, ICircle, ILine } from './paint.types';

export const Paint: FC = () => {
  const [drawType, setDrawType] = useState<DrawType>(SELECT);
  const [image, setImage] = useState<HTMLImageElement | undefined>(undefined);
  const [rects, setRects] = useState<IRectangle[]>([]);
  const [circles, setCircles] = useState<ICircle[]>([]);
  const [lines, setLines] = useState<ILine[]>([]);
  const stageRef = useRef<S | null>(null);
  const isPaintingRef = useRef<boolean>(false);
  const currentShapeIdRef = useRef<string>('');

  const clearStage = useCallback(() => {
    setDrawType(SELECT);
    setImage(undefined);
    setCircles([]);
    setRects([]);
    setLines([]);
  }, []);

  const onStageMouseDown = () => {
    if (drawType === SELECT) return;

    isPaintingRef.current = true;
    const stageEl = stageRef.current;
    const pointerPosition = stageEl?.getPointerPosition();
    const x = pointerPosition?.x || 0;
    const y = pointerPosition?.y || 0;
    const id = uuidv4();
    currentShapeIdRef.current = id;

    switch (drawType) {
      case RECTANGLE:
        setRects((prevRects) => [
          ...prevRects,
          {
            id,
            x,
            y,
            width: 1,
            height: 1,
          },
        ]);
        break;
      case CIRCLE:
        setCircles((prevCircles) => [
          ...prevCircles,
          {
            id,
            x,
            y,
            radius: 1,
          },
        ]);
        break;
      case PENCIL:
        setLines((prevLines) => [
          ...prevLines,
          {
            id,
            points: [x, y],
          },
        ]);
        break;
      default:
        break;
    }
  };

  const onStageMouseMove = () => {
    if (drawType === SELECT || !isPaintingRef.current) return;

    const stageEl = stageRef.current;
    const pointerPosition = stageEl?.getPointerPosition();
    const x = pointerPosition?.x || 0;
    const y = pointerPosition?.y || 0;

    switch (drawType) {
      case RECTANGLE:
        setRects((prevRects) =>
          prevRects.map((prevRect) =>
            prevRect.id === currentShapeIdRef.current
              ? {
                  ...prevRect,
                  height: y - prevRect.y,
                  width: x - prevRect.x,
                }
              : prevRect
          )
        );
        break;
      case CIRCLE:
        setCircles((prevCircles) =>
          prevCircles.map((prevCircle) =>
            prevCircle.id === currentShapeIdRef.current
              ? {
                  ...prevCircle,
                  radius: Math.sqrt(
                    Math.pow(x - prevCircle.x, 2) +
                      Math.pow(y - prevCircle.y, 2)
                  ),
                }
              : prevCircle
          )
        );
        break;
      case PENCIL:
        setLines((prevLines) =>
          prevLines.map((prevLine) =>
            prevLine.id === currentShapeIdRef.current
              ? {
                  ...prevLine,
                  points: [...prevLine.points, x, y],
                }
              : prevLine
          )
        );
        break;
      default:
        break;
    }
  };

  const onStageMouseUp = () => {
    stageRef.current?.removeEventListener('mousemove');
    isPaintingRef.current = false;
  };

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
        onMouseDown={onStageMouseDown}
        onMouseUp={onStageMouseUp}
        onMouseMove={isPaintingRef.current ? onStageMouseMove : undefined}
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
        <Layer>
          <Group>
            {!!rects.length &&
              rects.map((rect) => (
                <Rect
                  key={rect.id}
                  id={rect.id}
                  x={rect.x}
                  y={rect.y}
                  width={rect.width}
                  height={rect.height}
                  stroke={'black'}
                  strokeWidth={3}
                />
              ))}
          </Group>
          <Group>
            {!!circles.length &&
              circles.map((circle) => (
                <Circle
                  key={circle.id}
                  id={circle.id}
                  x={circle.x}
                  y={circle.y}
                  radius={circle.radius}
                  stroke={'black'}
                  strokeWidth={3}
                />
              ))}
          </Group>
          <Group>
            {!!lines.length &&
              lines.map((line) => (
                <Line
                  key={line.id}
                  id={line.id}
                  points={line.points}
                  lineCap='round'
                  lineJoin='round'
                  stroke={'black'}
                  strokeWidth={5}
                />
              ))}
          </Group>
        </Layer>
      </Stage>
    </div>
  );
};

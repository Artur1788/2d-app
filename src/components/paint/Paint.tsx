import { FC, useCallback, useRef, useState } from 'react';

import {
  Circle,
  Group,
  Image,
  Layer,
  Line,
  Rect,
  Stage,
  Transformer,
} from 'react-konva';

import { KonvaEventObject } from 'konva/lib/Node';
import { Stage as S } from 'konva/lib/Stage';
import { Transformer as T } from 'konva/lib/shapes/Transformer';
import { v4 as uuidv4 } from 'uuid';

import {
  CIRCLE,
  MIN_SIZE,
  PENCIL,
  RECTANGLE,
  SELECT,
  SIZE,
} from '../../consts';
import { DrawType } from '../../types';
import { Toolbar } from '../toolbar/Toolbar';
import { ICircle, ILine, IRectangle } from './paint.types';
import { useMatchMedia } from '../../hooks/useMatchMedia';

export const Paint: FC = () => {
  const [drawType, setDrawType] = useState<DrawType>(SELECT);
  const [image, setImage] = useState<HTMLImageElement | undefined>(undefined);
  const [rects, setRects] = useState<IRectangle[]>([]);
  const [circles, setCircles] = useState<ICircle[]>([]);
  const [lines, setLines] = useState<ILine[]>([]);
  const { isMobile } = useMatchMedia();
  const stageRef = useRef<S | null>(null);
  const isPaintingRef = useRef<boolean>(false);
  const currentShapeIdRef = useRef<string>('');
  const cleanupRef = useRef<() => void>(null);
  const transformerRef = useRef<T>(null);
  const isDraggable = drawType === SELECT;

  const clearStage = useCallback(() => {
    setDrawType(SELECT);
    setImage(undefined);
    setCircles([]);
    setRects([]);
    setLines([]);
    transformerRef?.current?.nodes?.([]);
  }, []);

  const onShapeClick = (e: KonvaEventObject<MouseEvent>) => {
    if (drawType !== SELECT) return;
    transformerRef?.current?.nodes?.([e.currentTarget]);
  };

  const onBgClick = () => {
    transformerRef?.current?.nodes?.([]);
  };

  const onStagePointerMove = useCallback(() => {
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
  }, [drawType]);

  const onStagePointerEnd = useCallback(() => {
    cleanupRef.current?.();
    stageRef.current?.off('pointermove', onStagePointerMove);
    isPaintingRef.current = false;
  }, [onStagePointerMove]);

  const onStagePointerDown = useCallback(
    (e: KonvaEventObject<PointerEvent>) => {
      if (drawType === SELECT) return;
      e.evt.preventDefault();

      const stage = stageRef.current;
      if (!stage) return;

      stage?.on('pointermove', onStagePointerMove);
      isPaintingRef.current = true;

      const handleGlobalMove = (e: MouseEvent) => {
        if (!isPaintingRef.current) return;

        const container = stage.container();
        const rect = container.getBoundingClientRect();
        const isOutside =
          e.clientX < rect.left ||
          e.clientX > rect.right ||
          e.clientY < rect.top ||
          e.clientY > rect.bottom;

        if (isOutside) onStagePointerEnd();
      };

      cleanupRef.current?.();

      window.addEventListener('mousemove', handleGlobalMove);
      window.addEventListener('pointerup', onStagePointerEnd);

      cleanupRef.current = () => {
        window.removeEventListener('mousemove', handleGlobalMove);
        window.removeEventListener('pointerup', onStagePointerEnd);
      };

      const pointerPosition = stage?.getPointerPosition();
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
    },
    [drawType, onStagePointerMove, onStagePointerEnd]
  );

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
        width={isMobile ? MIN_SIZE : SIZE}
        height={isMobile ? MIN_SIZE : SIZE}
        onPointerDown={onStagePointerDown}
        onPointerCancel={onStagePointerEnd}
      >
        <Layer>
          {/* Background rectangle for exported canvas */}
          <Rect
            x={0}
            y={0}
            width={isMobile ? MIN_SIZE : SIZE}
            height={isMobile ? MIN_SIZE : SIZE}
            fill='white'
            onPointerClick={onBgClick}
          />
          {image && (
            <Image
              x={0}
              y={0}
              image={image}
              width={SIZE / 3}
              height={SIZE / 3}
              draggable={isDraggable}
              onPointerClick={onShapeClick}
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
                  draggable={isDraggable}
                  onPointerClick={onShapeClick}
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
                  draggable={isDraggable}
                  onPointerClick={onShapeClick}
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
                  draggable={isDraggable}
                  onPointerClick={onShapeClick}
                />
              ))}
          </Group>
        </Layer>
        {drawType === SELECT && (
          <Layer>
            <Transformer ref={transformerRef} />
          </Layer>
        )}
      </Stage>
    </div>
  );
};

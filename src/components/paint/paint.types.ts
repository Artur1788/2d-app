interface Shape {
  id: string;
  x: number;
  y: number;
  stroke?: string;
  strokeWidth?: number;
}

export interface IRectangle extends Shape {
  width: number;
  height: number;
}

export interface ICircle extends Shape {
  radius: number;
}

export interface ILine extends Pick<Shape, 'id'> {
  points: number[];
}

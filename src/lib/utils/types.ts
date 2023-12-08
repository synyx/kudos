import type { StrokeOptions } from 'perfect-freehand';

export type Strokes = {
  strokeOptions: StrokeOptionsWithColor;
  points: number[][];
}[];

export type StrokeOptionsWithColor = StrokeOptions & {
  colorFill: string;
  colorFillOpacity: number;
};

export type ViewMode = 'single' | 'gallery' | 'presentation';

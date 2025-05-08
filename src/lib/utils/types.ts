import type { StrokeOptions } from 'perfect-freehand';

export type Strokes = {
  strokeOptions: StrokeOptionsWithColor;
  points: number[][];
}[];

export type StrokeOptionsWithColor = StrokeOptions & {
  colorFill: string;
  colorFillOpacity: number;
};

export const viewModes = ['single', 'gallery', 'presentation'] as const;

export type ViewMode = typeof viewModes[number];

import type { InferSelectModel } from 'drizzle-orm';
import type { StrokeOptions } from 'perfect-freehand';
import type { KudosTable } from '$lib/server/db/schema';

export type Strokes = {
  strokeOptions: StrokeOptionsWithColor;
  points: number[][];
}[];

export type StrokeOptionsWithColor = StrokeOptions & {
  colorFill: string;
  colorFillOpacity: number;
};

export const viewModes = ['single', 'gallery', 'presentation'] as const;

export type ViewMode = (typeof viewModes)[number];

export type Kudo = InferSelectModel<KudosTable>;

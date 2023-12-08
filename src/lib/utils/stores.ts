import { persisted } from 'svelte-local-storage-store';
import type { ViewMode } from './types';

export const viewMode = persisted<ViewMode>('viewMode', 'presentation');
export const drawSettings = persisted('drawSettings', {
  colorFill: '#000000',
  colorFillOpacity: 1,
  size: 16,
});

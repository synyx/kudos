import { persisted } from 'svelte-persisted-store';
import type { ViewMode } from './types';

export const viewMode = persisted<ViewMode>('viewMode', 'presentation', {
  beforeWrite(val) {
      if(!val) {
        return 'presentation';
      }

      return val;
  },
})

export const drawSettings = persisted('drawSettings', {
  colorFill: '#000000',
  colorFillOpacity: 1,
  size: 16,
});

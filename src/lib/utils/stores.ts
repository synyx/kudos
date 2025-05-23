import { persisted } from 'svelte-persisted-store';

export const createViewModeStore = () => persisted('viewMode', 'presentation');

export const createDrawSettingsStore = () =>
  persisted('drawSettings', {
    colorFill: '#000000',
    colorFillOpacity: 1,
    size: 16,
  });

import { dynamic } from '@sjsf/form/lib/dynamic.svelte';
import { clientOnly } from '@sjsf/form/lib/env';

export { default as textWidget } from './text.svelte';
export { default as numberWidget } from './number.svelte';
export { default as selectWidget } from './select.svelte';
export { default as checkboxWidget } from './checkbox.svelte';
export { default as radioWidget } from './radio.svelte';
export { default as checkboxesWidget } from './checkboxes.svelte';
export { default as fileWidget } from './file.svelte';

export const textareaWidget = dynamic(() => import('./textarea.svelte'));
export const multiSelectWidget = dynamic(() => import('./multi-select.svelte'));
export const daisyui5ToggleWidget = dynamic(() => import('./toggle.svelte'));
export const daisyui5FilterWidget = dynamic(() => import('./filter.svelte'));
export const daisyui5CallyCalendarWidget = clientOnly(() => import('./cally-calendar.svelte'));
export const daisyui5PikadayCalendarWidget = clientOnly(() => import('./pikaday-calendar.svelte'));

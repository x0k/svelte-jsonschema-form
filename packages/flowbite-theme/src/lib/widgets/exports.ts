import { dynamic } from '@sjsf/form/lib/dynamic.svelte';

export { default as textWidget } from './text.svelte';
export { default as numberWidget } from './number.svelte';
export { default as selectWidget } from './select.svelte';
export { default as checkboxWidget } from './checkbox.svelte';
export { default as radioWidget } from './radio.svelte';
export { default as checkboxesWidget } from './checkboxes.svelte';
export { default as fileWidget } from './file.svelte';

export const flowbiteMultiSelectWidget = dynamic(() => import('./multi-select.svelte'));
export const flowbiteTextareaWidget = dynamic(() => import('./textarea.svelte'));
export const flowbiteToggleWidget = dynamic(() => import('./toggle.svelte'));
export const flowbiteRangeWidget = dynamic(() => import('./range.svelte'));
export const flowbiteDatepickerWidget = dynamic(() => import('./date-picker.svelte'));

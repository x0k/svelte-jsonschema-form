import { dynamic } from '@sjsf/form/lib/dynamic.svelte';

export { default as textWidget } from './text.svelte';
export { default as numberWidget } from './number.svelte';
export { default as selectWidget } from './select.svelte';
export { default as checkboxWidget } from './checkbox.svelte';
export { default as radioWidget } from './radio.svelte';
export { default as checkboxesWidget } from './checkboxes.svelte';
export { default as fileWidget } from './file.svelte';

import './multi-select.svelte';
export const shadcnMultiSelectWidget = dynamic(() => import('./multi-select.svelte'));
import './textarea.svelte';
export const shadcnTextareaWidget = dynamic(() => import('./textarea.svelte'));
import './calendar.svelte';
export const shadcnCalendarWidget = dynamic(() => import('./calendar.svelte'));
import './slider.svelte';
export const shadcnSliderWidget = dynamic(() => import('./slider.svelte'));

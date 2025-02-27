import { dynamic } from '@sjsf/form/lib/dynamic.svelte';

export { default as textWidget } from './text.svelte';
export { default as numberWidget } from './number.svelte';
export { default as selectWidget } from './select.svelte';
export { default as checkboxWidget } from './checkbox.svelte';
export { default as radioWidget } from './radio.svelte';
export { default as checkboxesWidget } from './checkboxes.svelte';
export { default as fileWidget } from './file.svelte';
export { default as toggleWidget } from './toggle.svelte';

import './textarea.svelte';
export const textareaWidget = dynamic(() => import('./textarea.svelte'));
import './multi-select.svelte';
export const multiSelectWidget = dynamic(() => import('./multi-select.svelte'));
import './toggle.svelte';
export const daisyuiToggleWidget = dynamic(() => import('./toggle.svelte'));

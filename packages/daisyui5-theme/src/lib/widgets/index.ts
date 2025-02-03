import type { HTMLInputAttributes } from 'svelte/elements';

import type { RadioWidgetProps, SchemaValue, Widget, WidgetCommonProps, Widgets, WidgetType } from '@sjsf/form';

import TextWidget from './text-widget.svelte';
import TextareaWidget from './textarea-widget.svelte';
import NumberWidget from './number-widget.svelte';
import SelectWidget from './select-widget.svelte';
import CheckBoxWidget from './checkbox-widget.svelte';
import RadioWidget from './radio-widget.svelte';
import CheckboxesWidget from './checkboxes-widget.svelte';
import FileWidget from './file-widget.svelte';
import ToggleWidget from './toggle-widget.svelte';
import FilterWidget from './filter-widget.svelte';

declare module '@sjsf/form' {
	export interface WidgetsAndProps<V> {
		toggle: WidgetCommonProps<V, HTMLInputAttributes>;
		filter: RadioWidgetProps<V>;
	}

	export interface WidgetValue {
		toggle: boolean;
		filter: SchemaValue;
	}
}

export const registry: { [T in WidgetType]: Widget<T> } = {
	text: TextWidget,
	textarea: TextareaWidget,
	number: NumberWidget,
	select: SelectWidget,
	checkbox: CheckBoxWidget,
	radio: RadioWidget,
	checkboxes: CheckboxesWidget,
	file: FileWidget,
	toggle: ToggleWidget,
	filter: FilterWidget,
};

// @ts-expect-error TODO: improve `widgets` type
export const widgets: Widgets = (type) => registry[type];

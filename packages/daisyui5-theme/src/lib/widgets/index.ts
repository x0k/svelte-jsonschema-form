import type {
	Widget,
	Widgets,
	WidgetType
} from '@sjsf/form';

import TextWidget from './text.svelte';
import TextareaWidget from './textarea.svelte';
import NumberWidget from './number.svelte';
import SelectWidget from './select.svelte';
import CheckBoxWidget from './checkbox.svelte';
import RadioWidget from './radio.svelte';
import CheckboxesWidget from './checkboxes.svelte';
import FileWidget from './file.svelte';
import ToggleWidget from './toggle.svelte';
import FilterWidget from './filter.svelte';
import { CallyCalendar } from './cally-calendar'

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
	callyCalendar: CallyCalendar
};

// @ts-expect-error TODO: improve `widgets` type
export const widgets: Widgets = (type) => registry[type];

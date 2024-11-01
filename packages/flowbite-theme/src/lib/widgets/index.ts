import type { HTMLInputAttributes } from 'svelte/elements';
import type { Widget, WidgetCommonProps, Widgets, WidgetType } from '@sjsf/form';
import type { CheckboxProps } from 'flowbite-svelte/Checkbox.svelte';
import type { FileuploadProps } from 'flowbite-svelte/Fileupload.svelte';
import type { RangeProps } from 'flowbite-svelte/Range.svelte';
import type { InputProps } from 'flowbite-svelte/Input.svelte';
import type { RadioProps } from 'flowbite-svelte/Radio.svelte';
import type { SelectProps } from 'flowbite-svelte/Select.svelte';
import type { MultiSelectSlots } from 'flowbite-svelte/MultiSelect.svelte';
import type { DatepickerProps } from 'flowbite-svelte/Datepicker.svelte';
import type { TextareaProps } from 'flowbite-svelte/Textarea.svelte';
import type { ToggleProps } from 'flowbite-svelte/Toggle.svelte';

import TextWidget from './text-widget.svelte';
import TextareaWidget from './textarea-widget.svelte';
import NumberWidget from './number-widget.svelte';
import SelectWidget from './select-widget.svelte';
import CheckBoxWidget from './checkbox-widget.svelte';
import RadioWidget from './radio-widget.svelte';
import CheckboxesWidget from './checkboxes-widget.svelte';
import FileWidget from './file-widget.svelte';
import ToggleWidget from './toggle-widget.svelte';

declare module '@sjsf/form' {
	export interface Inputs {
		flowbiteCheckbox: CheckboxProps;
		flowbiteFileUpload: FileuploadProps;
		flowbiteRange: RangeProps;
		flowbiteInput: InputProps;
		flowbiteRadio: RadioProps;
		flowbiteSelect: SelectProps;
		flowbiteMultiSelect: MultiSelectSlots;
		flowbiteDatepicker: DatepickerProps;
		flowbiteTextarea: TextareaProps;
		flowbiteToggle: ToggleProps;
	}

	export interface WidgetsAndProps<V> {
		toggle: WidgetCommonProps<V, HTMLInputAttributes>;
	}

	export interface WidgetValue {
		toggle: boolean;
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
	toggle: ToggleWidget
};

// @ts-expect-error TODO: improve `widgets` type
export const widgets: Widgets = (type) => registry[type];

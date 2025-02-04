import type { Theme } from '@sjsf/form';

import type { HTMLInputAttributes } from 'svelte/elements';
import type { WidgetCommonProps } from '@sjsf/form';
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

import { components } from './components/index.js';
import { widgets } from './widgets/index.js';

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

export const theme = {
	components,
	widgets
} satisfies Theme;

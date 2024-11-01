import type { Widget, Widgets, WidgetType } from '@sjsf/form';
import type {
	Calendar,
	Checkbox,
	RadioGroup,
	Select,
	Slider,
	Switch,
	WithoutChildrenOrChild
} from 'bits-ui';

import TextWidget from './text-widget.svelte';
import TextareaWidget from './textarea-widget.svelte';
import NumberWidget from './number-widget.svelte';
import SelectWidget from './select-widget.svelte';
import CheckBoxWidget from './checkbox-widget.svelte';
import RadioWidget from './radio-widget.svelte';
import CheckboxesWidget from './checkboxes-widget.svelte';
import FileWidget from './file-widget.svelte';

declare module '@sjsf/form' {
	interface Inputs {
		shadcnCheckbox: WithoutChildrenOrChild<Checkbox.RootProps>;
		shadcnCalendar: WithoutChildrenOrChild<Calendar.RootProps>;
		shadcnRadio: WithoutChildrenOrChild<RadioGroup.ItemProps>;
		shadcnSelect: Select.RootProps;
		shadcnSlider: WithoutChildrenOrChild<Slider.RootProps>;
		shadcnSwitch: WithoutChildrenOrChild<Switch.RootProps>;
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
	file: FileWidget
};

// @ts-expect-error TODO: improve `widgets` type
export const widgets: Widgets = (type) => registry[type];

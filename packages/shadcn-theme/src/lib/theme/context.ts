/* eslint-disable @typescript-eslint/no-empty-object-type */
import { type Component, getContext, setContext } from 'svelte';
import type {
	HTMLButtonAttributes,
	HTMLInputAttributes,
	HTMLTextareaAttributes
} from 'svelte/elements';
import type {
	Calendar,
	Checkbox,
	Label,
	Popover,
	RadioGroup,
	Select,
	Slider,
	Switch,
	WithElementRef,
	WithoutChild,
	WithoutChildrenOrChild
} from 'bits-ui';

export interface ThemeComponents {
	Button: Component<HTMLButtonAttributes>;
	Calendar: Component<
		WithoutChildrenOrChild<Calendar.RootProps>,
		{},
		'value' | 'placeholder' | 'ref'
	>;
	Checkbox: Component<WithoutChildrenOrChild<Checkbox.RootProps>, {}, 'checked' | 'ref'>;
	Input: Component<WithElementRef<HTMLInputAttributes>, {}, 'value' | 'ref'>;
	FilesInput: Component<
		HTMLInputAttributes & {
			files?: FileList;
		},
		{},
		'files'
	>;
	Label: Component<Label.RootProps>;
	Popover: Component<Popover.ContentProps>;
	RadioGroup: Component<RadioGroup.RootProps, {}, 'value' | 'ref'>;
	RadioGroupItem: Component<WithoutChildrenOrChild<RadioGroup.ItemProps>>;
	Select: Component<Select.RootProps, {}, 'value' | 'open'>;
	SelectItem: Component<WithoutChild<Select.ItemProps>>;
	SelectTrigger: Component<WithoutChild<Select.TriggerProps>>;
	SelectContent: Component<WithoutChild<Select.ContentProps>>;
	Slider: Component<WithoutChildrenOrChild<Slider.RootProps>, {}, 'value' | 'ref'>;
	Switch: Component<WithoutChildrenOrChild<Switch.RootProps>, {}, 'checked' | 'ref'>;
	Textarea: Component<WithElementRef<HTMLTextareaAttributes>, {}, 'value' | 'ref'>;
}

export interface ThemeContext {
	components: ThemeComponents;
}

const THEME_CONTEXT = Symbol('theme-context');

export function getThemeContext(): ThemeContext {
	return getContext(THEME_CONTEXT);
}

export function setThemeContext(ctx: ThemeContext) {
	setContext(THEME_CONTEXT, ctx);
}

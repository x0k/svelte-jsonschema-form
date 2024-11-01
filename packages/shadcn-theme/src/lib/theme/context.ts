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
	RadioGroup,
	Select,
	Slider,
	Switch,
	WithElementRef,
	WithoutChild,
	WithoutChildrenOrChild
} from 'bits-ui';
import { Popover } from 'bits-ui';

export type CalendarProps = WithoutChildrenOrChild<Calendar.RootProps>;

export interface ThemeComponents {
	Button: Component<HTMLButtonAttributes>;
	// @ts-expect-error too complex
	Calendar: Component<CalendarProps, {}, 'value' | 'placeholder' | 'ref'>;
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
	// @deprecate (for search reasons)
	// TODO: Make this components required in next major
	PopoverTrigger?: Component<Popover.TriggerProps>;
	PopoverContent?: Component<Popover.ContentProps>;
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

export type DateFormatter = (date: Date) => string;

export interface ThemeContext {
	components: ThemeComponents;
	formatDate?: DateFormatter;
}

const THEME_CONTEXT = Symbol('theme-context');

export function getThemeContext(): Required<Omit<ThemeContext, 'components'>> & {
	components: Required<ThemeComponents>;
} {
	return getContext(THEME_CONTEXT);
}

export function setThemeContext(ctx: ThemeContext) {
	// TODO: Remove Proxy in next major
	const dateTimeFormat = new Intl.DateTimeFormat(undefined, {
		year: 'numeric',
		month: '2-digit',
		day: 'numeric'
	});
	setContext(THEME_CONTEXT, {
		get formatDate() {
			return ctx.formatDate ?? ((date) => dateTimeFormat.format(date));
		},
		get components() {
			return new Proxy(ctx.components, {
				get(target, prop, receiver) {
					switch (prop as keyof ThemeComponents) {
						case 'PopoverContent': {
							return target.PopoverContent ?? Popover.Content;
						}
						case 'PopoverTrigger': {
							return target.PopoverTrigger ?? Popover.Trigger;
						}
						default:
							return Reflect.get(target, prop, receiver);
					}
				}
			});
		}
	});
}

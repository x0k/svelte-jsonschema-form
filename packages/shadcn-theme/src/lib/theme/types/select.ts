import type { Component } from 'svelte';
import type {
	Select,
	WithoutChild,
	SelectTriggerProps,
	SelectSingleRootProps,
	SelectMultipleRootProps
} from 'bits-ui';

export type { SelectTriggerProps, SelectSingleRootProps, SelectMultipleRootProps };

declare module '../context.js' {
	interface ThemeComponents {
		Select: Component<Select.RootProps, {}, 'value' | 'open'>;
		SelectItem: Component<WithoutChild<Select.ItemProps>>;
		SelectTrigger: Component<WithoutChild<Select.TriggerProps>>;
		SelectContent: Component<WithoutChild<Select.ContentProps>>;
	}
}

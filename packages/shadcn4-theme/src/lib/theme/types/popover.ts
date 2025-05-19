import type { Component } from 'svelte';
import type { Popover } from 'bits-ui';

declare module '../context.js' {
	interface ThemeComponents {
		Popover: Component<Popover.RootProps, {}, 'open'>;
		PopoverTrigger: Component<Popover.TriggerProps>;
		PopoverContent: Component<Popover.ContentProps>;
	}
}

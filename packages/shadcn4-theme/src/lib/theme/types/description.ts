import type { Component } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';

declare module '../context.js' {
	interface ThemeComponents {
		FieldDescription: Component<HTMLAttributes<HTMLParagraphElement>>;
	}
}

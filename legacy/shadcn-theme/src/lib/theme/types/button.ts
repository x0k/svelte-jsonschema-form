import type { Component } from 'svelte';

import type { ButtonProps } from '$lib/default-ui/button/button.svelte';

export type { ButtonProps }

declare module '../context.js' {
	interface ThemeComponents {
		Button: Component<ButtonProps>;
	}
}

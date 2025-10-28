import type { Component } from 'svelte';
import type { LabelRootProps } from 'bits-ui';

export type LabelProps = LabelRootProps;

declare module '../context.js' {
	interface ThemeComponents {
		Label: Component<LabelRootProps>;
	}
}

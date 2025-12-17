import type { Component } from 'svelte';
import type { Slider, WithoutChildrenOrChild } from 'bits-ui';

declare module '../context.js' {
	interface ThemeComponents {
		Slider: Component<WithoutChildrenOrChild<Slider.RootProps>, {}, 'value' | 'ref'>;
	}
}

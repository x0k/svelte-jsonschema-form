import type { Component } from 'svelte';
import type { CheckboxRootProps, WithoutChildrenOrChild } from 'bits-ui';

export type CheckboxProps = WithoutChildrenOrChild<CheckboxRootProps>;

declare module '../context.js' {
	interface ThemeComponents {
		Checkbox: Component<CheckboxProps, {}, 'checked' | 'indeterminate' | 'ref'>;
	}
}

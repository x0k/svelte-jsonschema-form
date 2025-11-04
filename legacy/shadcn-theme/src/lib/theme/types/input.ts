import type { WithElementRef } from 'bits-ui';
import type { Component } from 'svelte';
import type { HTMLInputAttributes, HTMLInputTypeAttribute } from 'svelte/elements';

type InputType = Exclude<HTMLInputTypeAttribute, 'file'>;

export type InputProps = WithElementRef<
	Omit<HTMLInputAttributes, 'type'> &
		({ type: 'file'; files?: FileList } | { type?: InputType; files?: undefined })
>;

declare module '../context.js' {
	interface ThemeComponents {
		Input: Component<InputProps, {}, 'ref' | 'value' | 'files'>;
	}
}

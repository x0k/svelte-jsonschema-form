import type { HTMLInputAttributes } from 'svelte/elements';
import type { Theme, WidgetCommonProps } from '@sjsf/form';

import { components } from './components/index.js';
import { widgets } from './widgets/index.js';

declare module '@sjsf/form' {
	export interface WidgetsAndProps<V> {
		switch: WidgetCommonProps<V, HTMLInputAttributes>;
	}

	export interface WidgetValue {
		switch: boolean;
	}
}

export const theme = {
	components,
	widgets
} satisfies Theme;

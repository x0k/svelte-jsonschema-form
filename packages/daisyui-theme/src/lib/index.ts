import type { HTMLInputAttributes } from 'svelte/elements';
import type { Theme, WidgetCommonProps } from '@sjsf/form';

import { components } from './components/index.js';
import { widgets } from './widgets/index.js';

declare module '@sjsf/form' {
	export interface WidgetsAndProps<V> {
		toggle: WidgetCommonProps<V, HTMLInputAttributes>;
	}

	export interface WidgetValue {
		toggle: boolean;
	}
}

export const theme = {
	components,
	widgets
} satisfies Theme;

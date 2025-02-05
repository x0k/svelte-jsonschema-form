import type { HTMLButtonAttributes, HTMLInputAttributes } from 'svelte/elements';
import type { RadioWidgetProps, SchemaValue, Theme, WidgetCommonProps } from '@sjsf/form';
import type { PikadayOptions } from 'pikaday';

import { components } from './components/index.js';
import { widgets, type CalendarProps } from './widgets/index.js';

declare module '@sjsf/form' {
	interface Inputs {
		daisyui5CallyCalendar: CalendarProps;
	}

	interface UiOptions {
		trigger?: HTMLButtonAttributes;
		formatDate?: (date: string) => string;
		pikaday?: PikadayOptions;
	}
	interface WidgetsAndProps<V> {
		toggle: WidgetCommonProps<V, HTMLInputAttributes>;
		filter: RadioWidgetProps<V>;
		callyCalendar: WidgetCommonProps<V, CalendarProps>;
		pikadayCalendar: WidgetCommonProps<V, HTMLInputAttributes>;
	}

	interface WidgetValue {
		toggle: boolean;
		filter: SchemaValue;
		callyCalendar: string;
		pikadayCalendar: string;
	}
}

export const theme = {
	components,
	widgets
} satisfies Theme;

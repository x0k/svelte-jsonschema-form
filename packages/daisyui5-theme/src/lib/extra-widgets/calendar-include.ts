import { clientOnly } from '@sjsf/form/lib/env';

import { definitions } from '../definitions.js';

export type * as __preserveCallyCalendarTypes from './calendar.svelte';

declare module '../definitions.js' {
	interface ExtraWidgets {
		calendarWidget: {};
	}
}

definitions.calendarWidget = clientOnly(() => import('./calendar.svelte'));

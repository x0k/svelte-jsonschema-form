import { definitions } from '../definitions.js';

import Calendar from './calendar.svelte';
import './calendar.svelte';

declare module '../definitions.js' {
	interface ExtraWidgets {
		calendarWidget: {};
	}
}

definitions.calendarWidget = Calendar;

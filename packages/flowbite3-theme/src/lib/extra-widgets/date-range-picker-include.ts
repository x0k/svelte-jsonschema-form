import { definitions } from '../definitions.js';

import DateRangePicker from './date-range-picker.svelte';
import './date-range-picker.svelte';

declare module '../definitions.js' {
	interface ExtraWidgets {
		dateRangePickerWidget: {};
	}
}

definitions.dateRangePickerWidget = DateRangePicker;

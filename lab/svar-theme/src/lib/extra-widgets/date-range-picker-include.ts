import { definitions } from '../definitions.js';

import DateRangePicker from './date-range-picker.svelte';
import './date-range-picker.svelte';

declare module '../definitions.js' {
	interface ExtraWidgets {
		// TODO: Remove in v4
		/** @deprecated use `dateRangePickerWidget` instead */
		svarDateRangePickerWidget: {};
		dateRangePickerWidget: {};
	}
}

definitions.dateRangePickerWidget = DateRangePicker;
definitions.svarDateRangePickerWidget = DateRangePicker;

import { definitions } from '../definitions.js';

import DateRangePicker from './date-range-picker.svelte';
import './date-range-picker.svelte';

declare module '../definitions.js' {
	interface ExtraWidgets {
		// TODO: Remove in v4
		/** @deprecated use `dateRangePickerWidget` instead */
		shadcn4DateRangePickerWidget: {};
		dateRangePickerWidget: {};
	}
}

definitions.dateRangePickerWidget = DateRangePicker;
definitions.shadcn4DateRangePickerWidget = DateRangePicker;

import { definitions } from '../definitions.js';

import DateRangePicker from './date-range-picker.svelte';
import './date-range-picker.svelte';

declare module '../definitions.js' {
	interface ExtraWidgets {
		// TODO: Remove in v4
		/** @deprecated use `stringRangeWidget` instead */
		skeleton4DateRangePickerWidget: {};
		stringRangeWidget: {};
	}
}

definitions.skeleton4DateRangePickerWidget = DateRangePicker;
definitions.stringRangeWidget = DateRangePicker;

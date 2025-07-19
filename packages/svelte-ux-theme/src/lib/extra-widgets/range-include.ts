import { definitions } from '../definitions';

import Range from './range.svelte';
import './range.svelte';

declare module '../definitions.js' {
	interface ExtraWidgets {
		rangeWidget: {};
	}
}

definitions.rangeWidget = Range;

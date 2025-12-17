import { definitions } from '../definitions.js';

import RangeSlider from './range-slider.svelte';
import './range-slider.svelte';

declare module '../definitions.js' {
	interface ExtraWidgets {
		rangeSliderWidget: {};
	}
}

definitions.rangeSliderWidget = RangeSlider;

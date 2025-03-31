import { definitions } from '../definitions';

import Slider from './slider.svelte';
import './slider.svelte';

declare module '../definitions.js' {
	interface ExtraWidgets {
		rangeWidget: {};
	}
}

definitions.rangeWidget = Slider;

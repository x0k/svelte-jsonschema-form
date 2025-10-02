import { definitions } from '../definitions.js';

import Slider from './slider.svelte';
import './slider.svelte';

declare module '../definitions.js' {
	interface ExtraWidgets {
		skeleton3SliderWidget: {};
	}
}

definitions.skeleton3SliderWidget = Slider;

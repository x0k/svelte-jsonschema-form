import { definitions } from '../definitions.js';

import Slider from './slider.svelte';
import './slider.svelte';

declare module '../definitions.js' {
	interface ExtraWidgets {
		skeleton4SliderWidget: {};
	}
}

definitions.skeleton4SliderWidget = Slider;

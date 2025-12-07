import { definitions } from '../definitions.js';

import RadioButtons from './filter-radio-buttons.svelte';
import './filter-radio-buttons.svelte';

declare module '../definitions.js' {
	interface ExtraWidgets {
		daisyui5FilterRadioButtonsWidget: {};
	}
}

definitions.daisyui5FilterRadioButtonsWidget = RadioButtons;

import { definitions } from '../definitions';

import RadioButtons from './radio-buttons.svelte';
import './radio-buttons.svelte';

declare module '../definitions.js' {
	interface ExtraWidgets {
		radioButtonsWidget: {};
	}
}

definitions.radioButtonsWidget = RadioButtons;

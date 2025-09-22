import { definitions } from '../definitions.js';

import ToggleRadioButtons from './toggle-radio-buttons.svelte';
import './toggle-radio-buttons.svelte';

declare module '../definitions.js' {
	interface ExtraWidgets {
		radioButtonsWidget: {};
	}
}

definitions.radioButtonsWidget = ToggleRadioButtons;

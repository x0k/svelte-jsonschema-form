import { definitions } from '../definitions.js';

import ToggleRadioButtons from './toggle-radio-buttons.svelte';
import './toggle-radio-buttons.svelte';

declare module '../definitions.js' {
	interface ExtraWidgets {
		flowbite3ToggleRadioButtonsWidget: {};
	}
}

definitions.flowbite3ToggleRadioButtonsWidget = ToggleRadioButtons;

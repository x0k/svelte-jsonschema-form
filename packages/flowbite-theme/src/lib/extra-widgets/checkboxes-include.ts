import { definitions } from '../definitions.js';

import Checkboxes from './checkboxes.svelte';
import './checkboxes.svelte';

declare module '../definitions.js' {
	interface ExtraWidgets {
		checkboxesWidget: {};
	}
}

definitions.checkboxesWidget = Checkboxes;

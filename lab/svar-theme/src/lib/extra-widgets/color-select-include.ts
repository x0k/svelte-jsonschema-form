import { definitions } from '../definitions.js';

import ColorSelect from './color-select.svelte';
import './color-select.svelte';

declare module '../definitions.js' {
	interface ExtraWidgets {
		svarColorSelectWidget: {};
	}
}

definitions.svarColorSelectWidget = ColorSelect;

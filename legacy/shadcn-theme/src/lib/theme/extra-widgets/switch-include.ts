import { definitions } from '../definitions';

import Switch from './switch.svelte';
import './switch.svelte';

declare module '../definitions.js' {
	interface ExtraWidgets {
		switchWidget: {};
	}
}

definitions.switchWidget = Switch;

import { clientOnly } from '@sjsf/form/lib/env';

import { definitions } from '../definitions.js';

export type * as __preserveCallyTypes from './cally-date-picker.svelte';

declare module '../definitions.js' {
	interface ExtraWidgets {
		daisyui5CallyDatePickerWidget: {};
	}
}

definitions.daisyui5CallyDatePickerWidget = clientOnly(() => import('./cally-date-picker.svelte'));

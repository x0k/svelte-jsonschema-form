import { definitions } from '../definitions.js';

import Password from './password.svelte';
import './password.svelte';

declare module '../definitions.js' {
	interface ExtraWidgets {
		shadcnExtrasPasswordWidget: {};
	}
}

definitions.shadcnExtrasPasswordWidget = Password;

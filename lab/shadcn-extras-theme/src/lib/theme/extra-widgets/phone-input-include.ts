import { definitions } from '../definitions.js';

import PhoneInput from './phone-input.svelte';
import './phone-input.svelte';

declare module '../definitions.js' {
	interface ExtraWidgets {
		shadcnExtrasPhoneInputWidget: {};
	}
}

definitions.shadcnExtrasPhoneInputWidget = PhoneInput;

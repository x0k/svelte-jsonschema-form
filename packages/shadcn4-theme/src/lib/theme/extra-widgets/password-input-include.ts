import { definitions } from '../definitions.js';

import PasswordInput from './password-input.svelte';
import './password-input.svelte';

declare module '../definitions.js' {
	interface ExtraWidgets {
		passwordInputWidget: {};
	}
}

definitions.passwordInputWidget = PasswordInput;

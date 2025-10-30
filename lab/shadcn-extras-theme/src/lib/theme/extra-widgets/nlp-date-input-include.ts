import { definitions } from '../definitions.js';

import NlpDateInput from './nlp-date-input.svelte';
import './nlp-date-input.svelte';

declare module '../definitions.js' {
	interface ExtraWidgets {
		shadcnExtrasNLPDateInputWidget: {};
	}
}

definitions.shadcnExtrasNLPDateInputWidget = NlpDateInput;

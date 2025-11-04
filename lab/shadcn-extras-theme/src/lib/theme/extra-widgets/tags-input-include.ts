import { definitions } from '../definitions.js';

import TagsInput from './tags-input.svelte';
import './tags-input.svelte';

declare module '../definitions.js' {
	interface ExtraWidgets {
		shadcnExtrasTagsInputWidget: {};
	}
}

definitions.shadcnExtrasTagsInputWidget = TagsInput;

import { definitions } from '../definitions.js';

import Tags from './tags.svelte';
import './tags.svelte';

declare module '../definitions.js' {
	interface ExtraWidgets {
		tagsWidget: {};
	}
}

definitions.tagsWidget = Tags;

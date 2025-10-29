import { definitions } from '../definitions.js';

import FileDropZone from './file-drop-zone.svelte';
import './file-drop-zone.svelte';

declare module '../definitions.js' {
	interface ExtraWidgets {
		shadcnExtrasFileDropZoneWidget: {};
	}
}

definitions.shadcnExtrasFileDropZoneWidget = FileDropZone;

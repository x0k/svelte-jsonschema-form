import { definitions } from '../definitions.js';

import FileUpload from './file-upload.svelte';
import './file-upload.svelte';

declare module '../definitions.js' {
	interface ExtraWidgets {
		skeleton4FileUploadWidget: {};
	}
}

definitions.skeleton4FileUploadWidget = FileUpload;

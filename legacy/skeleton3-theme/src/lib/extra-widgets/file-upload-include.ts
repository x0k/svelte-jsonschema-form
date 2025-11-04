import { definitions } from '../definitions.js';

import FileUpload from './file-upload.svelte';
import './file-upload.svelte';

declare module '../definitions.js' {
	interface ExtraWidgets {
		skeleton3FileUploadWidget: {};
	}
}

definitions.skeleton3FileUploadWidget = FileUpload;

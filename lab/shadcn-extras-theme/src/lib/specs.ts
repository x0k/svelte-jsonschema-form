import { s } from 'theme-testing/specs';

import './theme/extra-widgets/file-drop-zone-include.js';

export const specs: s.Specs = {
	fileDropZone: [
		s.file,
		{
			'ui:components': {
				stringField: 'fileField',
				fileWidget: 'shadcnExtrasFileDropZoneWidget'
			}
		},
		{}
	],
	fileDropZoneMultiple: [
		s.filesArray,
		{
			'ui:components': {
				arrayField: 'arrayFilesField',
				fileWidget: 'shadcnExtrasFileDropZoneWidget'
			}
		},
		{}
	]
};

export const extraWidgets = Object.keys(import.meta.glob('./theme/extra-widgets/*.svelte')).map(
	(widget) => widget.substring(22, widget.length - 7)
);

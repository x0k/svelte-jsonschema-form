import { s } from 'theme-testing/specs';

import './theme/extra-widgets/file-drop-zone-include.js';
import './theme/extra-widgets/ip-v4-address-input-include.js';
import './theme/extra-widgets/nlp-date-input-include.js';
import './theme/extra-widgets/password-include.js';
import './theme/extra-widgets/phone-input-include.js';

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
	],
	ipV4AddressInput: [
		s.text,
		{
			'ui:components': {
				textWidget: 'shadcnExtrasIPv4AddressInputWidget'
			},
			'ui:options': {
				useLabel: false
			}
		},
		{}
	],
	nlpDateInput: [
		s.text,
		{
			'ui:components': {
				textWidget: 'shadcnExtrasNLPDateInputWidget'
			},
			'ui:options': {
				useLabel: false
			}
		},
		{}
	],
	password: [
		s.text,
		{
			'ui:components': {
				textWidget: 'shadcnExtrasPasswordWidget'
			}
		},
		{}
	],
	phoneInput: [
		s.text,
		{
			'ui:components': {
				textWidget: 'shadcnExtrasPhoneInputWidget'
			}
		},
		{}
	]
};

export const extraWidgets = Object.keys(import.meta.glob('./theme/extra-widgets/*.svelte')).map(
	(widget) => widget.substring(22, widget.length - 7)
);

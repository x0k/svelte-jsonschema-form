import { s } from 'testing/demo';

import './extra-widgets/checkboxes-include';
import './extra-widgets/date-picker-include';
import './extra-widgets/file-include';
import './extra-widgets/multi-select-include';
import './extra-widgets/radio-include';
import './extra-widgets/range-include';
import './extra-widgets/switch-include';
import './extra-widgets/textarea-include';

export const specs: s.Specs = {
	datePicker: [
		s.text,
		// TODO: Remove `useLabel` as `Datepicker` will be ok
		{ 'ui:components': { textWidget: 'datePickerWidget' }, 'ui:options': { useLabel: false } }
	],
	multiSelect: [
		s.uniqueArray,
		{ 'ui:components': { checkboxesWidget: 'multiSelectWidget' }, 'ui:options': { useLabel: true } }
	],
	radio: [
		s.enumeration,
		{ 'ui:components': { selectWidget: 'radioWidget' }, 'ui:options': { useLabel: false } }
	],
	range: [s.number, { 'ui:components': { numberWidget: 'rangeWidget' } }],
	switch: [s.boolean, { 'ui:components': { checkboxWidget: 'switchWidget' } }],
	textarea: [s.text, { 'ui:components': { textWidget: 'textareaWidget' } }]
};

export const extraWidgets = Object.keys(import.meta.glob('./extra-widgets/*.svelte')).map(
	(widget) => widget.substring(16, widget.length - 7)
);

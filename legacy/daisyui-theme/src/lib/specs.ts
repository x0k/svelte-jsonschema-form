import { s, DEFAULT_SPECS } from 'theme-testing/specs';

import './extra-widgets/checkboxes-include';
import './extra-widgets/date-picker-include';
import './extra-widgets/file-include';
import './extra-widgets/multi-select-include';
import './extra-widgets/radio-buttons-include';
import './extra-widgets/radio-include';
import './extra-widgets/range-include';
import './extra-widgets/switch-include';
import './extra-widgets/textarea-include';

export const specs: s.Specs = {
	...DEFAULT_SPECS,
	datePicker: [s.text, { 'ui:components': { textWidget: 'datePickerWidget' } }, {}],
	multiSelect: [
		s.uniqueArray,
		{ 'ui:components': { arrayField: 'multiEnumField', checkboxesWidget: 'multiSelectWidget' } },
		{}
	],
	radioButtons: [
		s.enumeration,
		{ 'ui:components': { stringField: 'enumField', selectWidget: 'radioButtonsWidget' } },
		{}
	],
	radio: [
		s.enumeration,
		{ 'ui:components': { stringField: 'enumField', selectWidget: 'radioWidget' } },
		{}
	],
	range: [s.number, { 'ui:components': { numberWidget: 'rangeWidget' } }, {}],
	switch: [s.boolean, { 'ui:components': { checkboxWidget: 'switchWidget' } }, {}],
	textarea: [s.text, { 'ui:components': { textWidget: 'textareaWidget' } }, {}]
};

export const extraWidgets = Object.keys(import.meta.glob('./extra-widgets/*.svelte')).map(
	(widget) => widget.substring(16, widget.length - 7)
);

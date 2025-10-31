import { s, DEFAULT_SPECS } from 'theme-testing/specs';
import '@sjsf/form/fields/extra/array-tags-include';
import '@sjsf/form/fields/extra/array-files-include';

import './extra-widgets/checkboxes-include.js';
import './extra-widgets/date-picker-include.js';
import './extra-widgets/file-include.js';
import './extra-widgets/multi-select-include.js';
import './extra-widgets/radio-include.js';
import './extra-widgets/range-include.js';
import './extra-widgets/textarea-include.js';

export const specs: s.Specs = {
	...DEFAULT_SPECS,
	datePicker: [
		s.text,
		{ 'ui:components': { textWidget: 'datePickerWidget' } },
		{
			oninput: 'inputDate',
			onchange: 'changeDate',
			onblur: 'visitDate'
		}
	],
	multiSelect: [
		s.uniqueArray,
		{
			'ui:components': {
				arrayField: 'multiEnumField',
				checkboxesWidget: 'multiSelectWidget'
			},
			'ui:options': { useLabel: true }
		},
		{
			oninput: 'inputMultiSelect',
			onchange: 'changeMultiSelect',
			onblur: 'visitMultiSelect'
		}
	],
	radio: [
		s.enumeration,
		{
			'ui:components': {
				stringField: 'enumField',
				selectWidget: 'radioWidget'
			},
			'ui:options': { useLabel: false }
		},
		{
			oninput: 'inputRadio',
			onchange: 'changeRadio',
			onblur: 'visitRadio'
		}
	],
	range: [
		s.number,
		{ 'ui:components': { numberWidget: 'rangeWidget' } },
		{
			oninput: 'inputSlider',
			onchange: 'changeSlider',
			onblur: 'visitSlider'
		}
	],
	textarea: [
		s.text,
		{ 'ui:components': { textWidget: 'textareaWidget' } },
		{
			oninput: 'inputText',
			onchange: 'changeText',
			onblur: 'visitText'
		}
	]
};

export const extraWidgets = Object.keys(import.meta.glob('./extra-widgets/*.svelte')).map(
	(widget) => widget.substring(16, widget.length - 7)
);

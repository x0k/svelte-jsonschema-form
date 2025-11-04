import { s, DEFAULT_SPECS } from 'theme-testing/specs';

import './extra-widgets/cally-date-picker-include';
import './extra-widgets/checkboxes-include';
import './extra-widgets/file-include';
import './extra-widgets/filter-radio-buttons-include.js';
import './extra-widgets/multi-select-include';
import './extra-widgets/radio-buttons-include';
import './extra-widgets/radio-include';
import './extra-widgets/range-include';
import './extra-widgets/rating-include';
import './extra-widgets/switch-include';
import './extra-widgets/textarea-include';
import './extra-widgets/date-picker-include.js';

export const specs: s.Specs = {
	...DEFAULT_SPECS,
	callyDatePicker: [
		s.text,
		{
			'ui:components': { textWidget: 'daisyui5CallyDatePickerWidget' },
			'ui:options': { useLabel: false }
		},
		{
			onchange: 'changeCallyDatePicker'
		}
	],
	datePicker: [
		s.text,
		{ 'ui:components': { textWidget: 'datePickerWidget' } },
		{
			oninput: 'inputDate',
			onchange: 'changeDate',
			onblur: 'visitDate'
		}
	],
	filterRadioButtons: [
		s.enumeration,
		{
			'ui:components': {
				stringField: 'enumField',
				selectWidget: 'daisyui5FilterRadioButtonsWidget'
			},
			'ui:options': { useLabel: false }
		},
		{
			oninput: 'inputRadio',
			onchange: 'changeRadio',
			onblur: 'visitRadio'
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
	radioButtons: [
		s.enumeration,
		{
			'ui:components': {
				stringField: 'enumField',
				selectWidget: 'radioButtonsWidget'
			},
			'ui:options': { useLabel: false }
		},
		{
			oninput: 'inputRadio',
			onchange: 'changeRadio',
			onblur: 'visitRadio'
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
	rating: [
		s.number,
		{ 'ui:components': { numberWidget: 'ratingWidget' }, 'ui:options': { useLabel: false } },
		{
			oninput: 'inputRadio',
			onchange: 'changeRadio',
			onblur: 'visitRadio'
		}
	],
	switch: [
		s.boolean,
		{ 'ui:components': { checkboxWidget: 'switchWidget' } },
		{
			oninput: 'inputCheckbox',
			onchange: 'changeCheckbox',
			onblur: 'visitCheckbox'
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

import { s } from 'testing/demo';

import './extra-widgets/cally-date-picker-include';
import './extra-widgets/checkboxes-include';
import './extra-widgets/file-include';

import FilterRadioButtons from './extra-widgets/filter-radio-buttons.svelte';
import './extra-widgets/filter-radio-buttons.svelte';

import './extra-widgets/multi-select-include';
import './extra-widgets/radio-buttons-include';
import './extra-widgets/radio-include';
import './extra-widgets/range-include';
import './extra-widgets/rating-include';
import './extra-widgets/switch-include';
import './extra-widgets/textarea-include';

import PikadayDatePicker from './extra-widgets/pikaday-date-picker.svelte';
import './extra-widgets/pikaday-date-picker.svelte';

export const specs: s.Specs = {
	callyDatePicker: [
		s.text,
		{ 'ui:components': { textWidget: 'datePickerWidget' }, 'ui:options': { useLabel: false } }
	],
	filterRadioButtons: [
		s.enumeration,
		{
			'ui:components': {
				stringField: 'enumField',
				selectWidget: FilterRadioButtons
			},
			'ui:options': { useLabel: false }
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
		}
	],
	pikadayDatePicker: [s.text, { 'ui:components': { textWidget: PikadayDatePicker } }],
	radioButtons: [
		s.enumeration,
		{
			'ui:components': {
				stringField: 'enumField',
				selectWidget: 'radioButtonsWidget'
			},
			'ui:options': { useLabel: false }
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
		}
	],
	range: [s.number, { 'ui:components': { numberWidget: 'rangeWidget' } }],
	rating: [
		s.number,
		{ 'ui:components': { numberWidget: 'ratingWidget' }, 'ui:options': { useLabel: false } }
	],
	switch: [s.boolean, { 'ui:components': { checkboxWidget: 'switchWidget' } }],
	textarea: [s.text, { 'ui:components': { textWidget: 'textareaWidget' } }]
};

export const extraWidgets = Object.keys(import.meta.glob('./extra-widgets/*.svelte')).map(
	(widget) => widget.substring(16, widget.length - 7)
);

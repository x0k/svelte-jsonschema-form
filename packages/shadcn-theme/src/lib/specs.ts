import { s } from 'testing/demo';

import './theme/extra-widgets/checkboxes-include';

import Combobox from './theme/extra-widgets/combobox.svelte';
import './theme/extra-widgets/combobox.svelte';

import './theme/extra-widgets/date-picker-include';
import './theme/extra-widgets/file-include';
import './theme/extra-widgets/multi-select-include';
import './theme/extra-widgets/radio-buttons-include';
import './theme/extra-widgets/radio-include';
import './theme/extra-widgets/range-include';
import './theme/extra-widgets/switch-include';
import './theme/extra-widgets/textarea-include';

export const specs: s.Specs = {
	combobox: [
		s.enumeration,
		{
			'ui:components': {
				stringField: 'enumField',
				selectWidget: Combobox
			},
			'ui:options': { useLabel: false }
		}
	],
	datePicker: [
		s.text,
		// NOTE: DatePicker is a button
		{ 'ui:components': { textWidget: 'datePickerWidget' }, 'ui:options': { useLabel: false } }
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
	range: [
		s.number,
		// NOTE: Range is span based
		{ 'ui:components': { numberWidget: 'rangeWidget' }, 'ui:options': { useLabel: false } }
	],
	switch: [s.boolean, { 'ui:components': { checkboxWidget: 'switchWidget' } }],
	textarea: [s.text, { 'ui:components': { textWidget: 'textareaWidget' } }]
};

export const extraWidgets = Object.keys(import.meta.glob('./theme/extra-widgets/*.svelte')).map(
	(widget) => widget.substring(22, widget.length - 7)
);

import { userEvent } from '@vitest/browser/context';
import { s, t, DEFAULT_SPECS } from 'testing/demo';

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
	...DEFAULT_SPECS,
	callyDatePicker: [
		s.text,
		{ 'ui:components': { textWidget: 'datePickerWidget' }, 'ui:options': { useLabel: false } },
		{
			onchange: async (l) => {
				await customElements.whenDefined('calendar-date');
				await customElements.whenDefined('calendar-month');
				const button = t.getButton(l);
				await userEvent.click(button);
				const day = l.getByText('26');
				await userEvent.click(day);
			}
		}
	],
	filterRadioButtons: [
		s.enumeration,
		{
			'ui:components': {
				stringField: 'enumField',
				selectWidget: FilterRadioButtons
			},
			'ui:options': { useLabel: false }
		},
		{
			oninput: t.inputRadio,
			onchange: t.changeRadio,
			onblur: t.visitRadio
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
			oninput: t.inputMultiSelect,
			onchange: t.changeMultiSelect,
			onblur: t.visitMultiSelect
		}
	],
	pikadayDatePicker: [
		s.text,
		{ 'ui:components': { textWidget: PikadayDatePicker } },
		{
			oninput: t.inputDate,
			onchange: t.changeDate,
			onblur: t.visitDate
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
			oninput: t.inputRadio,
			onchange: t.changeRadio,
			onblur: t.visitRadio
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
			oninput: t.inputRadio,
			onchange: t.changeRadio,
			onblur: t.visitRadio
		}
	],
	range: [
		s.number,
		{ 'ui:components': { numberWidget: 'rangeWidget' } },
		{
			oninput: t.inputSlider,
			onchange: t.changeSlider,
			onblur: t.visitSlider
		}
	],
	rating: [
		s.number,
		{ 'ui:components': { numberWidget: 'ratingWidget' }, 'ui:options': { useLabel: false } },
		{
			oninput: t.inputRadio,
			onchange: t.changeRadio,
			onblur: t.visitRadio
		}
	],
	switch: [
		s.boolean,
		{ 'ui:components': { checkboxWidget: 'switchWidget' } },
		{
			oninput: t.inputCheckbox,
			onchange: t.changeCheckbox,
			onblur: t.visitCheckbox
		}
	],
	textarea: [
		s.text,
		{ 'ui:components': { textWidget: 'textareaWidget' } },
		{
			oninput: t.inputText,
			onchange: t.changeText,
			onblur: t.visitText
		}
	]
};

export const extraWidgets = Object.keys(import.meta.glob('./extra-widgets/*.svelte')).map(
	(widget) => widget.substring(16, widget.length - 7)
);

import { userEvent } from '@vitest/browser/context';
import { s, t, DEFAULT_SPECS } from 'testing/demo';

import './theme/extra-widgets/checkboxes-include.js';
import './theme/extra-widgets/combobox-include.js';
import './theme/extra-widgets/date-picker-include.js';
import './theme/extra-widgets/file-include.js';
import './theme/extra-widgets/multi-select-include.js';
import './theme/extra-widgets/radio-buttons-include.js';
import './theme/extra-widgets/radio-include.js';
import './theme/extra-widgets/range-include.js';
import './theme/extra-widgets/switch-include.js';
import './theme/extra-widgets/textarea-include.js';

const inputSelect: s.FieldValidationTrigger = async (l) => {
	const select = t.getButton(l);
	await userEvent.click(select);
	const option = l.getByRole('option').last();
	await userEvent.click(option);
};

const inputDatePicker: s.FieldValidationTrigger = async (l) => {
	const btn = t.getButton(l);
	await userEvent.click(btn);
	const day = l.getByText('26');
	await userEvent.click(day);
};

const inputCombobox: s.FieldValidationTrigger = async (l) => {
	const cmb = t.getCombobox(l);
	await userEvent.click(cmb);
	const opt = l.getByRole('option').last();
	await userEvent.click(opt);
};

export const specs: s.Specs = {
	...DEFAULT_SPECS,
	select: [
		s.enumeration,
		{
			'ui:components': {
				stringField: 'enumField'
			}
		},
		{
			oninput: inputSelect,
			onchange: inputSelect,
			onblur: t.withTab(inputSelect)
		}
	],
	combobox: [
		s.enumeration,
		{
			'ui:components': {
				stringField: 'enumField',
				selectWidget: 'comboboxWidget'
			},
			'ui:options': { useLabel: false }
		},
		{
			oninput: inputCombobox,
			onchange: inputCombobox,
			onblur: t.withTab(inputCombobox)
		}
	],
	datePicker: [
		s.text,
		// NOTE: DatePicker is a button
		{ 'ui:components': { textWidget: 'datePickerWidget' }, 'ui:options': { useLabel: false } },
		{
			oninput: inputDatePicker,
			onchange: inputDatePicker,
			onblur: t.withTab(inputDatePicker)
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
			oninput: inputSelect,
			onchange: inputSelect,
			onblur: t.withTab(inputSelect)
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
		// NOTE: Range is span based
		{ 'ui:components': { numberWidget: 'rangeWidget' }, 'ui:options': { useLabel: false } },
		{
			oninput: t.inputSlider,
			onchange: t.changeSlider
		}
	],
	switch: [
		s.boolean,
		{
			'ui:components': { checkboxWidget: 'switchWidget' },
			'ui:options': {
				title: t.SWITCH_LABEL_TEXT
			}
		},
		{
			oninput: t.inputSwitch,
			onchange: t.changeSwitch,
			onblur: t.visitSwitch
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

export const extraWidgets = Object.keys(import.meta.glob('./theme/extra-widgets/*.svelte')).map(
	(widget) => widget.substring(22, widget.length - 7)
);

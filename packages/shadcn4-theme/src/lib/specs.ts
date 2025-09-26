import { s, DEFAULT_SPECS } from 'theme-testing/demo';

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
			oninput: "inputShadcnSelect",
			onchange: "changeShadcnSelect",
			onblur: "visitShadcnSelect",
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
			oninput: "inputShadcnCombobox",
			onchange: "changeShadcnCombobox",
			onblur: "visitShadcnCombobox",
		}
	],
	datePicker: [
		s.text,
		// NOTE: DatePicker is a button
		{ 'ui:components': { textWidget: 'datePickerWidget' }, 'ui:options': { useLabel: false } },
		{
			oninput: "inputShadcnDatePicker",
			onchange: "changeShadcnDatePicker",
			onblur: "visitShadcnDatePicker",
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
			oninput: "inputShadcnSelect",
			onchange: "changeShadcnSelect",
			onblur: "visitShadcnSelect",
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
			oninput: "inputRadio",
			onchange: "changeRadio",
			onblur: "visitRadio"
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
			oninput: "inputRadio",
			onchange: "changeRadio",
			onblur: "visitRadio"
		}
	],
	range: [
		s.number,
		// NOTE: Range is span based
		{ 'ui:components': { numberWidget: 'rangeWidget' }, 'ui:options': { useLabel: false } },
		{
			oninput: "inputSlider",
			onchange: "changeSlider"
		}
	],
	switch: [
		s.boolean,
		{
			'ui:components': { checkboxWidget: 'switchWidget' },
			'ui:options': {
				title: s.SWITCH_LABEL_TEXT
			}
		},
		{
			oninput: "inputSwitch",
			onchange: "changeSwitch",
			onblur: "visitSwitch"
		}
	],
	textarea: [
		s.text,
		{ 'ui:components': { textWidget: 'textareaWidget' } },
		{
			oninput: "inputText",
			onchange: "changeText",
			onblur: "visitText"
		}
	]
};

export const extraWidgets = Object.keys(import.meta.glob('./theme/extra-widgets/*.svelte')).map(
	(widget) => widget.substring(22, widget.length - 7)
);

import { s, DEFAULT_SPECS } from 'theme-testing/specs';
import '@sjsf/form/fields/extra/array-tags-include';
import '@sjsf/form/fields/extra/aggregated-include';

import './extra-widgets/calendar-include.js';
import './extra-widgets/checkboxes-include.js';
import './extra-widgets/color-picker-include.js';
import './extra-widgets/date-picker-include.js';
import './extra-widgets/date-range-picker-include.js';
import './extra-widgets/file-include.js';
import './extra-widgets/multi-select-include.js';
import './extra-widgets/password-input-include.js';
import './extra-widgets/radio-buttons-include.js';
import './extra-widgets/radio-include.js';
import './extra-widgets/range-include.js';
import './extra-widgets/switch-include.js';
import './extra-widgets/tags-include.js';
import './extra-widgets/textarea-include.js';
import './extra-widgets/toggle-radio-buttons-include.js';

export const specs: s.Specs = {
	...DEFAULT_SPECS,
	calendar: [
		s.text,
		{
			'ui:components': { textWidget: 'calendarWidget' },
			'ui:options': {
				useLabel: false,
				flowbite3Datepicker: {
					locale: 'en-US'
				}
			}
		},
		{
			oninput: 'inputShadcnDatePicker',
			onchange: 'changeShadcnDatePicker',
		}
	],
	colorPicker: [
		s.text,
		{ 'ui:components': { textWidget: 'colorPickerWidget' } },
		{
			oninput: 'inputColor',
			onchange: 'changeColor',
			onblur: 'visitColor'
		}
	],
	datePicker: [
		s.text,
		{
			'ui:components': { textWidget: 'datePickerWidget' },
			'ui:options': {
				flowbite3Datepicker: {
					locale: 'en-US'
				}
			}
		},
		{
			oninput: 'inputDate',
			onchange: 'changeDate',
			onblur: 'visitDate'
		}
	],
	dateRangePicker: [
		s.range(s.text),
		{
			'ui:components': {
				objectField: 'aggregatedField',
				aggregatedWidget: 'dateRangePickerWidget'
			},
			'ui:options': {
				flowbite3DateRangePicker: {
					locale: 'en-US'
				}
			}
		},
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
			'ui:options': { useLabel: false }
		},
		{
			oninput: 'inputFlowbiteMultiSelect',
			onchange: 'inputFlowbiteMultiSelect',
			onblur: 'visitMultiSelect'
		}
	],
	passwordInput: [
		s.text,
		{ 'ui:components': { textWidget: 'passwordInputWidget' } },
		{
			oninput: 'inputText',
			onchange: 'changeText',
			onblur: 'visitText'
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
			oninput: 'inputFlowbiteRadioButton',
			onchange: 'changeFlowbiteRadioButton',
			onblur: 'visitFlowbiteRadioButton'
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
	switch: [
		s.boolean,
		{
			'ui:components': { checkboxWidget: 'switchWidget' },
			'ui:options': {
				title: s.SWITCH_LABEL_TEXT
			}
		},
		{
			oninput: 'inputSwitch',
			onchange: 'changeSwitch',
			onblur: 'visitSwitch'
		}
	],
	tags: [
		s.uniqueArray,
		{
			'ui:components': {
				arrayField: 'arrayTagsField'
			}
		},
		{
			oninput: 'inputTags',
			onchange: 'changeTags',
			onblur: 'visitTags'
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
	],
	toggleRadioButtons: [
		s.enumeration,
		{
			'ui:components': {
				stringField: 'enumField',
				selectWidget: 'flowbite3ToggleRadioButtonsWidget'
			},
			'ui:options': { useLabel: false }
		},
		{
			onchange: 'changeRadio'
		}
	]
};

export const extraWidgets = Object.keys(import.meta.glob('./extra-widgets/*.svelte')).map(
	(widget) => widget.substring(16, widget.length - 7)
);

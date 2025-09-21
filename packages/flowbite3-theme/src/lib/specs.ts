import { cast } from '@sjsf/form/lib/component';
import type { ComponentDefinition } from '@sjsf/form';
import TagsField from '@sjsf/form/fields/extra-fields/tags.svelte';
import { s, DEFAULT_SPECS } from 'testing/demo';

import './extra-widgets/checkboxes-include';
import './extra-widgets/date-picker-include';
import './extra-widgets/file-include';
import './extra-widgets/multi-select-include';
import './extra-widgets/radio-buttons-include';
import './extra-widgets/radio-include';
import './extra-widgets/range-include';
import './extra-widgets/switch-include';
import './extra-widgets/tags-include';
import './extra-widgets/textarea-include';

const tagsAsArrayField = cast(TagsField, {
	value: {
		transform(props) {
			s.assertStrings(props.value);
			return props.value;
		}
	}
}) satisfies ComponentDefinition<'arrayField'>;

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
			'ui:options': { useLabel: false }
		},
		{
			oninput: 'inputFlowbiteMultiSelect',
			onchange: 'inputFlowbiteMultiSelect',
			onblur: 'visitMultiSelect'
		}
	],
	// TODO: Rename to `ToggleRadioButtons`, create new `RadioButtons` widget
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
			onchange: 'changeRadio'
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
				arrayField: tagsAsArrayField
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
	]
};

export const extraWidgets = Object.keys(import.meta.glob('./extra-widgets/*.svelte')).map(
	(widget) => widget.substring(16, widget.length - 7)
);

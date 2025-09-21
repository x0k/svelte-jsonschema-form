import { userEvent } from '@vitest/browser/context';
import { cast } from '@sjsf/form/lib/component';
import type { ComponentDefinition } from '@sjsf/form';
import TagsField from '@sjsf/form/fields/extra-fields/tags.svelte';
import { s, t, DEFAULT_SPECS } from 'testing/demo';

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

const inputMultiSelect: s.FieldValidationTrigger = async (l) => {
	const select = t.getListbox(l);
	await userEvent.click(select);
	const option = l.getByRole('presentation').last();
	await userEvent.click(option);
};

export const specs: s.Specs = {
	...DEFAULT_SPECS,
	datePicker: [
		s.text,
		{ 'ui:components': { textWidget: 'datePickerWidget' } },
		{
			oninput: t.inputDate,
			onchange: t.changeDate,
			onblur: t.visitDate
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
			oninput: inputMultiSelect,
			onchange: inputMultiSelect,
			onblur: t.visitMultiSelect
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
			onchange: t.changeRadio
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
	tags: [
		s.uniqueArray,
		{
			'ui:components': {
				arrayField: tagsAsArrayField
			}
		},
		{
			oninput: t.inputTags,
			onchange: t.changeTags,
			onblur: t.visitTags
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

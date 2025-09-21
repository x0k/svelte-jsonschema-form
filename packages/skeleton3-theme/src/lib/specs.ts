import type { Locator } from '@vitest/browser/context';
import { cast } from '@sjsf/form/lib/component';
import type { ComponentDefinition } from '@sjsf/form';
import FilesField from '@sjsf/form/fields/extra-fields/files.svelte';
import TagsField from '@sjsf/form/fields/extra-fields/tags.svelte';
import { s, t, DEFAULT_SPECS } from 'testing/demo';

import './extra-widgets/checkboxes-include';
import './extra-widgets/date-picker-include';

import FileUpload from './extra-widgets/file-upload.svelte';
import './extra-widgets/file-upload.svelte';

import './extra-widgets/file-include';
import './extra-widgets/multi-select-include';
import './extra-widgets/radio-buttons-include';
import './extra-widgets/radio-include';
import './extra-widgets/range-include';
import './extra-widgets/rating-include';

import Slider from './extra-widgets/slider.svelte';
import './extra-widgets/slider.svelte';

import './extra-widgets/switch-include';
import './extra-widgets/tags-include';
import './extra-widgets/textarea-include';

const filesAsArrayField = cast(FilesField, {
	value: {
		transform(props) {
			s.assertStrings(props.value);
			return props.value;
		}
	}
}) satisfies ComponentDefinition<'arrayField'>;

const tagsAsArrayField = cast(TagsField, {
	value: {
		transform(props) {
			s.assertStrings(props.value);
			return props.value;
		}
	}
}) satisfies ComponentDefinition<'arrayField'>;

const getRadioButtonLabel = (l: Locator) => l.getByTestId('segment-item').last();

const getFileInput = (l: Locator) => l.getByRole('button').nth(1)

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
	fileUpload: [
		s.file,
		{
			'ui:components': {
				stringField: 'fileField',
				fileWidget: FileUpload
			}
		},
		{
			onchange: t.uploadFile(getFileInput)
		}
	],
	fileUploadMultiple: [
		s.filesArray,
		{
			'ui:components': {
				arrayField: filesAsArrayField,
				fileWidget: FileUpload
			}
		},
		{
			onchange: t.uploadFile(getFileInput)
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
			oninput: t.click(getRadioButtonLabel),
			onchange: t.click(getRadioButtonLabel)
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
		{ 'ui:components': { numberWidget: 'ratingWidget' } },
		{
			oninput: t.inputRadio,
			onchange: t.changeRadio
		}
	],
	slider: [
		s.number,
		{ 'ui:components': { numberWidget: Slider } },
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
			onchange: t.changeSwitch
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
			// TODO: Figure out why it doesn't work in headless mode
			// onblur: t.withTab(t.inputTags, true)
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

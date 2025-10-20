import { s, DEFAULT_SPECS } from 'theme-testing/demo';
import '@sjsf/form/fields/extra/array-tags-include';
import '@sjsf/form/fields/extra/array-files-include';

import './extra-widgets/checkboxes-include';
import './extra-widgets/combobox-include.js';
import './extra-widgets/date-picker-include';
import './extra-widgets/file-upload-include.js';
import './extra-widgets/file-include';
import './extra-widgets/multi-select-include';
import './extra-widgets/radio-buttons-include';
import './extra-widgets/radio-include';
import './extra-widgets/range-include';
import './extra-widgets/rating-include';
import './extra-widgets/slider-include.js';
import './extra-widgets/switch-include';
import './extra-widgets/tags-include';
import './extra-widgets/textarea-include';

export const specs: s.Specs = {
	...DEFAULT_SPECS,
	combobox: [
		s.enumeration,
		{
			'ui:components': {
				stringField: 'enumField',
				selectWidget: 'comboboxWidget'
			}
		},
		{
			// oninput: 'inputSkeletonCombobox',
			// onchange: 'changeSkeletonCombobox',
			// onblur: 'visitSkeletonCombobox'
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
	fileUpload: [
		s.file,
		{
			'ui:components': {
				stringField: 'fileField',
				fileWidget: 'skeleton3FileUploadWidget'
			}
		},
		{
			onchange: 'changeSkeletonFile'
		}
	],
	fileUploadMultiple: [
		s.filesArray,
		{
			'ui:components': {
				arrayField: 'arrayFilesField',
				fileWidget: 'skeleton3FileUploadWidget'
			}
		},
		{
			onchange: 'changeSkeletonFile'
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
			oninput: 'inputSkeletonRadioButton',
			onchange: 'changeSkeletonRadioButton'
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
		{ 'ui:components': { numberWidget: 'ratingWidget' } },
		{
			oninput: 'inputRadio',
			onchange: 'changeRadio'
		}
	],
	slider: [
		s.number,
		{ 'ui:components': { numberWidget: 'skeleton3SliderWidget' } },
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
			onchange: 'changeSwitch'
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
	]
};

export const extraWidgets = Object.keys(import.meta.glob('./extra-widgets/*.svelte')).map(
	(widget) => widget.substring(16, widget.length - 7)
);

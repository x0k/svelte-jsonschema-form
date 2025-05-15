import { cast } from '@sjsf/form/lib/component';
import type { ComponentDefinition } from '@sjsf/form';
import FilesField from '@sjsf/form/fields/extra-fields/files.svelte';
import TagsField from '@sjsf/form/fields/extra-fields/tags.svelte';
import { s } from 'testing/demo';

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

export const specs: s.Specs = {
	datePicker: [s.text, { 'ui:components': { textWidget: 'datePickerWidget' } }],
	fileUpload: [
		s.file,
		{
			'ui:components': {
				stringField: 'fileField',
				fileWidget: FileUpload
			}
		}
	],
	fileUploadMultiple: [
		s.filesArray,
		{
			'ui:components': {
				arrayField: filesAsArrayField,
				fileWidget: FileUpload
			}
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
	rating: [s.number, { 'ui:components': { numberWidget: 'ratingWidget' } }],
	slider: [s.number, { 'ui:components': { numberWidget: Slider } }],
	switch: [s.boolean, { 'ui:components': { checkboxWidget: 'switchWidget' } }],
	tags: [
		s.uniqueArray,
		{
			'ui:components': {
				arrayField: tagsAsArrayField
			}
		}
	],
	textarea: [s.text, { 'ui:components': { textWidget: 'textareaWidget' } }]
};

export const extraWidgets = Object.keys(import.meta.glob('./extra-widgets/*.svelte')).map(
	(widget) => widget.substring(16, widget.length - 7)
);

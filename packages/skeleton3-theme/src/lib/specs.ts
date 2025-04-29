import { cast } from '@sjsf/form/lib/component';
import type { SchemaArrayValue } from '@sjsf/form/core';
import type { ComponentDefinition } from '@sjsf/form';
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

export const specs: s.Specs = {
	datePicker: [s.text, { 'ui:components': { textWidget: 'datePickerWidget' } }],
	fileUpload: [s.file, { 'ui:components': { fileWidget: FileUpload } }],
	fileUploadMultiple: [s.filesArray, { 'ui:components': { fileWidget: FileUpload } }],
	multiSelect: [
		s.uniqueArray,
		{ 'ui:components': { checkboxesWidget: 'multiSelectWidget' }, 'ui:options': { useLabel: true } }
	],
	radioButtons: [
		s.enumeration,
		{ 'ui:components': { selectWidget: 'radioButtonsWidget' }, 'ui:options': { useLabel: false } }
	],
	radio: [
		s.enumeration,
		{ 'ui:components': { selectWidget: 'radioWidget' }, 'ui:options': { useLabel: false } }
	],
	range: [s.number, { 'ui:components': { numberWidget: 'rangeWidget' } }],
	rating: [s.number, { 'ui:components': { numberWidget: 'ratingWidget' } }],
	slider: [s.number, { 'ui:components': { numberWidget: Slider } }],
	switch: [s.boolean, { 'ui:components': { checkboxWidget: 'switchWidget' } }],
	tags: [
		s.uniqueArray,
		{
			'ui:components': {
				multiEnumField: cast(TagsField, {
					value: {
						transform(props) {
							assertStrings(props.value);
							return props.value;
						}
					}
				}) satisfies ComponentDefinition<'multiEnumField'>
			}
		}
	],
	textarea: [s.text, { 'ui:components': { textWidget: 'textareaWidget' } }]
};

function assertStrings(arr: SchemaArrayValue | undefined): asserts arr is string[] | undefined {
	if (
		arr !== undefined &&
		arr.find((item) => {
			return item !== undefined && typeof item !== 'string';
		})
	) {
		throw new TypeError('expected array of strings');
	}
}

export const extraWidgets = Object.keys(import.meta.glob('./extra-widgets/*.svelte')).map(
	(widget) => widget.substring(16, widget.length - 7)
);

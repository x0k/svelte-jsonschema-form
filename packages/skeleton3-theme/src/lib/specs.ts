import { s } from 'testing/demo';

import './extra-widgets/checkboxes-include';
import './extra-widgets/date-picker-include';
import FileUpload from './extra-widgets/file-upload.svelte';
import './extra-widgets/file-include';
import './extra-widgets/multi-select-include';
import './extra-widgets/radio-buttons-include';
import './extra-widgets/radio-include';
import './extra-widgets/range-include';
import './extra-widgets/rating-include';
import Slider from './extra-widgets/slider.svelte';
import './extra-widgets/switch-include';
import './extra-widgets/textarea-include';

export const specs: s.Specs = {
	datePicker: [s.text, { 'ui:components': { textWidget: 'datePickerWidget' } }],
	fileUpload: [s.file, { 'ui:components': { fileWidget: FileUpload } }],
	fileUploadMultiple: [s.filesArray, { 'ui:components': { fileWidget: FileUpload } }],
	multiSelect: [s.uniqueArray, { 'ui:components': { checkboxesWidget: 'multiSelectWidget' } }],
	radioButtons: [s.enumeration, { 'ui:components': { selectWidget: 'radioButtonsWidget' } }],
	radio: [s.enumeration, { 'ui:components': { selectWidget: 'radioWidget' } }],
	range: [s.number, { 'ui:components': { numberWidget: 'rangeWidget' } }],
	rating: [s.number, { 'ui:components': { numberWidget: 'ratingWidget' } }],
	slider: [s.number, { 'ui:components': { numberWidget: Slider } }],
	switch: [s.boolean, { 'ui:components': { checkboxWidget: 'switchWidget' } }],
	textarea: [s.text, { 'ui:components': { textWidget: 'textareaWidget' } }]
};

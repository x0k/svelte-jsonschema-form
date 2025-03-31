import { s } from 'testing/demo';

import './extra-widgets/cally-date-picker-include';
import './extra-widgets/checkboxes-include';
import './extra-widgets/file-include';
import FilterRadioButtons from './extra-widgets/filter-radio-buttons.svelte';
import './extra-widgets/multi-select-include';
import './extra-widgets/radio-buttons-include';
import './extra-widgets/radio-include';
import './extra-widgets/range-include';
import './extra-widgets/rating-include';
import './extra-widgets/switch-include';
import './extra-widgets/textarea-include';

import PikadayDatePicker from './extra-widgets/pikaday-date-picker.svelte';

export const specs: s.Specs = {
	callyDatePicker: [s.text, { 'ui:components': { textWidget: 'datePickerWidget' } }],
	filterRadioButtons: [s.enumeration, { 'ui:components': { selectWidget: FilterRadioButtons } }],
	multiSelect: [s.uniqueArray, { 'ui:components': { checkboxesWidget: 'multiSelectWidget' } }],
	pikadayDatePicker: [s.text, { 'ui:components': { textWidget: PikadayDatePicker } }],
	radioButtons: [s.enumeration, { 'ui:components': { selectWidget: 'radioButtonsWidget' } }],
	radio: [s.enumeration, { 'ui:components': { selectWidget: 'radioWidget' } }],
	range: [s.number, { 'ui:components': { numberWidget: 'rangeWidget' } }],
	rating: [s.number, { 'ui:components': { numberWidget: 'ratingWidget' } }],
	switch: [s.boolean, { 'ui:components': { checkboxWidget: 'switchWidget' } }],
	textarea: [s.text, { 'ui:components': { textWidget: 'textareaWidget' } }]
};

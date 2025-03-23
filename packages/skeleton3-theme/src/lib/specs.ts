import { s } from 'testing/demo';

import './extra-widgets/checkboxes-include';
import './extra-widgets/date-picker-include';
import './extra-widgets/file-include';
import './extra-widgets/multi-select-include';
import './extra-widgets/radio-include';
import './extra-widgets/range-include';
import './extra-widgets/textarea-include';

export const specs: s.Specs = {
	datePicker: [s.text, { 'ui:components': { textWidget: 'datePickerWidget' } }],
	multiSelect: [s.uniqueArray, { 'ui:components': { checkboxesWidget: 'multiSelectWidget' } }],
	radio: [s.enumeration, { 'ui:components': { selectWidget: 'radioWidget' } }],
	range: [s.number, { 'ui:components': { numberWidget: 'rangeWidget' } }],
	textarea: [s.text, { 'ui:components': { textWidget: 'textareaWidget' } }]
};

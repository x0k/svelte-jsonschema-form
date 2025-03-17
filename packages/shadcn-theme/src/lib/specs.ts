import { s } from 'testing/demo';

import './theme/extra-widgets/checkboxes-include';
import './theme/extra-widgets/date-picker-include';
import './theme/extra-widgets/file-include';
import './theme/extra-widgets/multi-select-include';
import './theme/extra-widgets/radio-include';
import './theme/extra-widgets/range-include';
import './theme/extra-widgets/switch-include';
import './theme/extra-widgets/textarea-include';

export const specs: s.Specs = {
	datePicker: [s.text, { 'ui:components': { textWidget: 'datePickerWidget' } }],
	multiSelect: [s.uniqueArray, { 'ui:components': { checkboxesWidget: 'multiSelectWidget' } }],
	radio: [s.enumeration, { 'ui:components': { selectWidget: 'radioWidget' } }],
	range: [s.number, { 'ui:components': { numberWidget: 'rangeWidget' } }],
	switch: [s.boolean, { 'ui:components': { checkboxWidget: 'switchWidget' } }],
	textarea: [s.text, { 'ui:components': { textWidget: 'textareaWidget' } }]
};

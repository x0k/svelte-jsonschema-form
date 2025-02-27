import { createMessage, type Definitions } from '@sjsf/form';
import * as fields from '@sjsf/legacy-fields/exports';
import * as templates from '@sjsf/legacy-templates/exports';

import * as components from './components/exports.js';
import * as widgets from './widgets/exports.js';

export const definitions = {
	datePickerWidget: createMessage('widget "datePickerWidget" is missing'),
	multiSelectWidget: createMessage('widget "multiSelectWidget" is missing'),
	rangeWidget: createMessage('widget "rangeWidget" is missing'),
	switchWidget: createMessage('widget "switchWidget" is missing'),
	textareaWidget: createMessage('widget "textareaWidget" is missing'),
	...fields,
	...templates,
	...components,
	...widgets
} satisfies Definitions;

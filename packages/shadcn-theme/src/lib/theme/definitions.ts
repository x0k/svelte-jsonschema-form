import { createMessage, type Definitions } from '@sjsf/form';
import * as fields from '@sjsf/legacy-fields/exports';
import * as templates from '@sjsf/legacy-templates/exports';
import '@sjsf/legacy-fields/exports';
import '@sjsf/basic-theme/components/exports';

import * as components from './components/exports.js';
import * as widgets from './widgets/exports.js';

export const definitions: Definitions = {
	datePickerWidget: createMessage('widget "datePickerWidget" is missing'),
	switchWidget: createMessage('widget "switchWidget" is missing'),
	multiSelectWidget: createMessage('widget "multiSelectWidget" is missing'),
	textareaWidget: createMessage('widget "textareaWidget" is missing'),
	rangeWidget: createMessage('widget "rangeWidget" is missing'),
	...fields,
	...templates,
	...components,
	...widgets
};

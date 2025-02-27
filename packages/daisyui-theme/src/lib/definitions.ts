import { createMessage, type Definitions } from '@sjsf/form';
import * as fields from '@sjsf/legacy-fields/exports';
import * as templates from '@sjsf/legacy-templates/exports';
import '@sjsf/basic-theme/components/exports';
import '@sjsf/basic-theme/widgets/exports';

import * as components from './components/exports';
import * as widgets from './widgets/exports';

export const definitions = {
	multiSelectWidget: createMessage('widget "multiSelectWidget" is missing'),
	switchWidget: createMessage('widget "switchWidget" is missing'),
	textareaWidget: createMessage('widget "textareaWidget" is missing'),
	...fields,
	...templates,
	...components,
	...widgets
} satisfies Definitions;

import type { ComponentDefinitions } from '@sjsf/form';
import * as templates from '@sjsf/form/templates/exports';

import * as components from './components/exports.js';
import * as widgets from './widgets/exports.js';

export interface ExtraWidgets {}

export const definitions = {
	...templates,
	...components,
	...widgets
} satisfies Partial<ComponentDefinitions> as typeof templates &
	typeof components &
	typeof widgets &
	Pick<ComponentDefinitions, keyof ExtraWidgets>;

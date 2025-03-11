import type { ExtendableComponentDefinitionsWithoutFields } from '@sjsf/form/fields/resolver';
import * as templates from '@sjsf/form/templates/exports';

import * as components from './components/exports.js';
import * as widgets from './widgets/exports.js';

export const definitions = {
	...templates,
	...components,
	...widgets
} satisfies ExtendableComponentDefinitionsWithoutFields;

export const extendable: ExtendableComponentDefinitionsWithoutFields = definitions;

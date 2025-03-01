import type { ExtendableDefinitions } from '@sjsf/form';
import * as fields from '@sjsf/legacy-fields/exports';
import * as templates from '@sjsf/legacy-templates/exports';
import '@sjsf/legacy-fields/exports';
import '@sjsf/basic-theme/components/exports';

import * as components from './components/exports.js';
import * as widgets from './widgets/exports.js';

export const definitions = {
	...fields,
	...templates,
	...components,
	...widgets
} satisfies ExtendableDefinitions;

export const extendable: ExtendableDefinitions = definitions;

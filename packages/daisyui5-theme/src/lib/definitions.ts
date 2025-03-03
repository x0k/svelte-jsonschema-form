import type { ExtendableComponentDefinitions } from '@sjsf/form';
import * as fields from '@sjsf/legacy-fields/exports';
import * as templates from '@sjsf/legacy-templates/exports';

import * as components from './components/exports';
import * as widgets from './widgets/exports';

export const definitions = {
	...fields,
	...templates,
	...components,
	...widgets
} satisfies ExtendableComponentDefinitions;

export const extendable: ExtendableComponentDefinitions = definitions;

import type { ExtendableComponentDefinitionsWithoutFields } from '@sjsf/form/fields/resolver';
import * as templates from '@sjsf/form/templates/exports';

import * as components from './components/exports';
import * as widgets from './widgets/exports';

export const definitions = {
	...templates,
	...components,
	...widgets
} satisfies ExtendableComponentDefinitionsWithoutFields;

export const extendable: ExtendableComponentDefinitionsWithoutFields = definitions;

import type { ExtendableDefinitions } from '@sjsf/form';
import * as fields from '@sjsf/legacy-fields/exports';
import * as templates from '@sjsf/legacy-templates/exports';
import '@sjsf/basic-theme/components/exports';
import '@sjsf/basic-theme/widgets/exports';

import * as components from './components/exports';
import * as widgets from './widgets/exports';

export const definitions = {
	...fields,
	...templates,
	...components,
	...widgets
} satisfies ExtendableDefinitions;

export const extendable: ExtendableDefinitions = definitions;

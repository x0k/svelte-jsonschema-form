import "@sjsf/basic-theme/components/exports"
import "@sjsf/basic-theme/widgets/exports"

import { fromRecord } from '@sjsf/form/lib/resolver';
import { createTheme, type Definitions } from '@sjsf/form';
import * as fields from '@sjsf/legacy-fields/exports';
import * as templates from '@sjsf/legacy-templates/exports';

import * as components from './components';
import * as widgets from './widgets';

export { fields, templates, components, widgets };

const definitions: Definitions = {
	...fields,
	...templates,
	...components,
	...widgets
}

export const themeResolver = fromRecord(definitions)

export const theme = createTheme(themeResolver)

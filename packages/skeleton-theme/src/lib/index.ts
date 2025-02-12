import { createTheme } from '@sjsf/form';
import * as fields from '@sjsf/form/fields/export';
import * as templates from '@sjsf/form/templates/export';

import * as components from './components';
import * as widgets from './widgets';

export { fields, templates, components, widgets };

export const theme = createTheme({
	...fields,
	...templates,
	...components,
	...widgets
});

import '@sjsf/basic-theme/components/exports';
import '@sjsf/basic-theme/widgets/exports';

import { fromRecord } from '@sjsf/form/lib/resolver';
import { createTheme, type Definitions } from '@sjsf/form';
import * as fields from '@sjsf/legacy-fields/exports';
import * as templates from '@sjsf/legacy-templates/exports';

import * as components from './components/exports';
import * as widgets from './widgets/exports';

export { fields, templates, components, widgets };

const definitions: Definitions = {
	...fields,
	...templates,
	...components,
	...widgets
};

export const themeResolver = fromRecord(definitions);

export const theme = createTheme(themeResolver);

// declare module '@sjsf/form' {
// 	interface Inputs {
// 		daisyui5CallyCalendar: CalendarProps;
// 	}

// 	interface UiOptions {
// 		trigger?: HTMLButtonAttributes;
// 		formatDate?: (date: string) => string;
// 		pikaday?: PikadayOptions;
// 	}
// 	interface WidgetsAndProps<V> {
// 		toggle: WidgetCommonProps<V, HTMLInputAttributes>;
// 		filter: RadioWidgetProps<V>;
// 		callyCalendar: WidgetCommonProps<V, CalendarProps>;
// 		pikadayCalendar: WidgetCommonProps<V, HTMLInputAttributes>;
// 	}

// 	interface WidgetValue {
// 		toggle: boolean;
// 		filter: SchemaValue;
// 		callyCalendar: string;
// 		pikadayCalendar: string;
// 	}
// }

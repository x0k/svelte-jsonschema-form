import { fromRecord } from '@sjsf/form/lib/resolver';
import { createTheme } from '@sjsf/form';

import { definitions } from './definitions';

export * as components from './components/exports';
export * as widgets from './widgets/exports';

export const themeResolver = fromRecord(definitions);

export const theme = createTheme(themeResolver);

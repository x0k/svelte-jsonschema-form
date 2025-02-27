import '@sjsf/legacy-fields/exports';
import '@sjsf/basic-theme/components/exports';

import { fromRecord } from '@sjsf/form/lib/resolver';
import { createTheme } from '@sjsf/form';

export * from './context';

import { definitions } from './definitions';

export const themeResolver = fromRecord(definitions);

export const theme = createTheme(themeResolver);

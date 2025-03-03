import { fromRecord } from '@sjsf/form/lib/resolver';
import '@sjsf/legacy-fields/exports';
import '@sjsf/legacy-templates/exports';

import { definitions } from './definitions';

export * as components from './components/exports';
export * as widgets from './widgets/exports';

export const theme = fromRecord(definitions);

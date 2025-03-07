import { fromRecord } from '@sjsf/form/lib/resolver';
import "@sjsf/form/fields/exports";
import "@sjsf/form/templates/exports";
import '@sjsf/basic-theme/components/exports';
import '@sjsf/basic-theme/widgets/exports';

import { definitions } from './definitions';

export * as components from './components/exports';
export * as widgets from './widgets/exports';

export const theme = fromRecord(definitions);

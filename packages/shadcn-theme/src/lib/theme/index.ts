import { extendByRecord } from '@sjsf/form/lib/resolver';
import { fields } from '@sjsf/form/fields/resolver';
import '@sjsf/form/fields/exports';
import '@sjsf/form/templates/exports';
import '@sjsf/basic-theme/components/exports';

import { definitions } from './definitions';
import './widgets/exports';

export * from './context';

export const theme = extendByRecord(fields, definitions);

import { extendByRecord } from '@sjsf/form/lib/resolver';
import { fields } from '@sjsf/form/fields/resolver';

import { definitions } from './definitions';

export * from './context';

export const theme = extendByRecord(fields, definitions);

import { extendByRecord } from '@sjsf/form/lib/resolver';
import { base } from '@sjsf/form/theme';

import { definitions } from './definitions';

export * from './context';

export const theme = extendByRecord(base, definitions);

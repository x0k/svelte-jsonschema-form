import { extendByRecord } from '@sjsf/form/lib/resolver';
import { theme as base } from '@sjsf/shadcn4-theme';

import { definitions } from './definitions.js';

export const theme = extendByRecord(base, definitions);

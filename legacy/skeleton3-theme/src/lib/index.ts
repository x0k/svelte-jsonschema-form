import { extendByRecord } from '@sjsf/form/lib/resolver';
import { base } from '@sjsf/form/theme';

import { definitions } from './definitions.js';

export const theme = extendByRecord(base, definitions);

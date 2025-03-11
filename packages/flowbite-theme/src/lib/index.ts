import { extendByRecord } from '@sjsf/form/lib/resolver';
import { fields } from '@sjsf/form/fields/resolver';
import '@sjsf/form/fields/exports';
import '@sjsf/form/templates/exports';

import { definitions } from './definitions';
import './components/exports';
import './widgets/exports';

export const theme = extendByRecord(fields, definitions);

import { clientOnly } from '@sjsf/form/lib/env';

import { extendable } from '../definitions';

export type * as __preserveCallyTypes from './cally-date-picker.svelte';

extendable.datePickerWidget = clientOnly(() => import('./cally-date-picker.svelte'));

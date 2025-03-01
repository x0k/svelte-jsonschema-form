import { clientOnly } from '@sjsf/form/lib/env';

import { extendable } from '../definitions';

export type * as __preservePikadayTypes from './pikaday-date-picker.svelte';

extendable.datePickerWidget = clientOnly(() => import('./pikaday-date-picker.svelte'));

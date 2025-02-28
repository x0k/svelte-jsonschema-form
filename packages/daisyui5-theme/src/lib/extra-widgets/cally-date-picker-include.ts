import { clientOnly } from '@sjsf/form/lib/env';

import { extendable } from '../definitions';

import './cally-date-picker.svelte';

extendable.datePickerWidget = clientOnly(() => import('./cally-date-picker.svelte'));

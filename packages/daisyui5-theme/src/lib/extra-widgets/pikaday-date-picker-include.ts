import { clientOnly } from '@sjsf/form/lib/env';

import { extendable } from '../definitions';

import './pikaday-date-picker.svelte';

extendable.datePickerWidget = clientOnly(() => import('./pikaday-date-picker.svelte'));

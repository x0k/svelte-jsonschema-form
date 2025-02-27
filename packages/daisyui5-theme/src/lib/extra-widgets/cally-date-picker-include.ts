import { clientOnly } from '@sjsf/form/lib/env';

import { definitions } from '../definitions';

import './cally-date-picker.svelte';

definitions.datePickerWidget = clientOnly(() => import('./cally-date-picker.svelte'));

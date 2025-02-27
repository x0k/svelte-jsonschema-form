import { clientOnly } from '@sjsf/form/lib/env';

import { definitions } from '../definitions';

import './pikaday-date-picker.svelte';

definitions.datePickerWidget = clientOnly(() => import('./pikaday-date-picker.svelte'));

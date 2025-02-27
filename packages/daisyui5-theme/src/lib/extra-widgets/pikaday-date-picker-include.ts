import { clientOnly } from '@sjsf/form/lib/env';

import { definitions } from '../definitions';

definitions.datePickerWidget = clientOnly(() => import('./pikaday-date-picker.svelte'));

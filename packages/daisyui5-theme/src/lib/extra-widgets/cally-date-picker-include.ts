import { clientOnly } from '@sjsf/form/lib/env';

import { definitions } from '../definitions.js';

export type * as __preserveCallyTypes from './cally-date-picker.svelte';

declare module "../definitions.js" {
  interface ExtraWidgets {
    datePickerWidget: {}
  }
}

definitions.datePickerWidget = clientOnly(() => import('./cally-date-picker.svelte'));

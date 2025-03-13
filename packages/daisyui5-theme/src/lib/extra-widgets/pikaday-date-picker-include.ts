import { clientOnly } from '@sjsf/form/lib/env';

import { definitions } from '../definitions';

export type * as __preservePikadayTypes from './pikaday-date-picker.svelte';

declare module "../definitions.js" {
  interface ExtraWidgets {
    datePickerWidget: {}
  }
}

definitions.datePickerWidget = clientOnly(() => import('./pikaday-date-picker.svelte'));

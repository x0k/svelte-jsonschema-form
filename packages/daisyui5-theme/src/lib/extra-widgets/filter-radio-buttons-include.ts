import { definitions } from '../definitions.js';

import RadioButtons from './filter-radio-buttons.svelte';
import './filter-radio-buttons.svelte';

declare module "../definitions.js" {
  interface ExtraWidgets {
    radioButtonsWidget: {}
  }
}



definitions.radioButtonsWidget = RadioButtons;

import { definitions } from '../definitions.js';

import PikadayDatePicker from './pikaday-date-picker.svelte';
import './pikaday-date-picker.svelte';

declare module "../definitions.js" {
  interface ExtraWidgets {
    datePickerWidget: {}
  }
}

definitions.datePickerWidget = PikadayDatePicker

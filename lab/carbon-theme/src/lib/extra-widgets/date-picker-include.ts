import { definitions } from "../definitions.js";

import DatePicker from "./date-picker.svelte";
import "./date-picker.svelte";

declare module "../definitions.js" {
  interface ExtraWidgets {
    datePickerWidget: {};
  }
}

definitions.datePickerWidget = DatePicker;

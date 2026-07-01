import { definitions } from "../definitions.js";
import VcDatePicker from "./vc-date-picker.svelte";
import "./vc-date-picker.svelte";

declare module "../definitions.js" {
  interface ExtraWidgets {
    daisyui5VcDatePickerWidget: {};
  }
}

definitions.daisyui5VcDatePickerWidget = VcDatePicker;

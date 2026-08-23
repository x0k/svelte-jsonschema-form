import { definitions } from "../definitions.js";
import datePickerWidget from "./date-picker.svelte";
import "./date-picker.svelte";

declare module "../definitions.js" {
  interface ExtraWidgets {
    datePickerWidget: {};
  }
}

definitions.datePickerWidget = datePickerWidget;

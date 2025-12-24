import { definitions } from "../definitions.js";

import ColorPicker from "./color-picker.svelte";
import "./color-picker.svelte";

declare module "../definitions.js" {
  interface ExtraWidgets {
    colorPickerWidget: {};
  }
}

definitions.colorPickerWidget = ColorPicker;

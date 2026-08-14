import { definitions } from "../definitions.js";
import Widget from "./color-picker.svelte";
import "./color-picker.svelte";

declare module "../definitions.js" {
  interface ExtraWidgets {
    stdfColorPickerWidget: {};
  }
}

definitions.stdfColorPickerWidget = Widget;

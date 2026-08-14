import { definitions } from "../definitions.js";
import Widget from "./combobox.svelte";
import "./combobox.svelte";

declare module "../definitions.js" {
  interface ExtraWidgets {
    comboboxWidget: {};
  }
}

definitions.comboboxWidget = Widget;

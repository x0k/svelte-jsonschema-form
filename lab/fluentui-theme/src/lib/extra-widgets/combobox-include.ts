import { definitions } from "../definitions.js";
import comboboxWidget from "./combobox.svelte";
import "./combobox.svelte";

declare module "../definitions.js" {
  interface ExtraWidgets {
    comboboxWidget: {};
  }
}

definitions.comboboxWidget = comboboxWidget;

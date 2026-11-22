import { definitions } from "../definitions.js";
import DateWidget from "./date-input.svelte";
import "./date-input.svelte";

declare module "../definitions.js" {
  interface ExtraWidgets {
    dateInputWidget: {};
  }
}

definitions.dateInputWidget = DateWidget;

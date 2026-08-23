import { definitions } from "../definitions.js";
import multiSelectWidget from "./multi-select.svelte";
import "./multi-select.svelte";

declare module "../definitions.js" {
  interface ExtraWidgets {
    multiSelectWidget: {};
  }
}

definitions.multiSelectWidget = multiSelectWidget;

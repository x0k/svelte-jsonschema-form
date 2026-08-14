import { definitions } from "../definitions.js";
import Widget from "./multi-select.svelte";
import "./multi-select.svelte";

declare module "../definitions.js" {
  interface ExtraWidgets {
    multiSelectWidget: {};
  }
}

definitions.multiSelectWidget = Widget;

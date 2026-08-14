import { definitions } from "../definitions.js";
import Widget from "./checkboxes.svelte";
import "./checkboxes.svelte";

declare module "../definitions.js" {
  interface ExtraWidgets {
    checkboxesWidget: {};
  }
}

definitions.checkboxesWidget = Widget;

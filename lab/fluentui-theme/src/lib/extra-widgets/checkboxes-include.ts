import { definitions } from "../definitions.js";
import checkboxesWidget from "./checkboxes.svelte";
import "./checkboxes.svelte";

declare module "../definitions.js" {
  interface ExtraWidgets {
    checkboxesWidget: {};
  }
}

definitions.checkboxesWidget = checkboxesWidget;

import { definitions } from "../definitions.js";
import Widget from "./range.svelte";
import "./range.svelte";

declare module "../definitions.js" {
  interface ExtraWidgets {
    rangeWidget: {};
  }
}

definitions.rangeWidget = Widget;

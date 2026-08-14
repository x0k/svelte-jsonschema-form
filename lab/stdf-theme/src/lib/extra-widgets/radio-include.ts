import { definitions } from "../definitions.js";
import Widget from "./radio.svelte";
import "./radio.svelte";

declare module "../definitions.js" {
  interface ExtraWidgets {
    radioWidget: {};
  }
}

definitions.radioWidget = Widget;

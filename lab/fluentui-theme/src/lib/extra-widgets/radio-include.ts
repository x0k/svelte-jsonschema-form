import { definitions } from "../definitions.js";
import radioWidget from "./radio.svelte";
import "./radio.svelte";

declare module "../definitions.js" {
  interface ExtraWidgets {
    radioWidget: {};
  }
}

definitions.radioWidget = radioWidget;

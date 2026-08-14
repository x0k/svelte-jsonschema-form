import { definitions } from "../definitions.js";
import Widget from "./switch.svelte";
import "./switch.svelte";

declare module "../definitions.js" {
  interface ExtraWidgets {
    switchWidget: {};
  }
}

definitions.switchWidget = Widget;

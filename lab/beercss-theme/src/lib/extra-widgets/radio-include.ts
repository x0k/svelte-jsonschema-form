import { definitions } from "../definitions.js";

import Radio from "./radio.svelte";
import "./radio.svelte";

declare module "../definitions.js" {
  interface ExtraWidgets {
    radioWidget: {}
  }
}

definitions.radioWidget = Radio;

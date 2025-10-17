import { definitions } from "../definitions.js";

import { displayPrimitiveValue } from "./display-primitive-value.svelte";
import "./display-primitive-value.svelte";

declare module "../definitions.js" {
  interface ExtraActions {
    displayPrimitiveValue: {};
  }
}

definitions.displayPrimitiveValue = displayPrimitiveValue;

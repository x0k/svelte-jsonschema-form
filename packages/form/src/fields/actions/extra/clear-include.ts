import { definitions } from "../definitions.js";

import { clear } from "./clear.svelte";
import "./clear.svelte";

declare module "../definitions.js" {
  interface ExtraActions {
    clear: {};
  }
}

definitions.clear = clear;

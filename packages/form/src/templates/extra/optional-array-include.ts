import { definitions } from "../resolver/definitions.js";

import OptionalArray from "./optional-array.svelte";
import "./optional-array.svelte";

declare module "../resolver/definitions.js" {
  interface ExtraTemplates {
    optionalArrayTemplate: {};
  }
}

definitions.optionalArrayTemplate = OptionalArray;

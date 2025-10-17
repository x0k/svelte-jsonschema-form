import { definitions } from "../../theme/definitions.js";

import OptionalArray from "./optional-array.svelte";
import "./optional-array.svelte";

declare module "../../theme/definitions.js" {
  interface ExtraComponents {
    optionalArrayTemplate: {};
  }
}

definitions.optionalArrayTemplate = OptionalArray;

import { definitions } from "../../theme/definitions.js";

import OptionalObject from "./optional-object.svelte";
import "./optional-object.svelte";

declare module "../../theme/definitions.js" {
  interface ExtraComponents {
    optionalObjectTemplate: {};
  }
}

definitions.optionalObjectTemplate = OptionalObject;

import { definitions } from "../../theme/definitions.js";

import OptionalField from "./optional-field.svelte";
import "./optional-field.svelte";

declare module "../../theme/definitions.js" {
  interface ExtraComponents {
    optionalFieldTemplate: {};
  }
}

definitions.optionalFieldTemplate = OptionalField;

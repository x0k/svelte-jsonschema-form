import { definitions } from "../../theme/definitions.js";

import OptionalMultiField from "./optional-multi-field.svelte";
import "./optional-multi-field.svelte";

declare module "../../theme/definitions.js" {
  interface ExtraComponents {
    optionalMultiFieldTemplate: {};
  }
}

definitions.optionalMultiFieldTemplate = OptionalMultiField;

import { definitions } from "../../resolver/definitions.js";

import OptionalField from "./optional-field.svelte";
import "./optional-field.svelte";

declare module "../../resolver/definitions.js" {
  interface ExtraComponents {
    optionalFieldTemplate: {};
  }
}

definitions.optionalFieldTemplate = OptionalField;

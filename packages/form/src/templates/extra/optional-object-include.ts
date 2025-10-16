import { definitions } from "../resolver/definitions.js";

import OptionalObject from "./optional-object.svelte";
import "./optional-object.svelte";

declare module "../resolver/definitions.js" {
  interface ExtraTemplates {
    optionalObjectTemplate: {};
  }
}

definitions.optionalObjectTemplate = OptionalObject;

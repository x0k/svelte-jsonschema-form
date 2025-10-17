import { definitions } from "../../resolver/definitions.js";

import OptionalObject from "./optional-object.svelte";
import "./optional-object.svelte";

declare module "../../resolver/definitions.js" {
  interface ExtraComponents {
    optionalObjectTemplate: {};
  }
}

definitions.optionalObjectTemplate = OptionalObject;

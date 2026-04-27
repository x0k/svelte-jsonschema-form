import { definitions } from "../../theme/definitions.js";

import ObjectKeyEnum from "./object-key-enum.svelte";
import "./object-key-enum.svelte";

declare module "../../theme/definitions.js" {
  interface ExtraComponents {
    objectKeyEnumField: {};
  }
}

definitions.objectKeyEnumField = ObjectKeyEnum;

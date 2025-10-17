import { definitions } from "../../theme/definitions.js";

import MultiEnum from "./multi-enum.svelte";
import "./multi-enum.svelte";

declare module "../../theme/definitions.js" {
  interface ExtraComponents {
    multiEnumField: {};
  }
}

definitions.multiEnumField = MultiEnum;

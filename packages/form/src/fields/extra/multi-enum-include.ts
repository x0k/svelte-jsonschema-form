import { definitions } from "../../resolver/definitions.js";

import MultiEnum from "./multi-enum.svelte";
import "./multi-enum.svelte";

declare module "../../resolver/definitions.js" {
  interface ExtraComponents {
    multiEnumField: {};
  }
}

definitions.multiEnumField = MultiEnum;

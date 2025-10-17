import { definitions } from "../../theme/definitions.js";

import Enum from "./enum.svelte";
import "./enum.svelte";

declare module "../../theme/definitions.js" {
  interface ExtraComponents {
    enumField: {};
  }
}

definitions.enumField = Enum;

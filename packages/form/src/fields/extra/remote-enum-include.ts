import { definitions } from "../../theme/definitions.js";

import AsyncEnum from "./remote-enum.svelte";
import "./remote-enum.svelte";

declare module "../../theme/definitions.js" {
  interface ExtraComponents {
    remoteEnumField: {};
  }
}

definitions.remoteEnumField = AsyncEnum;

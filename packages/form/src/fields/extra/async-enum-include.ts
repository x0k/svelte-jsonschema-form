import { definitions } from "../../theme/definitions.js";

import AsyncEnum from "./async-enum.svelte";
import "./async-enum.svelte";

declare module "../../theme/definitions.js" {
  interface ExtraComponents {
    asyncEnumField: {};
  }
}

definitions.asyncEnumField = AsyncEnum;

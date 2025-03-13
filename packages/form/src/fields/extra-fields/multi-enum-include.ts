import { definitions } from "../resolver/definitions.js";

import MultiEnum from "./multi-enum.svelte";
import "./multi-enum.svelte";

declare module "../resolver/definitions.js" {
  interface ExtraFields {
    multiEnumField: {};
  }
}

definitions.multiEnumField = MultiEnum;

import { definitions } from "../resolver/definitions.js";

import Enum from "./enum.svelte";
import "./enum.svelte";

declare module "../resolver/definitions.js" {
  interface ExtraFields {
    enumField: {};
  }
}

definitions.enumField = Enum;

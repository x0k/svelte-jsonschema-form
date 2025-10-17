import { definitions } from "../../resolver/definitions.js";

import Enum from "./enum.svelte";
import "./enum.svelte";

declare module "../../resolver/definitions.js" {
  interface ExtraComponents {
    enumField: {};
  }
}

definitions.enumField = Enum;

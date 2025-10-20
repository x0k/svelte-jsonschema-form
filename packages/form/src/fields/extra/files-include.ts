import { definitions } from "../../theme/definitions.js";

import Files from "./files.svelte";
import "./files.svelte";

declare module "../../theme/definitions.js" {
  interface ExtraComponents {
    filesField: {};
  }
}

definitions.filesField = Files;

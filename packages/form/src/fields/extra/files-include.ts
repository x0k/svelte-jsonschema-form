import { definitions } from "../../resolver/definitions.js";

import Files from "./files.svelte";
import "./files.svelte";

declare module "../../resolver/definitions.js" {
  interface ExtraComponents {
    filesField: {};
  }
}

definitions.filesField = Files;

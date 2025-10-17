import { definitions } from "../../theme/definitions.js";

import File from "./file.svelte";
import "./file.svelte";

declare module "../../theme/definitions.js" {
  interface ExtraComponents {
    fileField: {};
  }
}

definitions.fileField = File;

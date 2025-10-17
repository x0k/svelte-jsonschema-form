import { definitions } from "../../theme/definitions.js";

import ArrayFiles from "./array-files.svelte";
import "./array-files.svelte";

declare module "../../theme/definitions.js" {
  interface ExtraComponents {
    arrayFilesField: {};
  }
}

definitions.arrayFilesField = ArrayFiles;

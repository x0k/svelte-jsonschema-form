import { definitions } from "../resolver/definitions.js";

import ArrayFiles from "./array-files.svelte";
import "./array-files.svelte";

declare module "../resolver/definitions.js" {
  interface ExtraFields {
    arrayFilesField: {};
  }
}

definitions.arrayFilesField = ArrayFiles;

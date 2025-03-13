import { definitions } from "../resolver/definitions.js";

import File from "./file.svelte";
import "./file.svelte";

declare module "../resolver/definitions.js" {
  interface ExtraFields {
    fileField: {};
  }
}

definitions.fileField = File;

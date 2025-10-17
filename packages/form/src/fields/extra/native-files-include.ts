import { definitions } from "../../theme/definitions.js";

import NativeFiles from "./native-files.svelte";
import "./native-files.svelte";

declare module "../../theme/definitions.js" {
  interface ExtraComponents {
    nativeFilesField: {};
  }
}

definitions.nativeFilesField = NativeFiles;

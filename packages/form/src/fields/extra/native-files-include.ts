import { definitions } from "../../resolver/definitions.js";

import NativeFiles from "./native-files.svelte";
import "./native-files.svelte";

declare module "../../resolver/definitions.js" {
  interface ExtraComponents {
    nativeFilesField: {};
  }
}

definitions.nativeFilesField = NativeFiles;

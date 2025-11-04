import { definitions } from "../../theme/definitions.js";

import NativeFile from "./native-file.svelte";
import "./native-file.svelte";

declare module "../../theme/definitions.js" {
  interface ExtraComponents {
    nativeFileField: {};
  }
}

definitions.nativeFileField = NativeFile;

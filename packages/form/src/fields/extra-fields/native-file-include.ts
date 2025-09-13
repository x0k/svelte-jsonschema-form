import { definitions } from "../resolver/definitions.js";

import NativeFile from "./native-file.svelte";
import "./native-file.svelte";

declare module "../resolver/definitions.js" {
  interface ExtraFields {
    nativeFileField: {};
  }
}

definitions.nativeFileField = NativeFile;

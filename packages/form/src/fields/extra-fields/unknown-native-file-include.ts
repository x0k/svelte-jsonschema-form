import { definitions } from "../resolver/definitions.js";

import UnknownNativeFile from "./unknown-native-file.svelte";
import "./unknown-native-file.svelte";

declare module "../resolver/definitions.js" {
  interface ExtraFields {
    unknownNativeFileField: {};
  }
}

definitions.unknownNativeFileField = UnknownNativeFile;

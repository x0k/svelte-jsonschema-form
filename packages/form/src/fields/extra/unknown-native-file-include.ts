import { definitions } from "../../theme/definitions.js";

import UnknownNativeFile from "./unknown-native-file.svelte";
import "./unknown-native-file.svelte";

declare module "../../theme/definitions.js" {
  interface ExtraComponents {
    unknownNativeFileField: {};
  }
}

definitions.unknownNativeFileField = UnknownNativeFile;

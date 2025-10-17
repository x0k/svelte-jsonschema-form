import { definitions } from "../../resolver/definitions.js";

import UnknownNativeFile from "./unknown-native-file.svelte";
import "./unknown-native-file.svelte";

declare module "../../resolver/definitions.js" {
  interface ExtraComponents {
    unknownNativeFileField: {};
  }
}

definitions.unknownNativeFileField = UnknownNativeFile;

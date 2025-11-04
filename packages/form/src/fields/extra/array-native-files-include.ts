import { definitions } from "../../theme/definitions.js";

import ArrayNativeFiles from "./array-native-files.svelte";
import "./array-native-files.svelte";

declare module "../../theme/definitions.js" {
  interface ExtraComponents {
    arrayNativeFilesField: {};
  }
}

definitions.arrayNativeFilesField = ArrayNativeFiles;

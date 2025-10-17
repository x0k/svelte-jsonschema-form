import { definitions } from "../../resolver/definitions.js";

import ArrayNativeFiles from "./array-native-files.svelte";
import "./array-native-files.svelte";

declare module "../../resolver/definitions.js" {
  interface ExtraComponents {
    arrayNativeFilesField: {};
  }
}

definitions.arrayNativeFilesField = ArrayNativeFiles;

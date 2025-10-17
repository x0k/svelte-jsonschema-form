import { definitions } from "../../resolver/definitions.js";

import File from "./file.svelte";
import "./file.svelte";

declare module "../../resolver/definitions.js" {
  interface ExtraComponents {
    fileField: {};
  }
}

definitions.fileField = File;

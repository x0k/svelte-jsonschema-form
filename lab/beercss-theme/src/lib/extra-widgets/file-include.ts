import { definitions } from "../definitions.js";

import File from "./file.svelte";
import "./file.svelte";

declare module "../definitions.js" {
  interface ExtraWidgets {
    fileWidget: {}
  }
}



definitions.fileWidget = File;

import { definitions } from "../definitions.js";

import Textarea from "./textarea.svelte";
import "./textarea.svelte";

declare module "../definitions.js" {
  interface ExtraWidgets {
    textareaWidget: {};
  }
}

definitions.textareaWidget = Textarea;

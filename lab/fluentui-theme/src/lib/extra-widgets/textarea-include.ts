import { definitions } from "../definitions.js";
import textareaWidget from "./textarea.svelte";
import "./textarea.svelte";

declare module "../definitions.js" {
  interface ExtraWidgets {
    textareaWidget: {};
  }
}

definitions.textareaWidget = textareaWidget;

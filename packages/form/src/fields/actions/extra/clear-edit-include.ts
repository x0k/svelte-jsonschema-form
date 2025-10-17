import { definitions } from "../definitions.js";

import { clearEdit } from "./clear-edit.svelte";
import "./clear-edit.svelte";

declare module "../definitions.js" {
  interface ExtraActions {
    clearEdit: {};
  }
}

definitions.clearEdit = clearEdit;

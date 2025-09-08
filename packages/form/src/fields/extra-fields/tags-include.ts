import { definitions } from "../resolver/definitions.js";

import Tags from "./tags.svelte";
import "./tags.svelte";

declare module "../resolver/definitions.js" {
  interface ExtraFields {
    tagsField: {};
  }
}

definitions.tagsField = Tags;

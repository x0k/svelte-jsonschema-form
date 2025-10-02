import { definitions } from "../resolver/definitions.js";

import ArrayTags from "./array-tags.svelte";
import "./array-tags.svelte";

declare module "../resolver/definitions.js" {
  interface ExtraFields {
    arrayTagsField: {};
  }
}

definitions.arrayTagsField = ArrayTags;

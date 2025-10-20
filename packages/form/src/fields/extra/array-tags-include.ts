import { definitions } from "../../theme/definitions.js";

import ArrayTags from "./array-tags.svelte";
import "./array-tags.svelte";

declare module "../../theme/definitions.js" {
  interface ExtraComponents {
    arrayTagsField: {};
  }
}

definitions.arrayTagsField = ArrayTags;

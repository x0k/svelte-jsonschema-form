import { definitions } from "../../theme/definitions.js";

import Tags from "./tags.svelte";
import "./tags.svelte";

declare module "../../theme/definitions.js" {
  interface ExtraComponents {
    tagsField: {};
  }
}

definitions.tagsField = Tags;

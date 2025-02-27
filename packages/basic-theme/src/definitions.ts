import { noopComponent } from "@sjsf/form/lib/svelte.svelte";
import type { Definitions } from "@sjsf/form";
import * as fields from "@sjsf/legacy-fields/exports";
import * as templates from "@sjsf/legacy-templates/exports";

import * as components from "./components/exports.js";
import * as widgets from "./widgets/exports.js";

export const definitions: Definitions = {
  ...fields,
  ...templates,
  ...components,
  ...widgets,
  multiSelectWidget: noopComponent,
  textareaWidget: noopComponent,
};

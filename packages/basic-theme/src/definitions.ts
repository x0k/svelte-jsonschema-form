import { type Definitions, createMessage } from "@sjsf/form";
import * as fields from "@sjsf/legacy-fields/exports";
import * as templates from "@sjsf/legacy-templates/exports";

import * as components from "./components/exports.js";
import * as widgets from "./widgets/exports.js";

export const definitions: Definitions = {
  multiSelectWidget: createMessage('widget "multiSelectWidget" is missing'),
  textareaWidget: createMessage('widget "textareaWidget" is missing'),
  ...fields,
  ...templates,
  ...components,
  ...widgets,
};

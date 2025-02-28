import * as fields from "@sjsf/legacy-fields/exports";
import * as templates from "@sjsf/legacy-templates/exports";

import * as components from "./components/exports.js";
import * as widgets from "./widgets/exports.js";

export const definitions = {
  ...fields,
  ...templates,
  ...components,
  ...widgets,
} satisfies fields.Defs;

export const extendable: fields.Defs = definitions;

import { fromRecord } from "@sjsf/form/lib/resolver";
import type { Definitions } from "@sjsf/form";
import * as fields from "@sjsf/legacy-fields/export";
import * as templates from "@sjsf/legacy-templates/export";

import * as components from "./components/index.js";
import * as widgets from "./widgets/index.js";

export { fields, templates, components, widgets };

const definitions: Definitions = {
  ...fields,
  ...templates,
  ...components,
  ...widgets,
};

export const themeResolver = fromRecord(definitions);

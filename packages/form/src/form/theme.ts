import type { FieldsResolver } from "./fields/index.js";
import type { TemplatesResolver } from "./templates/index.js";
import type { ComponentsResolver } from "./component.js";
import type { WidgetsResolver } from "./widgets.js";

export interface Theme {
  fields: FieldsResolver;
  templates: TemplatesResolver;
  components: ComponentsResolver;
  widgets: WidgetsResolver;
}

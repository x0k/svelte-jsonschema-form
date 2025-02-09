import type { FieldsResolver } from "./fields.js";
import type { TemplatesResolver } from "./templates.js";
import type { ComponentsResolver } from "./component.js";
import type { WidgetsResolver } from "./widgets.js";

export interface Theme {
  fields: FieldsResolver;
  templates: TemplatesResolver;
  components: ComponentsResolver;
  widgets: WidgetsResolver;
}

import type { Components } from "./component.js";
import type { Fields } from "./fields/index.js";
import type { Templates } from "./templates/index.js";
import type { Widgets } from "./widgets.js";

export interface Theme {
  components: Components;
  widgets: Widgets;
  fields?: Fields;
  templates?: Templates;
}

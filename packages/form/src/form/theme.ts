import type { Components } from "./component";
import type { Fields } from "./fields";
import type { Templates } from "./templates";
import type { Widgets } from "./widgets";

export interface Theme {
  components: Components;
  widgets: Widgets;
  fields?: Fields;
  templates?: Templates;
}

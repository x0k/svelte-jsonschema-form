import type { Components, ComponentsResolver } from "./component.js";
import type { Fields } from "./fields/index.js";
import type { Templates } from "./templates/index.js";
import type { Widgets } from "./widgets.js";

/** @deprecated use `Theme2` instead */
export interface Theme {
  components: Components;
  widgets: Widgets;
  fields?: Fields;
  templates?: Templates;
}

export interface Theme2 {
  components: ComponentsResolver
}
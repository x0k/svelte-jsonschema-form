import type { Widget, Widgets, WidgetType } from "@/components/form";

import Text from "./text.svelte";

export const registry: { [T in WidgetType]: Widget<T> } = {
  text: Text,
};

export const widgets: Widgets = (type) => registry[type];

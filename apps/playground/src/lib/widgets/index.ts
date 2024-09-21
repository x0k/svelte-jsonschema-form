import type { Widget, Widgets, WidgetType } from "@/components/form";

import Text from "./text.svelte";
import Select from './select.svelte';

export const registry: { [T in WidgetType]: Widget<T> } = {
  text: Text,
  select: Select
};

export const widgets: Widgets = (type) => registry[type];

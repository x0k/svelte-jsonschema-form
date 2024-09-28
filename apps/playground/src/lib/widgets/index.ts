import type { Widget, Widgets, WidgetType } from "@/components/form";

import TextWidget from "./text-widget.svelte";
import TextareaWidget from "./textarea-widget.svelte";
import NumberWidget from "./number-widget.svelte";
import SelectWidget from "./select-widget.svelte";
import CheckBoxWidget from "./checkbox-widget.svelte";

export const registry: { [T in WidgetType]: Widget<T> } = {
  text: TextWidget,
  textarea: TextareaWidget,
  number: NumberWidget,
  select: SelectWidget,
  checkbox: CheckBoxWidget,
};

export const widgets: Widgets = (type) => registry[type];

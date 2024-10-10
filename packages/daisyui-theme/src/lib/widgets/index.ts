import type { Widget, Widgets, WidgetType } from "@/form/index.js";

import TextWidget from "./text-widget.svelte";
import TextareaWidget from "./textarea-widget.svelte";
import NumberWidget from "./number-widget.svelte";
import SelectWidget from "./select-widget.svelte";
import CheckBoxWidget from "./checkbox-widget.svelte";
import RadioWidget from './radio-widget.svelte';
import CheckboxesWidget from './checkboxes-widget.svelte';
import FileWidget from './file-widget.svelte';

export const registry: { [T in WidgetType]: Widget<T> } = {
  text: TextWidget,
  textarea: TextareaWidget,
  number: NumberWidget,
  select: SelectWidget,
  checkbox: CheckBoxWidget,
  radio: RadioWidget,
  checkboxes: CheckboxesWidget,
  file: FileWidget,
};

// @ts-expect-error TODO: improve `widgets` type
export const widgets: Widgets = (type) => registry[type];

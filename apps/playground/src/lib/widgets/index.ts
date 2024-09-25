import type { Widget, Widgets, WidgetType } from "@/components/form";

import Text from "./text.svelte";
import Number from './number.svelte'
import Select from './select.svelte';
import CheckBox from './checkbox.svelte'

export const registry: { [T in WidgetType]: Widget<T> } = {
  text: Text,
  number: Number,
  select: Select,
  checkbox: CheckBox
};

export const widgets: Widgets = (type) => registry[type];
